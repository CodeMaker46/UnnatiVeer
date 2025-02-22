const express = require('express');
const router = express.Router();
const Sponsorship = require('../models/Sponsorship');
const auth = require('../middleware/auth');

// Get all sponsorships
router.get('/', async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find({ status: 'active' });
    res.json(sponsorships);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new sponsorship (organization only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, amount, sport } = req.body;
    
    const sponsorship = new Sponsorship({
      title,
      description,
      amount,
      sport,
      organization: req.user.id
    });

    await sponsorship.save();
    res.status(201).json(sponsorship);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 