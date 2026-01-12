/**
 * Health Routes
 *
 * Endpoints for health checks, liveness, and readiness probes.
 */

const express = require('express');
const { getHealthStatus, isReady, isAlive } = require('../services/health');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * GET /health
 * Returns detailed health status
 */
router.get('/', asyncHandler(async (req, res) => {
  const status = getHealthStatus();

  res.json({
    success: true,
    data: status
  });
}));

/**
 * GET /health/ready
 * Kubernetes readiness probe - is the app ready to receive traffic?
 */
router.get('/ready', asyncHandler(async (req, res) => {
  const ready = await isReady();

  if (ready) {
    res.json({
      success: true,
      data: { ready: true }
    });
  } else {
    res.status(503).json({
      success: false,
      error: { message: 'Service not ready' }
    });
  }
}));

/**
 * GET /health/live
 * Kubernetes liveness probe - is the app alive?
 */
router.get('/live', (req, res) => {
  const alive = isAlive();

  if (alive) {
    res.json({
      success: true,
      data: { alive: true }
    });
  } else {
    res.status(503).json({
      success: false,
      error: { message: 'Service not alive' }
    });
  }
});

module.exports = router;
