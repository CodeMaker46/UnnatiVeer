const mongoose = require('mongoose');

const travelSupportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  amount: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  details: {
    type: String,
    required: true
  },
  eligibility: {
    ageRange: {
      min: Number,
      max: Number
    },
    sportsCategory: [String],
    level: {
      type: String,
      enum: ['district', 'state', 'national', 'international']
    }
  },
  eventDetails: {
    name: String,
    date: Date,
    venue: String,
    city: String,
    state: String
  },
  coverageType: {
    type: String,
    enum: ['full', 'partial'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  validTill: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelSupport', travelSupportSchema); 