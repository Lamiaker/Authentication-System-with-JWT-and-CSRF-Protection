# Authentication-System-with-JWT-and-CSRF-Protection
This project is an authentication system for an admin dashboard that utilizes JSON Web Tokens (JWT) for user authentication and CSRF tokens for additional security. It includes routes for user signup, login, and protected resource access.
# To get started, clone the repository and install the required dependencies:
https://github.com/Lamiaker/Authentication-System-with-JWT-and-CSRF-Protection.git
cd Authentication-System-with-JWT-and-CSRF-Protection
npm install
# Start the server: npm start
# API Endpoints:
POST	/signup	Register a new admin user	No authentication
POST	/login	Login as admin and get tokens	No authentication
GET	/logout	Logout and clear tokens	Requires JWT (logged in)
GET	/me	Get logged-in admin info	Requires JWT + CSRF token
# Middleware:
CSRF Protection is applied to routes once a user logs in to prevent cross-site request forgery attacks. The CSRF token is generated during the login process and must be included in subsequent requests that modify the state.

JWT Authentication protects sensitive routes like /me by validating the user's JWT before granting access.

# Environment Variables
Create a .env file with the following variables:
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=7
NODE_ENV=development
# Technologies Used
Node.js
Express.js
MongoDB (Mongoose)
JWT (JSON Web Token)
CSRF Protection using csurf
Cookie Management using cookie-parser

