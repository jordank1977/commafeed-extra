# CommaFeed - BongoFeed

A fork of [CommaFeed](https://github.com/Athou/commafeed) with additional features for improved reading experience and content management.

![preview](https://user-images.githubusercontent.com/1256795/184886828-1973f148-58a9-4c6d-9587-ee5e5d3cc2cb.png)

## What's Different in This Fork

### Article Truncation
Truncate long articles to a configurable character limit for faster page loads and better readability.

- **Toggle**: Enable/disable article truncation in Display settings
- **Configurable length**: Set truncation limit (100-10,000 characters, default 1,000)
- **HTML-safe**: Preserves formatting and media content when truncating
- **Smart handling**: Articles shorter than the limit are displayed in full

### Article Truncation (Dynamic)
Dynamically truncate articles to fit the viewport height, creating a "card-like" browsing experience.

- **Toggle**: Enable "Truncate articles (Dynamic)" in Display settings (mutually exclusive with standard truncation)
- **Viewport adaptation**: Automatically adjusts article height to fit within the screen (`100dvh`)
- **Scroll optimization**: Ensures the article and exactly one furled header below it are visible
- **Focus mode**: Disables conflicting scroll behaviors (e.g., "Scroll selected entry to the top") for a stable reading flow

### Global Content Filter
Apply filtering expressions to **all feeds** from one central location, with per-feed overrides.

- **Global filter**: Set a single JEXL filter expression that applies to all feeds
- **Per-feed override**: Individual feeds can use their own custom filter instead
- **Automatic marking**: Filtered entries are automatically marked as read
- **Flexible expressions**: Use JEXL syntax to filter by title, content, URL, author, or categories
  - Example: `url.contains('youtube') or (author eq 'john' and title.contains('update'))`

### Why These Features?

**Article Truncation** helps when:
- You have feeds with very long articles that slow down page loads
- You want to quickly scan headlines and summaries before diving into full content
- You're on mobile or have limited bandwidth

**Global Filter** helps when:
- You want to automatically mark certain types of content as read across all feeds
- You have common filtering needs that apply to multiple feeds
- You don't want to set up the same filter expression repeatedly for each feed

## Quick Start

### Docker (Recommended)

Docker images are available at GitHub Container Registry:

```bash
# PostgreSQL + JVM (recommended for most users)
docker pull ghcr.io/jordank1977/commafeed-extra:master-postgresql-jvm

# Other database variants
docker pull ghcr.io/jordank1977/commafeed-extra:master-h2-jvm
docker pull ghcr.io/jordank1977/commafeed-extra:master-mysql-jvm
docker pull ghcr.io/jordank1977/commafeed-extra:master-mariadb-jvm
```

**Docker Compose Example:**

```yaml
version: '3'
services:
  commafeed:
    image: ghcr.io/jordank1977/commafeed-extra:master-postgresql-jvm
    container_name: commafeed
    ports:
      - "8082:8082"
    volumes:
      - commafeed-data:/commafeed/data
    environment:
      - QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://db:5432/commafeed
      - QUARKUS_DATASOURCE_USERNAME=commafeed
      - QUARKUS_DATASOURCE_PASSWORD=your_password
      - QUARKUS_HTTP_AUTH_SESSION_ENCRYPTION_KEY=change_this_to_random_16_chars
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    container_name: commafeed-db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=commafeed
      - POSTGRES_USER=commafeed
      - POSTGRES_PASSWORD=your_password

volumes:
  commafeed-data:
  postgres-data:
```

### First Login

When started, the server will listen on http://localhost:8082

- **Default username**: `admin`
- **Default password**: `admin`

**Important**: Change the default password immediately after first login!

## Configuration

CommaFeed can be configured via:
- Environment variables (recommended for Docker)
- `config/application.properties` file
- Command line arguments with `-D` prefix
- `.env` file in working directory

### Essential Settings

**Database** (if not using embedded H2):
```bash
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/commafeed
QUARKUS_DATASOURCE_USERNAME=commafeed
QUARKUS_DATASOURCE_PASSWORD=your_password
```

**Session encryption** (to persist login across restarts):
```bash
QUARKUS_HTTP_AUTH_SESSION_ENCRYPTION_KEY=your_random_16_char_key
```

For all configuration options, see the [official CommaFeed documentation](https://athou.github.io/commafeed/documentation).

## About CommaFeed

CommaFeed is a Google Reader inspired self-hosted RSS reader, based on Quarkus and React/TypeScript.

### Core Features (from upstream)

- 4 different layouts (title, cozy, expanded, card)
- Light/Dark theme with custom color schemes
- Fully responsive - works great on mobile and desktop
- Keyboard shortcuts for everything
- Right-to-left feed support
- Translated in 25+ languages
- OPML import/export
- REST API & Fever-compatible API for mobile apps
- Highly customizable with custom CSS and JavaScript
- Browser extension available
- Native compilation for fast startup and low memory usage
- Supports PostgreSQL, MySQL, MariaDB, and H2 databases

## Building from Source

```bash
./mvnw clean package -Ppostgresql [-Pnative] [-DskipTests]
```

- Use `-Pnative` for native compilation (requires GraalVM)
- Use `-DskipTests` to speed up build
- Replace `postgresql` with `h2`, `mysql`, or `mariadb` as needed

## Contributing

This fork focuses on quality-of-life improvements for content reading and management. If you have ideas for similar enhancements, feel free to open an issue or pull request!

## Original Project

This is a fork of [CommaFeed by Athou](https://github.com/Athou/commafeed).

The original project offers:
- A free public instance at [commafeed.com](https://www.commafeed.com)
- Official Docker images at [Docker Hub](https://hub.docker.com/r/athou/commafeed)
- Professional support and 1-click hosting via [PikaPods](https://www.pikapods.com/pods?run=commafeed)
- Regular updates and active development

**Support the original author**: If you find CommaFeed useful, consider [supporting the upstream project](https://github.com/Athou/commafeed#readme).

## License

Licensed under the Apache License 2.0. See the original CommaFeed repository for full license details.
