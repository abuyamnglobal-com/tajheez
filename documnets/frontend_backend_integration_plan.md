# Frontend ↔ Backend Integration Plan

## Goals
1. Display live finance data (transactions, balances, statements) sourced from the Express API in `backend/`.
2. Allow users to create, approve, and reject transactions with the workflow defined in the stored procedures (`pr_create_transaction`, `pr_approve_transaction`, `pr_reject_transaction`).
3. Share validation, error handling, and environment settings between the Next.js app and API.

Set `NEXT_PUBLIC_API_BASE_URL` (e.g., `https://api.example.com`) so the frontend can call the backend without hardcoding hostnames.

## Available API Routes
| Purpose | Method & Path | Notes |
| --- | --- | --- |
| Health | `GET /` | Returns “Partnership Finance App Backend” |
| List transactions | `GET /api/transactions` | Reads from `vw_transactions_enriched`, sorted by `id DESC` |
| Create transaction | `POST /api/transactions` | Calls `pr_create_transaction` with payload fields below |
| Approve | `POST /api/transactions/:id/approve` | Body: `{ "user_id": "uuid" }` |
| Reject | `POST /api/transactions/:id/reject` | Body: `{ "user_id": "uuid", "note": "reason" }` |
| Party balances | `GET /api/parties/balances` | Reads from `vw_party_balances` |
| Party statement | `GET /api/parties/:id/statement` | Reads from `vw_party_statement` |

### Expected POST payload (create transaction)
```json
{
  "trx_date": "2025-01-14",
  "from_party_id": 1,
  "to_party_id": 2,
  "category_code": "FUEL",
  "amount": 150.5,
  "payment_method_code": "CASH",
  "description": "Diesel refill",
  "created_by": "user-123",
  "from_account_id": "acct-1",
  "to_account_id": "acct-2",
  "related_tx_id": null
}
```

## Implementation Steps
1. **API Client Utility**  
   - Create `frontend/src/lib/api.ts` with a tiny fetch wrapper that injects base URL, JSON headers, and handles `res.ok`.  
   - Example:
     ```ts
     export async function api<T>(path: string, options?: RequestInit): Promise<T> {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
         headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
         ...options,
       });
       if (!res.ok) throw new Error(await res.text());
       return res.json();
     }
     ```

2. **Server Components / RSC Fetching**  
   - For dashboard pages, call `await api('/api/transactions')` inside server components or `getServerSideProps` to keep secrets off the client.
   - Cache responses per request with `fetch`’s built-in caching or React query if you move to client components.

3. **Mutations**  
   - Use form actions or client components with `useTransition` for POST routes.  
   - After successful POST, refresh data via `router.refresh()` (App Router) or SWR/React Query invalidation.
   - Surface backend validation errors directly in the form (e.g., invalid amount, missing fields).

4. **Approval Workflow**  
   - Render action buttons on transactions with status `SUBMITTED`.  
   - Approve: `api(`/api/transactions/${id}/approve`, { method: 'POST', body: JSON.stringify({ user_id }) })`.  
   - Reject: include `note` and ensure the UI enforces the `V-05` comment requirement.

5. **Party Insights**  
   - Balances widget: fetch `/api/parties/balances`, map to cards showing `in_total`, `out_total`, and `net`.  
   - Party statement page: dynamic route `/parties/[id]` that calls `/api/parties/:id/statement` and displays the ledger with filters.

6. **Error & Loading States**  
   - Wrap calls with `try/catch`, show toast or inline messages for 4xx/5xx.  
   - Implement skeletons/spinners for transaction tables and statement charts while data loads.

7. **Testing Hooks**  
   - Mock the API using MSW or Next.js Route Handlers during unit/integration tests; assert that payloads match stored procedure requirements.
   - Add Playwright flows that hit a staging API to ensure create/approve/reject flows work end-to-end.

## Edge Considerations
- Handle timezone normalization (backend expects server-local date; send ISO strings).  
- Guard against double submissions by disabling submit buttons while awaiting responses.  
- Surface attachment upload guidance (Phase 2) even if backend endpoints are not yet available.  
- Keep `user_id` aligned with whatever auth provider you adopt (e.g., Clerk, NextAuth) and store tokens securely.
