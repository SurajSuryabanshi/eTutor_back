const Tutor = require('../models/tutor');

//function to query tutors
exports.searchTutors = async (req, res) => {
    try {
        const { date, tutorName, collegeName } = req.query;
        let query = {};

        if (date) {
            query = { ...query, availability: { $elemMatch: { dayOfWeek: date } } };
        }

        if (tutorName) {
            query = {
                ...query,
                $or: [
                    { firstName: { $regex: tutorName, $options: 'i' } },
                    { lastName: { $regex: tutorName, $options: 'i' } }
                ]
            };
        }

        if (collegeName) {
            query = { ...query, college: collegeName };
        }

        const tutors = await Tutor.find(query).select('firstName lastName college languages courses');
        ;
        res.status(200).json({ tutors });
    } catch (error) {
        console.error('Error searching tutors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
