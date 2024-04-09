const { editProfile } = require('../controllers/studentController');
const Student = require('../models/student');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
jest.mock('../models/student');

beforeAll(async () => {
  await connectDB(); 
});

afterAll(async () => {
  await mongoose.disconnect();
});

//test case for editing student profile, edit profile function
describe('Edit Student Profile', () => {

    it('should edit student profile details', async () => {
            const req = {
              student: {
                _id: '660e00f9e840acff89b49149', 
              },
              body: {
                firstName: 'Updated',
                lastName: 'Student',
                email: 'updatedstudent@example.com',
                phoneNumber: '1234567890',
                collegeName: 'Updated College',
                profilePicture: 'test.jpg'
              }
            };
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
            };

            const updatedStudentProfile = {
              _id: req.student._id,
              ...req.body
            };
            Student.findByIdAndUpdate.mockResolvedValueOnce(updatedStudentProfile);
        
            // Call the editProfile function
            await editProfile(req, res);
      
            //logging the updated student profile
            console.log('Updated Student Profile:', updatedStudentProfile);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Student profile updated successfully', student: expect.any(Object) });
          });
        });
