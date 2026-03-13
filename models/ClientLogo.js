const mongoose = require('mongoose');

const clientLogoSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client Name is required'],
        trim: true,
    },
    logoUrl: {
        type: String,
        required: [true, 'Logo image is required'],
    },
    logoPublicId: {
        type: String,
        required: [true, 'Logo Public ID is required for Cloudinary'],
    },
    certificateUrl: {
        type: String,
        required: false,
    },
    certificatePublicId: {
        type: String,
        required: false,
    },
    certificate2Url: {
        type: String,
        required: false,
    },
    certificate2PublicId: {
        type: String,
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('ClientLogo', clientLogoSchema);
