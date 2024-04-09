const mongoose = require('mongoose');
// MongoDB connection URI
const mongoURI = 'mongodb+srv://sghartic:sumingc@etutor.564tdky.mongodb.net/?retryWrites=true&w=majority&appName=eTutor';

// Function to establish connection to MongoDB.
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    process.exit(1);
  }
};

// Exporting the connectDB function for use in other modules
module.exports = connectDB;
