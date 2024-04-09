const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true,
    unique: true // Ensures each tutor has only one availability
  },
  days: {
    type: [String],
    required: true,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Availability', availabilitySchema);
