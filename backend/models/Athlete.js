const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  sportsCategory: {
    type: String,
    required: true
  },
  currentLevel: {
    type: String,
    required: true,
    enum: ['school', 'district', 'state', 'national']
  },
  contactNumber: {
    type: String,
    required: true
  },
  guardianName: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  achievements: {
    type: String
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  photos: [{
    url: String,
    publicId: String
  }],
  videos: [{
    url: String,
    publicId: String
  }],
  bio: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Athlete', athleteSchema);