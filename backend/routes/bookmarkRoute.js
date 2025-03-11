const express = require('express');
const router = express.Router();
const { createBookmark, deleteBookmark, getUserBookmarks } = require('../controllers/bookmarkController');

router.post('/', createBookmark);
router.delete('/', deleteBookmark);
router.get('/', getUserBookmarks);

module.exports = router;