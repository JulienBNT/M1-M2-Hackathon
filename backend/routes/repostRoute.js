const express = require('express');
const router = express.Router();
const { createRepost, deleteRepost, viewRepost, getReposts, modifyRepost } = require('../controllers/repostController');

router.post('/', createRepost);
router.get('/', getReposts);
router.delete('/:id', deleteRepost);
router.get('/:id', viewRepost);
router.put('/:id', modifyRepost);

module.exports = router;