
-- =========================================================
-- Partnership Finance App (Phase-1)
-- Schema + Views + Procedures + Seed
-- PostgreSQL 12+
-- =========================================================

BEGIN;

-- =======================
-- [B] Domain Enums
-- =======================
DO $$ BEGIN
  CREATE TYPE party_type   AS ENUM ('COMPANY','INVESTOR','VENDOR','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role    AS ENUM ('PARTNER','ACCOUNTANT','APPROVER','VIEWER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tx_status    AS ENUM ('DRAFT','SUBMITTED','APPROVED','REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE account_type AS ENUM ('CASH','BANK_ACCOUNT','CREDIT_CARD','DEBIT_CARD','WALLET','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =======================
-- [C] Core Tables
-- =======================
CREATE TABLE IF NOT EXISTS parties (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  type       party_type NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by BIGINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by BIGINT,
  email      TEXT,
  phone      TEXT
);

CREATE TABLE IF NOT EXISTS app_users (
  id            BIGSERIAL PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    BIGINT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    BIGINT
);

CREATE TABLE IF NOT EXISTS categories (
  id         SMALLSERIAL PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  label      TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id         SMALLSERIAL PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  label      TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS threshold_config (
  id                       SMALLSERIAL PRIMARY KEY,
  approval_threshold_omr   NUMERIC(12,3) NOT NULL CHECK (approval_threshold_omr >= 0),
  effective_from           DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active                BOOLEAN NOT NULL DEFAULT TRUE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =======================
-- [D] Accounts (per party)
-- =======================
CREATE TABLE IF NOT EXISTS accounts (
  id                 BIGSERIAL PRIMARY KEY,
  party_id           BIGINT NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  type               account_type NOT NULL,
  display_name       TEXT NOT NULL,
  provider_name      TEXT,
  currency_code      CHAR(3) DEFAULT 'OMR',
  iban               TEXT,
  account_last4      TEXT,
  pan_last4          TEXT,
  wallet_handle      TEXT,
  masked_reference   TEXT,
  is_default_outflow BOOLEAN NOT NULL DEFAULT FALSE,
  is_default_inflow  BOOLEAN NOT NULL DEFAULT FALSE,
  active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_card_last4_required CHECK (
    (type IN ('CREDIT_CARD','DEBIT_CARD') AND pan_last4 IS NOT NULL)
    OR (type NOT IN ('CREDIT_CARD','DEBIT_CARD'))
  ),
  CONSTRAINT chk_cash_no_identifiers CHECK (
    (type <> 'CASH')
    OR (iban IS NULL AND account_last4 IS NULL AND pan_last4 IS NULL AND wallet_handle IS NULL)
  )
);

-- composite unique to support FKs (account belongs to party)
DO $$ BEGIN
  CREATE UNIQUE INDEX uq_accounts_id_party ON accounts (id, party_id);
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- one default inflow/outflow per party
DO $$ BEGIN
  CREATE UNIQUE INDEX uq_default_outflow_per_party ON accounts (party_id) WHERE is_default_outflow;
  CREATE UNIQUE INDEX uq_default_inflow_per_party  ON accounts (party_id) WHERE is_default_inflow;
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- =======================
-- [E] Transactions + Attachments
-- =======================
CREATE TABLE IF NOT EXISTS transactions (
  id                BIGSERIAL PRIMARY KEY,
  trx_date          DATE NOT NULL CHECK (trx_date <= CURRENT_DATE),
  from_party_id     BIGINT NOT NULL REFERENCES parties(id),
  to_party_id       BIGINT NOT NULL REFERENCES parties(id),
  category_id       SMALLINT NOT NULL REFERENCES categories(id),
  amount            NUMERIC(18,3) NOT NULL CHECK (amount > 0),
  payment_method_id SMALLINT REFERENCES payment_methods(id),
  description       TEXT,
  status            tx_status NOT NULL DEFAULT 'DRAFT',
  created_by        BIGINT REFERENCES app_users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        BIGINT REFERENCES app_users(id),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by       BIGINT REFERENCES app_users(id),
  approved_at       TIMESTAMPTZ,
  rejected_by       BIGINT REFERENCES app_users(id),
  rejected_at       TIMESTAMPTZ,
  reject_note       TEXT,
  from_account_id   BIGINT,
  to_account_id     BIGINT,
  related_transaction_id BIGINT REFERENCES transactions(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT chk_parties_distinct CHECK (from_party_id <> to_party_id),
  CONSTRAINT chk_reject_requires_note CHECK (
    status <> 'REJECTED' OR (reject_note IS NOT NULL AND length(trim(reject_note)) > 0)
  )
);

-- enforce: account belongs to the specified party (composite FK)
DO $$ BEGIN
  ALTER TABLE transactions
    ADD CONSTRAINT fk_tx_from_account_belongs_to_from_party
    FOREIGN KEY (from_account_id, from_party_id)
    REFERENCES accounts (id, party_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE transactions
    ADD CONSTRAINT fk_tx_to_account_belongs_to_to_party
    FOREIGN KEY (to_account_id, to_party_id)
    REFERENCES accounts (id, party_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- helpful indexes
CREATE INDEX IF NOT EXISTS idx_transactions_submitted   ON transactions (trx_date, amount) WHERE status='SUBMITTED';
CREATE INDEX IF NOT EXISTS idx_transactions_by_parties  ON transactions (from_party_id, to_party_id);
CREATE INDEX IF NOT EXISTS idx_transactions_by_category ON transactions (category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_by_date     ON transactions (trx_date);
CREATE INDEX IF NOT EXISTS idx_tx_from_account          ON transactions (from_account_id) WHERE from_account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tx_to_account            ON transactions (to_account_id)   WHERE to_account_id   IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tx_related               ON transactions (related_transaction_id);

CREATE TABLE IF NOT EXISTS attachments (
  id              BIGSERIAL PRIMARY KEY,
  transaction_id  BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  file_url        TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 5*1024*1024),
  uploaded_by     BIGINT REFERENCES app_users(id),
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attachments_tx ON attachments (transaction_id);

-- =======================
-- [F] Triggers: updated_at
-- =======================
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_parties_updated_at ON parties;
  CREATE TRIGGER trg_parties_updated_at BEFORE UPDATE ON parties FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  DROP TRIGGER IF EXISTS trg_users_updated_at ON app_users;
  CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON app_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
  CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  DROP TRIGGER IF EXISTS trg_payment_methods_updated_at ON payment_methods;
  CREATE TRIGGER trg_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  DROP TRIGGER IF EXISTS trg_threshold_updated_at ON threshold_config;
  CREATE TRIGGER trg_threshold_updated_at BEFORE UPDATE ON threshold_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  DROP TRIGGER IF EXISTS trg_accounts_updated_at ON accounts;
  CREATE TRIGGER trg_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  DROP TRIGGER IF EXISTS trg_transactions_updated_at ON transactions;
  CREATE TRIGGER trg_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END $$;

-- =======================
-- [G] Views
-- =======================
CREATE OR REPLACE VIEW vw_transactions_enriched AS
SELECT
  t.id, t.trx_date, t.amount, t.status,
  fp.name  AS from_party,
  tp.name  AS to_party,
  c.code   AS category_code,
  c.label  AS category_label,
  pm.code  AS payment_method_code,
  pm.label AS payment_method_label,
  fa.display_name AS from_account,
  ta.display_name AS to_account,
  t.description, t.created_at, t.approved_at, t.rejected_at
FROM transactions t
JOIN parties fp ON fp.id = t.from_party_id
JOIN parties tp ON tp.id = t.to_party_id
JOIN categories c ON c.id = t.category_id
LEFT JOIN payment_methods pm ON pm.id = t.payment_method_id
LEFT JOIN accounts fa ON fa.id = t.from_account_id
LEFT JOIN accounts ta ON ta.id = t.to_account_id;

CREATE OR REPLACE VIEW vw_active_threshold AS
SELECT approval_threshold_omr
FROM threshold_config
WHERE is_active = TRUE
ORDER BY effective_from DESC, id DESC
LIMIT 1;

CREATE OR REPLACE VIEW vw_transactions_with_threshold AS
SELECT
  t.*,
  (SELECT approval_threshold_omr FROM vw_active_threshold) AS threshold_omr,
  (t.amount >= (SELECT approval_threshold_omr FROM vw_active_threshold)) AS requires_approval
FROM transactions t;

CREATE OR REPLACE VIEW vw_party_balances AS
WITH base AS (
  SELECT
    p.id AS party_id,
    p.name AS party_name,
    SUM(CASE WHEN t.to_party_id = p.id   AND t.status='APPROVED' THEN t.amount ELSE 0 END) AS total_in,
    SUM(CASE WHEN t.from_party_id = p.id AND t.status='APPROVED' THEN t.amount ELSE 0 END) AS total_out
  FROM parties p
  LEFT JOIN transactions t
    ON (t.from_party_id = p.id OR t.to_party_id = p.id)
  GROUP BY p.id, p.name
)
SELECT party_id, party_name, total_in, total_out, (COALESCE(total_in,0) - COALESCE(total_out,0)) AS net
FROM base;

CREATE OR REPLACE VIEW vw_party_statement AS
SELECT
  p.id AS party_id,
  p.name AS party_name,
  t.id AS transaction_id,
  t.trx_date,
  t.status,
  c.code AS category_code,
  t.description,
  t.amount,
  fp.name AS from_party,
  tp.name AS to_party
FROM transactions t
JOIN parties fp ON fp.id = t.from_party_id
JOIN parties tp ON tp.id = t.to_party_id
JOIN parties p  ON p.id IN (t.from_party_id, t.to_party_id)
JOIN categories c ON c.id = t.category_id
WHERE t.status='APPROVED';

CREATE OR REPLACE VIEW vw_accounts_by_party AS
SELECT a.id AS account_id, p.id AS party_id, p.name AS party_name,
       a.type, a.display_name, a.provider_name, a.currency_code,
       a.pan_last4, a.account_last4, a.iban, a.wallet_handle,
       a.is_default_outflow, a.is_default_inflow, a.active
FROM accounts a
JOIN parties p ON p.id = a.party_id;

-- =======================
-- [H] Helper Functions
-- =======================
CREATE OR REPLACE FUNCTION fn_active_threshold()
RETURNS NUMERIC AS $$
DECLARE v NUMERIC;
BEGIN
  SELECT approval_threshold_omr INTO v FROM vw_active_threshold LIMIT 1;
  IF v IS NULL THEN RETURN 0; END IF;
  RETURN v;
END; $$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION fn_default_outflow_account(p_party_id BIGINT)
RETURNS BIGINT AS $$
DECLARE v BIGINT;
BEGIN
  SELECT id INTO v FROM accounts
   WHERE party_id = p_party_id AND is_default_outflow = TRUE AND active = TRUE
   ORDER BY id LIMIT 1;
  RETURN v;
END; $$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION fn_default_inflow_account(p_party_id BIGINT)
RETURNS BIGINT AS $$
DECLARE v BIGINT;
BEGIN
  SELECT id INTO v FROM accounts
   WHERE party_id = p_party_id AND is_default_inflow = TRUE AND active = TRUE
   ORDER BY id LIMIT 1;
  RETURN v;
END; $$ LANGUAGE plpgsql STABLE;

-- =======================
-- [I] Procedures
-- =======================
CREATE OR REPLACE PROCEDURE pr_set_default_account(p_account_id BIGINT, p_direction TEXT)
LANGUAGE plpgsql AS $$
DECLARE v_party BIGINT; v_dir TEXT;
BEGIN
  v_dir := upper(p_direction);
  SELECT party_id INTO v_party FROM accounts WHERE id = p_account_id AND active=TRUE;
  IF v_party IS NULL THEN
    RAISE EXCEPTION 'Account % not found or inactive', p_account_id USING ERRCODE='NO_DATA_FOUND';
  END IF;

  IF v_dir = 'INFLOW' THEN
    UPDATE accounts SET is_default_inflow = FALSE WHERE party_id = v_party;
    UPDATE accounts SET is_default_inflow = TRUE  WHERE id = p_account_id;
  ELSIF v_dir = 'OUTFLOW' THEN
    UPDATE accounts SET is_default_outflow = FALSE WHERE party_id = v_party;
    UPDATE accounts SET is_default_outflow = TRUE  WHERE id = p_account_id;
  ELSE
    RAISE EXCEPTION 'p_direction must be INFLOW or OUTFLOW';
  END IF;
END $$;

CREATE OR REPLACE PROCEDURE pr_create_transaction(
  p_trx_date DATE,
  p_from_party_id BIGINT,
  p_to_party_id   BIGINT,
  p_category_code TEXT,
  p_amount NUMERIC,
  p_payment_method_code TEXT,
  p_description TEXT,
  p_created_by BIGINT,
  p_from_account_id BIGINT DEFAULT NULL,
  p_to_account_id   BIGINT DEFAULT NULL,
  p_related_tx_id   BIGINT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_category_id SMALLINT;
  v_payment_id  SMALLINT;
  v_threshold   NUMERIC;
  v_status      tx_status;
  v_tx_id       BIGINT;
BEGIN
  IF p_trx_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'trx_date cannot be in the future' USING ERRCODE='22007';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'amount must be > 0' USING ERRCODE='22003';
  END IF;
  IF p_from_party_id = p_to_party_id THEN
    RAISE EXCEPTION 'from_party and to_party must differ' USING ERRCODE='22000';
  END IF;

  SELECT id INTO v_category_id FROM categories WHERE code = upper(p_category_code) AND is_active=TRUE;
  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Unknown category_code: %', p_category_code;
  END IF;

  IF p_payment_method_code IS NOT NULL THEN
    SELECT id INTO v_payment_id FROM payment_methods WHERE code = upper(p_payment_method_code) AND is_active=TRUE;
    IF v_payment_id IS NULL THEN
      RAISE EXCEPTION 'Unknown payment_method_code: %', p_payment_method_code;
    END IF;
  END IF;

  IF p_from_account_id IS NULL THEN
    p_from_account_id := fn_default_outflow_account(p_from_party_id);
  END IF;
  IF p_to_account_id IS NULL THEN
    p_to_account_id := fn_default_inflow_account(p_to_party_id);
  END IF;

  v_threshold := fn_active_threshold();
  v_status := CASE WHEN p_amount >= v_threshold THEN 'SUBMITTED' ELSE 'APPROVED' END;

  INSERT INTO transactions
  (trx_date, from_party_id, to_party_id, category_id, amount, payment_method_id,
   description, status, created_by, from_account_id, to_account_id, related_transaction_id)
  VALUES
  (p_trx_date, p_from_party_id, p_to_party_id, v_category_id, p_amount, v_payment_id,
   p_description, v_status, p_created_by, p_from_account_id, p_to_account_id, p_related_tx_id)
  RETURNING id INTO v_tx_id;

  IF v_status = 'APPROVED' THEN
    UPDATE transactions SET approved_by = p_created_by, approved_at = now() WHERE id = v_tx_id;
  END IF;

  RAISE NOTICE 'Created transaction %, status %', v_tx_id, v_status;
END $$;

CREATE OR REPLACE PROCEDURE pr_record_expense(
  p_trx_date DATE, p_company_id BIGINT, p_vendor_id BIGINT,
  p_amount NUMERIC, p_payment_method_code TEXT, p_desc TEXT, p_user_id BIGINT,
  p_from_account_id BIGINT DEFAULT NULL, p_to_account_id BIGINT DEFAULT NULL
) LANGUAGE plpgsql AS $$
BEGIN
  CALL pr_create_transaction(p_trx_date, p_company_id, p_vendor_id,
                             'EXPENSE', p_amount, p_payment_method_code, p_desc, p_user_id,
                             p_from_account_id, p_to_account_id, NULL);
END $$;

CREATE OR REPLACE PROCEDURE pr_loan_to_investor(
  p_trx_date DATE, p_company_id BIGINT, p_investor_id BIGINT,
  p_amount NUMERIC, p_payment_method_code TEXT, p_desc TEXT, p_user_id BIGINT,
  p_company_bank_account_id BIGINT DEFAULT NULL
) LANGUAGE plpgsql AS $$
BEGIN
  CALL pr_create_transaction(p_trx_date, p_company_id, p_investor_id,
                             'LOAN_TO_INVESTOR', p_amount, p_payment_method_code, p_desc, p_user_id,
                             p_company_bank_account_id, NULL, NULL);
END $$;

CREATE OR REPLACE PROCEDURE pr_loan_return(
  p_trx_date DATE, p_investor_id BIGINT, p_company_id BIGINT,
  p_amount NUMERIC, p_payment_method_code TEXT, p_desc TEXT, p_user_id BIGINT,
  p_investor_account_id BIGINT DEFAULT NULL,
  p_company_account_id  BIGINT DEFAULT NULL,
  p_original_loan_tx_id BIGINT DEFAULT NULL
) LANGUAGE plpgsql AS $$
BEGIN
  CALL pr_create_transaction(p_trx_date, p_investor_id, p_company_id,
                             'LOAN_RETURN', p_amount, p_payment_method_code, p_desc, p_user_id,
                             p_investor_account_id, p_company_account_id, p_original_loan_tx_id);
END $$;

CREATE OR REPLACE PROCEDURE pr_transfer_between_parties(
  p_trx_date DATE, p_from_party_id BIGINT, p_to_party_id BIGINT,
  p_amount NUMERIC, p_payment_method_code TEXT, p_desc TEXT, p_user_id BIGINT,
  p_from_account_id BIGINT DEFAULT NULL,
  p_to_account_id   BIGINT DEFAULT NULL
) LANGUAGE plpgsql AS $$
BEGIN
  CALL pr_create_transaction(p_trx_date, p_from_party_id, p_to_party_id,
                             'TRANSFER', p_amount, p_payment_method_code, p_desc, p_user_id,
                             p_from_account_id, p_to_account_id, NULL);
END $$;

CREATE OR REPLACE PROCEDURE pr_approve_transaction(p_tx_id BIGINT, p_user_id BIGINT)
LANGUAGE plpgsql AS $$
DECLARE v_status tx_status;
BEGIN
  SELECT status INTO v_status FROM transactions WHERE id = p_tx_id FOR UPDATE;
  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Transaction % not found', p_tx_id;
  END IF;
  IF v_status NOT IN ('SUBMITTED','DRAFT') THEN
    RAISE EXCEPTION 'Only DRAFT/SUBMITTED can be approved (current=%)', v_status;
  END IF;
  UPDATE transactions
     SET status='APPROVED', approved_by=p_user_id, approved_at=now(), rejected_by=NULL, rejected_at=NULL, reject_note=NULL
   WHERE id = p_tx_id;
END $$;

CREATE OR REPLACE PROCEDURE pr_reject_transaction(p_tx_id BIGINT, p_user_id BIGINT, p_note TEXT)
LANGUAGE plpgsql AS $$
DECLARE v_status tx_status;
BEGIN
  IF p_note IS NULL OR length(trim(p_note))=0 THEN
    RAISE EXCEPTION 'reject_note is required';
  END IF;
  SELECT status INTO v_status FROM transactions WHERE id = p_tx_id FOR UPDATE;
  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Transaction % not found', p_tx_id;
  END IF;
  IF v_status NOT IN ('SUBMITTED','DRAFT') THEN
    RAISE EXCEPTION 'Only DRAFT/SUBMITTED can be rejected (current=%)', v_status;
  END IF;
  UPDATE transactions
     SET status='REJECTED', rejected_by=p_user_id, rejected_at=now(), reject_note=p_note
   WHERE id = p_tx_id;
END $$;

CREATE OR REPLACE PROCEDURE pr_attach_file(
  p_tx_id BIGINT, p_file_url TEXT, p_mime TEXT, p_size_bytes INTEGER, p_uploaded_by BIGINT
)
LANGUAGE plpgsql AS $$
BEGIN
  IF p_size_bytes IS NULL OR p_size_bytes <= 0 OR p_size_bytes > 5*1024*1024 THEN
    RAISE EXCEPTION 'Invalid file size (must be 1..5MB)';
  END IF;
  INSERT INTO attachments(transaction_id, file_url, mime_type, file_size_bytes, uploaded_by)
  VALUES (p_tx_id, p_file_url, p_mime, p_size_bytes, p_uploaded_by);
END $$;

-- =======================
-- [J] Seed Data (Phase-1)
-- =======================
INSERT INTO threshold_config (approval_threshold_omr, is_active)
VALUES (500.000, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO categories (code, label) VALUES
  ('EXPENSE','Expense'),
  ('LOAN_TO_INVESTOR','Loan to Investor'),
  ('LOAN_TO_COMPANY','Loan to Company'),
  ('LOAN_RETURN','Loan Return'),
  ('TRANSFER','Transfer')
ON CONFLICT (code) DO NOTHING;

INSERT INTO payment_methods (code, label) VALUES
  ('CASH','Cash'),
  ('BANK_TRANSFER','Bank Transfer'),
  ('CARD','Card'),
  ('WALLET','Wallet / Mobile Pay'),
  ('OTHER','Other')
ON CONFLICT (code) DO NOTHING;

INSERT INTO parties (name, type) VALUES
  ('Abu Yamen Global','COMPANY'),
  ('Yamen Trading & Contracting','COMPANY'),
  ('Raed','INVESTOR'),
  ('Ghaznafar','INVESTOR')
ON CONFLICT (name) DO NOTHING;

INSERT INTO app_users (full_name, email, password_hash, role, is_active) VALUES
  ('Raed Alsinani','raed@example.com','$argon2id$REPLACE_ME','PARTNER', TRUE),
  ('Approver User','approver@example.com','$argon2id$REPLACE_ME','APPROVER', TRUE),
  ('Accountant User','accountant@example.com','$argon2id$REPLACE_ME','ACCOUNTANT', TRUE),
  ('Viewer User','viewer@example.com','$argon2id$REPLACE_ME','VIEWER', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Accounts
INSERT INTO accounts (party_id, type, display_name, provider_name, pan_last4, is_default_outflow)
VALUES (3, 'CREDIT_CARD', 'Raed Credit Card (1234)', 'Visa', '1234', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO accounts (party_id, type, display_name, provider_name, pan_last4)
VALUES (3, 'DEBIT_CARD', 'Raed Debit (5455)', 'Mastercard', '5455')
ON CONFLICT DO NOTHING;

INSERT INTO accounts (party_id, type, display_name, is_default_inflow)
VALUES (1, 'CASH', 'Company Cash Box', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO accounts (party_id, type, display_name, provider_name, iban, account_last4)
VALUES (1, 'BANK_ACCOUNT', 'Company Bank (NBO)', 'NBO', 'OMxx-xxxx-xxxx-xxxx', '9999')
ON CONFLICT DO NOTHING;

INSERT INTO accounts (party_id, type, display_name, provider_name, wallet_handle)
VALUES (1, 'WALLET', 'Company Wallet', 'Thawani', 'company-wallet@example.com')
ON CONFLICT DO NOTHING;

COMMIT;
