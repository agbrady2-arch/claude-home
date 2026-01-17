# CLAUDE.md

This file provides guidance for AI assistants working on the claude-home repository.

## Project Overview

**claude-home** is a Node.js web application designed for deployment to Azure Web Apps. The project uses GitHub Actions for continuous integration and deployment.

## Repository Structure

```
claude-home/
├── .github/
│   └── workflows/
│       └── azure-webapps-node.yml   # CI/CD pipeline for Azure deployment
├── src/                             # Application source code
│   ├── app.js                       # Express application configuration
│   ├── index.js                     # Entry point - server startup
│   ├── middleware/                  # Express middleware
│   │   ├── errorHandler.js          # Centralized error handling
│   │   └── security.js              # Security headers middleware
│   ├── routes/                      # API route handlers
│   │   ├── api.js                   # Main API endpoints (v1)
│   │   └── health.js                # Health check routes
│   ├── services/                    # Business logic layer
│   │   └── health.js                # Health status service
│   └── utils/                       # Utility functions
│       └── validation.js            # Input validation & sanitization
├── tests/                           # Test files organized by layer
│   ├── setup.js                     # Jest setup & global configuration
│   ├── fixtures/                    # Test data & mocks
│   │   ├── mocks.js                 # Mock factories for req/res/middleware
│   │   └── testData.js              # Test fixtures & constants
│   ├── helpers/                     # Test utilities
│   │   └── testUtils.js             # Helper functions for testing
│   ├── unit/                        # Unit tests
│   │   ├── middleware/
│   │   │   └── errorHandler.test.js
│   │   ├── services/
│   │   │   └── health.test.js
│   │   └── utils/
│   │       └── validation.test.js
│   ├── integration/                 # Integration tests
│   │   └── routes/
│   │       ├── api.test.js
│   │       └── health.test.js
│   └── e2e/                         # End-to-end tests
│       └── flows/
│           └── healthCheck.test.js
├── jest.config.js                   # Jest test configuration
├── package.json                     # Dependencies & scripts
├── package-lock.json                # Locked dependencies
├── .gitignore                       # Git ignore rules
├── CLAUDE.md                        # This file - AI assistant guidance
└── README.md                        # Project readme
```

## Technology Stack

- **Runtime**: Node.js 20.x
- **Web Framework**: Express.js ^4.18.2
- **Testing Framework**: Jest ^29.7.0
- **Test Utilities**: Supertest ^6.3.3, Jest-junit ^16.0.0
- **Hosting**: Azure Web Apps
- **CI/CD**: GitHub Actions
- **Package Manager**: npm

### Dependencies

**Production**:
- `express` - Fast, unopinionated web framework

**Development**:
- `jest` - Testing framework with coverage reporting
- `supertest` - HTTP assertion library for integration testing
- `jest-junit` - JUnit reporter for CI/CD integration

## Development Workflow

### Prerequisites

- Node.js 20.x installed locally
- npm for package management
- Azure Web App configured (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Run the application
npm start                    # Production mode (port 3000)
npm run dev                  # Development mode with file watching

# Testing
npm test                     # Run all tests
npm run test:unit            # Run unit tests only
npm run test:integration     # Run integration tests only
npm run test:e2e             # Run end-to-end tests only
npm run test:coverage        # Generate coverage reports
npm run test:ci              # CI environment testing with JUnit reporter

# Build (currently a no-op placeholder)
npm run build
```

### Available npm Scripts

| Script | Description |
|--------|-------------|
| `start` | Start the production server on PORT (default: 3000) |
| `dev` | Run server with file watching for development |
| `test` | Run all test suites (unit, integration, e2e) |
| `test:unit` | Run only unit tests |
| `test:integration` | Run only integration tests |
| `test:e2e` | Run only end-to-end tests |
| `test:coverage` | Run tests and generate coverage reports |
| `test:ci` | Run tests in CI mode with JUnit XML output |
| `build` | Build for production (placeholder) |

### Branch Strategy

- `main` - Production branch; pushes trigger automatic deployment to Azure
- Feature branches should be created for new work and merged via pull requests

## CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/azure-webapps-node.yml`) with the following stages:

