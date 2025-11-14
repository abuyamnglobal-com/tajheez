# Functional Specification Document (FSD)

## Project Overview
- **Project**: Partnership Finance App (Abu Yamen Global & Yamen Trading)
- **Version**: 0.1 Draft — 08 Nov 2025
- **Goal**: Launch a lightweight finance platform to log transactions between two companies and multiple investors, while remaining extensible for future parties.

## 1. Purpose & Scope
- Capture inter-company and investor transactions from mobile or web, manage parties, enforce permissions, and archive attachments (invoice photos, receipts).
- Provide weekly/monthly reporting, approvals, and attachment storage.
- **Out of scope (Phase 1)**: Full double-entry accounting, invoicing/sales, bank integrations, automated payroll.

## 2. Glossary
- **Party**: Company / Investor / Vendor participating financially.
- **Company**: Abu Yamen Global or Yamen Trading & Contracting.
- **Investor**: Raed, Ghaznafar, or future investors.
- **Transaction**: Expense, Loan, Loan Return, Transfer.
- **Intercompany**: Transaction between companies or company↔investor.
- **Attachment**: Image/PDF linked to a transaction.
- **Role**: Partner, Accountant, Approver, Viewer.

## 3. Assumptions
- Each transaction stores date, amount, from→to, type, description, payment method, status, audit metadata.
- Multiple payment accounts exist, but Phase 1 records them at the party level only.
- Reports derive solely from the Transactions ledger.
- Mobile capture supports photo uploads.

## 4. Users & Roles
- **Partner**: Create/edit/approve transactions above a threshold, manage reports.
- **Accountant**: Enter & review transactions without final approval.
- **Approver**: Final approval for threshold-sensitive operations.
- **Viewer**: Read-only dashboards & reports.

## 5. Functional Requirements
1. Manage parties and user accounts.
2. Log transactions with optional attachments and payment methods.
3. Support intercompany transfers and investor repayments.
4. Maintain attachment archive with metadata.
5. Provide weekly/monthly summaries and party statements.
6. Enforce approvals when amount ≥ Threshold (default OMR 500).

## 6. Non-Functional Requirements
- Cloud Run + PostgreSQL + Cloud Storage stack.
- JWT-based REST APIs, HTTPS enforced, audit trail for “who did what when”.
- Mobile-first UX for quick entry (≤5 required fields + attachment).

## 7. Data Model Snapshot
- **Party**: `id`, `name`, `type[COMPANY/INVESTOR/etc]`, `active`.
- **Transaction**: `id`, `date`, `from_party_id`, `to_party_id`, `category`, `amount`, `payment_method`, `description`, `status[DRAFT/SUBMITTED/APPROVED/REJECTED]`, `created_by`, `created_at`.
- **Attachment**: `id`, `transaction_id`, `file_url`, `uploaded_by`, `uploaded_at`.
- **User**: `id`, `full_name`, `email`, `role`.
- **Relationships**: Party 1..* Transaction (as source/target), Transaction 1..* Attachment, User 1..* Transaction (creator/approver).

## 8. Validation Rules
- **V-01** Date cannot exceed current day unless special permission granted.
- **V-02** Amount must be positive with up to 3 decimal places.
- **V-03** `from_party_id` must differ from `to_party_id`.
- **V-04** Attachments limited to images/PDF ≤5 MB each.
- **V-05** Reject actions require an explanatory comment.

## 9. States & Transitions
- `DRAFT → SUBMITTED` when sent for approval (auto-approve if below threshold).
- `SUBMITTED → APPROVED` (approve) or `SUBMITTED → REJECTED` (reject).
- `APPROVED → CLOSED` when settled.
- `REJECTED → DRAFT` when edited & resubmitted.
- Full audit trail stored for every state change.

## 10. Reports
- **R-01** Weekly Summary: In / Out / Net per party for a range.
- **R-02** Party Statement: Ledger for a single party.
- **R-03** Inter-Party Matrix: Debt grid (From→To).
- **R-04** Category Spend: Top spending categories per company.
- **R-05** Daily Sales Report: End-of-day sales vs previous days.
- **R-06** Loan Analysis: Outstanding vs repaid loans and timelines.
- **R-07** Cashflow Forecast v1: Simple projection based on history.

