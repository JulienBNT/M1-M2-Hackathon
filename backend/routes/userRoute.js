const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  verifyToken,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.delete("/me", protect, deleteUserAccount);
router.get("/verify", protect, verifyToken);

module.exports = router;
