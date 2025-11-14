# Test Workspace

Use this directory to stage automated and manual test assets shared by backend and frontend contributors.

## Recommended Layout
- `backend/` — Jest + Supertest suites hitting `backend/` routes or stored procedures.
- `frontend/` — React Testing Library, Playwright, or Cypress specs that exercise the Next.js UI.
- `sql/` — SQL-based smoke tests or seed scripts derived from `sql/phase1_smoketest.sql`.
- `fixtures/` — JSON payloads, recorded API responses, and MSW handlers for mocking.

## Getting Started
1. Duplicate `.env.example` values into `.env.test` for isolated DB credentials.
2. Seed the test database via `psql "$TEST_DATABASE_URL" -f sql/phase1_smoketest.sql`.
3. Run backend tests from this folder with `npm --prefix ../backend test` once suites exist.
4. Launch frontend component tests with `npm --prefix ../frontend run lint && npm --prefix ../frontend test`.

Document any new test utilities or data builders here so other agents can reuse them.
