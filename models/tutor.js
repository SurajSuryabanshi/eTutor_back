const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tutorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
      },
    password: {
        type: String,
        required: true
    },
    languages: {
        type: String,
        required: true
    }, // Array of strings for languages
    courses: {
        type: String,
        required: true
    } ,
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    profilePicture: String,
    availability: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability'
    }]
   
});

// Middleware to hash password before saving
tutorSchema.pre('save', async function(next) {
    try {
        // Hash the password only if it has been modified or is new
        if (!this.isModified('password')) {
            return next();
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Replace the plain text password with the hashed one
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Static method to find a tutor by email and password
tutorSchema.statics.findByCredentials = async function(email, password) {
    const tutor = await this.findOne({ email });
    if (!tutor) {
        throw new Error('Invalid email or password');
    }
    const isPasswordMatch = await bcrypt.compare(password, tutor.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
    }
    return tutor;
};

// Generate JWT token
tutorSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { tutorId: this._id, email: this.email },
        process.env.JWT_SECRET_KEY
    );

  return token;
};

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
