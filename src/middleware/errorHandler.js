/**
 * Error Handler Middleware
 *
 * Centralized error handling for the application.
 * Provides consistent error responses and logging.
 */

/**
 * Custom error class for Not Found errors
 */
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Custom error class for Validation errors
 */
class ValidationError extends Error {
  constructor(message = 'Validation failed', details = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

/**
 * Custom error class for Unauthorized errors
 */
class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

/**
 * Custom error class for Forbidden errors
 */
class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error (in production, use proper logging service)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
    console.error(`  Path: ${req.method} ${req.path}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(`  Stack: ${err.stack}`);
    }
  }

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Build error response
  const errorResponse = {
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : err.message
    }
  };

  // Add details for validation errors
  if (err.details) {
    errorResponse.error.details = err.details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Handle JSON parsing errors
  if (err.type === 'entity.parse.failed') {
    errorResponse.error.message = 'Invalid JSON in request body';
    return res.status(400).json(errorResponse);
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function that catches errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError
};
