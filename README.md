# 🪂 Paragliding Reservation Management System

<div align="center">

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-10.11-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Reverse--Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT%20Bearer-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**An enterprise-grade, full-stack management and booking platform designed for paragliding agencies, flight operations, pilot assignments, and financial tracking.**

[Features](#-key-features) • [Quick Start](#-quick-start-docker) • [Manual Setup](#-manual-development-setup) • [Deployment](#-deployment--updates) • [Documentation](#-guides--documentation)

</div>

---

## 🌟 Key Features

- 📊 **Operational Dashboard:** Real-time metrics for total reservations, today's flight schedule, gross revenue, active customer tracking, and a live multi-currency calculator widget.
- 🪂 **Reservation & Flight Booking:** Complete booking lifecycle management with flight packages, time slots, extra services (photo/video), and pilot assignments.
- 👨‍✈️ **Pilot & Transport Management:** Organize pilots into duty groups, schedule transport shuttles, and manage daily flight capacities.
- 🏢 **Agencies & Customer CRM:** Centralized customer database with search, identity documents, nationality records, and agency partner commissions.
- 💳 **Payments & Multi-Currency:** Financial ledger supporting multiple currencies (**USD, EUR, GBP, TRY**) with live exchange rate conversions.
- 🔐 **Role-Based Access Control (RBAC):** Secure JWT authentication, custom authorization policies, auto-seeded administrator, and protected production Swagger documentation.
- 🐳 **Production-Ready Docker Setup:** Multi-container orchestration (Angular + Nginx, ASP.NET Core 9 Web API, MariaDB, and phpMyAdmin).

---

## 🏗️ Tech Stack & Architecture

```
                      ┌──────────────────────────────────────┐
                      │          Client Browser              │
                      └──────────────────┬───────────────────┘
                                         │  Port 8080 / 80
                                         ▼
                      ┌──────────────────────────────────────┐
                      │         Nginx Reverse Proxy          │
                      ├──────────────────┬───────────────────┤
                      │  Angular 19 SPA  │   /api/* Proxy    │
                      └──────────────────┴─────────┬─────────┘
                                                   │
                                                   ▼  Port 5000 (Internal)
                      ┌──────────────────────────────────────┐
                      │       ASP.NET Core 9 Web API         │
                      │     (JWT Auth, EF Core, Services)    │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼  Port 3306 (Internal) / 3307 (Host)
                      ┌──────────────────────────────────────┐
                      │         MariaDB 10.11 / MySQL        │
                      │       (Persistent Data Volume)       │
                      └──────────────────────────────────────┘
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Angular 19, TypeScript, RxJS, Bootstrap 5, MDB, Material Icons |
| **Backend** | ASP.NET Core 9, C#, Entity Framework Core, Pomelo MariaDB Provider |
| **Authentication** | ASP.NET Core Identity + JSON Web Tokens (JWT) Bearer |
| **Database** | MariaDB 10.11 / MySQL with initialization script |
| **Database Admin** | phpMyAdmin (Web GUI) |
| **DevOps** | Docker, Docker Compose, Multi-stage Dockerfiles, Nginx |

---

## ⚡ Quick Start (Docker - Recommended)

The easiest way to run the complete stack locally with a single command:

### 1. Clone the repository
```bash
git clone https://github.com/anass2002-dr/ReservationSystem.git
cd ReservationSystem
```

### 2. Build and launch all containers
```bash
docker-compose up -d --build
```

### 3. Access the services
| Service | URL | Credentials |
| :--- | :--- | :--- |
| **🌐 Web Application** | [http://localhost:8080](http://localhost:8080) | **Username:** `admin`<br>**Password:** `admin123` |
| **⚙️ Backend Web API** | [http://localhost:5000](http://localhost:5000) | REST Endpoints `http://localhost:5000/api/*` |
| **🗄️ phpMyAdmin** | [http://localhost:8081](http://localhost:8081) | **Server:** `db`<br>**User:** `root` \| **Pass:** `rootpassword` |

### Useful Docker commands:
```bash
# View running containers
docker ps

# Stream live container logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

---

## 💻 Manual Development Setup (Without Docker)

For active code development with hot-reloading:

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js (v20+ LTS)](https://nodejs.org/) & `npm`
- Local MySQL / MariaDB Server (e.g. XAMPP, Homebrew)

### 1. Database Setup
1. Start your local MySQL service.
2. Create a database named `ReservationSystemDb`.
3. Import the SQL schema file from `Server/script.sql`.

### 2. Backend (.NET 9 Web API)
```bash
cd Server
# Verify your connection string in appsettings.json if needed
dotnet restore
dotnet run
```
*API runs on `http://localhost:5000` (Swagger UI at `http://localhost:5000/swagger` in Development mode).*

### 3. Frontend (Angular 19)
```bash
cd App
npm install --legacy-peer-deps
npm start
```
*Frontend runs on `http://localhost:4200` with instant live code reload.*

---

## 🔄 Deployment & Updates

### 1-Click Automated Deployment Script
Deploy changes from your local Mac to the production VPS server (`2.24.115.165`):

```bash
./deploy.sh "Your commit message description"
```

### Manual Deployment Steps:
1. **Commit & Push from Local:**
   ```bash
   git add .
   git commit -m "Update reservation logic"
   git push origin main
   ```
2. **Pull & Rebuild on VPS Server:**
   ```bash
   ssh root@2.24.115.165
   cd /root/ReservationSystem
   git pull origin main
   PORT=80 docker-compose up -d --build
   ```

---

## 📁 Repository Structure

```
ReservationSystem/
├── App/                          # Angular 19 Frontend Application
│   ├── src/
│   │   ├── app/                  # Angular components, guards, services
│   │   │   ├── layouts/          # Header, Sidebar, Footer
│   │   │   ├── pages/            # Dashboard, Reservations, Customers, Pilots...
│   │   │   └── services/         # API HTTP communication services
│   │   └── environments/         # Environment configuration (Dev / Prod)
│   ├── Dockerfile                # Multi-stage Angular build + Nginx runtime
│   └── nginx.conf                # Nginx SPA router & API reverse proxy
│
├── Server/                       # ASP.NET Core 9 Web API Backend
│   ├── Controllers/              # RESTful API controllers
│   ├── Models/                   # Entity Framework database models
│   ├── Repository/               # Data access repositories
│   ├── Services/                 # Business logic services
│   ├── Dockerfile                # .NET 9 SDK publish + ASP.NET runtime
│   └── script.sql                # Complete database schema & seed data
│
├── docker-compose.yml            # Multi-container orchestration definition
├── deploy.sh                     # Automated 1-Click deployment script
├── LOCAL_SETUP_GUIDE.md          # Complete local installation guide (EN)
├── DEPLOYMENT_UPDATE_GUIDE.md    # Code update & deployment workflow guide (EN)
├── GUIDE_INSTALLATION_LOCAL.md   # Complete local installation guide (FR)
└── USER_GUIDE.md                 # End-user operational manual
```

---

## 📚 Guides & Documentation

Detailed guides and PDFs are available directly in the project root:

- 📖 **[Local Setup Guide (PDF)](./LOCAL_SETUP_GUIDE.pdf)** | **[Markdown](./LOCAL_SETUP_GUIDE.md)**: Full step-by-step local machine setup.
- 🚀 **[Deployment & Update Guide (PDF)](./DEPLOYMENT_UPDATE_GUIDE.pdf)** | **[Markdown](./DEPLOYMENT_UPDATE_GUIDE.md)**: How to push changes and update containers.
- 📋 **[User Guide (Markdown)](./USER_GUIDE.md)**: Detailed end-user manual for all booking operations.

---

## 🔐 Default Credentials Summary

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin` | `admin123` | Full access to all dashboard operations |
| **Database (Docker)** | `root` | `rootpassword` | Access via phpMyAdmin at port `8081` |

---

## 📄 License

This project is proprietary and maintained for **Reservation System Operations**. All rights reserved.
