# Project Context

## 1. PROJECT OVERVIEW
BongoFeed is a CommaFeed fork enhancing the RSS reading experience with article truncation and global content filtering. The project combines a Java Quarkus backend with a React/Vite frontend to deliver a self-hosted, feature-rich feed reader. It supports multiple database backends and aims for high performance and user customization.

## 2. ARCHITECTURE
*   **commafeed-server**: Java/Quarkus backend handling business logic, DB interactions, and feed fetching.
    *   `src/main/java/com/commafeed/CommaFeedApplication.java`: Main entry point.
    *   `src/main/java/com/commafeed/backend`: Core logic (services, DAOs, feed parsing).
    *   `src/main/java/com/commafeed/frontend`: REST API endpoints.
*   **commafeed-client**: React/Vite frontend using Redux Toolkit and Mantine UI.
    *   `src/main.tsx`: Application entry point.
    *   `src/app`: Redux store and slices.
    *   `src/components`: Reusable UI components.
*   **Integrations**:
    *   Databases: H2 (default), MySQL, MariaDB, PostgreSQL.
    *   Feed Parsing: ROME.
    *   Testing: JUnit, Mockito, Playwright (backend); Vitest (frontend).

## 3. CONVENTIONS
*   **Java**:
    *   Style: Enforced via Checkstyle (`commafeed-server/dev/checkstyle.xml`) and Spotless.
    *   Structure: Standard Maven directory layout.
    *   Naming: PascalCase for classes, camelCase for methods/variables.
*   **TypeScript/React**:
    *   Style: Enforced via Biome (`commafeed-client/biome.json`).
    *   Structure: Feature-based folder structure (e.g., `src/app/entries`, `src/components/settings`).
    *   Naming: PascalCase for components, camelCase for hooks/functions.
*   **General**:
    *   Code formatting is automated.
    *   Strict typing where possible.

## 4. CURRENT STATE
*   **Working**: Core RSS fetching, parsing, and display. User management. Database migrations (Liquibase). Custom features (truncation, dynamic truncation [fully refined], global filtering).
*   **In Progress**: Routine dependency updates (Renovate). Maintenance and cleanup.
*   **Known Issues**: PostgreSQL 18+ docker mount point change (addressed in recent commits).

## 5. CHANGELOG
[2026-01-18] - [FIX]: Resolved scrolling, layout, and settings interactions for Dynamic Truncation.
[2026-01-18] - [FIX]: Resolved database column conflicts and frontend state logic.
[2026-01-18] - [FEAT]: Added Dynamic Article Truncation
[2026-01-07] - [DEPS]: Merge branch 'Athou:master', update quarkus.version to v3.30.6
[2026-01-06] - [MAINT]: Cleanup, update @biomejs/biome to v2.3.11
[2026-01-05] - [DEPS]: Update graalvm digest, checkstyle to v13, lock file maintenance
[2026-01-05] - [REQ]: Java 25+ is now required
[2026-01-03] - [INFRA]: Postgresql 18+ changed docker mount point
[2026-01-02] - [FIX/DEPS]: Fix typo, update ayza-for-apache5 to v10.0.3
[2026-01-01] - [DEPS]: Update jsoup to v1.22.1
[2025-12-31] - [DEPS]: Update checkstyle to v12.3.1
[2025-12-31] - [REL]: Release 5.12.1
[2025-12-30] - [SEC]: ReadKit sends md5 hash of password in uppercase

## 6. QUICK REFERENCE
*   **Build**: `mvn clean install` (builds both server and client)
*   **Run Server**: `java -jar commafeed-server/target/commafeed-server-*-runner.jar`
*   **Run Client (Dev)**: `cd commafeed-client && npm run dev`
*   **Requirements**: Java 25+, Node.js (for client dev), Docker (optional for DBs).

## SESSION CHANGELOG (2026-01-18)
*   **Backend**: Added `truncateArticlesDynamic` to `UserSettings` entity and `Settings` DTO.
*   **API**: Updated `UserREST` to support the new setting.
*   **Database**: Added Liquibase changelog `db.changelog-5.14.xml` for `truncate_articles_dynamic` column.
*   **Frontend**: Implemented mutual exclusivity between truncation settings in `thunks.ts`.
*   **UI**: Implemented dynamic CSS-based truncation in `Content.tsx`.

## SESSION CHANGELOG (2026-01-18) - Fixes
*   **Database**: Resolved `ConstraintViolationException` regarding `markAllAsReadNavigateToUnread`.
    *   Created `db.changelog-5.16.xml` to drop erroneous `markAllAsReadNavigateToUnread` column.
    *   Mapped `UserSettings.markAllAsReadNavigateToUnread` field to existing `markAllAsReadNavigateToNextUnread` column.
*   **Frontend**: Fixed mutual exclusivity logic in `slice.ts` for truncation settings.

## SESSION CHANGELOG (2026-01-18) - Dynamic Truncation Refinement
*   **Frontend**: Refactored `dynamicTruncation` to use CSS Flexbox.
    *   Updated `FeedEntry.tsx` to apply `display: flex; flex-direction: column` and `maxHeight: calc(100dvh - 160px)` when dynamic truncation is active. This ensures the expanded article fits the viewport while preserving space for the next header.
    *   Updated `Content.tsx` to `height: 100%` and `overflowY: hidden` to respect the parent container's constraints.
    *   Ensured compatibility with mobile viewports (`100dvh`).
*   **Build**: Verified with `npm run lint:fix` and `./mvnw clean install -DskipTests`.

## SESSION CHANGELOG (2026-01-18) - Review

**Code Changes:**
*   **Fix for Furled Article Headers**: I fixed a formatting issue where elements in the collapsed article headers were stacking vertically instead of displaying in a row. This was resolved by updating `commafeed-client/src/components/content/header/FeedEntryHeader.tsx` to use `tss` for flexbox styling, ensuring the correct layout is applied.

**Documentation Changes:**
*   **Project Context Update**: I updated the `.clinerules/PROJECT_CONTEXT.md` file to reflect the changes made during this session. This includes:
    *   Updating the `CURRENT STATE` section to include the UI formatting fix.
    *   Adding a new entry to the `CHANGELOG` for the header fix.
    *   Correcting the `QUICK REFERENCE` section with the accurate command to run the server.
    *   Adding a new session changelog detailing the fix and the verification steps taken.

## SESSION CHANGELOG (2026-01-18) - Dynamic Truncation Polish
*   **Settings UI**:
    *   Updated `DisplaySettings.tsx` to disable conflicting settings ("Scroll selected entry to the top", "Entries to keep above...") when "Truncate articles (Dynamic)" is enabled.
    *   Forced UI values to reflect the override behavior (Scroll Mode = Always, Keep Above = 0).
    *   Updated localization files (`npm run i18n:extract`) to fix missing strings.
*   **Scroll & Layout Logic**:
    *   Updated `FeedEntry.tsx` to force `scrollMode='always'` when dynamic truncation is active.
    *   Added `scrollMarginTop: 68px` to `paper` styles to prevent articles from scrolling under the sticky header.
    *   Refined `maxHeight` calculation to `calc(100dvh - 170px)` to ensure the selected article allows exactly one furled header to be visible below it with appropriate spacing.
