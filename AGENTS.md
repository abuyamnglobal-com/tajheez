# Repository Guidelines

## Project Structure & Module Organization
This repo is split cleanly: `frontend/` hosts the Next.js 16 app (routes in `src/app`, static assets in `public/`, design tokens in `tailwind.config.ts`), and `backend/` holds the Express service (`index.js`, DB helper in `config/db.js`, resource routers in `routes/`). SQL schema plus smoke tests live under `sql/phase1_*.sql`, and business briefs/API notes live in `documnets/`.

## Build, Test, and Development Commands
- `cd frontend && npm install` once per machine, then `npm run dev` for a hot-reload client on port 3000.
- `npm run build` in `frontend/` creates the production bundle, `npm run start` serves it, and `npm run lint` applies the Next ESLint preset.
- `cd backend && npm install` followed by `node index.js` starts the API.
- Validate SQL changes through `psql "$DATABASE_URL" -f sql/phase1_smoketest.sql` before merging anything DB-dependent.

## Coding Style & Naming Conventions
Frontend files use TypeScript, two-space indentation, arrow functions, and Tailwind utilities as shown in `src/app/page.tsx`; colocate tweaks or extend `tailwind.config.ts` rather than sprinkling ad-hoc CSS. Always run `npm run lint` and fix warnings. Backend code stays in CommonJS, prefers async/await, snake_case PostgreSQL columns, and camelCase JavaScript variables. Name React routes by folder (`src/app/transactions/page.tsx`) and API routers by resource (`routes/transactions.js`).

## Testing Guidelines
Automated suites are not yet wired, so every feature must include targeted tests. For backend endpoints, add Jest + Supertest specs named `*.test.js` beside the route or under `backend/tests/`, then wire them to `npm test`. Frontend work should include React Testing Library or Playwright specs named `*.test.tsx` under `frontend/src`. Re-run and extend `sql/phase1_smoketest.sql` whenever schemas shift, and describe coverage expectations in the PR.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits (`fix:`, `chore:`, etc.—see `git log`). Match that casing, keep the first line under 72 characters, and group related edits per commit. Pull requests must link an issue, summarize backend/frontend impact, mention schema or env updates, and attach screenshots or curl snippets for UI/API work. Call out breaking changes or new env vars explicitly and refresh any relevant doc in `documnets/`.

## Environment & Security Notes
The backend uses the Cloud SQL connector in `config/db.js`, so local `.env` files must supply `INSTANCE_CONNECTION_NAME`, `DB_USER`, `DB_PASS`, and `DB_NAME` (keep them out of git). Limit shared service accounts to development scope, rotate credentials whenever dumps change hands, and avoid logging secrets in browser consoles or API responses. Prefer Secret Manager/CI variables for deploys.
