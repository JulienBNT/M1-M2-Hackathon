const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const registerUser = async (req, res) => {
  try {
    const { lastname, firstname, username, email, password } = req.body;

    if (!lastname || !firstname || !username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Le nom d'utilisateur ou l'email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      lastname,
      firstname,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user);
    const userResponse = {
      _id: user._id,
      lastname: user.lastname,
      firstname: user.firstname,
      username: user.username,
      email: user.email,
      profilePicture: "",
      bio: "",
    };

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email et mot de passe sont requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = generateToken(user);
    const userResponse = {
      _id: user._id,
      lastname: user.lastname,
      firstname: user.firstname,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || "",
      bio: user.bio || "",
    };

    res.status(200).json({
      message: "Connexion réussie",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du profil utilisateur" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { lastname, firstname, username, email, bio } = req.body;
    const updates = {};

    if (lastname) updates.lastname = lastname;
    if (firstname) updates.firstname = firstname;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (bio) updates.bio = bio;

    if (req.file) {
      updates.profilePicture = `/uploads/profiles/${req.file.filename}`;

      // Supprime l'ancienne image si elle existe et n'est pas une image par défaut
      const user = await User.findById(req.user._id);
      if (
        user &&
        user.profilePicture &&
        !user.profilePicture.includes("freepik.com") &&
        !user.profilePicture.includes("placeholder")
      ) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          user.profilePicture,
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Mot de passe actuel incorrect" });

    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .json({ error: "Les mots de passe ne correspondent pas" });

    if (newPassword.length < 8)
      return res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 8 caractères" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Error updating user password:", error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du mot de passe" });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    if (user.profilePicture && !user.profilePicture.includes("freepik.com")) {
      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        user.profilePicture,
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await User.findByIdAndDelete(user._id);
    res
      .status(200)
      .json({ message: "Compte utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting user account:", error.message);
    res.status(500).json({ error: "Erreur lors de la suppression du compte" });
  }
};

const verifyToken = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  verifyToken,
};
