const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const registerUser = async (req, res) => {
  try {
    console.log("Register request received:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log("All fields are required");
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    if (password.length < 6) {
      console.log("Password must be at least 6 characters long");
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log("Username or email already exists");
      return res.status(400).json({ error: "Le nom d'utilisateur ou l'email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("User registered:", user);

    res.status(201).json({ message: "Utilisateur enregistré avec succès", user });
  } catch (error) {
    console.log("Error registering user:", error.message);
    res.status(400).json({ error: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      console.log("User not found");
      return res.status(404).send({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).send({ error: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT secret is not defined");
      return res.status(500).send({ error: "Internal server error" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log("Login successful, token generated");
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.log("Error logging in user:", error.message);
    res.status(400).send({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error fetching user profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (password && password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error updating user profile" });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting user account" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserAccount };