const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController.js');

const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage: storage });

// Adjust the upload.array() to match the field name used in your frontend ('collegePics') and the number of files you expect
router.post('/register', upload.array('collegePics', 5), collegeController.register);
router.get('/:id', collegeController.getCollegeById);

// Endpoint to fetch list of colleges
router.get('/', collegeController.getAllColleges);

router.get('/:collegeId/tutors', collegeController.getTutorsByCollegeId);

module.exports = router;
