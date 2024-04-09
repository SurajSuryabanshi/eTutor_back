const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticateTutor } = require('../middlewares/authenticateJWT');

// Route for creating or updating availability (protected by tutor authentication)
router.post('/', authenticateTutor, availabilityController.createOrUpdateAvailability);
router.delete('/:id', authenticateTutor, availabilityController.deleteAvailability);
router.get('/', authenticateTutor, availabilityController.getAvailabilities);
router.get('/tutor/:tutorId', availabilityController.searchAvailabilitiesByTutorId);

module.exports = router;
