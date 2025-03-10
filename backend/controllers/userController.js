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


module.exports = { registerUser, loginUser};