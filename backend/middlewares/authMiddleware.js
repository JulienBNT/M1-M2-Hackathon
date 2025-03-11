const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Non autorisé, token manquant" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key",
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }

      next();
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).json({ error: "Non autorisé, token invalide" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { protect };
