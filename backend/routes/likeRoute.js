const express = require('express');
const router = express.Router();
const { createLike, deleteLike, getUserLikes } = require('../controllers/likeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createLike);
router.delete('/', protect, deleteLike);
router.get('/', protect, getUserLikes);

module.exports = router;