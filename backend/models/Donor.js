const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String
  },
  donorType: {
    type: String,
    enum: ['individual', 'organization'],
    default: 'individual'
  },
  organization: {
    type: String,
    default: '',
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  panNumber: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  preferredSports: [{
    type: String,
    trim: true
  }],
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add pre-save middleware to handle validation
donorSchema.pre('save', function(next) {
  // Additional validation can be added here
  next();
});

module.exports = mongoose.model('Donor', donorSchema);
