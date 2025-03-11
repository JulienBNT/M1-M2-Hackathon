const express = require('express');
const router = express.Router();
const { createComment, deleteComment, getCommentsByUser, viewComment, getComments, modifyComment } = require('../controllers/commentController');

router.post('/', createComment);
router.get('/', getComments);
router.delete('/:id', deleteComment);
router.get('/:id', viewComment);
router.get('/user/:userId', getCommentsByUser);
router.put('/:id', modifyComment);

module.exports = router;