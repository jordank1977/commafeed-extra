import { Box, Mark } from "@mantine/core"
import escapeStringRegexp from "escape-string-regexp"
import { ALLOWED_TAG_LIST, type ChildrenNode, Interweave, Matcher, type MatchResponse, type Node, type TransformCallback } from "interweave"
import React from "react"
import styleToObject from "style-to-object"
import { Constants } from "@/app/constants"
import { calculatePlaceholderSize } from "@/app/utils"
import { BasicHtmlStyles } from "@/components/content/BasicHtmlStyles"
import { ImageWithPlaceholderWhileLoading } from "@/components/ImageWithPlaceholderWhileLoading"
import { tss } from "@/tss"

export interface ContentProps {
    content: string
    highlight?: string
    truncateToFirstParagraph?: boolean
    truncationLength?: number
}

const useStyles = tss.create(() => ({
    content: {
        // break long links or long words
        overflowWrap: "anywhere",
        "& a": {
            color: "inherit",
            textDecoration: "underline",
        },
        "& iframe": {
            maxWidth: "100%",
        },
        "& pre, & code": {
            whiteSpace: "pre-wrap",
        },
    },
}))

const transform: TransformCallback = node => {
    if (node.tagName === "IMG") {
        // show placeholders for loading img tags, this allows the entry to have its final height immediately
        const src = node.getAttribute("src") ?? undefined
        if (!src) return undefined

        const alt = node.getAttribute("alt") ?? "image"
        const title = node.getAttribute("title") ?? undefined
        const nodeWidth = node.getAttribute("width")
        const nodeHeight = node.getAttribute("height")
        const width = nodeWidth ? Number.parseInt(nodeWidth, 10) : undefined
        const height = nodeHeight ? Number.parseInt(nodeHeight, 10) : undefined
        const style = styleToObject(node.getAttribute("style") ?? "") ?? undefined
        const placeholderSize = calculatePlaceholderSize({
            width,
            height,
            maxWidth: Constants.layout.entryMaxWidth,
        })

        return (
            <ImageWithPlaceholderWhileLoading
                src={src}
                alt={alt}
                title={title}
                width={width}
                height="auto"
                style={style}
                placeholderWidth={placeholderSize.width}
                placeholderHeight={placeholderSize.height}
            />
        )
    }
    return undefined
}

class HighlightMatcher extends Matcher {
    private readonly regexp: RegExp

    constructor(search: string) {
        super("highlight")
        this.regexp = new RegExp(escapeStringRegexp(search).split(" ").join("|"), "i")
    }

    match(string: string): MatchResponse<unknown> | null {
        return this.doMatch(string, this.regexp, () => ({}))
    }

    replaceWith(children: ChildrenNode): Node {
        return <Mark key={0}>{children}</Mark>
    }

    asTag(): string {
        return "span"
    }
}

/**
 * Truncates HTML content to approximately N characters.
 * Preserves HTML structure and adds ellipsis if truncated.
 */
function truncateContent(html: string, maxChars: number = 1000): string {
    if (!html || html.trim().length === 0) {
        return html
    }

    // Create a temporary DOM element to parse HTML safely
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html

    // Get text content to check length
    const textContent = tempDiv.textContent || ""

    // If content is already short enough, return as-is
    if (textContent.length <= maxChars) {
        return html
    }

    // Truncate to first maxChars characters of text
    let charCount = 0

    function truncateNode(node: globalThis.Node): boolean {
        if (charCount >= maxChars) {
            return true // Signal to stop processing
        }

        if (node.nodeType === globalThis.Node.TEXT_NODE) {
            const text = node.textContent || ""
            if (charCount + text.length > maxChars) {
                // Truncate this text node
                const remaining = maxChars - charCount
                node.textContent = `${text.substring(0, remaining)}...`
                charCount = maxChars
                return true
            }
            charCount += text.length
        } else if (node.nodeType === globalThis.Node.ELEMENT_NODE) {
            const children = Array.from(node.childNodes)
            for (let i = 0; i < children.length; i++) {
                if (truncateNode(children[i] as globalThis.Node)) {
                    // Remove all subsequent siblings
                    while (node.childNodes.length > i + 1) {
                        const lastChild = node.lastChild
                        if (lastChild) node.removeChild(lastChild)
                    }
                    return true
                }
            }
        }
        return false
    }

    truncateNode(tempDiv as globalThis.Node)
    return tempDiv.innerHTML
}

// allow iframe tag
const allowList = [...ALLOWED_TAG_LIST, "iframe"]

// memoize component because Interweave is costly
const Content = React.memo((props: ContentProps) => {
    const { classes } = useStyles()
    const matchers = props.highlight ? [new HighlightMatcher(props.highlight)] : []

    // Apply truncation if enabled
    const displayContent = props.truncateToFirstParagraph ? truncateContent(props.content, props.truncationLength) : props.content

    return (
        <BasicHtmlStyles>
            <Box className={classes.content}>
                <Interweave content={displayContent} transform={transform} matchers={matchers} allowList={allowList} />
            </Box>
        </BasicHtmlStyles>
    )
})
Content.displayName = "Content"

export { Content }
