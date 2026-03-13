const express = require('express');
const router = express.Router();
const { createApplication, getMyApplications, getAllApplications, updateApplicationStatus, deleteApplication } = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createApplication)
    .get(protect, admin, getAllApplications);

router.route('/mine')
    .get(protect, getMyApplications);

router.route('/:id')
    .delete(protect, admin, deleteApplication);

router.route('/:id/status')
    .put(protect, admin, updateApplicationStatus);

module.exports = router;
