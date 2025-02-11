const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./utils/errorHandler'); // Custom error handler

dotenv.config();

// Import API routes
const transactionRoutes = require('./api/routes/transactionRoutes');
const investorRoutes = require('./api/routes/investorRoutes');
const metricsRoutes = require('./api/routes/metricsRoutes');
const reportingRoutes = require('./api/routes/reportingRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/reporting', reportingRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running smoothly!' });
});

// Error Handling Middleware
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;
