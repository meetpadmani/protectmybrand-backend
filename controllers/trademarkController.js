const Trademark = require('../models/Trademark');

// @desc    Get all trademarks (with search and filter)
// @route   GET /api/trademarks
// @access  Public
const getTrademarks = async (req, res, next) => {
    try {
        const { keyword, trademarkClass, status } = req.query;

        const query = {};

        if (keyword) {
            query.brandName = { $regex: keyword, $options: 'i' };
        }

        if (trademarkClass) {
            query.trademarkClass = Number(trademarkClass);
        }

        if (status) {
            query.status = status;
        } else {
            // By default, only show approved trademarks to public
            if (!req.user || req.user.role !== 'admin') {
                query.status = 'Approved';
            }
        }

        const trademarks = await Trademark.find(query).populate('seller', 'name email').sort({ createdAt: -1 });
        res.json(trademarks);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single trademark
// @route   GET /api/trademarks/:id
// @access  Public
const getTrademarkById = async (req, res, next) => {
    try {
        const trademark = await Trademark.findById(req.params.id).populate('seller', 'name email company');

        if (trademark) {
            if (trademark.status !== 'Approved' && (!req.user || (req.user.role !== 'admin' && trademark.seller._id.toString() !== req.user._id.toString()))) {
                return res.status(404).json({ message: 'Trademark not found' });
            }
            res.json(trademark);
        } else {
            res.status(404).json({ message: 'Trademark not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a trademark listing
// @route   POST /api/trademarks
// @access  Private
const createTrademark = async (req, res, next) => {
    try {
        const { brandName, trademarkClass, price, negotiable, description, features, certificateUrl } = req.body;

        const trademark = new Trademark({
            seller: req.user._id,
            brandName,
            trademarkClass,
            price,
            negotiable,
            description,
            features,
            certificateUrl
        });

        const createdTrademark = await trademark.save();
        res.status(201).json(createdTrademark);
    } catch (error) {
        next(error);
    }
};

// @desc    Update trademark status (Admin only)
// @route   PUT /api/trademarks/:id/status
// @access  Private/Admin
const updateTrademarkStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const trademark = await Trademark.findById(req.params.id);

        if (trademark) {
            trademark.status = status;
            const updatedTrademark = await trademark.save();
            res.json(updatedTrademark);
        } else {
            res.status(404).json({ message: 'Trademark not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete trademark
// @route   DELETE /api/trademarks/:id
// @access  Private/Admin
const deleteTrademark = async (req, res, next) => {
    try {
        const trademark = await Trademark.findById(req.params.id);

        if (trademark) {
            await trademark.deleteOne();
            res.json({ message: 'Trademark removed' });
        } else {
            res.status(404).json({ message: 'Trademark not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTrademarks,
    getTrademarkById,
    createTrademark,
    updateTrademarkStatus,
    deleteTrademark,
};
