/**
 * Unit Tests: Error Handler Middleware
 *
 * Tests for the centralized error handling middleware.
 * Demonstrates testing Express middleware in isolation.
 */

const { errorHandler, NotFoundError, ValidationError } = require('../../../src/middleware/errorHandler');

// Mock Express request/response objects
const mockRequest = () => ({
  method: 'GET',
  path: '/test',
  headers: {}
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Error Handler Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle generic errors with 500 status', () => {
      const error = new Error('Something went wrong');
      const req = mockRequest();
      const res = mockResponse();

      errorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Internal Server Error'
          })
        })
      );
    });

    it('should handle NotFoundError with 404 status', () => {
      const error = new NotFoundError('Resource not found');
      const req = mockRequest();
      const res = mockResponse();

      errorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Resource not found'
          })
        })
      );
    });

    it('should handle ValidationError with 400 status', () => {
      const error = new ValidationError('Invalid input', ['email is required']);
      const req = mockRequest();
      const res = mockResponse();

      errorHandler(error, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Invalid input',
            details: ['email is required']
          })
        })
      );
    });

    it('should not expose error stack in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Secret error');
      const req = mockRequest();
      const res = mockResponse();

      errorHandler(error, req, res, mockNext);

      const responseBody = res.json.mock.calls[0][0];
      expect(responseBody.error.stack).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Debug error');
      const req = mockRequest();
      const res = mockResponse();

      errorHandler(error, req, res, mockNext);

      const responseBody = res.json.mock.calls[0][0];
      expect(responseBody.error.stack).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('NotFoundError', () => {
    it('should create error with correct properties', () => {
      const error = new NotFoundError('User not found');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('NotFoundError');
    });
  });

  describe('ValidationError', () => {
    it('should create error with details array', () => {
      const details = ['field1 is required', 'field2 must be a number'];
      const error = new ValidationError('Validation failed', details);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });
  });
});
