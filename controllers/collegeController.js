const College = require('../models/college');
const Tutor = require('../models/tutor')

// function to register college
exports.register = async (req, res) => {
    try {
        const { collegeName, location, email, phoneNumber, description, picture } = req.body;
        const existingCollege = await College.findOne({ email });
        if (existingCollege) {
            return res.status(400).json({ message: 'College with this email already exists' });
        }
        const college = new College({ collegeName, location, email, phoneNumber, description, picture });
        await college.save();
        res.status(201).json({ message: 'College registered successfully', college });
    } catch (error) {
        console.error('Error registering college:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all colleges
exports.getAllColleges = async (req, res) => {
    try {
        const colleges = await College.find();
        res.status(200).json(colleges);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//getting a specific college based on id
exports.getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.status(200).json(college);
    } catch (error) {
        console.error('Error fetching college:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//getting tutors associated with the college id
exports.getTutorsByCollegeId = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const tutors = await Tutor.find({ college: collegeId });
        res.status(200).json(tutors);
    } catch (error) {
        console.error('Error fetching tutors by college ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};