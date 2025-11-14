import { apiFetch } from './client';
import type { TransactionRecord } from './transactions';

export async function getPendingApprovals(): Promise<TransactionRecord[]> {
  // Assuming the enriched view aligns with what ApprovalTransaction expects
  return apiFetch<TransactionRecord[]>('/api/transactions/pending-approval');
}

export async function approveTransaction(transactionId: number, userId: number): Promise<void> {
  await apiFetch(`/api/transactions/${transactionId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
    skipJsonParse: true,
  });
}

export async function rejectTransaction(transactionId: number, userId: number, note: string): Promise<void> {
  await apiFetch(`/api/transactions/${transactionId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, note }),
    skipJsonParse: true,
  });
}

