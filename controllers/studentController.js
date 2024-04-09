const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Booking = require('../models/booking');

// Student registration
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, collegeId, profilePicture } = req.body;
        const formattedCollegeId = mongoose.Types.ObjectId.isValid(collegeId) ? collegeId : null;

        const student = new Student({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            college: formattedCollegeId,
            profilePicture
        });

        await student.save();

        res.status(201).json({ message: 'Student registered successfully', student });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Student login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findByCredentials(email, password);

        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = student.generateAuthToken();

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in student:', error);
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Get the student ID from the authenticated request
        const studentId = req.student._id;

        // Fetch the student profile data from the database
        const profile = await Student.findById(studentId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Send the profile data in the response
        res.status(200).json({ student: profile });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Student profile edit
exports.editProfile = async (req, res) => {
    try {
        const studentId = req.student._id;

        const { firstName, lastName, email, phoneNumber, collegeName, profilePicture } = req.body;
        if (req.file) {
            profilePicture = req.file.path; // Save the file path
        }
        const updatedFields = {
            firstName,
            lastName,
            email,
            phoneNumber,
            profilePicture
        };

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedFields, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student profile updated successfully', student: updatedStudent });
    } catch (error) {
        console.error('Error editing student profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logout = async (req, res) => {
    try {
        // Clear the token cookie from the client
        res.clearCookie("token");

        // Respond with success message
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Handle errors
        console.error('Error logging out tutor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Student profile delete
exports.deleteProfile = async (req, res) => {
    try {
        const studentId = req.student._id;

        await Student.findByIdAndDelete(studentId);

        res.status(200).json({ message: 'Student profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting student profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
      const studentId = req.student._id; // Assuming tutorId is extracted from the token
      const bookings = await Booking.find({ student: studentId }).populate('tutor');
      res.status(200).json({ bookings });
    } catch (error) {
      console.error('Error fetching tutor bookings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };