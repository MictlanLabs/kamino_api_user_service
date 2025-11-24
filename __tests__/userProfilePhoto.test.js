import request from 'supertest';
import { createApp } from '../src/app.js';
import DatabaseInitializer from '../src/infrastructure/database/DatabaseInitializer.js';

describe('Profile photo integration', () => {
  let app;
  let cookies;
  let userId;

  const email = `profile_photo_${Date.now()}@example.com`;
  const password = 'P@ssw0rd!';

  beforeAll(async () => {
    const db = new DatabaseInitializer();
    await db.initialize();
    app = createApp();
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password, firstName: 'Photo', lastName: 'User' });
    userId = regRes.body.id;
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    cookies = loginRes.headers['set-cookie'];
  });

  test('GET /api/users/profile incluye profile_photo null sin foto', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('profile_photo', null);
  });

  test('GET /api/users/profile-picture retorna 404 si no hay foto', async () => {
    const picRes = await request(app)
      .get('/api/users/profile-picture')
      .set('Cookie', cookies);
    expect(picRes.status).toBe(404);
  });
});
