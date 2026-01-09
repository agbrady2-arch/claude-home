# CLAUDE.md

This file provides guidance for AI assistants working on the claude-home repository.

## Project Overview

**claude-home** is a Node.js web application designed for deployment to Azure Web Apps. The project uses GitHub Actions for continuous integration and deployment.

**Status**: Early-stage project - infrastructure configured, application code not yet implemented.

## Repository Structure

```
claude-home/
├── .github/
│   └── workflows/
│       └── azure-webapps-node.yml  # CI/CD pipeline for Azure deployment
├── CLAUDE.md                        # AI assistant guidance (this file)
└── README.md                        # Project readme
```

## Technology Stack

- **Runtime**: Node.js 20.x
- **Hosting**: Azure Web Apps
- **CI/CD**: GitHub Actions
- **Package Manager**: npm

## Current State

This is a **newly initialized repository** with minimal content:

| Component | Status |
|-----------|--------|
| README.md | Exists (minimal) |
| package.json | **Not created** |
| Application code | **Not implemented** |
| Tests | **Not implemented** |
| Azure workflow | Configured (needs app name) |

### Immediate Setup Required

Before any development can begin:

1. **Initialize npm project**:
   ```bash
   npm init -y
   ```

2. **Update workflow** (`.github/workflows/azure-webapps-node.yml`):
   - Change `AZURE_WEBAPP_NAME: your-app-name` to actual Azure app name

3. **Add GitHub secret**:
   - `AZURE_WEBAPP_PUBLISH_PROFILE` - download from Azure Portal

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
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Branch Strategy

- `main` - Production branch; pushes trigger automatic deployment to Azure
- Feature branches should be created for new work and merged via pull requests

## CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/azure-webapps-node.yml`) with two stages:

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
- Triggered on push to `main` branch or manual dispatch

## Conventions for AI Assistants

### Code Style
- Follow Node.js best practices
- Use ES modules syntax (`import`/`export`) when possible
- Maintain consistent formatting (add Prettier/ESLint as project grows)
- Use async/await over callbacks or raw promises

### When Making Changes
1. **Read existing code before modifying** - understand context first
2. Keep changes focused and minimal - avoid scope creep
3. Do not introduce security vulnerabilities (OWASP Top 10)
4. Test changes locally before committing
5. Prefer editing existing files over creating new ones

### Commit Messages
Use conventional commit format:
```
<type>: <description>

[optional body]
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

### Recommended File Organization

When implementing the application, follow this structure:
```
claude-home/
├── .github/workflows/     # CI/CD configuration
├── src/                   # Application source code
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── public/                # Static assets (if applicable)
├── package.json           # Dependencies and scripts
├── index.js               # Application entry point
├── CLAUDE.md              # AI assistant guidance
└── README.md              # Project documentation
```

### Security Considerations
- **Never** commit secrets, credentials, or API keys
- Use environment variables for all configuration
- Validate and sanitize all user inputs
- Keep dependencies updated and audit regularly
- Use HTTPS for all external communications

### What NOT to Do
- Do not create unnecessary files or abstractions
- Do not add features beyond what was requested
- Do not commit `.env` files or any secrets
- Do not modify workflow without understanding deployment impact
- Do not add dependencies without clear justification

## Getting Started (For AI Assistants)

If asked to bootstrap this project, the recommended steps are:

1. **Initialize package.json**:
   ```bash
   npm init -y
   ```

2. **Install Express.js**:
   ```bash
   npm install express
   ```

3. **Create entry point** (`index.js`):
   ```javascript
   import express from 'express';
   const app = express();
   const PORT = process.env.PORT || 3000;

   app.get('/', (req, res) => {
     res.send('Hello from claude-home!');
   });

   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

4. **Update package.json** scripts:
   ```json
   {
     "type": "module",
     "scripts": {
       "start": "node index.js",
       "test": "echo \"No tests yet\" && exit 0"
     }
   }
   ```

5. **Test locally** before committing

## References

- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions for Azure](https://github.com/Azure/Actions)
- [Express.js Documentation](https://expressjs.com/)
