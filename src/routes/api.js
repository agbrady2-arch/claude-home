/**
 * API Routes
 *
 * Main API endpoints for the application.
 */

const express = require('express');
const { asyncHandler, ValidationError } = require('../middleware/errorHandler');
const { sanitizeString, validateRequiredFields } = require('../utils/validation');

const router = express.Router();

/**
 * GET /api/v1/info
 * Returns API information
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Claude Home API',
      version: require('../../package.json').version,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

/**
 * POST /api/v1/data
 * Example endpoint demonstrating input validation
 */
router.post('/data', asyncHandler(async (req, res) => {
  const { name, value } = req.body;

  // Validate required fields
  const missingFields = validateRequiredFields(req.body, ['name', 'value']);
  if (missingFields.length > 0) {
    throw new ValidationError(
      'Missing required fields',
      missingFields.map(field => `${field} is required`)
    );
  }

  // Sanitize input
  const sanitizedData = {
    name: sanitizeString(name),
    value: sanitizeString(value),
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: sanitizedData
  });
}));

/**
 * GET /api/v1/data/:id
 * Example endpoint demonstrating parameter handling
 */
router.get('/data/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Placeholder - replace with actual data retrieval
  const data = {
    id,
    name: 'Example Item',
    value: 'Example Value',
    retrievedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data
  });
}));

module.exports = router;
