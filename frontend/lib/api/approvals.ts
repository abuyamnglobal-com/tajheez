// frontend/lib/api/approvals.ts

interface ApprovalTransaction {
  id: number;
  company: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

let dummyPendingApprovals: ApprovalTransaction[] = [
  { id: 1, company: 'ABC Corp', amount: 1200, date: '2023-10-26', category: 'Software', description: 'Software license renewal' },
  { id: 2, company: 'XYZ Ltd', amount: 500, date: '2023-10-25', category: 'Hardware', description: 'New keyboard and mouse' },
  { id: 3, company: 'Global Solutions', amount: 3000, date: '2023-10-24', category: 'Services', description: 'Consulting services for Q4' },
];

export async function getPendingApprovals(): Promise<ApprovalTransaction[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyPendingApprovals;
}

export async function approveTransaction(id: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  dummyPendingApprovals = dummyPendingApprovals.filter(tx => tx.id !== id);
  console.log(`Transaction ${id} approved (simulated).`);
}

export async function rejectTransaction(id: number, reason: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  dummyPendingApprovals = dummyPendingApprovals.filter(tx => tx.id !== id);
  console.log(`Transaction ${id} rejected with reason: "${reason}" (simulated).`);
}
