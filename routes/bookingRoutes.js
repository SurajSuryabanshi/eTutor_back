const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateStudent } = require('../middlewares/authenticateJWT');


router.post('/book', authenticateStudent, bookingController.bookSession);
module.exports = router;
