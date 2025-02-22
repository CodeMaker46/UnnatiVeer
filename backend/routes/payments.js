const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const Athlete = require('../models/Athlete');
const crypto = require('crypto');

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay credentials are missing in environment variables');
  throw new Error('Razorpay configuration is incomplete');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, athleteId } = req.body;
    
    if (!amount || !athleteId) {
      return res.status(400).json({ message: 'Amount and athleteId are required' });
    }

    console.log('Creating order with:', { amount, athleteId });

    // Create order options
    const options = {
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paise) and ensure integer
      currency: 'INR',
      receipt: `donation_${Date.now()}`,
      payment_capture: 1
    };

    console.log('Razorpay order options:', options);

    // Create Razorpay order
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    // Create a pending donation record
    const donation = new Donation({
      donor: req.user.id,
      athlete: athleteId,
      amount: amount,
      status: 'pending',
      orderId: order.id
    });

    await donation.save();
    console.log('Donation record created:', donation);

    res.json({
      orderId: order.id,
      amount: amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Verify payment signature
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Generate signature for verification
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Find and update donation status
      const donation = await Donation.findOne({ orderId: razorpay_order_id });
      if (!donation) {
        return res.status(404).json({ message: 'Donation not found' });
      }

      donation.status = 'completed';
      donation.paymentId = razorpay_payment_id;
      await donation.save();

      // Update athlete's total donations
      await Athlete.findByIdAndUpdate(donation.athlete, {
        $inc: { totalDonations: donation.amount }
      });

      res.json({ message: 'Payment verified successfully' });
    } else {
      // Payment verification failed
      await Donation.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'failed' }
      );
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

module.exports = router;