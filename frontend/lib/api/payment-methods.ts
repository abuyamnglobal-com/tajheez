import { apiFetch } from './client';

export interface PaymentMethod {
  id: number;
  code: string;
  label: string;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return apiFetch<PaymentMethod[]>('/api/payment-methods');
}
