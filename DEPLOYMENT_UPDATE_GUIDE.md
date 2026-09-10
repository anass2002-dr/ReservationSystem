# 🔄 How to Update Code in Local Docker & Remote Server

This guide explains the exact steps and commands for two essential workflows:
1. **Updating your Local Docker containers** after making code changes locally.
2. **Deploying updates to your Live Remote VPS Server** (`2.24.115.165`).

---

## 1. 🏗️ End-to-End Workflow Diagram

```
Local Code Edit (IDE)
       │
       ▼
Local Docker Test (Rebuild & verify on http://localhost:8080)
       │
       ▼
Git Push (Push commits to GitHub repository)
       │
       ▼
Server Update (SSH into VPS -> git pull -> PORT=80 docker-compose up -d --build)
```

---

## 2. 🐳 PART 1: Updating Your Local Docker Containers

Whenever you modify files in `App/` (Angular Frontend) or `Server/` (.NET Backend) and want to test them inside your local Docker containers:

### Option A: Rebuild and restart all containers
```bash
docker-compose up -d --build
```
> **Note:** Docker uses smart caching and will only recompile the services that have modified files. Your database data is stored in a persistent volume and will **not** be deleted.

### Option B: Speed Tip — Rebuild only one specific service
If you only modified one part of the project, you can rebuild just that container to save time:

- **If you only changed the Frontend (Angular):**
  ```bash
  docker-compose up -d --build frontend
  ```
- **If you only changed the Backend (.NET):**
  ```bash
  docker-compose up -d --build backend
  ```

### Verify Locally:
Open [http://localhost:8080](http://localhost:8080) in your browser and perform a **Hard Refresh** (`Cmd + Shift + R` on macOS or `Ctrl + F5` on Windows).

---

## 3. 🌐 PART 2: Deploying & Updating the Remote Server (VPS)

### Step 1: Commit and push your local changes to GitHub
From your Mac terminal at the project root:
```bash
# 1. Stage all changes
git add .

# 2. Commit with a message describing your changes
git commit -m "Update reservation logic and UI fixes"

# 3. Push to GitHub
git push origin main
```

---

### Step 2: Connect to your VPS server via SSH
```bash
ssh root@2.24.115.165
```

---

### Step 3: Pull latest changes and rebuild on the server
Inside your VPS terminal:
```bash
# 1. Navigate to the project directory
cd /root/ReservationSystem

# 2. Pull latest code from GitHub
git pull origin main

# 3. Rebuild and launch updated containers on Port 80
PORT=80 docker-compose up -d --build
```

---

### Step 4: Verify the live application
Open **[http://2.24.115.165](http://2.24.115.165)** in your browser and do a **Hard Refresh** (`Cmd + Shift + R`).

---

## 4. ⚡ PART 3: Automated 1-Click Deployment (`./deploy.sh`)

To make deploying even easier without manual SSH commands, you can use the automated script:

```bash
# Run this from your Mac terminal:
./deploy.sh "Your commit message here"
```

This single command automatically:
1. Adds all modified files locally.
2. Commits and pushes them to GitHub.
3. Connects to your VPS (`2.24.115.165`) via SSH.
4. Pulls the latest code on the server.
5. Rebuilds and restarts the Docker containers on Port 80.

---

## 5. 📋 Quick Reference Cheat Sheet

| Task | Where to Run | Command |
| :--- | :--- | :--- |
| **Update Local Docker** | Local Mac | `docker-compose up -d --build` |
| **Update only Frontend locally** | Local Mac | `docker-compose up -d --build frontend` |
| **Update only Backend locally** | Local Mac | `docker-compose up -d --build backend` |
| **Push changes to GitHub** | Local Mac | `git add . && git commit -m "update" && git push origin main` |
| **Update VPS Server manually** | VPS SSH | `git pull origin main && PORT=80 docker-compose up -d --build` |
| **1-Click Auto Deploy** | Local Mac | `./deploy.sh "commit description"` |
| **Check server container logs** | VPS SSH | `docker-compose logs -f` |
