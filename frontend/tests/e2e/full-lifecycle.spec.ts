import { test, expect } from '@playwright/test';

test.describe('Full transaction lifecycle', () => {
  const transactionAmount = Math.floor(Math.random() * 1000) + 501; // Amount that needs approval
  const transactionDescription = `Test transaction ${new Date().getTime()}`;

  test('should allow a user to create, approve, and see a transaction', async ({ page, request }) => {
    // 1. Log in
    await page.goto('/auth');
    await page.getByLabel('Email').fill('approver@example.com');
    await page.getByLabel('Password').fill('password'); // Assuming a default password
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('/dashboard');

    // 2. Create a new transaction that requires approval
    await page.goto('/add-transaction');
    await expect(page.getByRole('heading', { name: /add new transaction/i })).toBeVisible();
    await expect(page.getByLabel('From Party')).not.toBeEmpty();

    await page.getByLabel('From Party').selectOption({ index: 1 });
    await page.getByLabel('To Party').selectOption({ index: 2 });
    await page.getByLabel('Category').selectOption({ index: 1 });
    await page.getByLabel('Amount').fill(transactionAmount.toString());
    await page.getByLabel('Payment Method').selectOption({ index: 1 });
    await page.getByLabel('Date').fill('2025-11-14');
    await page.getByLabel('Description').fill(transactionDescription);
    await page.getByRole('button', { name: /add transaction/i }).click();
    await expect(page.getByText('Transaction added successfully!')).toBeVisible();

    // 3. Find the transaction in the approvals page
    await page.goto('/approvals');
    await expect(page.getByRole('heading', { name: /pending approvals/i })).toBeVisible();
    const transactionRow = page.getByRole('row', { name: new RegExp(transactionDescription) });
    await expect(transactionRow).toBeVisible();

    // Extract transaction ID from the row
    const transactionId = await transactionRow.getAttribute('data-transaction-id');
    expect(transactionId).toBeTruthy();

    // 4. Approve the transaction via API
    const approveResponse = await request.post(`/api/transactions/${transactionId}/approve`, {
      data: { user_id: 2 }, // Assuming user ID 2 is the approver
    });
    expect(approveResponse.ok()).toBeTruthy();

    // 5. Check that the transaction is no longer in the approvals page
    await page.reload();
    await expect(page.getByRole('row', { name: new RegExp(transactionDescription) })).not.toBeVisible();

    // 6. Check that the transaction appears in the main transaction list with "Approved" status
    await page.goto('/transactions');
    await expect(page.getByRole('heading', { name: /transactions/i })).toBeVisible();
    const approvedTransactionRow = page.getByRole('row', { name: new RegExp(transactionDescription) });
    await expect(approvedTransactionRow).toBeVisible();
    await expect(approvedTransactionRow.getByText('Approved')).toBeVisible();
  });
});
