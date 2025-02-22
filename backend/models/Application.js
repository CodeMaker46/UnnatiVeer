const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Basic application details
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Athlete',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemType',
    required: true
  },
  itemType: {
    type: String,
    enum: ['Event', 'Sponsorship', 'TravelSupport'],
    required: true,
    validate: {
      validator: function(value) {
        return mongoose.modelNames().includes(value);
      },
      message: props => `${props.value} is not a valid model name`
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: String,
  requirements: String,
  documents: [{
    title: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
applicationSchema.index({ athlete: 1, itemType: 1 });
applicationSchema.index({ status: 1 });

// Add virtual populate for dynamic references
applicationSchema.virtual('item', {
  ref: function() {
    return this.itemType;
  },
  localField: 'itemId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Application', applicationSchema);
