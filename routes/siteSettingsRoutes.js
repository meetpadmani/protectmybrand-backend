const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get site settings
// @route   GET /api/site-settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne().lean();
        const defaultSettings = {
            navbarLinks: [
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Packages', path: '/packages' },
                { label: 'Marketplace', path: '/marketplace' }
            ],
            footerSections: [
                {
                    title: 'Resources',
                    links: [
                        { label: 'About Us', path: '/about' },
                        { label: 'Legal Blog', path: '#' },
                        { label: 'Support', path: '#' }
                    ]
                },
                {
                    title: 'Our Services',
                    links: [
                        { label: 'Trademark Filing', path: '/packages' },
                        { label: 'Copyright Protection', path: '/packages' },
                        { label: 'Compliance', path: '/packages' }
                    ]
                }
            ],
            contactInfo: {
                address: "206 Sunrise Commercial Complex, Surat, Gujarat 394101",
                phones: ["+91 98796 20138", "+91 98255 16923"],
                emails: ["contact@protectmybrand.in", "niravgalani369@gmail.com"],
                socialLinks: [
                    { platform: 'Facebook', url: '#' },
                    { platform: 'Twitter', url: '#' },
                    { platform: 'LinkedIn', url: '#' },
                    { platform: 'Instagram', url: '#' }
                ]
            },
            visibility: {
                '/login': { showNavbar: false, showFooter: false },
                '/register': { showNavbar: false, showFooter: false },
                '/admin/login': { showNavbar: false, showFooter: false },
                '/admin/setup': { showNavbar: false, showFooter: false },
                '/dashboard': { showNavbar: false, showFooter: false }
            }
        };

        if (!settings) {
            return res.json(defaultSettings);
        }

        // Deep merge contactInfo and visibility
        const finalContactInfo = settings.contactInfo || {};
        const mergedContactInfo = {
            ...defaultSettings.contactInfo,
            ...finalContactInfo,
            phones: finalContactInfo.phones || (finalContactInfo.phone ? [finalContactInfo.phone] : defaultSettings.contactInfo.phones),
            emails: finalContactInfo.emails || (finalContactInfo.email ? [finalContactInfo.email] : defaultSettings.contactInfo.emails),
            socialLinks: finalContactInfo.socialLinks || defaultSettings.contactInfo.socialLinks
        };

        const finalVisibility = settings.visibility instanceof Map
            ? Object.fromEntries(settings.visibility)
            : (settings.visibility || {});

        const result = {
            ...defaultSettings,
            ...settings,
            contactInfo: mergedContactInfo,
            visibility: {
                ...defaultSettings.visibility,
                ...finalVisibility
            }
        };

        res.json(result);
    } catch (error) {
        console.error('Site Settings GET Error:', error);
        res.status(200).json({
            message: 'Falling back to defaults',
            navbarLinks: [
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Packages', path: '/packages' },
                { label: 'Marketplace', path: '/marketplace' }
            ],
            visibility: {}
        });
    }
});

// @desc    Update site settings
// @route   PUT /api/site-settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();

        if (settings) {
            settings = await SiteSettings.findOneAndUpdate({}, req.body, { new: true });
        } else {
            settings = await SiteSettings.create(req.body);
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
