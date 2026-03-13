const Blog = require('../models/Blog');
const { cloudinary } = require('../config/cloudinaryConfig');

// @desc    Get all blogs (public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ active: true }).sort({ publishedAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching blogs' });
    }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, active: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching blog' });
    }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
    try {
        const { title, content, category, author, tags, active, excerpt } = req.body;

        let imageUrl, imagePublicId;
        if (req.file) {
            imageUrl = req.file.path;
            imagePublicId = req.file.filename;
        }

        const slug = title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');

        const blog = new Blog({
            title,
            slug,
            content,
            excerpt,
            category,
            author,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            active: active !== undefined ? active : true,
            imageUrl,
            imagePublicId
        });

        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Create Blog Error:', error);
        res.status(500).json({ message: 'Server Error creating blog', details: error.message });
    }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const { title, content, category, author, tags, active, excerpt } = req.body;

        if (title) {
            blog.title = title;
            blog.slug = title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
        }
        if (content) blog.content = content;
        if (excerpt) blog.excerpt = excerpt;
        if (category) blog.category = category;
        if (author) blog.author = author;
        if (tags) blog.tags = tags.split(',').map(t => t.trim());
        if (active !== undefined) blog.active = active;

        if (req.file) {
            // Delete old image
            if (blog.imagePublicId) {
                await cloudinary.uploader.destroy(blog.imagePublicId);
            }
            blog.imageUrl = req.file.path;
            blog.imagePublicId = req.file.filename;
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        console.error('Update Blog Error:', error);
        res.status(500).json({ message: 'Server Error updating blog' });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Delete image from Cloudinary
        if (blog.imagePublicId) {
            await cloudinary.uploader.destroy(blog.imagePublicId);
        }

        await Blog.deleteOne({ _id: req.params.id });
        res.json({ message: 'Blog removed' });
    } catch (error) {
        console.error('Delete Blog Error:', error);
        res.status(500).json({ message: 'Server Error deleting blog' });
    }
};
