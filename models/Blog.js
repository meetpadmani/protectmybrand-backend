const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    excerpt: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        default: 'Trademark',
    },
    imageUrl: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    author: {
        type: String,
        default: 'Protect My Brand Admin',
    },
    tags: [{
        type: String,
    }],
    active: {
        type: Boolean,
        default: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Pre-save hook to generate slug if not provided (though usually handled by frontend)
blogSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title.toLowerCase().split(' ').join('-');
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
