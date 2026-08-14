const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// GET /api/search?q=query
router.get('/search', searchController.searchEntities);

// GET /api/featured
router.get('/featured', searchController.getFeatured);

module.exports = router;
