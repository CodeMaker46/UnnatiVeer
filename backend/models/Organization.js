const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  // Non-editable fields
  name: {
    type: String,
    required: true
  },
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
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  foundedYear: {
    type: Number,
    required: true
  },

  // Editable fields
  organizationType: {
    type: String,
    enum: ['academy', 'club', 'institute', 'other'],
    required: true
  },
  sports: [{
    type: String
  }],
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  contactNumber: {
    type: String
  },
  description: {
    type: String
  },
  website: {
    type: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },

  // References
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  sponsorships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsorship'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);
