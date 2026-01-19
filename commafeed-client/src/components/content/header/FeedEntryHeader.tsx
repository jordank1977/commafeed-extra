import { Box } from "@mantine/core"
import type { Entry } from "@/app/types"
import { FeedFavicon } from "@/components/content/FeedFavicon"
import { OpenExternalLink } from "@/components/content/header/OpenExternalLink"
import { Star } from "@/components/content/header/Star"
import { RelativeDate } from "@/components/RelativeDate"
import { tss } from "@/tss"
import { FeedEntryTitle } from "./FeedEntryTitle"

export interface FeedEntryHeaderProps {
    entry: Entry
    expanded: boolean
    showStarIcon?: boolean
    showExternalLinkIcon?: boolean
}

const useStyles = tss
    .withParams<{
        read: boolean
        expanded: boolean
    }>()
    .create(({ colorScheme, read, expanded }) => ({
        headerTitle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        headerSubtitle: {
            display: "flex",
            alignItems: "center",
            marginTop: "2px",
            gap: "6px",
        },
        main: {
            fontWeight: colorScheme === "light" && !read ? "bold" : "inherit",
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minWidth: 0,
            ...(!expanded
                ? {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                  }
                : {}),
        },
    }))

export function FeedEntryHeader(props: Readonly<FeedEntryHeaderProps>) {
    const { classes } = useStyles({
        read: props.entry.read,
        expanded: props.expanded,
    })

    // Very simplified approach to avoid complex union type errors
    return (
        <Box className="cf-header">
            <div className={classes.headerTitle}>
                <div className={classes.main}>
                    {props.showStarIcon && (
                        <Box ml={-5}>
                            <Star entry={props.entry} />
                        </Box>
                    )}
                    <FeedEntryTitle entry={props.entry} />
                </div>
                {props.showExternalLinkIcon && <OpenExternalLink entry={props.entry} />}
            </div>
            <div className={classes.headerSubtitle}>
                <FeedFavicon url={props.entry.iconUrl} />
                <Box c="dimmed">
                    {props.entry.feedName}
                    <span> · </span>
                    <RelativeDate date={props.entry.date} />
                </Box>
            </div>
            {props.expanded && (
                <Box className="cf-header-details">
                    {props.entry.author && <span>by {props.entry.author}</span>}
                    {props.entry.author && props.entry.categories && <span>&nbsp;·&nbsp;</span>}
                    {props.entry.categories && <span>{props.entry.categories}</span>}
                </Box>
            )}
        </Box>
    )
}
