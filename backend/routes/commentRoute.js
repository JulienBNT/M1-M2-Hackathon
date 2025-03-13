const express = require('express');
const router = express.Router();
const { createComment, deleteComment, getCommentsByUser, viewComment, getComments, modifyComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createComment);
router.get('/', protect, getComments);
router.delete('/:id', protect, deleteComment);
router.get('/:id', protect, viewComment);
router.get('/user/:userId', protect, getCommentsByUser);
router.put('/:id', protect, modifyComment);

module.exports = router;