const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Student = require('../models/student');
const Tutor = require('../models/tutor');

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const admin = await Admin.findById(decodedToken.adminId);

        if (!admin) {
            throw new Error('Admin not found!');
        }

        req.admin = admin; // Attach admin object to request object
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const authenticateStudent = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const student = await Student.findById(decodedToken.studentId);

        if (!student) {
            throw new Error('Student not found!');
        }

        req.student = student; // Attach student object to request object
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const authenticateTutor = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const tutor = await Tutor.findById(decodedToken.tutorId);

        if (!tutor) {
            throw new Error('Tutor not found!');
        }
        console.log("tutor",tutor);
        req.tutor = tutor; // Attach tutor object to request object
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    authenticateAdmin,
    authenticateStudent,
    authenticateTutor
};
