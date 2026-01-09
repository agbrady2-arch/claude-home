# CLAUDE.md - AI Assistant Guide for claude-home

## Project Overview

This is a Node.js web application designed for deployment to Azure Web Apps. The project is in its early stages of development.

## Repository Structure

```
claude-home/
├── .github/
│   └── workflows/
│       └── azure-webapps-node.yml    # CI/CD pipeline for Azure deployment
├── README.md                          # Project description
└── CLAUDE.md                          # This file - AI assistant guide
```

## Technology Stack

- **Runtime**: Node.js 20.x
- **Package Manager**: npm
- **Hosting**: Azure Web Apps
- **CI/CD**: GitHub Actions

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run the application (when scripts are configured)
npm start

# Run tests (when configured)
npm test

# Build the application (when configured)
npm run build
```

### Branch Strategy

- `main` - Production branch, triggers automatic deployment to Azure
- Feature branches should be created for new work and merged via pull requests

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/azure-webapps-node.yml`) handles:

1. **Build Job**:
   - Checkout code
   - Set up Node.js 20.x
   - Install npm dependencies
   - Build (if build script exists)
   - Run tests (if test script exists)
   - Upload build artifacts

2. **Deploy Job**:
   - Downloads build artifacts
   - Deploys to Azure Web App

### Required Secrets

- `AZURE_WEBAPP_PUBLISH_PROFILE` - Azure publish profile for deployment

### Configuration

Before deployment, update these values in the workflow file:
- `AZURE_WEBAPP_NAME` - Your Azure Web App name (currently set to `your-app-name`)

## Conventions for AI Assistants

### Code Style

- Use modern JavaScript/TypeScript features
- Follow Node.js best practices
- Prefer async/await over callbacks
- Use meaningful variable and function names

### File Organization

When adding new code:
- Source code should go in a `src/` directory
- Tests should go in a `tests/` or `__tests__` directory
- Configuration files belong in the root directory
- Static assets should go in a `public/` directory

### Package Management

- Always use `npm install` (not yarn or pnpm unless explicitly requested)
- Keep dependencies up to date
- Use exact versions in package.json for critical dependencies

### Testing

- Write tests for new functionality
- Run `npm test` before committing changes
- Aim for good test coverage on business logic

### Git Practices

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Don't commit secrets, credentials, or environment-specific configs
- Use `.gitignore` to exclude node_modules and build artifacts

### Security

- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate all user inputs
- Keep dependencies updated to patch security vulnerabilities

## Common Tasks

### Adding a New Dependency

```bash
npm install <package-name>
```

### Setting Up the Project (First Time)

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file for local environment variables (if needed)
4. Start development with `npm start` or `npm run dev`

### Deploying to Azure

Deployment happens automatically when pushing to the `main` branch. For manual deployment:

1. Ensure Azure Web App is created
2. Configure `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub
3. Update `AZURE_WEBAPP_NAME` in the workflow file
4. Push to `main` branch

## Notes for AI Development

- This project is in early development stages
- When creating new files, follow the directory structure conventions above
- Always check if `package.json` exists before running npm commands
- The Azure workflow expects standard npm scripts (`build`, `test`, `start`)
