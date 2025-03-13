const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteComment,
  getCommentsByUser,
  viewComment,
  getComments,
  modifyComment,
  getCommentsByPost,
  getCommentCount,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createComment);
router.get("/", protect, getComments);
router.delete("/:id", protect, deleteComment);
router.get("/:id", protect, viewComment);
router.get("/user/:userId", protect, getCommentsByUser);
router.put("/:id", protect, modifyComment);
router.get("/post/:postId", protect, getCommentsByPost);

router.get("/count/:postId", protect, getCommentCount);

module.exports = router;
