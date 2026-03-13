const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, required: true }, // e.g., 'Trademark Registration', 'Patent Registration'
    status: { type: String, enum: ['Submitted', 'Under Review', 'Processing', 'Completed', 'Rejected'], default: 'Submitted' },
    documents: [{
        name: String,
        url: String,
    }],
    details: { type: Object }, // Flexible field for specific service data
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    notes: { type: String }, // Admin notes
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
