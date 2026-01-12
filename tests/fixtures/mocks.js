/**
 * Mock Factories
 *
 * Factory functions for creating mock objects used in tests.
 * Provides consistent mock implementations across the test suite.
 */

/**
 * Create a mock Express request object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock request object
 */
const createMockRequest = (overrides = {}) => ({
  method: 'GET',
  path: '/',
  params: {},
  query: {},
  body: {},
  headers: {
    'content-type': 'application/json',
    'user-agent': 'jest-test'
  },
  get: jest.fn((header) => overrides.headers?.[header.toLowerCase()]),
  ...overrides
});

/**
 * Create a mock Express response object
 * @returns {Object} Mock response object with chainable methods
 */
const createMockResponse = () => {
  const res = {
    statusCode: 200,
    headers: {}
  };

  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });

  res.json = jest.fn((data) => {
    res.body = data;
    return res;
  });

  res.send = jest.fn((data) => {
    res.body = data;
    return res;
  });

  res.set = jest.fn((header, value) => {
    res.headers[header.toLowerCase()] = value;
    return res;
  });

  res.header = res.set;

  res.end = jest.fn(() => res);

  return res;
};

/**
 * Create a mock next function
 * @returns {Function} Jest mock function
 */
const createMockNext = () => jest.fn();

/**
 * Create mock Express middleware context
 * @param {Object} reqOverrides - Request overrides
 * @returns {Object} Object containing req, res, and next
 */
const createMiddlewareContext = (reqOverrides = {}) => ({
  req: createMockRequest(reqOverrides),
  res: createMockResponse(),
  next: createMockNext()
});

/**
 * Create a mock database client
 * @param {Object} methods - Methods to mock
 * @returns {Object} Mock database client
 */
const createMockDbClient = (methods = {}) => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  query: jest.fn().mockResolvedValue({ rows: [] }),
  findOne: jest.fn().mockResolvedValue(null),
  findMany: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockImplementation((data) => Promise.resolve({ id: '1', ...data })),
  update: jest.fn().mockImplementation((id, data) => Promise.resolve({ id, ...data })),
  delete: jest.fn().mockResolvedValue(true),
  ...methods
});

/**
 * Create a mock logger
 * @returns {Object} Mock logger with all log levels
 */
const createMockLogger = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn()
});

/**
 * Create a mock cache client
 * @param {Object} initialData - Initial cache data
 * @returns {Object} Mock cache client
 */
const createMockCache = (initialData = {}) => {
  const cache = new Map(Object.entries(initialData));

  return {
    get: jest.fn((key) => Promise.resolve(cache.get(key) || null)),
    set: jest.fn((key, value, ttl) => {
      cache.set(key, value);
      return Promise.resolve(true);
    }),
    del: jest.fn((key) => {
      cache.delete(key);
      return Promise.resolve(true);
    }),
    clear: jest.fn(() => {
      cache.clear();
      return Promise.resolve(true);
    }),
    has: jest.fn((key) => Promise.resolve(cache.has(key)))
  };
};

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockNext,
  createMiddlewareContext,
  createMockDbClient,
  createMockLogger,
  createMockCache
};
