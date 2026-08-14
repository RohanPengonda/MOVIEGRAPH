const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

// GET /api/actors/:id
router.get('/:id', actorController.getActorById);

// GET /api/actors/:id/hidden-collaborators
router.get('/:id/hidden-collaborators', actorController.getHiddenCollaborators);

module.exports = router;
