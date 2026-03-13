const express = require('express');
const router = express.Router();
const { getTrademarks, getTrademarkById, createTrademark, updateTrademarkStatus, deleteTrademark } = require('../controllers/trademarkController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTrademarks) // Can be made aware of req.user if we use a soft-protect middleware, but simplified here
    .post(protect, createTrademark);

router.route('/:id')
    .get(getTrademarkById)
    .delete(protect, admin, deleteTrademark);

router.route('/:id/status')
    .put(protect, admin, updateTrademarkStatus);

module.exports = router;