### Build Stage
1. Checkout code
2. Set up Node.js 20.x with npm caching
3. Run `npm install`
4. Run `npm run build --if-present`
5. Run `npm run test --if-present`
6. Upload build artifacts

### Deploy Stage
- Deploys to Azure Web Apps using publish profile
- Targets the 'Development' environment
- Requires `AZURE_WEBAPP_PUBLISH_PROFILE` secret configured in repository

### Required Configuration

Before deployment works:
1. Update `AZURE_WEBAPP_NAME` in the workflow file with your actual app name
2. Add `AZURE_WEBAPP_PUBLISH_PROFILE` secret to the repository

## Application Architecture

### Application Entry Points

**`src/index.js`** - Server startup
- Starts Express server on PORT (default 3000)
- Logs environment information on startup
- Implements graceful shutdown handling (SIGTERM/SIGINT)
- 10-second timeout before force shutdown
- Exported for testing purposes

**`src/app.js`** - Express application
- Configures middleware stack (security headers first)
- Body parsing: JSON/URL-encoded (10kb limit for security)
- Route mounting: `/health/*`, `/api/v1/*`, root `/`
- 404 handler for unknown routes
- Global error handler middleware
- Separated from index.js for better testability

### Middleware Layer

**Security Middleware** (`src/middleware/security.js`)
- Removes `X-Powered-By` header to hide Express fingerprint
- Sets comprehensive security headers:
  - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
  - `X-Frame-Options: DENY` - Prevents clickjacking
  - `X-XSS-Protection: 1; mode=block` - Enables browser XSS filter
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy` - Restrictive policy for scripts/styles
  - `Strict-Transport-Security` - HSTS on HTTPS connections

**Error Handler Middleware** (`src/middleware/errorHandler.js`)
- Custom error classes with appropriate HTTP status codes:
  - `NotFoundError` (404)
  - `ValidationError` (400)
  - `UnauthorizedError` (401)
  - `ForbiddenError` (403)
- `errorHandler` function:
  - Logs errors (skipped in test environment)
  - Shows stack traces in development only
  - Hides detailed error messages in production for 500 errors
  - Provides detailed validation error messages
  - Handles JSON parsing errors gracefully
- `asyncHandler` wrapper for catching async route handler errors
- Consistent error response format: `{ success: false, error: { message, details?, stack? } }`

### Routes Layer

**Health Routes** (`src/routes/health.js`)
- `GET /health` - Detailed health status with uptime, version, memory usage
- `GET /health/ready` - Kubernetes readiness probe (checks dependencies)
- `GET /health/live` - Kubernetes liveness probe (basic alive check)
- Returns 503 status if service is not ready
- Uses asyncHandler for proper error handling

**API Routes** (`src/routes/api.js`)
- `GET /api/v1/info` - API metadata (name, version, environment)
- `POST /api/v1/data` - Example endpoint with input validation & sanitization
- `GET /api/v1/data/:id` - Example parameterized endpoint
- Demonstrates proper validation, sanitization, and response formatting

### Services Layer

**Health Service** (`src/services/health.js`)
- `getHealthStatus()` - Returns comprehensive health data:
  - Status, uptime, timestamp
  - Application version, Node.js version
  - Memory usage (RSS, heap used/total)
- `formatMemoryUsage()` - Converts bytes to MB for readability
- `checkDatabaseConnection()` - Database health check (placeholder, returns true)
- `checkDependencies()` - Aggregates all dependency health checks
- `isReady()` - Returns true if all dependencies are healthy
- `isAlive()` - Simple liveness check (always true currently)

### Utilities Layer

**Validation Utilities** (`src/utils/validation.js`)
- `isValidEmail(email)` - RFC 5322 simplified regex validation
- `isValidUrl(url)` - URL validation (http/https protocols only)
- `sanitizeString(str)` - HTML entity escaping & whitespace trimming
- `validateRequiredFields(obj, fields)` - Checks for required field presence
- `isInRange(value, min, max)` - Numeric range validation
- `isValidLength(str, min, max)` - String length validation

All utility functions return descriptive error messages for failed validations.

## Testing Infrastructure

### Test Configuration

**Jest Configuration** (`jest.config.js`)
- **Test Environment**: Node.js
- **Module Aliases**:
  - `@/*` → `src/`
  - `@tests/*` → `tests/`
- **Coverage Thresholds**:
  - Branches: 75%
  - Functions: 85%
  - Lines: 80%
  - Statements: 80%
- **Coverage Reports**: text, text-summary, lcov, HTML
- **Settings**: Clear mocks between tests, 10-second timeout

### Test Organization

Tests are organized in three layers:

1. **Unit Tests** (`tests/unit/`) - Test individual functions/modules in isolation
   - `middleware/errorHandler.test.js` - Error handling and custom error classes
   - `services/health.test.js` - Health service functions
   - `utils/validation.test.js` - Validation and sanitization utilities

2. **Integration Tests** (`tests/integration/`) - Test route handlers with middleware
   - `routes/health.test.js` - Health endpoint functionality
   - `routes/api.test.js` - API endpoints, validation, security headers

3. **End-to-End Tests** (`tests/e2e/`) - Test complete user flows
   - `flows/healthCheck.test.js` - Complete health check sequences

### Test Utilities

**Setup** (`tests/setup.js`)
- Sets `NODE_ENV=test` and `PORT=3001`
- Global Jest timeout: 10 seconds
- Custom matchers:
  - `toBeValidHttpStatus()` - Validates HTTP status codes (100-599)
  - `toBeApiResponse()` - Checks for required API response structure

**Mock Factories** (`tests/fixtures/mocks.js`)
- `createMockRequest()` - Mock Express request with chainable methods
- `createMockResponse()` - Mock Express response with status/json/send/header
- `createMockNext()` - Mock next middleware function
- `createMiddlewareContext()` - Complete req/res/next bundle
- `createMockDbClient()` - Mock database client (for future use)
- `createMockLogger()` - Mock logger with all levels
- `createMockCache()` - Mock cache client (for future use)

**Test Data** (`tests/fixtures/testData.js`)
- Valid user fixtures
- Invalid email and URL examples
- XSS attack payloads for security testing
- SQL injection payloads for validation testing
- API response templates
- Health response structures
- HTTP status code constants

**Test Helpers** (`tests/helpers/testUtils.js`)
- `wait(ms)` - Sleep utility for async tests
- `retry(fn, options)` - Retry async function with exponential backoff
- `randomString/Email/Int()` - Random data generators
- `expectAsyncError(fn, errorClass)` - Assert async function throws
- `timeout(ms)` - Promise-based timeout
- `withTimeout(promise, ms)` - Race promise against timeout
- `deepFreeze(obj)` - Object immutability utility
- `cleanupTestDatabase()` - Placeholder for DB cleanup

## Conventions for AI Assistants

### Code Style
- **Module System**: Use CommonJS (`require`/`module.exports`) - the current codebase standard
- **Async/Await**: Prefer async/await over promises and callbacks
- **Error Handling**: Always use the `asyncHandler` wrapper for async route handlers
- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for classes and custom error types
  - UPPER_CASE for constants
- **File Naming**: Use camelCase for all JavaScript files
- **Comments**: Only add comments where logic isn't self-evident; avoid redundant comments
- **Formatting**: Maintain consistent indentation (2 spaces) and line spacing

### When Making Changes

1. **Read First**: Always read existing code before modifying. Never propose changes to code you haven't read.
2. **Maintain Patterns**: Follow established architectural patterns:
   - Routes should be thin, delegating to services
   - Business logic belongs in the services layer
   - Utilities should be pure functions when possible
   - All route handlers must use `asyncHandler` wrapper
3. **Security First**:
   - Do not introduce OWASP Top 10 vulnerabilities
   - Always validate and sanitize user input
   - Never commit secrets or credentials
   - Use environment variables for configuration
4. **Testing Requirements**:
   - Write tests for new functionality (unit + integration)
   - Maintain coverage thresholds (75-85%)
   - Use appropriate test layer (unit/integration/e2e)
   - Leverage existing test utilities and fixtures
5. **Keep It Simple**:
   - Avoid over-engineering
   - Don't add features beyond what was requested
   - Don't create abstractions for one-time operations
   - Three similar lines are better than premature abstraction
6. **Error Handling**:
   - Use custom error classes (`NotFoundError`, `ValidationError`, etc.)
   - Provide descriptive error messages
   - Let the error handler middleware format responses

### Commit Messages
- Use clear, descriptive commit messages
- Format: `<type>: <description>` (e.g., `feat: add user authentication`)
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### File Organization

The codebase follows a layered architecture. When adding new code:

**Source Code** (`src/`):
- `index.js` - Entry point, server startup only
- `app.js` - Express app configuration only
- `routes/` - Route handlers (thin, delegate to services)
- `middleware/` - Express middleware (security, errors, etc.)
- `services/` - Business logic and external service integration
- `utils/` - Pure utility functions, no external dependencies

**Tests** (`tests/`):
- Mirror the `src/` structure within `unit/`, `integration/`, and `e2e/` directories
- Place shared mocks in `fixtures/mocks.js`
- Place test data in `fixtures/testData.js`
- Place test helpers in `helpers/testUtils.js`
- One test file per source file (e.g., `health.js` → `health.test.js`)

### Adding New Features

When adding new functionality:

1. **Routes**: Create route handler in appropriate file under `src/routes/`
   - Keep handlers thin - validate input, call service, return response
   - Always wrap async handlers with `asyncHandler`
   - Use custom error classes for exceptional cases

2. **Services**: Implement business logic in `src/services/`
   - Services should be independent of Express (no req/res)
   - Return data or throw errors; don't format HTTP responses
   - Keep functions focused and testable

3. **Utilities**: Add reusable functions to `src/utils/`
   - Prefer pure functions (no side effects)
   - One file per logical grouping (e.g., all validation functions together)

4. **Middleware**: Add middleware to `src/middleware/` if needed
   - Follow Express middleware signature: `(req, res, next)`
   - Call `next()` on success, `next(error)` on failure

5. **Tests**: Write tests at appropriate level
   - **Unit**: Test individual functions with mocks
   - **Integration**: Test routes with supertest, verify responses
   - **E2E**: Test complete user flows across multiple endpoints

### Security Considerations
- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Use utilities from `src/utils/validation.js`
- **Sanitize user data** - Prevent XSS, SQL injection, command injection
- **Use security headers** - Already configured in `src/middleware/security.js`
- **Limit request size** - Body parser limited to 10kb
- **Handle errors safely** - Don't leak stack traces or internal details in production
- **Keep dependencies updated** - Run `npm audit` regularly

## Current State

### What's Implemented

The repository contains a **fully functional Express.js application** with:

**Application Features**:
- Express.js web server with graceful shutdown
- Health check endpoints (Kubernetes-compatible liveness and readiness probes)
- Example API endpoints demonstrating best practices
- Comprehensive security middleware (headers, CORS-ready)
- Centralized error handling with custom error classes
- Input validation and sanitization utilities
- Environment-aware configuration

**Testing Infrastructure**:
- Jest testing framework with coverage reporting
- 3-layer test organization (unit, integration, e2e)
- Custom Jest matchers for API testing
- Mock factories for Express req/res objects
- Test fixtures and helpers
- Coverage thresholds enforced (75-85%)
- CI/CD test integration with JUnit reporter

**DevOps & CI/CD**:
- GitHub Actions workflow for Azure deployment
- Automated testing in CI pipeline
- Build artifact management
- npm script organization for different environments

**Code Quality**:
- Layered architecture (routes → services → utilities)
- Consistent error handling patterns
- Security best practices (OWASP Top 10 awareness)
- Mock-friendly architecture for testing
- Environment-specific behavior (dev vs production)

### What's Not Yet Implemented

**Infrastructure Placeholders**:
- Database integration (placeholders exist in `src/services/health.js`)
- Caching layer (mock exists in test fixtures)
- Proper logging service (currently using console.log)

**Feature Areas**:
- Authentication and authorization
- User management
- Session management
- Rate limiting middleware
- Request logging middleware
- Static file serving (if needed)
- File upload handling
- WebSocket support (if needed)

**Configuration**:
- Environment-specific config files
- Database connection configuration
- External service integrations
- Feature flags

**Azure Deployment**:
- `AZURE_WEBAPP_NAME` needs to be configured in workflow
- `AZURE_WEBAPP_PUBLISH_PROFILE` secret needs to be added to repository

### Recommended Next Steps

Based on typical application needs, consider:

1. **Database Integration**:
   - Choose database (PostgreSQL, MongoDB, etc.)
   - Add ORM/ODM (Sequelize, TypeORM, Mongoose)
   - Implement database service in `src/services/`
   - Update health checks to verify database connectivity
   - Add migration scripts

2. **Authentication**:
   - Add authentication middleware
   - Implement JWT or session-based auth
   - Create user registration/login endpoints
   - Add password hashing (bcrypt)

3. **Logging**:
   - Replace console.log with proper logger (Winston, Pino)
   - Add request logging middleware
   - Implement log levels and formatting
   - Configure log outputs (file, cloud service)

4. **Rate Limiting**:
   - Add express-rate-limit middleware
   - Configure different limits for different endpoints
   - Add Redis for distributed rate limiting (if multi-instance)

5. **Configuration Management**:
   - Add dotenv for environment variables
   - Create config files for different environments
   - Document required environment variables

6. **API Documentation**:
   - Add Swagger/OpenAPI documentation
   - Document request/response formats
   - Provide example requests

7. **Monitoring**:
   - Add application performance monitoring (APM)
   - Implement custom metrics
   - Add error tracking service integration

## API Endpoints

### Health Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/health` | Detailed health status | 200: Health data with uptime, memory, version |
| GET | `/health/ready` | Kubernetes readiness | 200: Ready, 503: Not ready |
| GET | `/health/live` | Kubernetes liveness | 200: Alive |

### API v1 Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/api/v1/info` | API metadata | 200: API name, version, environment |
| POST | `/api/v1/data` | Example data submission | 200: Success with validated data |
| GET | `/api/v1/data/:id` | Example data retrieval | 200: Data for given ID |

### Standard Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": { /* optional additional info */ },
    "stack": "Stack trace (development only)"
  }
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production/test) | `development` | No |
| `PORT` | Server port | `3000` | No |
| `AZURE_WEBAPP_NAME` | Azure Web App name for deployment | - | For deployment |

## Common Development Tasks

### Running Locally
```bash
npm install
npm start
# Server starts on http://localhost:3000
```

### Running Tests
```bash
# All tests
npm test

# Specific test suite
npm run test:unit

# With coverage
npm run test:coverage
```

### Adding a New Endpoint

1. Create or update route file in `src/routes/`
2. Implement business logic in `src/services/` if needed
3. Add validation utilities if needed
4. Write unit tests for service functions
5. Write integration tests for the endpoint
6. Update this documentation with new endpoint details

### Debugging

Set breakpoints and use Node.js debugger:
```bash
node --inspect src/index.js
```

Then attach your debugger (VS Code, Chrome DevTools, etc.)
