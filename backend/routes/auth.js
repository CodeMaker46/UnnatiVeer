const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Validate token endpoint
router.get('/validate', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        valid: false,
        message: 'No auth token found' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ 
      valid: true,
      user: decoded
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ 
      valid: false,
      message: 'Invalid token',
      error: error.message 
    });
  }
});

module.exports = router;