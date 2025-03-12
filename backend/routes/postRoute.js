const express = require('express');
const router = express.Router();
const { createPost, deletePost, viewPost, getAllPosts, modifyPost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.get('/:id', protect, viewPost);
router.get('/', protect, getAllPosts);
router.put('/:id', protect, modifyPost);

module.exports = router;