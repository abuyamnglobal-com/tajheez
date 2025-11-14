import { apiFetch } from './client';

export interface Party {
  id: number;
  name: string;
  type: string;
}

export async function getParties(): Promise<Party[]> {
  return apiFetch<Party[]>('/api/parties');
}
