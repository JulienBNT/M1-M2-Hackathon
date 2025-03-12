const express = require('express');
const router = express.Router();
const { createBookmark, deleteBookmark, getUserBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createBookmark);
router.delete('/', protect, deleteBookmark);
router.get('/', protect, getUserBookmarks);

module.exports = router;