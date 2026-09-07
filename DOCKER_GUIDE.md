# 🚀 Docker Quickstart Guide (Local Deployment)

Had l-guide kay-chre7 kifach t-khaddem had l-projet **100% en local b Docker** b commande we7da bla ma t7taj t-installi .NET wla Node.js wla MariaDB/MySQL f pc dialek.

---

## 📋 Prérequis (Chno khas ykoun 3ndek)
- **Docker Desktop** (m-installi w khaddam f Windows / Mac / Linux).
  - Télécharger: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

---

## ⚡ Kifach t-khaddem l-projet (1-Step Run)

1. Fte7 **Terminal** (CMD / PowerShell / Bash) f dossier dial l-projet:
   ```bash
   cd ReservationSystem
   ```

2. Kteb had l-commande:
   ```bash
   docker-compose up -d --build
   ```

3. Safi! Docker غادي يبني ويشغل 3 ديال les containers:
   - 🗄️ **Database (MariaDB 10.11):** Port `3306`
   - ⚙️ **Backend (.NET Web API):** Port `5000` (Interne)
   - 🌐 **Frontend (Angular + Nginx):** Port `80`

---

## 🌐 Liens d'accès (Fin ghadi t-fte7 l-app)

| Service | Lien | Identifiants |
| :--- | :--- | :--- |
| **Application Web (Frontend)** | [http://localhost:8080](http://localhost:8080) | - |
| **Swagger Documentation (API)** | [http://localhost:8080/swagger](http://localhost:8080/swagger) | - |
| **phpMyAdmin (Interface Web DB)** | [http://localhost:8081](http://localhost:8081) | User: `root` / Pass: `root_password_123`<br>wla User: `my_api_user` / Pass: `123456789` |
| **Database (MariaDB Port Direct)** | `localhost:3307` | User: `my_api_user` / Pass: `123456789` |

---

## 🛠️ Les Commandes L-mohimma

### 1. Tchouf les logs f l-we9t l-7a9iqi:
```bash
docker-compose logs -f
```

### 2. Twaqqaf l-projet:
```bash
docker-compose down
```

### 3. T-redémarrer l-projet:
```bash
docker-compose restart
```

### 4. Ila zedti chi code jdid w bghiti t3awed l-build:
```bash
docker-compose up -d --build
```
