# Local Development Workflow (Windows 11)

This workflow outlines the steps to build and run BongoFeed locally on a Windows 11 environment.

## Prerequisites
Ensure the following are installed and available in your PATH:
- **Java JDK 25+**: Required for the backend.
- **Node.js**: Required for the frontend development server.
- **Git**: For version control operations.

## 1. Verify Environment
Open a PowerShell terminal in the project root (`C:\Vibing\bongo-commafeed`) and verify versions:

```powershell
java -version
node -v
```

## 2. Build Project
Build the entire project (Server + Client). This downloads dependencies and compiles both modules.

```powershell
.\mvnw.cmd clean install -DskipTests
```
*Note: We skip tests here for speed. Run `.\mvnw.cmd test` if you want to execute the test suite.*

## 3. Run Backend (Server)
Start the Quarkus backend. This serves the API and the compiled frontend (production mode).

```powershell
java -jar commafeed-server/target/quarkus-app/quarkus-run.jar
```
*   **Port**: 8082 (Default)
*   **Database**: H2 (In-memory/File default)
*   Wait for the log message indicating the server has started.

## 4. Run Frontend (Dev Mode) - Optional
For frontend development with hot-reloading:

1.  Keep the backend running in the first terminal.
2.  Open a **new terminal**.
3.  Navigate to the client directory and start the dev server:

```powershell
cd commafeed-client
npm install
npm run dev
```

*   **URL**: http://localhost:5173 (or what Vite assigns)
*   The dev server proxies API requests to the backend at localhost:8082.

## 5. Verification
- **Full App (Production Build)**: Visit [http://localhost:8082](http://localhost:8082)
- **Dev Frontend**: Visit the URL provided by Vite (usually [http://localhost:5173](http://localhost:5173))

## Common Issues
- **Port Conflicts**: Ensure ports 8082 and 5173 are free.
- **Java Version**: If build fails, double-check `java -version` reports 25+.
- **Node Dependencies**: If `npm run dev` fails, try deleting `commafeed-client/node_modules` and running `npm install` again.
