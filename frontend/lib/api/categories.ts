import { apiFetch } from './client';

export interface Category {
  id: number;
  code: string;
  label: string;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/api/categories');
}
