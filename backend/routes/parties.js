const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /parties
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, type FROM parties WHERE active = TRUE ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /parties/balances
router.get('/balances', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM vw_party_balances ORDER BY party_id');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /parties/:id/statement
router.get('/:id/statement', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM vw_party_statement WHERE party_id = $1 ORDER BY trx_date, transaction_id', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
