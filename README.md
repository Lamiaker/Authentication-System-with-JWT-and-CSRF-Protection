# Authentication System with JWT and CSRF Protection

This project implements a secure authentication system for an admin dashboard, using **JSON Web Tokens (JWT)** for user authentication and **CSRF (Cross-Site Request Forgery)** tokens for additional security. It includes routes for registration, login, and access to protected resources.

## Prerequisites

- Node.js and npm must be installed on your machine.
- MongoDB must be installed and running.

## Installation

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/Lamiaker/Authentication-System-with-JWT-and-CSRF-Protection.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Authentication-System-with-JWT-and-CSRF-Protection
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Server

To start the server in development mode, run the following command:

```bash
npm start
```

The server will run at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```
JWT_SECRET=your_jwt_secret        # Secret key to sign JWT
JWT_EXPIRES_IN=1d                 # JWT expiration time (e.g., 1d for 1 day)
JWT_COOKIE_EXPIRES_IN=7           # Cookie expiration time (e.g., 7 days)
NODE_ENV=development               # Environment (development, production)
PORT=3000                          # Default port
```

## API Endpoints

### Authentication and User Management

| Method | Endpoint  | Description                                     | Auth Required    |
| ------ | --------- | ----------------------------------------------- | ---------------- |
| POST   | `/signup` | Register a new admin user                       | No               |
| POST   | `/login`  | Log in and receive JWT and CSRF tokens          | No               |
| GET    | `/logout` | Log out and remove tokens                       | Yes (JWT)        |
| GET    | `/me`     | Get the currently logged-in admin's information | Yes (JWT + CSRF) |

### Example Usage of Endpoints

#### 1. **Signup (`/signup`)**

- **Description**: Register a new admin user.
- **Method**: `POST`
- **Request Body (JSON)**:
  ```json
  {
    "name": "AdminName",
    "email": "admin@example.com",
    "password": "yourpassword",
    "passwordConfirm": "yourpassword"
  }
  ```

#### 2. **Login (`/login`)**

- **Description**: Log in as an admin and receive JWT and CSRF tokens.
- **Method**: `POST`
- **Request Body (JSON)**:
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```

#### 3. **Logout (`/logout`)**

- **Description**: Log out and remove JWT token from the cookie.
- **Method**: `GET`

#### 4. **Get Current User Info (`/me`)**

- **Description**: Retrieve information of the currently logged-in admin user. Requires the JWT in the cookie and a CSRF token.
- **Method**: `GET`
- **Request**: The CSRF token should be sent in the request header or body.

## Security Middleware

### CSRF Protection

Once a user is logged in, a CSRF token is generated and sent in a cookie. This token is used to protect sensitive routes from CSRF attacks. The CSRF token must be included in each subsequent state-changing request (POST, PUT, DELETE).

### JWT Authentication

Sensitive routes such as `/me` are protected with JWT. The JWT is sent in a cookie after login, and this token is verified each time a protected route is accessed.

## Postman Example

### 1. Signup (Register)

- URL: `POST http://localhost:3000/api/admin/signup`
- Body (raw JSON):
  ```json
  {
    "name": "AdminName",
    "email": "admin@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```

### 2. Login

- URL: `POST http://localhost:3000/api/admin/login`
- Body (raw JSON):
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

### 3. Retrieve CSRF Token

After logging in, the server will return a CSRF token in a `csrfToken` cookie. This token must be included in future requests that modify the state (POST, PUT, DELETE).

### 4. Access Logged-in Admin Info

- URL: `GET http://localhost:3000/api/admin/me`
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>` (JWT from login)
  - `csrf-token: <CSRF_TOKEN>` (CSRF token received during login)

## Technologies Used

- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Minimalist framework for web applications.
- **MongoDB**: NoSQL database to store admin user information.
- **JWT (JSON Web Token)**: Used for secure user authentication.
- **CSRF Protection**: Middleware (`csurf`) to protect routes from CSRF attacks.
- **Cookie Management**: Handles cookies using `cookie-parser` for storing JWT and CSRF tokens.

---

### Additional Notes

1. If you encounter any issues during setup, make sure all dependencies are installed with `npm install`.
2. Ensure MongoDB is properly configured and running before starting the application.

---

Make sure to customize the `.env` file according to your environment and keep your dependencies up to date. This project provides a robust base for a secure authentication system.
