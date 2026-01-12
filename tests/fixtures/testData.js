/**
 * Test Fixtures
 *
 * Reusable test data for consistent testing across the test suite.
 * Import these fixtures in your tests to maintain consistency.
 */

// Valid user data for testing
const validUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'user'
  }
];

// Invalid data for negative testing
const invalidEmails = [
  '',
  'invalid',
  'user@',
  '@example.com',
  'user@.com',
  'user..name@example.com',
  null,
  undefined
];

const invalidUrls = [
  '',
  'not-a-url',
  'ftp://example.com',
  'javascript:alert(1)',
  '//example.com',
  null,
  undefined
];

// XSS attack payloads for security testing
const xssPayloads = [
  '<script>alert("xss")</script>',
  '<img src="x" onerror="alert(1)">',
  '"><script>alert(1)</script>',
  "'-alert(1)-'",
  '<svg onload="alert(1)">',
  'javascript:alert(1)'
];

// SQL injection payloads for security testing
const sqlInjectionPayloads = [
  "'; DROP TABLE users; --",
  "' OR '1'='1",
  "1; DELETE FROM users",
  "' UNION SELECT * FROM users --",
  "admin'--"
];

// API response templates
const apiResponses = {
  success: (data) => ({
    success: true,
    data
  }),
  error: (message, details = null) => ({
    success: false,
    error: {
      message,
      ...(details && { details })
    }
  })
};

// Health check expected responses
const healthResponses = {
  healthy: {
    status: 'healthy',
    uptime: expect.any(Number),
    timestamp: expect.any(String),
    version: expect.any(String)
  },
  ready: {
    ready: true
  },
  live: {
    alive: true
  }
};

// HTTP status codes for reference
const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

module.exports = {
  validUsers,
  invalidEmails,
  invalidUrls,
  xssPayloads,
  sqlInjectionPayloads,
  apiResponses,
  healthResponses,
  httpStatus
};
