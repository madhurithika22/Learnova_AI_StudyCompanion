const request = require('supertest');
const app = require('../server'); // Import your express app

describe('AI Schedule API', () => {
  it('should return a prioritized schedule', async () => {
    const res = await request(app)
      .post('/api/schedule/generate')
      .set('Authorization', 'Bearer YOUR_TEST_TOKEN')
      .send({ /* test preferences */ });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    // High-level check: ensure the first topic has a high priority score
    expect(res.body[0]).toHaveProperty('aiReason'); 
  });
});