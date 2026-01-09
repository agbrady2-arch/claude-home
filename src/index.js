import express from 'express';
import { healthRouter } from './routes/health.js';
import { versionRouter } from './routes/version.js';
import { requestLogger } from './middleware/logging.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/version', versionRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'claude-home',
    status: 'running',
    endpoints: ['/health', '/api/version']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
