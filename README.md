# Authentication System with JWT and CSRF Protection

Ce projet implémente un système d'authentification sécurisé pour un tableau de bord administrateur, utilisant JSON Web Tokens (JWT) pour l'authentification des utilisateurs et des jetons CSRF (Cross-Site Request Forgery) pour une sécurité supplémentaire. Il comprend des routes pour l'inscription, la connexion et l'accès aux ressources protégées.

## Prérequis

- Node.js et npm doivent être installés sur votre machine.
- MongoDB doit être installé et configuré.

## Installation

1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/Lamiaker/Authentication-System-with-JWT-and-CSRF-Protection.git
   ```
2. Accédez au répertoire du projet :
   ```bash
   cd Authentication-System-with-JWT-and-CSRF-Protection
   ```
3. Installez les dépendances nécessaires :
   ```bash
   npm install
   ```

## Démarrage du serveur

Pour démarrer le serveur en mode développement, exécutez la commande suivante :

```bash
npm start
```

Le serveur sera lancé sur `http://localhost:3000`.

## Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet et configurez les variables suivantes :

```
JWT_SECRET=your_jwt_secret       # Clé secrète pour signer les JWT
JWT_EXPIRES_IN=1d                # Durée d'expiration des JWT (ex: 1d pour 1 jour)
JWT_COOKIE_EXPIRES_IN=7          # Durée d'expiration des cookies (ex: 7 jours)
NODE_ENV=development              # Environnement (development, production)
PORT=3000                         # Port par défaut
```

## API Endpoints

Voici les principales routes disponibles dans cette application d'authentification :

### Authentification et gestion des utilisateurs

| Méthode | Endpoint  | Description                                                       | Authentification requise |
| ------- | --------- | ----------------------------------------------------------------- | ------------------------ |
| `POST`  | `/signup` | Inscrire un nouvel administrateur                                 | Non                      |
| `POST`  | `/login`  | Connexion d'un administrateur et obtenir les tokens (JWT et CSRF) | Non                      |
| `GET`   | `/logout` | Déconnexion et suppression des tokens                             | Oui (JWT nécessaire)     |
| `GET`   | `/me`     | Obtenir les informations de l'admin connecté                      | Oui (JWT + Jeton CSRF)   |

### Exemple d'utilisation des routes

#### 1. **Inscription (`/signup`)**

- **Description** : Permet d'inscrire un nouvel utilisateur administrateur.
- **Méthode** : `POST`
- **Corps de la requête (JSON)** :
  ```json
  {
    "name": "AdminName",
    "email": "admin@example.com",
    "password": "yourpassword",
    "passwordConfirm": "yourpassword"
  }
  ```

#### 2. **Connexion (`/login`)**

- **Description** : Permet à un administrateur de se connecter et de recevoir un token JWT et un jeton CSRF.
- **Méthode** : `POST`
- **Corps de la requête (JSON)** :
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```

#### 3. **Déconnexion (`/logout`)**

- **Description** : Permet à l'administrateur de se déconnecter et de supprimer le token JWT du cookie.
- **Méthode** : `GET`

#### 4. **Obtenir les informations de l'utilisateur connecté (`/me`)**

- **Description** : Récupère les informations de l'administrateur connecté. Nécessite le JWT dans le cookie et un jeton CSRF.
- **Méthode** : `GET`
- **Requête** : Le jeton CSRF doit être envoyé dans l'en-tête ou le corps de la requête.

## Middleware de sécurité

### Protection CSRF

Une fois qu'un utilisateur est connecté, un jeton CSRF est généré et envoyé dans un cookie. Ce jeton est utilisé pour protéger les routes sensibles contre les attaques de type Cross-Site Request Forgery (CSRF). Le jeton CSRF doit être inclus dans chaque requête ultérieure qui modifie l'état (POST, PUT, DELETE).

### Authentification JWT

Les routes sensibles, comme `/me`, sont protégées par JWT. Le token JWT est envoyé dans un cookie après la connexion, et ce token est vérifié à chaque fois qu'une route protégée est accédée.

## Exemple d'utilisation avec Postman

### 1. Inscription (signup)

- URL : `POST http://localhost:3000/signup`
- Body (raw JSON) :
  ```json
  {
    "name": "AdminName",
    "email": "admin@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```

### 2. Connexion (login)

- URL : `POST http://localhost:3000/login`
- Body (raw JSON) :
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

### 3. Récupérer le jeton CSRF

Après la connexion, le serveur renverra un jeton CSRF dans un cookie `csrfToken`. Ce jeton doit être inclus dans les futures requêtes d'écriture dans les en-têtes ou dans le corps de la requête.

### 4. Accéder aux informations de l'admin connecté

- URL : `GET http://localhost:3000/me`
- Headers :
  - `Authorization: Bearer <JWT_TOKEN>` (token JWT de la connexion)
  - `csrf-token: <CSRF_TOKEN>` (jeton CSRF reçu lors de la connexion)

## Technologies Utilisées

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express.js** : Framework minimaliste pour créer des applications web en Node.js.
- **MongoDB** : Base de données NoSQL utilisée pour stocker les informations des administrateurs.
- **JWT (JSON Web Token)** : Utilisé pour l'authentification sécurisée des utilisateurs.
- **CSRF Protection** : Protéger les routes contre les attaques CSRF via le middleware `csurf`.
- **Cookie Management** : Gestion des cookies avec `cookie-parser` pour stocker les tokens JWT et CSRF.

---

### Instructions supplémentaires

1. Si vous rencontrez des problèmes avec l'installation, assurez-vous que toutes les dépendances sont correctement installées avec `npm install`.
2. Assurez-vous que MongoDB est correctement configuré et que le serveur est démarré avant d'exécuter l'application.

---

N'oublie pas d'adapter le contenu du fichier `.env` selon ton environnement et de maintenir tes dépendances à jour. Ce projet fournit une base robuste pour un système d'authentification sécurisé.
