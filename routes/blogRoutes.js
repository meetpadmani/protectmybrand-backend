const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

const upload = multer({ storage });

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.post('/', protect, admin, upload.single('image'), createBlog);
router.put('/:id', protect, admin, upload.single('image'), updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
