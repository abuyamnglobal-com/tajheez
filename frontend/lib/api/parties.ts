import { apiFetch } from './client';

export interface Party {
  id: number;
  name: string;
  type: string;
}

export interface PartyBalance {
  party_id: number;
  party_name: string;
  total_in: number;
  total_out: number;
  net: number;
}

export interface PartyStatementEntry {
  party_id: number;
  party_name: string;
  transaction_id: number;
  trx_date: string;
  status: string;
  category_code: string;
  description: string;
  amount: number;
  from_party: string;
  to_party: string;
}

export async function getParties(): Promise<Party[]> {
  return apiFetch<Party[]>('/api/parties');
}

export async function getPartyBalances(): Promise<PartyBalance[]> {
  return apiFetch<PartyBalance[]>('/api/parties/balances');
}

export async function getPartyStatement(partyId: number): Promise<PartyStatementEntry[]> {
  return apiFetch<PartyStatementEntry[]>(`/api/parties/${partyId}/statement`);
}
