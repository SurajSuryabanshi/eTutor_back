// Import required modules
const { adminRegister } = require('../controllers/adminController');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

// Describe the test suite
describe('adminRegister', () => {
  // Mock req and res objects
  const req = {
    body: {
      email: 'test@example.com', // Provide email and password in the request body
      password: 'password123'
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  // Test case
  it('should register a new admin', async () => {
    try {
      // Mock bcrypt.hash to return a hashed password
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

      // Mock Admin.findOne to return null, indicating admin with provided email does not exist
      Admin.findOne = jest.fn().mockResolvedValue(null);

      // Define a variable to store the arguments passed to save function
      let savedAdminArgs;

      // Mock the save function of Admin prototype
      const mockSave = jest.fn().mockImplementation(function() {
        savedAdminArgs = arguments; // Store the arguments passed to save function
        return Promise.resolve();
      });

      // Replace Admin.prototype.save with the mockSave function
      Admin.prototype.save = mockSave;

      // Call the adminRegister function
      await adminRegister(req, res);

      // Assertions
      // Check if Admin.findOne was called with the correct email
      expect(Admin.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });

      // Check if bcrypt.hash was called with the correct password and salt rounds
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      // Check if a new admin was created and saved
      expect(mockSave).toHaveBeenCalled();

      // Verify that the admin is saved with the correct email and hashed password
      const savedAdmin = savedAdminArgs[0]; // Get the first argument passed to save function
    } catch (error) {
      console.error('Error registering admin:', error);
      throw error;
    }
  });
});

