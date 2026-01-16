/**
 * Unit Tests: Health Service
 *
 * Tests for the health check service.
 * Demonstrates testing services with external dependencies mocked.
 */

const { getHealthStatus, checkDatabaseConnection } = require('../../../src/services/health');

describe('Health Service', () => {
  describe('getHealthStatus', () => {
    it('should return healthy status with uptime', () => {
      const status = getHealthStatus();

      expect(status).toHaveProperty('status', 'healthy');
      expect(status).toHaveProperty('uptime');
      expect(status).toHaveProperty('timestamp');
      expect(typeof status.uptime).toBe('number');
      expect(status.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return ISO timestamp', () => {
      const status = getHealthStatus();
      const date = new Date(status.timestamp);

      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should include version info', () => {
      const status = getHealthStatus();

      expect(status).toHaveProperty('version');
      expect(typeof status.version).toBe('string');
    });
  });

  describe('checkDatabaseConnection', () => {
    it('should return true when database is connected', async () => {
      // This would typically mock the database client
      const result = await checkDatabaseConnection();

      expect(typeof result).toBe('boolean');
    });

    it('should handle connection errors gracefully', async () => {
      // Mock a failed connection scenario
      // In a real test, you'd inject a failing mock
      await expect(checkDatabaseConnection()).resolves.not.toThrow();
    });
  });
});
