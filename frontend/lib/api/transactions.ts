import { apiFetch } from './client';

export type TransactionVariant = 'success' | 'warning' | 'danger';

export interface TransactionRecord {
  id: number;
  company: string;
  amount: number;
  date: string;
  status: string;
  statusVariant: TransactionVariant;
  category: string;
  type: 'In' | 'Out';
  description?: string;
}

interface RawTransaction {
  id: number;
  amount: number;
  trx_date: string;
  status?: string;
  category_name?: string;
  category_code?: string;
  direction?: string;
  type?: string;
  from_party_name?: string;
  description?: string;
}

export interface CreateTransactionPayload {
  trx_date: string;
  from_party_id: number;
  to_party_id: number;
  category_code: string;
  amount: number;
  payment_method_code: string;
  description?: string;
  created_by: number;
  from_account_id?: number | null;
  to_account_id?: number | null;
  related_tx_id?: number | null;
}

const statusVariantMap: Record<string, TransactionVariant> = {
  APPROVED: 'success',
  SUBMITTED: 'warning',
  PENDING: 'warning',
  REJECTED: 'danger',
};

const statusLabelMap: Record<string, string> = {
  APPROVED: 'Approved',
  SUBMITTED: 'Pending Approval',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
};

const fallbackTransactions: TransactionRecord[] = [
  { id: 1, company: 'ABC Corp', amount: 1200, date: '2023-10-26', status: 'Approved', category: 'Software', type: 'Out', statusVariant: 'success' },
  { id: 2, company: 'XYZ Ltd', amount: 500, date: '2023-10-25', status: 'Pending', category: 'Hardware', type: 'In', statusVariant: 'warning' },
  { id: 3, company: 'Global Solutions', amount: 3000, date: '2023-10-24', status: 'Rejected', category: 'Services', type: 'Out', statusVariant: 'danger' },
  { id: 4, company: 'Tech Innovations', amount: 750, date: '2023-10-23', status: 'Approved', category: 'Software', type: 'In', statusVariant: 'success' },
  { id: 5, company: 'New Age Marketing', amount: 150, date: '2023-10-22', status: 'Pending', category: 'Marketing', type: 'Out', statusVariant: 'warning' },
];

const normalizeType = (direction?: string, type?: string): 'In' | 'Out' => {
  const token = direction || type || '';
  if (token.toLowerCase().includes('in')) {
    return 'In';
  }
  return 'Out';
};

const mapTransaction = (raw: RawTransaction): TransactionRecord => {
  const normalizedStatus = raw.status?.toUpperCase() || 'PENDING';
  return {
    id: raw.id,
    company: raw.from_party_name || 'Unknown party',
    amount: raw.amount,
    date: raw.trx_date,
    status: statusLabelMap[normalizedStatus] || raw.status || 'Pending',
    statusVariant: statusVariantMap[normalizedStatus] || 'warning',
    category: raw.category_name || raw.category_code || 'Uncategorized',
    type: normalizeType(raw.direction, raw.type),
    description: raw.description,
  };
};

export async function getTransactions(): Promise<TransactionRecord[]> {
  try {
    const data = await apiFetch<RawTransaction[]>('/api/transactions');
    return data.map(mapTransaction);
  } catch (error) {
    console.error('Falling back to static transactions due to API error', error);
    return fallbackTransactions;
  }
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<void> {
  await apiFetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipJsonParse: true,
  });
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
