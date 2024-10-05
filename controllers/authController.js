const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");




// Signer un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
};

// Fonction pour créer et envoyer le token
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "Strict",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Envoi du token JWT dans un cookie
  res.cookie("jwt", token, cookieOptions);

  // Retirer le mot de passe de la réponse
  user.password = undefined;

  // Envoi du jeton CSRF dans un cookie séparé
  res.cookie("csrfToken", req.csrfToken(), {
    httpOnly: true,
    sameSite: "Strict",
  });

  res.status(statusCode).json({
    status: "success",
    token,
    csrfToken: req.csrfToken(), // Optionnel : renvoyer aussi dans la réponse JSON
    data: {
      user,
    },
  });
};

// Route de signup
exports.signup = async (req, res, next) => {
  try {
    const newAdmin = await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newAdmin, 201, req, res); // Passe 'req' ici
  } catch (err) {
    next(err);
  }
};

// Route de login avec génération du token CSRF
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next("Veuillez fournir un email et un mot de passe.");
  }

  const user = await Admin.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next("Email ou mot de passe incorrect.");
  }

  createSendToken(user, 200, req, res); // Passe 'req' ici
};

// Protection des routes sensibles
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next("Vous devez vous connecter pour accéder à cette ressource.");
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await Admin.findById(decoded.id);
    if (!currentUser) {
      return next("L'utilisateur n'existe plus.");
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        "L'utilisateur a récemment changé son mot de passe. Veuillez vous reconnecter."
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    return next("Le token est invalide ou a expiré.");
  }
};

// Route de déconnexion avec suppression du token CSRF
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: "Strict",
  });
  res.cookie("csrfToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
  });
  res.status(200).json({ status: "success" });
};

// route de get user  avec leur cordonner dans res
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  res.json({ user: req.user });
  next();
};
