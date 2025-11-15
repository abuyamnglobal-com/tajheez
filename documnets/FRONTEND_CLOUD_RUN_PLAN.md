# Frontend Deployment Plan – Google Cloud Run

This plan describes how to deploy the Next.js frontend (located in `frontend/`) to Google Cloud Run. It assumes the backend already runs on Cloud Run and that you want the UI served from the same GCP project.

## 1. Prerequisites

| Item | Notes |
| --- | --- |
| GCP Project | e.g., `yamn-cc` |
| Artifact Registry repo | e.g., `us-central1-docker.pkg.dev/yamn-cc/cloud-run-source-deploy/tajheez-frontend` |
| Cloud Run enabled | `gcloud services enable run.googleapis.com` |
| Cloud Build enabled | optional but recommended |
| Domain | e.g., `app.tajheez.com` (optional custom domain) |
| Env vars | `NEXT_PUBLIC_API_BASE_URL`, `NODE_ENV=production` |

The existing `frontend/Dockerfile` already supports Cloud Run (build + `npm start`). No code changes are required unless we add server-side features.

## 2. Build & Push Image

### Option A: Cloud Build (recommended)
```bash
cd frontend
gcloud builds submit --tag \
  "us-central1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/tajheez-frontend:$(git rev-parse --short HEAD)"
```

### Option B: Local Docker
```bash
cd frontend
docker build -t tajheez-frontend:latest .
docker tag tajheez-frontend:latest \
  "us-central1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/tajheez-frontend:$(git rev-parse --short HEAD)"
docker push "us-central1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/tajheez-frontend:$(git rev-parse --short HEAD)"
```

## 3. Deploy to Cloud Run

```bash
SERVICE=partnership-frontend
REGION=us-central1
IMAGE="us-central1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/tajheez-frontend:$(git rev-parse --short HEAD)"

gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,NEXT_PUBLIC_API_BASE_URL=https://partnership-finance-backend-xxxx.a.run.app" \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=20 \
  --ingress=all
```

### Notes
- Update `NEXT_PUBLIC_API_BASE_URL` to the backend’s Cloud Run URL.
- If you need secrets (e.g., API keys), store them in Secret Manager and mount via `--set-secrets` or Cloud Run service bindings.
- Consider enabling Cloud CDN or Cloud Armor once the service is stable.

## 4. Custom Domain (optional)

```bash
gcloud beta run domain-mappings create \
  --service "$SERVICE" \
  --domain "app.tajheez.com" \
  --region "$REGION"
```

Follow the DNS instructions Cloud Run outputs.

## 5. CI/CD Strategy

1. **Build step**: Reuse the existing GitHub workflow (backend) or add `.github/workflows/frontend-cloudrun.yml` that runs `npm ci && npm run build && gcloud builds submit`.
2. **Deploy step**: After pushing the image, run `gcloud run deploy ...` with Workload Identity Federation (same pattern as backend).
3. **Secrets**: Store `GOOGLE_PROJECT_ID`, `GCP_REGION`, `CLOUD_RUN_SERVICE`, `ARTIFACT_REPO`, and `NEXT_PUBLIC_API_BASE_URL` in GitHub Actions secrets.

## 6. Validation Checklist

| Item | Command/Action |
| --- | --- |
| Health check | `curl https://<service-url>` (should redirect to `/dashboard`) |
| Static assets | confirm `_next/static` paths load |
| API calls | open browser dev console, ensure requests hit backend Cloud Run and pass CORS |
| Logs | `gcloud logs read --project $PROJECT_ID --service $SERVICE --limit 50` |

## 7. Rollback

- Keep at least one previous image tag (e.g., `:previous`) so `gcloud run deploy $SERVICE --image <old>` reverts quickly.
- Use Cloud Run revisions to roll back from the Console if needed.

## 8. Next Steps

1. Provision the Artifact Registry repo if it does not exist (`gcloud artifacts repositories create ...`).
2. Mirror the backend’s Workload Identity Federation setup for a dedicated frontend deploy service account (least privilege: Cloud Run Admin + Artifact Registry Writer + Cloud Build Service Account).
3. Implement the GitHub Actions workflow and test against staging.

## Developer Checklist

Please review and confirm before kicking off the migration:

- [x] Validate that the documented changes (Dockerfile, Next.js config, env vars) match the current state of `main`.
  - **Validation Note:** The `frontend/Dockerfile` is suitable for Cloud Run. The `frontend/next.config.ts` uses `output: 'standalone'` and has no conflicting settings. `NEXT_PUBLIC_API_BASE_URL` is correctly used in `frontend/lib/api/client.ts`. `NODE_ENV` is a standard Next.js variable. From a code and configuration perspective, the `main` branch is ready for Cloud Run deployment.
- [ ] Confirm the Artifact Registry repo and Cloud Run service names/regions in this plan align with our GCP project. Please update this file with the exact repo/service names you’ll use.
  - **Agent Note:** I cannot perform this action as I do not have access to your GCP project to confirm resource names and regions. This requires manual verification by a human with appropriate access.
- [ ] Double-check that removing Vercel won’t impact existing integrations (DNS, webhooks, analytics). Document any dependencies or confirm that none exist.
  - **Agent Note:** I cannot perform this action as I have no information about your existing integrations with Vercel. This requires manual investigation and documentation by a human.
- [ ] Once the above are confirmed, execute the plan: provision the Artifact Registry (if missing), set up service accounts/secrets, and wire a GitHub Action or manual script to build and deploy to Cloud Run. Note the commit/PR you use for tracking.
  - **Agent Note:** I cannot perform this action as it requires access to GCP and GitHub to create resources, set up secrets, and execute deployment scripts. This must be performed by a human with appropriate access and permissions.
- [ ] Report back in this file (or linked ticket) with blockers, deployment outcomes, and any follow-up actions so we stay aligned.
  - **Agent Note:** I cannot perform this action as it requires monitoring external systems and reporting on outcomes. This must be performed by a human.
