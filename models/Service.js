const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Main', 'Note', 'Additional'],
        default: 'Main'
    },
    priceDetails: [{ type: String }],
    includes: [{ type: String }],
    notIncludes: [{ type: String }],
    remarks: [{ type: String }],
    color: { type: String, default: 'orange' }, // orange, green, blue, purple, etc.
    order: { type: Number, default: 0 },
    icon: { type: String, default: 'MdOutlineBolt' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
