const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No auth token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token's user type matches the route's user type
    const routeUserType = req.baseUrl.split('/')[2]; // e.g., /api/organizations -> organizations
    if (routeUserType && decoded.userType && routeUserType !== `${decoded.userType}s`) {
      return res.status(403).json({
        message: 'Access denied. Invalid user type for this resource'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};