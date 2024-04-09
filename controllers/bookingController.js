const Booking = require('../models/booking');

exports.bookSession = async (req, res) => {
  try {
    // Extract booking details from request body
    const { sessionDate, sessionLength, tutorId, startTime, endTime } = req.body;
    const studentId = req.student._id; 

    const existingStudentBooking = await Booking.findOne({
      student: studentId,
      sessionDate,
      startTime,
      endTime
    });

    const existingTutorBooking = await Booking.findOne({
      tutor: tutorId,
      sessionDate,
      startTime,
      endTime
    });

    if (existingStudentBooking) {
      return res.status(400).json({ message: 'You are already booked for this time slot.' });
    }

    if (existingTutorBooking) {
      return res.status(400).json({ message: 'Tutor is already booked for this time slot.' });
    }

    // Create a new booking instance
    const booking = new Booking({
      student: studentId,
      tutor: tutorId,
      sessionDate,
      sessionLength,
      startTime,
      endTime
    });

    // Save the booking to the database
    await booking.save();

    // Respond with success message and booking details
    res.status(201).json({ message: 'Session booked successfully', booking });
  } catch (error) {
    // Handle errors
    console.error('Error booking session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTutorBookedSlots = async (req, res) => {
  try {
    const { tutorId, date } = req.params;

    // Query the database for bookings matching the tutor ID and date
    const bookedSlots = await Booking.find({
      tutor: tutorId,
      sessionDate: date,
    });

    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching tutor booked slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the current tutor
    if (booking.tutor.toString() !== req.tutor._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Remove the booking from the database
    await booking.remove();

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
