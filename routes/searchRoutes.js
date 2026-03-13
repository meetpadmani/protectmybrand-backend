const express = require('express');
const router = express.Router();
const { globalSearch, getTrademarkDetail, getTrademarkDocuments } = require('../controllers/searchController');

// Search by category (trademarks, companies, directors, patents, designs, copyrights)
router.get('/:category', globalSearch);

// Indian Trademark API — detail and documents
router.get('/trademark/:id', getTrademarkDetail);
router.get('/trademark/documents', getTrademarkDocuments);

module.exports = router;
