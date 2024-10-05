const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const csrf = require("csurf");

// Middleware de protection CSRF
const csrfProtection = csrf({ cookie: true });

// Route pour récupérer le token CSRF
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

router.post("/signup", csrfProtection, authController.signup);
router.post("/login", csrfProtection, authController.login);
router.get("/logout", authController.logout);
router.get("/me", authController.protect, authController.getMe);

module.exports = router;