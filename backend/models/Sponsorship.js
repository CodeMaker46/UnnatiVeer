const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  amount: {
    type: Number,
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  sport: String,
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Sponsorship', sponsorshipSchema); 