const express = require('express');
const router = express.Router();
const multer = require('multer');
const ClientLogo = require('../models/ClientLogo');
const { protect, admin } = require('../middleware/authMiddleware');
const { cloudinary, storage } = require('../config/cloudinaryConfig');

console.log('Cloudinary Config Check:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'MISSING'
});

const upload = multer({ storage });

// @desc    Get all client logos
// @route   GET /api/client-logos
// @access  Public
router.get('/', async (req, res) => {
    try {
        const logos = await ClientLogo.find({}).sort({ createdAt: -1 });
        res.json(logos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching logos' });
    }
});

// @desc    Add a client logo (with optional certificate)
// @route   POST /api/client-logos
// @access  Private/Admin
router.post(
    '/',
    protect,
    admin,
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'certificate', maxCount: 1 },
        { name: 'certificate2', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            console.log('Received Upload Request:', req.body);
            console.log('Files:', req.files ? Object.keys(req.files) : 'No Files');
            const { clientName } = req.body;

            if (!req.files || !req.files['logo']) {
                return res.status(400).json({ message: 'Logo image is required' });
            }

            const logoUrl = req.files['logo'][0].path;
            const logoPublicId = req.files['logo'][0].filename;

            let certificateUrl = '';
            let certificatePublicId = '';
            let certificate2Url = '';
            let certificate2PublicId = '';

            if (req.files['certificate']) {
                certificateUrl = req.files['certificate'][0].path;
                certificatePublicId = req.files['certificate'][0].filename;
            }

            if (req.files['certificate2']) {
                certificate2Url = req.files['certificate2'][0].path;
                certificate2PublicId = req.files['certificate2'][0].filename;
            }

            const clientLogo = new ClientLogo({
                clientName: clientName || 'Client ' + Date.now(),
                logoUrl,
                logoPublicId,
                certificateUrl,
                certificatePublicId,
                certificate2Url,
                certificate2PublicId,
            });

            const createdLogo = await clientLogo.save();
            res.status(201).json(createdLogo);
        } catch (error) {
            console.error('CRITICAL CLIENT LOGO UPLOAD ERROR:', error);
            res.status(500).json({
                message: 'Server Error uploading to Cloudinary',
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
);

// @desc    Delete a client logo
// @route   DELETE /api/client-logos/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const logo = await ClientLogo.findById(req.params.id);

        if (logo) {
            // Delete from Cloudinary
            if (logo.logoPublicId) {
                await cloudinary.uploader.destroy(logo.logoPublicId);
            }

            if (logo.certificatePublicId) {
                await cloudinary.uploader.destroy(logo.certificatePublicId);
            }

            if (logo.certificate2PublicId) {
                await cloudinary.uploader.destroy(logo.certificate2PublicId);
            }

            await logo.deleteOne();
            res.json({ message: 'Client logo removed from Cloudinary and DB' });
        } else {
            res.status(404).json({ message: 'Client logo not found' });
        }
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: 'Server Error deleting logo' });
    }
});

module.exports = router;
