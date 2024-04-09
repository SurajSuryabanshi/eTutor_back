const { getAllColleges } = require('../controllers/collegeController');
const College = require('../models/college');

jest.mock('../models/college');

//test case for getting all the colleges using the getAllColleges function
describe('Get All Colleges', () => {
  it('should get all colleges', async () => {
    const dummyColleges = [
      { collegeName: 'College A', location: 'Location A', email: 'collegeA@example.com', phoneNumber: '1234567890', description: 'Description A', picture: 'pictureA.jpg' },
      { collegeName: 'College B', location: 'Location B', email: 'collegeB@example.com', phoneNumber: '0987654321', description: 'Description B', picture: 'pictureB.jpg' }
    ];
    College.find.mockResolvedValueOnce(dummyColleges);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAllColleges(req, res);

    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith(dummyColleges); 
});
});