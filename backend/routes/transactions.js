const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /transactions
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM vw_transactions_enriched ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /transactions
router.post('/', async (req, res) => {
  const {
    trx_date,
    from_party_id,
    to_party_id,
    category_code,
    amount,
    payment_method_code,
    description,
    created_by,
    from_account_id,
    to_account_id,
    related_tx_id,
  } = req.body;

  try {
    await db.query(
      "CALL pr_create_transaction($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        trx_date,
        from_party_id,
        to_party_id,
        category_code,
        amount,
        payment_method_code,
        description,
        created_by,
        from_account_id,
        to_account_id,
        related_tx_id,
      ]
    );
    res.status(201).send('Transaction created');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /transactions/:id/approve
router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    await db.query("CALL pr_approve_transaction($1, $2)", [id, user_id]);
    res.status(200).send('Transaction approved');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /transactions/:id/reject
router.post('/:id/reject', async (req, res) => {
  const { id } = req.params;
  const { user_id, note } = req.body;

  try {
    await db.query("CALL pr_reject_transaction($1, $2, $3)", [id, user_id, note]);
    res.status(200).send('Transaction rejected');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
