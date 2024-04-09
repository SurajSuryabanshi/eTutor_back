const { register } = require('../controllers/collegeController');
const College = require('../models/college');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

beforeAll(async () => {
  await connectDB(); 
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('collegeRegister', () => {
  // Test case for registering the new college, register function of college
  it('should register a new college', async () => {
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

    const createdCollege = await College.findOne({ email: 'test@example.com' });
    
    //logging the createdCollege
    console.log(createdCollege);
    expect(createdCollege).toBeDefined(); 
    expect(res.status).toHaveBeenCalledWith(201); 
    expect(res.json).toHaveBeenCalledWith({ message: 'College registered successfully', college: expect.any(Object) }); 
  });

  
});
