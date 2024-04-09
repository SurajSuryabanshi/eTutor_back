const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateStudent } = require('../middlewares/authenticateJWT');

// Import multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Set the directory where the files should be saved
  },
  filename: function (req, file, cb) {
    // Create a unique filename with the original name and the current date
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Update the '/register' route to handle file uploads
router.post('/register', upload.single('profilePicture'), studentController.register);

router.get('/profile', authenticateStudent, studentController.getProfile);

router.get('/logout', authenticateStudent, studentController.logout);

// Student login route
router.post('/login', studentController.login);

// Student profile edit route
router.put('/profile', authenticateStudent, upload.single('profilePicture'),studentController.editProfile);

// Student profile delete route
router.delete('/profile', authenticateStudent, studentController.deleteProfile);

router.get('/bookings', authenticateStudent, studentController.getAllBookings);

module.exports = router;