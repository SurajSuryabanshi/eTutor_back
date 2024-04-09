const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
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
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  profilePicture: String
});

// Hash password before saving to the database
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next(); // If password is not modified, move to the next middleware
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

studentSchema.statics.findByCredentials = async function(email, password) {
  const student = await this.findOne({ email });

  if (!student) {
      throw new Error('Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, student.password);

  if (!isPasswordMatch) {
      throw new Error('Invalid email or password');
  }

  return student;
};
studentSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
      { studentId: this._id, email: this.email },
      process.env.JWT_SECRET_KEY
  );

return token;
};
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
