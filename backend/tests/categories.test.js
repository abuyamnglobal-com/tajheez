const request = require('supertest');
const express = require('express');
const categoriesRouter = require('../routes/categories');
const db = require('../config/db');

// Mock the db module
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const app = express();
app.use('/api/categories', categoriesRouter);

describe('GET /api/categories', () => {
  it('should return a list of categories', async () => {
    const mockCategories = [
      { id: 1, code: 'EXPENSE', label: 'Expense' },
      { id: 2, code: 'TRANSFER', label: 'Transfer' },
    ];
    db.query.mockResolvedValue({ rows: mockCategories });

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockCategories);
    expect(db.query).toHaveBeenCalledWith('SELECT id, code, label FROM categories WHERE is_active = TRUE ORDER BY label');
  });

  it('should handle server errors', async () => {
    db.query.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toEqual(500);
    expect(res.text).toBe('Server error');
  });
});
