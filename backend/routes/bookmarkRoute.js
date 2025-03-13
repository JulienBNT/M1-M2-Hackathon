const express = require("express");
const router = express.Router();
const {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  checkPostBookmarkStatus,
  getBookmarkCount,
} = require("../controllers/bookmarkController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:postId", protect, addBookmark);
router.delete("/:postId", protect, removeBookmark);
router.get("/", protect, getUserBookmarks);
router.get("/:userId", protect, getUserBookmarks);
router.get("/:postId/status", protect, checkPostBookmarkStatus);
router.get("/:postId/count", protect, getBookmarkCount);

module.exports = router;
