const express = require('express');
const router = express.Router();
const { createRepost, deleteRepost, viewRepost, getReposts, modifyRepost } = require('../controllers/repostController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createRepost);
router.get('/', protect, getReposts);
router.delete('/:id', protect, deleteRepost);
router.get('/:id', protect, viewRepost);
router.put('/:id', protect, modifyRepost);

module.exports = router;