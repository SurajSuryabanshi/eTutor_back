const { register } = require('../controllers/studentController');
const Student = require('../models/student');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

beforeAll(async () => {
  await connectDB(); 
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('studentRegister', () => {
  // Test case for registering new student, register function
  it('should register a new student', async () => {
    const req = {
      body: {
        firstName: 'Test',
        lastName: 'Student',
        email: 'teststudent@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        collegeId: '60328b66b86b8719d80e7341', 
        profilePicture: 'test.jpg'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the register function
    await register(req, res);
    const createdStudent = await Student.findOne({ email: 'teststudent@example.com' });

    //logging the created student
    console.log(createdStudent)
    expect(createdStudent).toBeDefined(); 
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student registered successfully', student: expect.any(Object) }); 
  });
});
