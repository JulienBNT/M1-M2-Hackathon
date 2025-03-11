const express = require('express');
const router = express.Router();
const { createLike, deleteLike, getUserLikes } = require('../controllers/likeController');

router.post('/', createLike);
router.delete('/', deleteLike);
router.get('/', getUserLikes);

module.exports = router;