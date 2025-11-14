const request = require('supertest');
const express = require('express');
const paymentMethodsRouter = require('../routes/payment-methods');
const db = require('../config/db');

// Mock the db module
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const app = express();
app.use('/api/payment-methods', paymentMethodsRouter);

describe('GET /api/payment-methods', () => {
  it('should return a list of payment methods', async () => {
    const mockPaymentMethods = [
      { id: 1, code: 'CASH', label: 'Cash' },
      { id: 2, code: 'CARD', label: 'Card' },
    ];
    db.query.mockResolvedValue({ rows: mockPaymentMethods });

    const res = await request(app).get('/api/payment-methods');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockPaymentMethods);
    expect(db.query).toHaveBeenCalledWith('SELECT id, code, label FROM payment_methods WHERE is_active = TRUE ORDER BY label');
  });

  it('should handle server errors', async () => {
    db.query.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/api/payment-methods');

    expect(res.statusCode).toEqual(500);
    expect(res.text).toBe('Server error');
  });
});
