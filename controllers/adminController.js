const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const College = require('../models/college');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Booking = require('../models/booking');
const Student = require('../models/student');
const Tutor = require('../models/tutor');

//function for admin login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            throw new Error('Please provide both email and password');
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            throw new Error('Invalid email or password');
        }

        // Compare provided password with hashed password in the database
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_KEY);

        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

//function for admin registration
exports.adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            throw new Error('Please provide both email and password');
        }

        // Check if admin with the provided email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            throw new Error('Admin with this email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin with hashed password
        const newAdmin = new Admin({
            email,
            password: hashedPassword
        });
        console.log('New Admin:', newAdmin);

        // Save the admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registration successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        // Fetch all bookings with populated student and tutor fields
        const bookings = await Booking.find()
            .populate('student', 'firstName lastName') // Populate firstName and lastName of the student
            .populate('tutor', 'firstName lastName'); // Populate firstName and lastName of the tutor

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Find the booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Remove the booking from the student's bookings
        await Student.updateOne(
            { _id: booking.student },
            { $pull: { bookings: bookingId } }
        );

        // Remove the booking from the tutor's bookings
        await Tutor.updateOne(
            { _id: booking.tutor },
            { $pull: { bookings: bookingId } }
        );

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



  
  // Function to get all students
  exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('college', 'collegeName'); // Populate college field with name
        res.status(200).json({ students });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Function to update student profile
  exports.updateStudent = async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const { firstName, lastName, email, phoneNumber} = req.body;
      const updatedFields = {
        firstName,
        lastName,
        email,
        phoneNumber
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
  
  // Function to delete student profile
  exports.deleteStudent = async (req, res) => {
    try {
      const studentId = req.params.studentId;
      await Student.findByIdAndDelete(studentId);
      res.status(200).json({ message: 'Student profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting student profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Function to get details of a specific student by ID
exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ student });
  } catch (error) {y
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get all tutors
exports.getAllTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find().populate('college', 'collegeName');
        res.status(200).json({ tutors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to update tutor profile
exports.updateTutor = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        const { firstName, lastName, email, phoneNumber } = req.body;
        
        // Check if the tutor exists
        const existingTutor = await Tutor.findById(tutorId);
        if (!existingTutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Update tutor fields
        existingTutor.firstName = firstName;
        existingTutor.lastName = lastName;
        existingTutor.email = email;
        existingTutor.phoneNumber = phoneNumber;

        // Save the updated tutor
        const updatedTutor = await existingTutor.save();

        res.status(200).json({ message: 'Tutor profile updated successfully', tutor: updatedTutor });
    } catch (error) {
        console.error('Error updating tutor profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to delete tutor profile
exports.deleteTutor = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        await Tutor.findByIdAndDelete(tutorId);
        res.status(200).json({ message: 'Tutor profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting tutor profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to get details of a specific tutor by ID
exports.getTutorById = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        res.status(200).json({ tutor });
    } catch (error) {
        console.error('Error fetching tutor details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Function to update details of a college
exports.updateCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const { collegeName, location, email, phoneNumber, description, picture } = req.body;

        // Find the college by ID and update details
        const updatedCollege = await College.findByIdAndUpdate(collegeId, {
            collegeName,
            location,
            email,
            phoneNumber,
            description,
            picture
        }, { new: true });

        if (!updatedCollege) {
            return res.status(404).json({ message: 'College not found' });
        }

        res.status(200).json({ message: 'College details updated successfully', college: updatedCollege });
    } catch (error) {
        console.error('Error updating college:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to delete a college
exports.deleteCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;

        // Find the college by ID and delete
        const deletedCollege = await College.findByIdAndDelete(collegeId);

        if (!deletedCollege) {
            return res.status(404).json({ message: 'College not found' });
        }

        res.status(200).json({ message: 'College deleted successfully' });
    } catch (error) {
        console.error('Error deleting college:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to retrieve all colleges
exports.getAllColleges = async (req, res) => {
    try {
        const colleges = await College.find();
        res.status(200).json({ colleges });
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};