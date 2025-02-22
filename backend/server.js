const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',  // This allows requests from any origin
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

// Initial connection
connectWithRetry();

// Add error handler for MongoDB connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Import routes
const athleteRoutes = require('./routes/athletes');
const organizationRoutes = require('./routes/organizations');
const donorRoutes = require('./routes/donors');
const travelSupportRoutes = require('./routes/travelSupports');
const sponsorshipRoutes = require('./routes/sponsorships');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

// Use routes
app.use('/api/athletes', athleteRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/travel-supports', travelSupportRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
