# Tajheez Monorepo

This workspace hosts the Tajheez backend (`backend/`), frontend (`frontend/`), SQL assets (`sql/`), and supporting docs (`documnets/`). To understand workflows, coding style, and review expectations, start with the contributor playbook in [AGENTS.md](AGENTS.md).

Additional module-specific instructions:
- `frontend/README.md` — default Next.js usage directions.
- `documnets/API_Documentation.md` — REST contract summary.
- `documnets/TAJHEEZ_Combined_Frontend_Developer_Document.md` — product and UI context.

Keep new documentation near related code and update the guides above whenever behavior or APIs change.

## Backend database access (Cloud SQL proxy)

Local scripts should connect to Cloud SQL the same way production does: through the Cloud SQL Auth Proxy. Export the standard env vars and create the instance connection string before starting:

```bash
export PROJECT_ID="yamn-cc"
export REGION="us-central1"
export INSTANCE="postgresql"
export INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${INSTANCE}"
export DB_USER="appuser"
export DB_PASS="E7s@@sii"
export DB_NAME="finance"
```

Download the proxy (v2+) once and keep it in the repo root:

```bash
curl -sSLo cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.11.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy
```

Start the proxy on a local port using your `gcloud auth application-default login` context or a service-account key:

```bash
./cloud-sql-proxy "$INSTANCE_CONNECTION_NAME" --port 5433 &
```

With the proxy listening, you can run targeted checks (for example the Phase 1 smoke test) just like the CI pipeline:

```bash
PGPASSWORD="$DB_PASS" psql -h 127.0.0.1 -p 5433 -U "$DB_USER" -d "$DB_NAME" -f sql/phase1_smoketest.sql
```

Shut down the background proxy process after testing to free the port (`kill %<job>` or `pkill -f cloud-sql-proxy`).

## Frontend deployment (Vercel)

Pushes to `main` run `.github/workflows/frontend-vercel.yml`, which:
- installs dependencies in `frontend/`,
- runs `npm run lint` and `npm run build`, and
- deploys the prebuilt output to Vercel production.

To keep the workflow green you must populate these GitHub Action secrets with the values from your Vercel project:

| Secret | Purpose |
| --- | --- |
| `VERCEL_TOKEN` | Personal/token-based access for the CLI |
| `VERCEL_ORG_ID` | Organization scope returned by `vercel link` |
| `VERCEL_PROJECT_ID` | Project identifier returned by `vercel link` |

Locally, run `npx vercel link` inside `frontend/` to verify the project binding and `npx vercel env pull` if you need the same environment variables for previews or smoke testing.
