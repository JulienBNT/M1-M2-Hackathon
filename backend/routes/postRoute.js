const express = require("express");
const router = express.Router();
const {
  createPost,
  deletePost,
  viewPost,
  getAllPosts,
  modifyPost,
  getAllPostsByUser,
} = require("../controllers/postController");

router.post("/", createPost);
router.delete("/:id", deletePost);
router.get("/:id", viewPost);
router.get("/", getAllPosts);
router.get("/get-all-posts/:userId", getAllPostsByUser);
router.put("/:id", modifyPost);

module.exports = router;
