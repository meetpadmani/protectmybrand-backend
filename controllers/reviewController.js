const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private/Admin
const addReview = async (req, res, next) => {
    try {
        const { clientName, companyRole, reviewText, rating } = req.body;

        const review = await Review.create({
            clientName,
            companyRole,
            reviewText,
            rating
        });

        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (review) {
            await review.deleteOne();
            res.json({ message: 'Review removed' });
        } else {
            res.status(404);
            throw new Error('Review not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getReviews,
    addReview,
    deleteReview
};
