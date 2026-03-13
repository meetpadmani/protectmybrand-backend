const Application = require('../models/Application');

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
    try {
        const { serviceType, documents, details } = req.body;

        const application = new Application({
            user: req.user._id,
            serviceType,
            documents,
            details,
        });

        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user applications
// @route   GET /api/applications/mine
// @access  Private
const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({}).populate('user', 'id name email phone').sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status, paymentStatus, notes } = req.body;
        const application = await Application.findById(req.params.id);

        if (application) {
            if (status) application.status = status;
            if (paymentStatus) application.paymentStatus = paymentStatus;
            if (notes) application.notes = notes;

            const updatedApplication = await application.save();
            res.json(updatedApplication);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (application) {
            await application.deleteOne();
            res.json({ message: 'Application removed' });
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApplication,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication,
};
