const express = require('express');
const router = express.Router();
const TravelSupport = require('../models/TravelSupport');
const auth = require('../middleware/auth');

// Create travel support
router.post('/', auth, async (req, res) => {
  try {
    const travelSupport = new TravelSupport({
      ...req.body,
      organization: req.user.id
    });
    await travelSupport.save();
    res.status(201).json(travelSupport);
  } catch (error) {
    console.error('Error creating travel support:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all active travel supports
router.get('/', auth, async (req, res) => {
  try {
    const travelSupports = await TravelSupport.find({ 
      organization: req.user.id
    }).populate('organization', 'name');
    res.json(travelSupports);
  } catch (error) {
    console.error('Error fetching travel supports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get travel support by id
router.get('/:id', async (req, res) => {
  try {
    const travelSupport = await TravelSupport.findById(req.params.id)
      .populate('organization', 'name');
    if (!travelSupport) {
      return res.status(404).json({ message: 'Travel support not found' });
    }
    res.json(travelSupport);
  } catch (error) {
    console.error('Error fetching travel support:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update travel support
router.put('/:id', auth, async (req, res) => {
  try {
    const travelSupport = await TravelSupport.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.id },
      req.body,
      { new: true }
    );
    if (!travelSupport) {
      return res.status(404).json({ message: 'Travel support not found' });
    }
    res.json(travelSupport);
  } catch (error) {
    console.error('Error updating travel support:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete travel support
router.delete('/:id', auth, async (req, res) => {
  try {
    const travelSupport = await TravelSupport.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.id
    });
    if (!travelSupport) {
      return res.status(404).json({ message: 'Travel support not found' });
    }
    res.json({ message: 'Travel support deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel support:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;