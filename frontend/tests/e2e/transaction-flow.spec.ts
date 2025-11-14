import { test, expect } from '@playwright/test';

test.describe('Transaction flow smoke', () => {
  test('login page renders and accepts input', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByRole('heading', { name: /login to tajheez/i })).toBeVisible();
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password');
    await expect(page.getByRole('button', { name: /login/i })).toBeEnabled();
  });

  test('transactions list loads', async ({ page }) => {
    await page.goto('/transactions');
    await expect(page.getByRole('heading', { name: /transactions/i })).toBeVisible();
    const section = page.getByTestId('transactions-section');
    await expect(section).toBeVisible();
    await section.getByTestId('transactions-loading').waitFor({ state: 'visible' }).catch(() => {});
    await expect(page.getByTestId('transactions-list')).toBeVisible();
  });

  test('creates a new transaction', async ({ page }) => {
    await page.goto('/add-transaction');
    await expect(page.getByRole('heading', { name: /add new transaction/i })).toBeVisible();

    // Wait for the form to be populated
    await expect(page.getByLabel('From Party')).not.toBeEmpty();

    await page.getByLabel('From Party').selectOption({ index: 1 });
    await page.getByLabel('To Party').selectOption({ index: 2 });
    await page.getByLabel('Category').selectOption({ index: 1 });
    await page.getByLabel('Amount').fill('100');
    await page.getByLabel('Payment Method').selectOption({ index: 1 });
    await page.getByLabel('Date').fill('2025-11-14');
    await page.getByLabel('Description').fill('Test transaction');

    await page.getByRole('button', { name: /add transaction/i }).click();

    await expect(page.getByText('Transaction added successfully!')).toBeVisible();
  });
});
