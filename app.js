// Importation des modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const adminRoutes = require("./routes/adminRoutes");
// Initialisation de l'application Express
const app = express();
// Middleware pour analyser les cookies
app.use(cookieParser());

// Initialisation de la protection CSRF avec cookies
const csrfProtection = csrf({ cookie: true });

// Ajoutez csrfProtection comme middleware global ou à des routes spécifiques
app.use(csrfProtection);
app.use(cors());


// Middleware de sécurité
app.use(helmet());

// Limiteur de requêtes pour éviter les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP
});
app.use(limiter);


// Middleware pour parser les données des requêtes
app.use(express.json()); // Pour les requêtes en JSON
app.use(express.urlencoded({ extended: true })); // Pour les formulaires

// Connexion à MongoDB
const port = process.env.PORT || 3000;
const MongoDB_URL = process.env.DATABASE_LOCAL;
//connect to database
if (!MongoDB_URL) {
  console.error("DATABASE_LOCAL is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(MongoDB_URL)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

// Déclaration des routes

app.use("/api/admin", adminRoutes); // Routes pour les interaction de ladmin
// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ressource non trouvée" });
});

// Démarrage du serveur

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
