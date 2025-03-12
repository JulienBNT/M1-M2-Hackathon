const express = require("express");
const router = express.Router();
const { createPost, deletePost, viewPost, getAllPosts, modifyPost, getAllPostsByUser } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.get('/:id', protect, viewPost);
router.get('/', protect, getAllPosts);
router.get("/get-all-posts/:userId", getAllPostsByUser);
router.put('/:id', protect, modifyPost);

module.exports = router;
