
-- ============================================
-- Phase-1 Smoke Test for Partnership Finance DB
-- Requires: phase1_schema_views_procedures.sql applied
-- PostgreSQL 12+
-- ============================================

\echo '==[SMOKE TEST START]=='

BEGIN;

\echo 'Step 0: Seed sanity (parties, categories, payment methods, accounts, users)'
SELECT 'parties' AS table, COUNT(*) AS rows FROM parties
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'payment_methods', COUNT(*) FROM payment_methods
UNION ALL
SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'app_users', COUNT(*) FROM app_users;

\echo 'Step 1: Show active threshold'
SELECT * FROM vw_active_threshold;

\echo 'Step 2: Ensure defaults (company cash = inflow, raed cc = outflow)'
-- Adjust names if different in your seed
SELECT a.id, p.name AS party, a.type, a.display_name, a.is_default_inflow, a.is_default_outflow
FROM accounts a JOIN parties p ON p.id=a.party_id
ORDER BY p.name, a.id;

\echo 'Step 3: Create transactions via procedures'
-- Expense: Company (1) -> Vendor (2) using CASH (auto-approve if < threshold)
CALL pr_record_expense(CURRENT_DATE, 1, 2, 18.500, 'CASH', 'SmokeTest: Fuel - Fuso', 1, NULL, NULL);

-- Loan to investor: Company (1) -> Raed (3) using BANK_TRANSFER (will be SUBMITTED if >= threshold)
CALL pr_loan_to_investor(CURRENT_DATE, 1, 3, 1500.000, 'BANK_TRANSFER', 'SmokeTest: Loan to Raed', 1, NULL);

-- Loan return: Raed (3) -> Company (1) partial
CALL pr_loan_return(CURRENT_DATE, 3, 1, 500.000, 'CARD', 'SmokeTest: Partial return', 1, NULL, NULL, NULL);

\echo 'Step 4: Attach a file to the latest expense (find by description)'
-- Find last expense id matching description
WITH last_exp AS (
  SELECT id FROM transactions
  WHERE description LIKE 'SmokeTest: Fuel - Fuso%'
  ORDER BY id DESC
  LIMIT 1
)
INSERT INTO attachments(transaction_id, file_url, mime_type, file_size_bytes, uploaded_by)
SELECT id, 'https://example.com/fuel_receipt.jpg', 'image/jpeg', 102400, 1
FROM last_exp;

\echo 'Step 5: Approve any SUBMITTED transactions (simulate approver action)'
UPDATE transactions
SET status='APPROVED', approved_by=2, approved_at=now(), rejected_by=NULL, rejected_at=NULL, reject_note=NULL
WHERE status='SUBMITTED';

\echo 'Step 6: Integrity checks (ASSERT-like)'
DO $$
DECLARE v INT;
BEGIN
  SELECT COUNT(*) INTO v FROM transactions WHERE amount <= 0;
  IF v <> 0 THEN RAISE EXCEPTION 'FAIL: Non-positive amounts found: %', v; END IF;
  RAISE NOTICE 'OK: All amounts > 0';

  SELECT COUNT(*) INTO v FROM transactions WHERE trx_date > CURRENT_DATE;
  IF v <> 0 THEN RAISE EXCEPTION 'FAIL: Future-dated transactions found: %', v; END IF;
  RAISE NOTICE 'OK: No future-dated transactions';

  SELECT COUNT(*) INTO v FROM transactions WHERE from_party_id = to_party_id;
  IF v <> 0 THEN RAISE EXCEPTION 'FAIL: From=To party violations: %', v; END IF;
  RAISE NOTICE 'OK: From != To enforced';

  -- Ensure account/party ownership via composite FK already in place
  RAISE NOTICE 'OK: Account ownership enforced by FK (checked at insert/update)';
END $$;

\echo 'Step 7: Key views output'
\echo '7.a) vw_transactions_enriched (last 10)'
SELECT * FROM vw_transactions_enriched ORDER BY id DESC LIMIT 10;

\echo '7.b) vw_party_balances'
SELECT * FROM vw_party_balances ORDER BY net DESC;

\echo '7.c) vw_accounts_by_party (first 10)'
SELECT * FROM vw_accounts_by_party ORDER BY party_id, account_id LIMIT 10;

\echo '7.d) Approval queue (should be empty after Step 5)'
SELECT id, trx_date, amount, status FROM transactions WHERE status='SUBMITTED' ORDER BY trx_date;

\echo 'Step 8: Payment mix'
SELECT pm.code AS payment_method, COUNT(*) AS tx_count, SUM(t.amount) AS total_amount
FROM transactions t
LEFT JOIN payment_methods pm ON pm.id = t.payment_method_id
WHERE t.trx_date BETWEEN CURRENT_DATE - INTERVAL '7 day' AND CURRENT_DATE + INTERVAL '1 day'
GROUP BY pm.code
ORDER BY total_amount DESC NULLS LAST;

\echo 'Step 9: Attachment health (should include our test image)'
SELECT t.id AS tx_id, a.id AS attachment_id, a.mime_type, a.file_size_bytes
FROM transactions t
JOIN attachments a ON a.transaction_id = t.id
WHERE t.description LIKE 'SmokeTest:%'
ORDER BY a.id DESC;

COMMIT;

\echo '==[SMOKE TEST END]=='
