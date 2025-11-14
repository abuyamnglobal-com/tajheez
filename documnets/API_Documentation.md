# API Documentation

**Base URL:** `https://partnership-finance-backend-plr3fh26nq-uc.a.run.app/api`

**Authentication:**
All endpoints require authentication. An identity token must be generated for the `cloud-run-invoker@yamn-cc.iam.gserviceaccount.com` service account with the service URL (`https://partnership-finance-backend-plr3fh26nq-uc.a.run.app`) as the audience. The token should be included in the `Authorization` header as a Bearer token.

**Example Token Generation:**
`gcloud auth print-identity-token --impersonate-service-account=cloud-run-invoker@yamn-cc.iam.gserviceaccount.com --audiences=https://partnership-finance-backend-plr3fh26nq-uc.a.run.app`

---

### `GET /transactions`

**Description:** Retrieves a list of all transactions.

**Request:**
*   **Method:** `GET`
*   **URL:** `/transactions`
*   **Headers:**
    *   `Authorization: Bearer <IDENTITY_TOKEN>`

**Response:**
*   **Status Code:** `200 OK`
*   **Body:** An array of transaction objects.
```json
[
  {
    "id": "string",
    "trx_date": "string (ISO 8601 date-time)",
    "amount": "string (decimal)",
    "status": "string (e.g., SUBMITTED, APPROVED, REJECTED)",
    "from_party": "string",
    "to_party": "string",
    "category_code": "string",
    "category_label": "string",
    "payment_method_code": "string",
    "payment_method_label": "string",
    "from_account": "string (optional)",
    "to_account": "string (optional)",
    "description": "string",
    "created_at": "string (ISO 8601 date-time)",
    "approved_at": "string (ISO 8601 date-time, optional)",
    "rejected_at": "string (ISO 8601 date-time, optional)"
  }
]
```

---

### `POST /transactions`

**Description:** Creates a new transaction.

**Request:**
*   **Method:** `POST`
*   **URL:** `/transactions`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <IDENTITY_TOKEN>`
*   **Body:** A JSON object representing the new transaction.
```json
{
  "trx_date": "string (YYYY-MM-DD)",
  "from_party_id": "integer",
  "to_party_id": "integer",
  "category_code": "string (e.g., EXPENSE, LOAN_TO_COMPANY)",
  "amount": "number",
  "payment_method_code": "string (e.g., BANK_TRANSFER, CARD, CASH)",
  "description": "string",
  "created_by": "integer",
  "from_account_id": "integer (optional)",
  "to_account_id": "integer (optional)",
  "related_tx_id": "integer (optional)"
}
```

**Response:**
*   **Status Code:** `201 Created`
*   **Body:** `Transaction created`

---

### `POST /transactions/:id/approve`

**Description:** Approves a transaction. Only `DRAFT` or `SUBMITTED` transactions can be approved.

**Request:**
*   **Method:** `POST`
*   **URL:** `/transactions/{id}/approve`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <IDENTITY_TOKEN>`
*   **Body:** A JSON object containing the user ID.
```json
{
  "user_id": "integer"
}
```

**Response:**
*   **Status Code:** `200 OK`
*   **Body:** `Transaction approved`

---

### `POST /transactions/:id/reject`

**Description:** Rejects a transaction. Only `DRAFT` or `SUBMITTED` transactions can be rejected.

**Request:**
*   **Method:** `POST`
*   **URL:** `/transactions/{id}/reject`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <IDENTITY_TOKEN>`
*   **Body:** A JSON object containing the user ID and a rejection note.
```json
{
  "user_id": "integer",
  "note": "string"
}
```

**Response:**
*   **Status Code:** `200 OK`
*   **Body:** `Transaction rejected`

---
