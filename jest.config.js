/** @type {import('jest').Config} */
const config = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Entry point usually just bootstraps
    '!**/node_modules/**'
  ],

  // Coverage thresholds - enforce minimum coverage
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80
    }
  },

  // Coverage report formats
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html'
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module path aliases (if needed)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },

  // Timeout for tests (in milliseconds)
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true
};

module.exports = config;
