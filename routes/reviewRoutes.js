const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getReviews)
    .post(protect, admin, addReview);

router.route('/:id')
    .delete(protect, admin, deleteReview);

module.exports = router;
