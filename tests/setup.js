/**
 * Jest Global Setup
 *
 * This file runs before all tests and sets up the testing environment.
 * Add global test utilities, mocks, and configurations here.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

// Global test timeout (can be overridden per-test)
jest.setTimeout(10000);

// Global beforeAll hook
beforeAll(() => {
  // Setup code that runs once before all tests
});

// Global afterAll hook
afterAll(() => {
  // Cleanup code that runs once after all tests
});

// Global beforeEach hook
beforeEach(() => {
  // Reset any state before each test
});

// Global afterEach hook
afterEach(() => {
  // Cleanup after each test
});

// Custom matchers (extend Jest's expect)
expect.extend({
  /**
   * Custom matcher to check if a value is a valid HTTP status code
   * Usage: expect(response.status).toBeValidHttpStatus()
   */
  toBeValidHttpStatus(received) {
    const pass = received >= 100 && received < 600;
    return {
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be a valid HTTP status code`,
      pass
    };
  },

  /**
   * Custom matcher to check if response has required API structure
   * Usage: expect(response.body).toBeApiResponse()
   */
  toBeApiResponse(received) {
    const hasSuccess = typeof received.success === 'boolean';
    const hasDataOrError = received.data !== undefined || received.error !== undefined;
    const pass = hasSuccess && hasDataOrError;
    return {
      message: () =>
        `expected response ${pass ? 'not ' : ''}to have valid API structure (success, data/error)`,
      pass
    };
  }
});
