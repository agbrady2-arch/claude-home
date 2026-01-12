/**
 * Health Service
 *
 * Provides health check functionality for the application.
 */

const packageJson = require('../../package.json');

// Track application start time
const startTime = Date.now();

/**
 * Get the current health status of the application
 * @returns {Object} Health status object
 */
const getHealthStatus = () => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  return {
    status: 'healthy',
    uptime,
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    nodeVersion: process.version,
    memoryUsage: formatMemoryUsage(process.memoryUsage())
  };
};

/**
 * Format memory usage for human-readable output
 * @param {Object} memUsage - Process memory usage object
 * @returns {Object} Formatted memory usage
 */
const formatMemoryUsage = (memUsage) => {
  const format = (bytes) => `${Math.round(bytes / 1024 / 1024 * 100) / 100} MB`;

  return {
    heapUsed: format(memUsage.heapUsed),
    heapTotal: format(memUsage.heapTotal),
    rss: format(memUsage.rss)
  };
};

/**
 * Check database connection status
 * @returns {Promise<boolean>} True if database is connected
 */
const checkDatabaseConnection = async () => {
  // Placeholder - implement actual database check when database is added
  // Example: return await db.ping();
  return true;
};

/**
 * Check if all dependencies are healthy
 * @returns {Promise<Object>} Dependency health status
 */
const checkDependencies = async () => {
  const checks = {
    database: await checkDatabaseConnection()
    // Add more dependency checks as needed
    // cache: await checkCacheConnection(),
    // externalApi: await checkExternalApiConnection()
  };

  const allHealthy = Object.values(checks).every((status) => status === true);

  return {
    healthy: allHealthy,
    checks
  };
};

/**
 * Check if application is ready to receive traffic
 * @returns {Promise<boolean>} True if ready
 */
const isReady = async () => {
  const deps = await checkDependencies();
  return deps.healthy;
};

/**
 * Check if application is alive (basic liveness)
 * @returns {boolean} True if alive
 */
const isAlive = () => {
  return true;
};

module.exports = {
  getHealthStatus,
  checkDatabaseConnection,
  checkDependencies,
  isReady,
  isAlive
};
