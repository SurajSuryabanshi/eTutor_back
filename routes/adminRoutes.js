const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { authenticateAdmin } = require('../middlewares/authenticateJWT.js');

router.post('/login', adminController.adminLogin);
router.post('/register', adminController.adminRegister);

//routes to manage bookings 
router.delete('/bookings/:bookingId',authenticateAdmin, adminController.deleteBooking);
router.get('/bookings', authenticateAdmin,adminController.getAllBookings);

//routes to manage students
router.get('/students', authenticateAdmin, adminController.getAllStudents);
router.put('/students/:studentId', authenticateAdmin, adminController.updateStudent);
router.delete('/students/:studentId', authenticateAdmin, adminController.deleteStudent);
router.get('/students/:studentId', authenticateAdmin, adminController.getStudentById);

//routes to manage tutors
router.get('/tutors', authenticateAdmin, adminController.getAllTutors);
router.put('/tutors/:tutorId', authenticateAdmin, adminController.updateTutor);
router.delete('/tutors/:tutorId', authenticateAdmin, adminController.deleteTutor);
router.get('/tutors/:tutorId', authenticateAdmin, adminController.getTutorById);

//routest to manage colleges
router.put('/colleges/:collegeId', authenticateAdmin, adminController.updateCollege);
router.delete('/colleges/:collegeId', authenticateAdmin, adminController.deleteCollege);
router.get('/colleges', authenticateAdmin, adminController.getAllColleges);

module.exports = router;