## 11. Analytics & KPIs
- **A-01** Net balance per party (In minus Out).
- **A-02** Expense trends per category (Fuel, Maintenance, Salaries, etc.).
- **A-03** Daily/weekly/monthly sales trends and top days/sites.
- **A-04** Intercompany debt breakdown (who owes whom and remaining).
- **A-05** Average days to return loans.
- **A-06** Cash burn rate (daily/weekly).
- **A-07** Profitability snapshot (later phase): Sales − Expenses.
- **A-08** Alerts when daily/weekly spend exceeds configured thresholds.
- **KPIs**: Revenue growth WoW, Expense ratio, Net cash position, Outstanding loans.

## 12. Visualizations
- Bar charts: spend by category.
- Line charts: daily sales timeline.
- Pie charts: spend distribution.
- Loan flow board: amount sent, returned, outstanding.

## 13. Architecture (Phase 1)
```
flowchart LR
    A[User Browser / Mobile App] -->|HTTPS REST| B[Vercel (React / React Native Web)]
    B -->|JWT REST API| C[Google Cloud Run (Express backend)]
    C --> D[Google Cloud SQL]
    C --> E[Google Cloud Storage (Attachments)]
```
- Future Phase 2: Google Drive/Cloud Storage integrations, email/WhatsApp alerts.

## 14. UX Summary (Mobile-First)
- Quick-add transaction sheet (5 core fields + attachment).
- Filters by Party / Category / Date range.
- Card layout per transaction showing from→to, amount, type, status, attachment icon.

## 15. Acceptance Criteria & UAT
- **AC-01** Create transaction ≤ threshold auto-approves, appears in reports immediately.
- **AC-02** Transaction > threshold becomes `SUBMITTED` and enters approval queue.
- **AC-03** Approved transactions lock after 24 hours.
- **AC-04** Weekly report returns correct values for the selected party/date range.
- **AC-05** Validation prevents `from = to`, non-positive amounts, or missing fields.
- **Sample UAT**: Loan from Company A to Investor Raed then repayment; expense reimbursed on behalf of Company B; 7-day weekly report verifying net totals.

## 16. Risks & Constraints
- Missing attachments reduce audit strength.
- Need a Loan↔Return matching mechanism (Phase 2).
- Policy required for attachment retention and backups.

## 17. MVP Scope (Phase 1)
- CRUD for Parties, Users, Transactions, Attachments.
- Simple approval workflow.
- Two reports: Weekly Summary + Party Statement.
- Mobile-friendly transaction entry view.

## 18. Open Points
- Confirm default approval threshold (currently OMR 500).
- Finalize allowed category list.
- Document attachment retention & backup policy.

## 19. Roadmap
1. **Phase 1** — PostgreSQL schema, constraints, indexes, official DDL.
2. **Phase 2** — Backend REST API on Cloud Run (auth, parties, transactions, attachments, reports) plus Swagger/Postman docs.
3. **Phase 3** — React web UI (login, add transaction, dashboard, reports) on Vercel.
4. **Phase 4** — React Native mobile app (login, add transaction, reports).
5. **Phase 5** — Analytics & KPIs (Outstanding loans, burn rate, net cash, charts/alerts).
6. **Phase 6** — Security & backup (daily DB backups, logs, HTTPS enforcement).
7. **Phase 7** — Go-live (clean data, add real users, optional PDF reports & notifications).

## 20. Proposed 8-Week Timeline
| Week | Phase | Deliverables |
| --- | --- | --- |
| 1 | Phase 1 | PostgreSQL schema, tables, constraints, seed data |
| 2 | Phase 2 | Auth API, Party & Transaction endpoints |
| 3 | Phase 2 | Reports API, attachments, Cloud Run deployment |
| 4 | Phase 3 | React UI: Login, Add Transaction, Dashboard |
| 5 | Phase 3 | Reports UI, deploy to Vercel |
| 6 | Phase 4 | React Native app: Add Transaction + basic reports |
| 7 | Phases 5–6 | KPIs, charts, alerts, backups, hardening |
| 8 | Phase 7 | Testing, data cleansing, production go-live |

---
*Source: “Fsd – Partnership Finance App (Abu Yamen Global & Yamen Trading)” PDF.*
