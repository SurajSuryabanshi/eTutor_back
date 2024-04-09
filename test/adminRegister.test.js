const { adminRegister } = require('../controllers/adminController');
const Admin = require('../models/admin');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

beforeAll(async () => {
  await connectDB(); 
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('adminRegister', () => {
  // Test case for registering admin, adminRegister function
  it('should register a new admin', async () => {
    const req = {
      body: {
        email: 'testadmin@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await adminRegister(req, res);

    const createdAdmin = await Admin.findOne({ email: 'testadmin@example.com' });

    //logging the createdAdmin
    console.log(createdAdmin)
    expect(createdAdmin).toBeDefined(); 
    expect(res.status).toHaveBeenCalledWith(201); 
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin registration successful' }); 
  });
});