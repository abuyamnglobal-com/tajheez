const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /payment-methods
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, code, label FROM payment_methods WHERE is_active = TRUE ORDER BY label');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
