const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,        
    unique: true
  } ,
  phoneNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  picture: String
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;
