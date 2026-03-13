const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    companyRole: {
        type: String,
        trim: true
    },
    reviewText: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
