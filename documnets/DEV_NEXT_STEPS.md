# Developer Next Steps

This repo currently tracks work across two branches (`main` for production readiness and `feature/frontend-rewrite` for the new Next.js UI). Keep the effort backend-first so schemas, procedures, and validations stabilize before UI polish. Use the checklist below when picking up the next tasks.

## Repo checkout & structure
- **Clone + install:** `git clone https://github.com/abuyamnglobal-com/tajheez.git && cd tajheez`. Install once per module (`npm install` in `backend/` and `frontend/`).
- **Branch awareness:** `main` = deployable backend-first baseline, `feature/frontend-rewrite` = active Next.js revamp. Always rebase feature work onto the latest `main` before merging.
- **Folder conventions:** Keep documentation under `documnets/` (e.g., `documnets/FSD/...`) and respect the agreed naming in AGENTS.md—no new top-level directories without approval.

## Backend branch (production hardening)
- **Watch the pipeline:** Each push to `main` now runs `sql/phase1_smoketest.sql` through the Cloud SQL proxy before deploying. Keep an eye on `.github/workflows/deploy.yml` logs; fix any failing seed or procedure quickly so deployments stay green.
- **Dynamic reference data:** Finalize how categories and payment methods are stored/seeded so backend validation (and later the UI) reads from the DB instead of static lists. Update `sql/phase1_schema_views_procedures.sql` plus seeds accordingly and rerun the smoketest.
- **Proxy-first local work:** Follow the updated `README.md` instructions to start the Cloud SQL proxy locally before testing migrations or running psql scripts. Document any new env vars directly in the README.
- **Targeted tests:** When adding new procedures or endpoints, drop Jest + Supertest specs under `backend/tests/` and wire them to `npm test` so CI can be expanded later.

## Frontend branch (Next.js rewrite)
- **Pipeline validation:** `.github/workflows/frontend-vercel.yml` deploys to Vercel from `main`. Ensure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` remain valid and that the workflow stays green after merges.
- **API integration plan:** Replace the dummy data in `frontend/lib/api/transactions.ts` with real fetchers targeting the deployed backend API (expose the base URL with `NEXT_PUBLIC_API_BASE_URL`). Add React Testing Library specs for the highest-traffic pages.
- **Dynamic lists:** Remove hardcoded category/payment method arrays from the forms and source them from backend endpoints so future changes do not require redeploys.
- **UI smoke tests:** Add lightweight Playwright tests under `frontend/src` to cover the login flow, dashboard widgets, and transaction creation—these should run locally before promoting builds to Vercel.

## Integration & end-to-end validation
- **Environment linking:** In Vercel, set `NEXT_PUBLIC_API_BASE_URL` (and any auth tokens) so the frontend points at the Google Cloud Run backend. Mirror those vars in `.env.local` for local testing.
- **Allow-list origins:** Update the backend `.env` `ALLOWED_ORIGINS` with the Vercel domain(s) to avoid CORS issues during previews and production deploys.
- **Proxy-friendly backend URL:** Expose the backend through Cloud Run with HTTPS and enforce CORS to allow the Vercel domain. Update `backend/index.js` CORS config if the domain list changes.
- **E2E test cases:** Create Playwright suites that (1) log in, (2) submit a new transaction, (3) approve/reject it via the backend API, and (4) validate dashboards reflect the change. Run them against staging before promoting to production.
- **Monitoring:** After each Vercel deploy, sanity-check the API calls via the browser devtools or automated smoke test to ensure requests reach the Cloud Run backend without CORS/auth issues.

## Developer action list (requires repo maintainers)
I was unable to complete the following without environment access—please tackle them and report back:
- **Configure prod/staging env vars:** In Vercel, set `NEXT_PUBLIC_API_BASE_URL` to the Cloud Run URL and confirm the same value exists in `.env.local` for local dev. In Cloud Run/Cloud Build secrets, set `ALLOWED_ORIGINS` to include the Vercel production + preview domains.
- **Verify GitHub secrets:** Ensure the frontend workflow has `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and the backend workflow still has the DB + Cloud SQL values. Re-save if any secret rotated.
- **Run end-to-end tests:** With the backend API reachable (either locally with `npm run dev` for both apps or via staging), execute `npm run test:e2e` from `frontend/` (remember to run `npx playwright install --with-deps` once). Capture screenshots/logs for failures.
- **Exercise backend smoke test locally:** Use the Cloud SQL proxy instructions in `README.md` to run `psql -f sql/phase1_smoketest.sql` and confirm it passes outside CI.
- **Share logs:** After completing the above, drop the outcomes (success/fail + logs) so we can update the playbook and unblock any remaining integration work.

## Communication cadence
- Stick to two-week sprints with a backend readiness checkpoint at mid-sprint. Surface blockers (smoketest failures, proxy auth issues, Vercel deploy glitches) in the daily stand-up so we keep the backend-first commitment.
