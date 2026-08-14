const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

// GET /api/connection/actors?from=a1&to=a2
router.get('/actors', connectionController.getDegreesOfSeparation);

module.exports = router;
