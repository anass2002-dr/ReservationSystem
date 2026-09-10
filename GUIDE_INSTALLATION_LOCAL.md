# 🚀 Guide d'Installation & Exécution en Local (De Zéro)

Ce guide détaille toutes les étapes et commandes nécessaires pour installer et faire tourner le projet **Reservation System** sur votre machine locale (Mac, Windows ou Linux).

---

## 1. 🏗️ Architecture & Composants du Projet

| Composant | Technologie | Port Local par Défaut | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | Angular 19 | `http://localhost:8080` (Docker) ou `http://localhost:4200` (Dev) | Interface utilisateur SPA |
| **Backend API** | ASP.NET Core 9 (.NET 9) | `http://localhost:5000` | API REST & Swagger UI |
| **Base de Données** | MariaDB 10.11 / MySQL | `localhost:3307` (Docker) ou `3306` (Local) | Stockage des réservations |
| **phpMyAdmin** | PHP / Web | `http://localhost:8081` | Interface de gestion BDD |

---

## 2. 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- **Git**
- **Docker & Docker Desktop** *(Recommandé pour la méthode 1-Click)*
- **Node.js (v20 LTS recommandé)** & **npm** *(si lancement manuel)*
- **.NET 9.0 SDK** *(si lancement manuel)*

---

## 3. ⚡ MÉTHODE 1 : Lancement Automatique avec Docker (1-Click - Recommandé)

Cette méthode est la plus simple : elle configure et démarre automatiquement la base de données avec les données initiales, le backend API, le frontend Nginx et phpMyAdmin.

### Étape 1 : Ouvrir le terminal dans le dossier du projet
```bash
cd /chemin/vers/ReservationSystem
```

### Étape 2 : Lancer tous les conteneurs
```bash
docker-compose up -d --build
```

### Étape 3 : Accéder aux services
- 🌐 **Application Web :** [http://localhost:8080](http://localhost:8080)
- ⚙️ **Backend API :** [http://localhost:5000](http://localhost:5000)
- 🗄️ **phpMyAdmin :** [http://localhost:8081](http://localhost:8081)
  - **Serveur :** `db`
  - **Utilisateur :** `root`
  - **Mot de passe :** `rootpassword`

### Commandes Docker utiles :
```bash
# Voir l'état des conteneurs
docker ps

# Suivre les logs en direct
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down
```

---

## 4. 💻 MÉTHODE 2 : Lancement Manuel Sans Docker (Mode Développement)

Pour travailler directement sur le code avec le rechargement à chaud (Hot-Reload) :

### A. Préparer la Base de Données (MySQL / MariaDB)
1. Démarrez votre serveur MySQL local (via XAMPP, Homebrew, etc.).
2. Créez une nouvelle base de données nommée : **`ReservationSystemDb`**.
3. Importez le script SQL initial situé dans : **`Server/script.sql`**.

### B. Lancer le Backend (.NET 9 Web API)
Dans un **premier terminal** :
```bash
# 1. Se positionner dans le dossier Server
cd Server

# 2. Restaurer les dépendances NuGet
dotnet restore

# 3. Compiler et lancer l'API
dotnet run
```
*L'API tourne sur `http://localhost:5000` et Swagger est disponible sur `http://localhost:5000/swagger`.*

### C. Lancer le Frontend (Angular 19)
Dans un **deuxième terminal** :
```bash
# 1. Se positionner dans le dossier App
cd App

# 2. Installer les dépendances npm
npm install --legacy-peer-deps

# 3. Démarrer le serveur de développement Angular
npm start
# (ou : npx ng serve --port 4200)
```
*L'application s'ouvre sur `http://localhost:4200`.*

---

## 5. 🔐 Identifiants de Connexion par Défaut

Le système initialise automatiquement un compte Administrateur :

| Champ | Valeur |
| :--- | :--- |
| **Nom d'utilisateur (Username)** | `admin` |
| **Mot de passe (Password)** | `admin123` |
| **Rôle** | `Admin` (Accès total au tableau de bord et gestion) |

---

## 6. 🛠️ Résolution des Problèmes Fréquents (Troubleshooting)

| Problème | Solution |
| :--- | :--- |
| **Conflit de port 3306** (`port already allocated`) | Votre MySQL local utilise déjà le port 3306. Le fichier `docker-compose.yml` mappe automatiquement le port sur `3307:3306` pour éviter ce conflit. |
| **Erreur npm install** (`peer dependency conflict`) | Utilisez toujours le flag `--legacy-peer-deps` : `npm install --legacy-peer-deps`. |
| **Page blanche au premier démarrage** | Attendez quelques secondes que le Backend initialise la base de données, puis faites un **Hard Refresh** (`Cmd+Shift+R` ou `Ctrl+F5`). |
| **Reconstruire les conteneurs après modifications** | Exécutez : `docker-compose down && docker-compose up -d --build`. |
