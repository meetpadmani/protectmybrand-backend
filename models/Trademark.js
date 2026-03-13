const mongoose = require('mongoose');

const trademarkSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brandName: { type: String, required: true },
    trademarkClass: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Sold'], default: 'Pending' },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    certificateUrl: { type: String }, // URL or path from cloud storage
    description: { type: String },
    features: [{ type: String }],
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Trademark', trademarkSchema);
