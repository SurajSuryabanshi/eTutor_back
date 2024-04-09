const { register } = require('../controllers/tutorController');
const Tutor = require('../models/tutor');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

beforeAll(async () => {
  await connectDB(); 
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('tutorRegister', () => {
  // Test case for registering the tutor, register function
  it('should register a new tutor', async () => {
    const req = {
      body: {
        firstName: 'Test',
        lastName: 'Tutor',
        email: 'testtutor@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        collegeId: '60328b66b86b8719d80e7341', 
        languages: 'English',
        courses: 'Mathematics',
        profilePicture: 'test.jpg'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    const createdTutor = await Tutor.findOne({ email: 'testtutor@example.com' });
    //logging the created tutor
    console.log(createdTutor)
    expect(createdTutor).toBeDefined(); 
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tutor registered successfully', tutor: expect.any(Object) }); 
  });
  
});
