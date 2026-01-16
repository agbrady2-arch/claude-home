/**
 * Express Application
 *
 * Configures and exports the Express app.
 * Separated from index.js for testing purposes.
 */

const express = require('express');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');
const { errorHandler, NotFoundError } = require('./middleware/errorHandler');
const securityMiddleware = require('./middleware/security');

const app = express();

// Security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Welcome to Claude Home API',
      version: require('../package.json').version
    }
  });
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
