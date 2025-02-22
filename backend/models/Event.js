const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Event Basic Details
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['tournament', 'championship', 'training', 'competition']
  },
  
  // Sports Details
  sport: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['district', 'state', 'national', 'international']
  },
  ageGroup: {
    min: { type: Number },
    max: { type: Number }
  },

  // Location & Time
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    venue: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },

  // Sponsorship Details
  sponsorship: {
    title: { type: String },
    category: {
      type: String,
      enum: ['full', 'partial', 'equipment', 'training']
    },
    amount: {
      min: { type: Number },
      max: { type: Number }
    },
    details: { type: String }
  },

  // Travel Support
  travelAllowance: {
    amount: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['fixed', 'range'],
      default: 'fixed'
    }
  },

  // Media
  eventBanner: {
    type: String // URL to image
  },
  documents: [{
    title: { type: String },
    url: { type: String }
  }],

  // Organization & Status
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
