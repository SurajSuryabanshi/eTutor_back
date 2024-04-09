// Import required modules
const { register } = require('../controllers/collegeController');
const College = require('../models/college');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Connect to the testing database
beforeAll(async () => {
  await connectDB(); 
});

// Disconnect from the testing database after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});

describe('collegeRegister', () => {
  // Test case
  it('should register a new college', async () => {
    // Mock request and response objects
    const req = {
      body: {
        collegeName: 'Test College',
        location: 'Test Location',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        description: 'Test Description',
        picture: 'test.jpg'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the register function
    await register(req, res);

    // Retrieve the newly created college from the database
    const createdCollege = await College.findOne({ email: 'test@example.com' });

    // Assertions
    expect(createdCollege).toBeDefined(); // Check if a college with the provided email exists
    expect(res.status).toHaveBeenCalledWith(201); // Check if the response status is 201 (Created)
    expect(res.json).toHaveBeenCalledWith({ message: 'College registered successfully', college: expect.any(Object) }); // Check the response message
  });

  
});
