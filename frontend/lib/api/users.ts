import { apiFetch } from './client';

export interface AppUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export async function getUserProfile(userId: number): Promise<AppUser> {
  return apiFetch<AppUser>(`/api/users/${userId}`);
}
