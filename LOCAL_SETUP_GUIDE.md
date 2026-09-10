# 🚀 Local Installation & Execution Guide (From Scratch)

This guide provides step-by-step instructions and all necessary commands to configure, run, and test the **Reservation System** project on your local machine (macOS, Windows, or Linux).

---

## 1. 🏗️ Architecture & Core Components

| Component | Technology | Default Local Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | Angular 19 | `http://localhost:8080` (Docker) or `http://localhost:4200` (Dev) | Single Page Application (SPA) |
| **Backend API** | ASP.NET Core 9 (.NET 9) | `http://localhost:5000` | REST API & Swagger UI |
| **Database** | MariaDB 10.11 / MySQL | `localhost:3307` (Docker) or `3306` (Local) | Persistent storage |
| **phpMyAdmin** | PHP / Web | `http://localhost:8081` | Web-based Database Manager |

---

## 2. 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Git**
- **Docker & Docker Desktop** *(Recommended for 1-Click setup)*
- **Node.js (v20 LTS recommended)** & **npm** *(if running manually without Docker)*
- **.NET 9.0 SDK** *(if running manually without Docker)*

---

## 3. ⚡ METHOD 1: Automated Start with Docker (1-Click - Recommended)

This is the fastest and easiest method. Docker automatically downloads dependencies, sets up the database, imports the schema, seeds the admin user, builds the backend, and serves the frontend.

### Step 1: Open terminal in the project directory
```bash
cd /path/to/ReservationSystem
```

### Step 2: Start all services with Docker Compose
```bash
docker-compose up -d --build
```

### Step 3: Access your services
- 🌐 **Web Application:** [http://localhost:8080](http://localhost:8080)
- ⚙️ **Backend API:** [http://localhost:5000](http://localhost:5000)
- 🗄️ **phpMyAdmin:** [http://localhost:8081](http://localhost:8081)
  - **Server:** `db`
  - **Username:** `root`
  - **Password:** `rootpassword`

### Useful Docker Commands:
```bash
# Check container status
docker ps

# Follow live logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

---

## 4. 💻 METHOD 2: Manual Setup Without Docker (Development Mode)

Recommended for active development with live code editing and instant hot-reload:

### A. Setup Local Database (MySQL / MariaDB)
1. Start your local MySQL server (via XAMPP, Homebrew, or native service).
2. Open phpMyAdmin or your MySQL GUI (e.g., TablePlus, DBeaver, Workbench).
3. Create a new database named: **`ReservationSystemDb`**.
4. Import the initialization SQL script located at: **`Server/script.sql`**.

### B. Start the Backend (.NET 9 Web API)
In a **first terminal window**:
```bash
# 1. Navigate to the Server folder
cd Server

# 2. Restore NuGet dependencies
dotnet restore

# 3. Run the Backend API
dotnet run
```
*The API will run on `http://localhost:5000` and Swagger documentation will be available at `http://localhost:5000/swagger`.*

### C. Start the Frontend (Angular 19)
In a **second terminal window**:
```bash
# 1. Navigate to the App folder
cd App

# 2. Install npm dependencies
npm install --legacy-peer-deps

# 3. Start the Angular development server
npm start
# (or: npx ng serve --port 4200)
```
*The app will automatically open at `http://localhost:4200` with live code reload.*

---

## 5. 🔐 Default Authentication Credentials

The system automatically initializes a default Administrator user:

| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `admin123` |
| **Role** | `Admin` (Full access to all dashboard operations and management) |

---

## 6. 🛠️ Troubleshooting & FAQ

| Issue | Solution |
| :--- | :--- |
| **Port 3306 conflict** (`address already in use`) | Your local MySQL is already using port 3306. The project's `docker-compose.yml` maps the database container to port **`3307:3306`** to prevent collisions. |
| **npm install error** (`peer dependency conflicts`) | Always use the legacy flag: `npm install --legacy-peer-deps`. |
| **Blank screen on first launch** | The Backend container is finalizing database migrations. Wait 10 seconds and do a **Hard Refresh** (`Cmd+Shift+R` or `Ctrl+F5`). |
| **Rebuilding after code changes** | Run: `docker-compose down && docker-compose up -d --build`. |
