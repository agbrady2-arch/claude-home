/**
 * Integration Tests: API Routes
 *
 * Tests for main API endpoints.
 * Demonstrates integration testing patterns with supertest.
 */

const request = require('supertest');
const app = require('../../../src/app');

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          message: expect.any(String)
        })
      });
    });
  });

  describe('GET /api/v1/info', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api/v1/info')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          name: expect.any(String),
          version: expect.any(String),
          environment: expect.any(String)
        })
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringMatching(/not found/i)
        })
      });
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/data')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.any(String)
        })
      });
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in response', async () => {
      const response = await request(app).get('/');

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
    });

    it('should not expose server information', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Input Validation', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/data')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.details).toBeInstanceOf(Array);
    });

    it('should sanitize input to prevent XSS', async () => {
      const response = await request(app)
        .post('/api/v1/data')
        .send({
          name: '<script>alert("xss")</script>',
          value: 'normal value'
        });

      // If successful, the script tags should be escaped
      if (response.status === 200) {
        expect(response.body.data.name).not.toContain('<script>');
      }
    });
  });
});
