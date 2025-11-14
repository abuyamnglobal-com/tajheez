// frontend/lib/api/transactions.ts

interface Transaction {
  id: number;
  company: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  category: string;
  type: 'In' | 'Out';
  statusColor: string; // Tailwind classes
  amountColor: string; // Tailwind classes
  description?: string;
}

interface AddTransactionPayload {
  company: string;
  fromParty: string;
  toParty: string;
  category: string;
  amount: string;
  paymentMethod: string;
  date: string;
  description: string;
  attachment: File | null;
}

let dummyTransactions: Transaction[] = [
  { id: 1, company: 'ABC Corp', amount: 1200, date: '2023-10-26', status: 'Approved', category: 'Software', type: 'Out', statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-red' },
  { id: 2, company: 'XYZ Ltd', amount: 500, date: '2023-10-25', status: 'Pending', category: 'Hardware', type: 'In', statusColor: 'bg-tajheez-orange-light text-tajheez-orange', amountColor: 'text-tajheez-green' },
  { id: 3, company: 'Global Solutions', amount: 3000, date: '2023-10-24', status: 'Rejected', category: 'Services', type: 'Out', statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
  { id: 4, company: 'Tech Innovations', amount: 750, date: '2023-10-23', status: 'Approved', category: 'Software', type: 'In', statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
  { id: 5, company: 'New Age Marketing', amount: 150, date: '2023-10-22', status: 'Pending', category: 'Marketing', type: 'Out', statusColor: 'bg-tajheez-orange-light text-tajheez-orange', amountColor: 'text-tajheez-red' },
];

export async function getTransactions(): Promise<Transaction[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyTransactions;
}

export async function addTransaction(payload: AddTransactionPayload): Promise<Transaction> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const newTransaction: Transaction = {
    id: dummyTransactions.length + 1,
    company: payload.company,
    amount: parseFloat(payload.amount),
    date: payload.date,
    status: 'Pending', // New transactions are pending by default
    category: payload.category,
    type: 'Out', // Assuming all added transactions are 'Out' for simplicity
    statusColor: 'bg-tajheez-orange-light text-tajheez-orange',
    amountColor: 'text-tajheez-red',
    description: payload.description,
  };
  dummyTransactions.push(newTransaction);
  return newTransaction;
}
