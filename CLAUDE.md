# CLAUDE.md

This file provides guidance for AI assistants working on the claude-home repository.

## Project Overview

**claude-home** is a Node.js web application designed for deployment to Azure Web Apps. The project uses GitHub Actions for continuous integration and deployment.

## Repository Structure

```
claude-home/
├── .github/
│   └── workflows/
│       └── azure-webapps-node.yml  # CI/CD pipeline for Azure deployment
├── README.md                        # Project readme
└── CLAUDE.md                        # This file - AI assistant guidance
```

## Technology Stack

- **Runtime**: Node.js 20.x
- **Hosting**: Azure Web Apps
- **CI/CD**: GitHub Actions
- **Package Manager**: npm

## Development Workflow

### Prerequisites

- Node.js 20.x installed locally
- npm for package management
- Azure Web App configured (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Run the application (once implemented)
npm start

# Run tests (once implemented)
npm test

# Build for production (if applicable)
npm run build
```

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

## Conventions for AI Assistants

### Code Style
- Follow Node.js best practices
- Use ES modules syntax when possible
- Maintain consistent formatting (consider adding Prettier/ESLint when project grows)

### When Making Changes
1. Read existing code before modifying
2. Keep changes focused and minimal
3. Do not introduce security vulnerabilities (OWASP Top 10)
4. Test changes locally before committing

### Commit Messages
- Use clear, descriptive commit messages
- Format: `<type>: <description>` (e.g., `feat: add user authentication`)
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### File Organization
When adding source code, follow this recommended structure:
```
claude-home/
├── src/              # Application source code
│   ├── routes/       # API route handlers
│   ├── middleware/   # Express middleware
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── tests/            # Test files
├── public/           # Static assets (if applicable)
├── package.json      # Dependencies and scripts
└── index.js          # Application entry point
```

### Security Considerations
- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user inputs
- Keep dependencies updated

## Current State

This is a newly initialized repository with:
- Basic README
- Azure deployment workflow configured
- No application code yet implemented

The next steps for development would typically include:
1. Initialize npm project (`npm init`)
2. Add web framework (Express.js recommended)
3. Create basic application structure
4. Add tests
5. Configure Azure Web App name in workflow
