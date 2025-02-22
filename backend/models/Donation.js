const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Athlete',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);