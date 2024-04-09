// availabilityController.js
const Availability = require('../models/availability');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.createOrUpdateAvailability = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { days, startTime, endTime } = req.body;
    const tutorId = req.tutor._id; // Retrieve tutor ID from authentication

    // Check if the tutor already has an availability
    let availability = await Availability.findOne({ tutor: tutorId });

    if (availability) {
      // Update existing availability
      availability.days = days;
      availability.startTime = new Date(startTime);
      availability.endTime = new Date(endTime);
      await availability.save();
      return res.status(200).json({ message: 'Availability updated successfully.', availability });
    } else {
      // Create new availability
      availability = new Availability({ tutor: tutorId, days, startTime: new Date(startTime), endTime: new Date(endTime) });
      await availability.save();
      return res.status(201).json({ message: 'Availability created successfully.', availability });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.deleteAvailability = async (req, res) => {
    const availabilityId = req.params.id; // Assuming availability ID is passed as a route parameter
  
    try {
      const deletedAvailability = await Availability.findByIdAndDelete(availabilityId);
      if (!deletedAvailability) {
        return res.status(404).json({ message: 'Availability not found.' });
      }
      res.status(200).json({ message: 'Availability deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };
  exports.getAvailabilities = async (req, res) => {
    try {
      const tutorId = req.tutor._id; // Retrieve tutor ID from authentication
      const availabilities = await Availability.find({ tutor: tutorId });
      res.status(200).json(availabilities);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };

exports.searchAvailabilitiesByTutorId = async (req, res) => {
    try {
      const { tutorId } = req.params; // Retrieve tutor ID from the route parameter
      const { date } = req.query; // Retrieve the selected date from the query parameters
      
      // Parse the selected date to get the day of the week (e.g., Monday, Tuesday, etc.)
      const dayOfWeek = moment(date).format('dddd');

      // Find availabilities for the tutor and the selected day of the week
      const availabilities = await Availability.find({ tutor: tutorId, days: dayOfWeek });
  
      res.status(200).json(availabilities);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };