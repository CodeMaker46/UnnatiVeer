const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'upcoming' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 