const express = require("express");
const router = express.Router();
const {
  createLike,
  deleteLike,
  getUserLikes,
  checkLikeStatus,
  getLikeCount,
} = require("../controllers/likeController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createLike);
router.delete("/", protect, deleteLike);
router.get("/", protect, getUserLikes);
router.get("/status/:postId", protect, checkLikeStatus);
router.get("/count/:postId", protect, getLikeCount);

module.exports = router;
