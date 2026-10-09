import app from '@/config/app.config';
import request from 'supertest';

describe('Express Application Smoke Tests', () => {
  it('should have the express app defined', () => {
    expect(app).toBeDefined();
  });

  it('should return 200 OK on GET /health with standard response structure', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('version');
    expect(response.body.data).toHaveProperty('env');
  });

  it('should return 200 OK on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it('should return 404 for unknown route', async () => {
    const response = await request(app).get('/unknown-endpoint');
    expect(response.status).toBe(404);
  });
});
