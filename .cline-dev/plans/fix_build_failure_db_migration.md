# Plan: Fix Build Failure by Removing Erroneous Database Migration

## 1. Problem Analysis
The CI build `build (ubuntu-22.04-arm, mariadb)` failed. The failure is attributed to the execution of `db.changelog-5.16.xml`, which attempts to drop a column named `markAllAsReadNavigateToUnread`.

### Root Cause
- **Migration Mismatch**: The column `markAllAsReadNavigateToUnread` does not exist in the official database schema history.
- **History**:
  - `db.changelog-5.11.xml` added a column named `markAllAsReadNavigateToNextUnread`.
  - There is no changelog that added `markAllAsReadNavigateToUnread`.
  - `db.changelog-5.16.xml` tries to `dropColumn` `markAllAsReadNavigateToUnread`.
- **Why it failed in CI**: The CI environment builds the database from scratch using the changelogs. Since `markAllAsReadNavigateToUnread` was never added, the `dropColumn` command fails.
- **Why it might have existed locally**: The local development environment likely had the `markAllAsReadNavigateToUnread` column due to a previous manual change or Hibernate auto-DDL configuration, leading to the creation of the fix migration `5.16`.

## 2. Solution Strategy
The solution is to remove the erroneous migration since the column it tries to drop should not exist in a consistent state.

### Verification
- **Java Mapping**: Checked `commafeed-server/src/main/java/com/commafeed/backend/model/UserSettings.java`. It correctly maps the Java field `markAllAsReadNavigateToUnread` to the DB column `markAllAsReadNavigateToNextUnread`:
  ```java
  @Column(name = "markAllAsReadNavigateToNextUnread")
  private boolean markAllAsReadNavigateToUnread;
  ```
- **DTO**: Checked `Settings.java`. It uses `markAllAsReadNavigateToUnread`, which matches the API and frontend, but does not affect DB schema.

## 3. Implementation Steps

### Step 1: Remove Migration File
Delete the file `commafeed-server/src/main/resources/changelogs/db.changelog-5.16.xml`.
- **Reason**: This file contains the invalid `dropColumn` instruction.

### Step 2: Update Master Migration File
Edit `commafeed-server/src/main/resources/migrations.xml`.
- **Action**: Remove the line `<include file="changelogs/db.changelog-5.16.xml" />`.
- **Reason**: To stop the application from attempting to run the deleted migration.

### Step 3: Verification (Implicit)
- Since this is a removal of a failing migration on a non-existent column, no new tests are needed. The "fix" is the absence of the error-causing instruction.
- The build process should be re-run (by the user committing changes) to verify the fix.

## 4. Rollback Plan
If this change causes issues (e.g., if there really was a hidden migration I missed), revert the changes to `migrations.xml` and restore `db.changelog-5.16.xml`. However, given the evidence from `search_files`, this is highly unlikely.
