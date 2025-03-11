const express = require('express');
const router = express.Router();
const { createPost, deletePost, viewPost, getAllPosts, modifyPost } = require('../controllers/postController');

router.post('/', createPost);
router.delete('/:id', deletePost);
router.get('/:id', viewPost);
router.get('/', getAllPosts);
router.put('/:id', modifyPost);

module.exports = router;