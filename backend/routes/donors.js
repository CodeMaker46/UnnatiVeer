const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Athlete = require('../models/Athlete');
const Donation = require('../models/Donation');
const mongoose = require('mongoose');

router.use((req, res, next) => {
  if (!mongoose.connection.readyState) {
    return res.status(500).json({ message: 'Database connection not ready' });
  }
  next();
});

router.post('/register', async (req, res) => {
  try {
    console.log('Received registration data:', req.body);
    
    const { 
      email, 
      password, 
      fullName,
      donorType,
      contactNumber,
      panNumber,
      organization,
      city,
      state 
    } = req.body;

    // Log all fields after destructuring
    console.log('Destructured data:', {
      email,
      fullName,
      donorType,
      contactNumber,
      panNumber,
      organization,
      city,
      state
    });

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ email: email.toLowerCase() });
    if (existingDonor) {
      console.log('Donor already exists with email:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new donor
    const donor = new Donor({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      donorType: donorType || 'individual',
      organization: organization ? organization.trim() : '',
      contactNumber: contactNumber.trim(),
      panNumber: panNumber.trim(),
      city: city.trim(),
      state: state.trim()
    });

    console.log('Attempting to save donor:', donor.toObject());

    await donor.save();
    console.log('Donor saved successfully with ID:', donor._id);

    // Create JWT token
    const token = jwt.sign(
      { 
        id: donor._id, 
        type: 'donor',
        name: donor.fullName,
        email: donor.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response
    const response = {
      token,
      donor: {
        id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        donorType: donor.donorType,
        organization: donor.organization,
        city: donor.city,
        state: donor.state
      }
    };

    console.log('Sending response:', response);
    res.status(201).json(response);

  } catch (error) {
    console.error('Donor registration error:', error);
    
    // Check for MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: 'Validation failed',
        details: validationErrors
      });
    }

    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already registered',
        field: 'email'
      });
    }

    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if donor exists
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: donor._id, type: 'donor' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      donor: {
        id: donor._id,
        name: donor.fullName,
        email: donor.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all athletes with filters
router.get('/athletes', async (req, res) => {
  try {
    const { name, location, age, sport, gender } = req.query;
    
    let query = {};
    
    if (name) {
      query.fullName = { $regex: name, $options: 'i' };
    }
    if (location) {
      query.$or = [
        { city: { $regex: location, $options: 'i' } },
        { state: { $regex: location, $options: 'i' } }
      ];
    }
    if (age) {
      query.age = age;
    }
    if (sport) {
      query.sportsCategory = sport;
    }
    if (gender) {
      query.gender = gender;
    }

    const athletes = await Athlete.find(query)
      .select('fullName age sportsCategory currentLevel city state achievements gender')
      .sort({ fullName: 1 });

    // Ensure achievements is always an array
    const athletesWithAchievements = athletes.map(athlete => ({
      ...athlete.toObject(),
      achievements: athlete.achievements || []
    }));

    res.json(athletesWithAchievements);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make a donation
router.post('/donate/:athleteId', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const athleteId = req.params.athleteId;

    // Create a Razorpay order
    const response = await axios.post('/api/payments/create-order', {
      amount,
      athleteId
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({ message: 'Failed to process donation' });
  }
});

// Get athlete profile
router.get('/athlete/:id', auth, async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id)
      .select('-password -applications');
    
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    res.json(athlete);
  } catch (error) {
    console.error('Error fetching athlete profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donor's donations
router.get('/donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('athlete', 'fullName sportsCategory currentLevel')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear donor's donation history
router.delete('/donations', auth, async (req, res) => {
  try {
    await Donation.deleteMany({ donor: req.user.id });
    res.json({ message: 'Donation history cleared successfully' });
  } catch (error) {
    console.error('Error clearing donation history:', error);
    res.status(500).json({ message: 'Failed to clear donation history' });
  }
});

// Get donor profile
router.get('/profile', auth, async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id).select('-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;