/**
 * Test Utilities
 *
 * Helper functions for common testing tasks.
 */

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry an async function until it succeeds or max attempts reached
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delay - Delay between attempts in ms
 * @returns {Promise<any>}
 */
const retry = async (fn, maxAttempts = 3, delay = 100) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await wait(delay);
      }
    }
  }

  throw lastError;
};

/**
 * Generate a random string for testing
 * @param {number} length - Length of the string
 * @returns {string}
 */
const randomString = (length = 10) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a random email for testing
 * @returns {string}
 */
const randomEmail = () => `test-${randomString(8)}@example.com`;

/**
 * Generate a random integer within a range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number}
 */
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Assert that an async function throws a specific error
 * @param {Function} fn - Async function to test
 * @param {string|RegExp} expectedMessage - Expected error message
 * @returns {Promise<void>}
 */
const expectAsyncError = async (fn, expectedMessage) => {
  let error;
  try {
    await fn();
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();
  if (expectedMessage instanceof RegExp) {
    expect(error.message).toMatch(expectedMessage);
  } else {
    expect(error.message).toBe(expectedMessage);
  }
};

/**
 * Create a timeout promise for testing async operations
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise<never>}
 */
const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );

/**
 * Race a promise against a timeout
 * @param {Promise<any>} promise - Promise to race
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise<any>}
 */
const withTimeout = (promise, ms) =>
  Promise.race([promise, timeout(ms)]);

/**
 * Deep freeze an object (make it immutable)
 * @param {Object} obj - Object to freeze
 * @returns {Object}
 */
const deepFreeze = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
};

/**
 * Clean up test database (placeholder)
 * @returns {Promise<void>}
 */
const cleanupTestDatabase = async () => {
  // Implementation depends on your database
  // Example: await db.query('TRUNCATE TABLE test_users');
};

module.exports = {
  wait,
  retry,
  randomString,
  randomEmail,
  randomInt,
  expectAsyncError,
  timeout,
  withTimeout,
  deepFreeze,
  cleanupTestDatabase
};
