const User = require('../models/User');
const Trademark = require('../models/Trademark');
const Application = require('../models/Application');
const Service = require('../models/Service');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Admin login & get token
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized as an admin' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get overall dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTrademarks = await Trademark.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Recent activity
        const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');
        const recentTrademarks = await Trademark.find().sort({ createdAt: -1 }).limit(5).populate('seller', 'name');

        res.json({
            counts: {
                users: totalUsers,
                trademarks: totalTrademarks,
                applications: totalApplications
            },
            recent: {
                applications: recentApplications,
                trademarks: recentTrademarks
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if any admin exists
// @route   GET /api/admin/check-setup
// @access  Public
const checkSetup = async (req, res, next) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        res.json({ setupRequired: !adminExists });
    } catch (error) {
        next(error);
    }
};

// @desc    Setup first admin
// @route   POST /api/admin/setup
// @access  Public (Only if no admin exists)
const setupAdmin = async (req, res, next) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists. Setup disabled.' });
        }

        const { name, email, password, phone, company, username } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            username: username || 'Nirav',
            email,
            password: hashedPassword,
            phone,
            company,
            role: 'admin'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin username
// @route   PUT /api/admin/update-username
// @access  Private/Admin
const updateUsername = async (req, res, next) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const usernameExists = await User.findOne({ username, _id: { $ne: user._id } });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        user.username = username;
        await user.save();

        res.json({
            message: 'Username updated successfully',
            username: user.username
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Public
const getServices = async (req, res, next) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new service
// @route   POST /api/admin/services
// @access  Private/Admin
const addService = async (req, res) => {
    try {
        const { title, category, priceDetails, includes, notIncludes, remarks, color, order } = req.body;

        if (!title || !category) {
            return res.status(400).json({ message: 'Title and Category are required' });
        }

        const service = await Service.create({
            title,
            category,
            priceDetails: Array.isArray(priceDetails) ? priceDetails : [],
            includes: Array.isArray(includes) ? includes : [],
            notIncludes: Array.isArray(notIncludes) ? notIncludes : [],
            remarks: Array.isArray(remarks) ? remarks : [],
            color: color || 'orange',
            order: parseInt(order) || 0
        });

        console.log('SERVICE CREATED:', service._id);
        return res.status(201).json(service);
    } catch (error) {
        console.error('ADD SERVICE ERROR:', error);
        return res.status(500).json({
            message: error.message || 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            const { title, category, priceDetails, includes, notIncludes, remarks, color, order } = req.body;
            service.title = title || service.title;
            service.category = category || service.category;
            service.priceDetails = priceDetails || service.priceDetails;
            service.includes = includes || service.includes;
            service.notIncludes = notIncludes || service.notIncludes;
            service.remarks = remarks || service.remarks;
            service.color = color || service.color;
            service.order = order !== undefined ? order : service.order;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            await service.deleteOne();
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    adminLogin,
    checkSetup,
    setupAdmin,
    getUsers,
    deleteUser,
    getDashboardStats,
    updateUsername,
    getServices,
    addService,
    updateService,
    deleteService
};
