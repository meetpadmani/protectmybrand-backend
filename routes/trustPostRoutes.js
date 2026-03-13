const express = require('express');
const router = express.Router();
const multer = require('multer');
const TrustPost = require('../models/TrustPost');
const { protect, admin } = require('../middleware/authMiddleware');
const { cloudinary, storage } = require('../config/cloudinaryConfig');

const upload = multer({ storage });

// @desc    Get the active trust post
// @route   GET /api/trust-post
// @access  Public
router.get('/', async (req, res) => {
    try {
        const post = await TrustPost.findOne({ active: true }).sort({ createdAt: -1 });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching trust post' });
    }
});

// @desc    Create or update trust post
// @route   POST /api/trust-post
// @access  Private/Admin
router.post(
    '/',
    protect,
    admin,
    upload.single('image'),
    async (req, res) => {
        try {
            const { title, subtitle, link, active } = req.body;

            let imageUrl, imagePublicId;

            if (req.file) {
                imageUrl = req.file.path;
                imagePublicId = req.file.filename;
            }

            // For simplicity, we'll just keep one active post or update the latest one
            let post = await TrustPost.findOne().sort({ createdAt: -1 });

            if (post) {
                // Update existing
                post.title = title || post.title;
                post.subtitle = subtitle || post.subtitle;
                post.link = link || post.link;
                post.active = active !== undefined ? active : post.active;

                if (imageUrl) {
                    // Delete old image from Cloudinary
                    if (post.imagePublicId) {
                        await cloudinary.uploader.destroy(post.imagePublicId);
                    }
                    post.imageUrl = imageUrl;
                    post.imagePublicId = imagePublicId;
                }

                const updatedPost = await post.save();
                res.json(updatedPost);
            } else {
                // Create new
                if (!imageUrl) {
                    return res.status(400).json({ message: 'Image is required for a new post' });
                }
                const newPost = new TrustPost({
                    title,
                    subtitle,
                    link,
                    imageUrl,
                    imagePublicId,
                    active: active !== undefined ? active : true
                });
                const savedPost = await newPost.save();
                res.status(201).json(savedPost);
            }
        } catch (error) {
            console.error('Trust Post Error:', error);
            res.status(500).json({ message: 'Server Error managing trust post', details: error.message });
        }
    }
);

module.exports = router;
