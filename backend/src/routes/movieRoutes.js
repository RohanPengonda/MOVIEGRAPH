const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET /api/movies/:id
router.get('/:id', movieController.getMovieById);

module.exports = router;
