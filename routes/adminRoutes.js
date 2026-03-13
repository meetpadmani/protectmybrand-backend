const express = require('express');
const router = express.Router();
console.log('--- adminRoutes.js loaded ---');
const { adminLogin, checkSetup, setupAdmin, getUsers, deleteUser, getDashboardStats, updateUsername, getServices, addService, updateService, deleteService } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/check-setup', checkSetup);
router.post('/setup', setupAdmin);

router.route('/update-username')
    .put(protect, admin, updateUsername);

router.route('/users')
    .get(protect, admin, getUsers);

router.route('/users/:id')
    .delete(protect, admin, deleteUser);

router.route('/stats')
    .get(protect, admin, getDashboardStats);

router.route('/services')
    .get(getServices)
    .post(protect, admin, addService);

router.route('/services/:id')
    .put(protect, admin, updateService)
    .delete(protect, admin, deleteService);

module.exports = router;
