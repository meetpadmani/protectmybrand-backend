const mongoose = require('mongoose');

const trustPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
    },
    imagePublicId: {
        type: String,
        required: [true, 'Image Public ID is required for Cloudinary'],
    },
    link: {
        type: String,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('TrustPost', trustPostSchema);
