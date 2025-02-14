const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server/server.js');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe('GET api/products', () => {
  it('should return product view', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET api/products/:id', () => {
  it('should return a product', async () => {
    const res = await request(app).get('/products/40344');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Rachelle Backpack');
  });
});

describe('GET api/products/:id/styles', () => {
  it('should return product styles', async () => {
    const res = await request(app).get('/products/40344/styles');
    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].name).toBe('Orchid');
  });
});

describe('GET api/products/:id/related', () => {
  it('should return related product ids', async () => {
    const res = await request(app).get('/products/40344/related');
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain(5104);
  });
});