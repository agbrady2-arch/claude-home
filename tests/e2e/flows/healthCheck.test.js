/**
 * End-to-End Tests: Health Check Flow
 *
 * Tests the complete health check flow from an external perspective.
 * These tests verify the application behaves correctly as a whole.
 */

const request = require('supertest');
const app = require('../../../src/app');

describe('E2E: Health Check Flow', () => {
  describe('Complete Health Check Sequence', () => {
    it('should pass full health check sequence', async () => {
      // Step 1: Check if app is alive
      const livenessResponse = await request(app)
        .get('/health/live')
        .expect(200);

      expect(livenessResponse.body.data.alive).toBe(true);

      // Step 2: Check if app is ready to receive traffic
      const readinessResponse = await request(app)
        .get('/health/ready')
        .expect(200);

      expect(readinessResponse.body.data.ready).toBe(true);

      // Step 3: Get detailed health status
      const healthResponse = await request(app)
        .get('/health')
        .expect(200);

      expect(healthResponse.body.data.status).toBe('healthy');
      expect(healthResponse.body.data.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should maintain consistent state across multiple requests', async () => {
      const responses = await Promise.all([
        request(app).get('/health'),
        request(app).get('/health'),
        request(app).get('/health')
      ]);

      // All responses should have the same status
      const statuses = responses.map(r => r.body.data.status);
      expect(new Set(statuses).size).toBe(1);

      // Uptime should be increasing (or equal for very fast requests)
      const uptimes = responses.map(r => r.body.data.uptime);
      expect(uptimes[2]).toBeGreaterThanOrEqual(uptimes[0]);
    });
  });

  describe('Application Resilience', () => {
    it('should handle concurrent requests', async () => {
      const concurrentRequests = 10;
      const requests = Array(concurrentRequests)
        .fill(null)
        .map(() => request(app).get('/health'));

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    it('should respond within acceptable time', async () => {
      const startTime = Date.now();

      await request(app).get('/health');

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });
});
