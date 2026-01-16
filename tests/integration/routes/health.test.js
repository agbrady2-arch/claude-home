/**
 * Integration Tests: Health Routes
 *
 * Tests for health check API endpoints.
 * Uses supertest to make actual HTTP requests to the app.
 */

const request = require('supertest');
const app = require('../../../src/app');

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          status: 'healthy',
          uptime: expect.any(Number),
          timestamp: expect.any(String)
        })
      });
    });

    it('should include version information', async () => {
      const response = await request(app).get('/health');

      expect(response.body.data).toHaveProperty('version');
    });
  });

  describe('GET /health/ready', () => {
    it('should return 200 when app is ready', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: { ready: true }
      });
    });
  });

  describe('GET /health/live', () => {
    it('should return 200 for liveness check', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: { alive: true }
      });
    });
  });
});
