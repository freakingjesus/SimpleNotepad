const { expect } = require('chai');
const request = require('supertest');
const path = require('path');

// load server with PIN
delete require.cache[require.resolve('../server')];
process.env.NOTES_PIN = '9999';
const { app } = require('../server');

describe('PIN protected endpoints', () => {
  it('GET /notes without pin returns 403', async () => {
    await request(app).get('/notes').expect(403);
  });

  it('POST /notes without pin returns 403', async () => {
    await request(app).post('/notes').send({ content: 'x' }).expect(403);
  });
});
