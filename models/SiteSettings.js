const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    navbarLinks: [{
        label: { type: String, required: true },
        path: { type: String, required: true },
        isExternal: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        subNav: [{
            label: { type: String },
            path: { type: String }
        }]
    }],
    footerSections: [{
        title: { type: String, required: true },
        links: [{
            label: { type: String, required: true },
            path: { type: String, required: true }
        }],
        order: { type: Number, default: 0 }
    }],
    contactInfo: {
        address: { type: String },
        phones: [{ type: String }],
        emails: [{ type: String }],
        socialLinks: [{
            platform: { type: String },
            url: { type: String }
        }]
    },
    visibility: {
        // Map of paths to visibility settings
        // Example: { '/': { showNavbar: true, showFooter: true }, '/admin': { ... } }
        type: Map,
        of: new mongoose.Schema({
            showNavbar: { type: Boolean, default: true },
            showFooter: { type: Boolean, default: true }
        }, { _id: false }),
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
