// frontend/lib/api/reports.ts

interface WeeklySummary {
  inflow: number;
  outflow: number;
  net: number;
  transactions: {
    id: number;
    date: string;
    description: string;
    type: 'Inflow' | 'Outflow';
    amount: number;
    statusColor: string;
    amountColor: string;
  }[];
}

interface PartyStatementItem {
  id: number;
  date: string;
  description: string;
  type: 'Credit' | 'Debit';
  amount: number;
  statusColor: string;
  amountColor: string;
}

interface PartyStatements {
  [key: string]: PartyStatementItem[];
}

const dummyWeeklySummary: WeeklySummary = {
  inflow: 25000,
  outflow: 18000,
  net: 7000,
  transactions: [
    { id: 1, date: '2023-10-23', description: 'Project payment', type: 'Inflow', amount: 15000, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
    { id: 2, date: '2023-10-24', description: 'Office supplies', type: 'Outflow', amount: 500, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
    { id: 3, date: '2023-10-25', description: 'Consulting fee', type: 'Inflow', amount: 10000, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
    { id: 4, date: '2023-10-26', description: 'Software subscription', type: 'Outflow', amount: 1500, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
  ],
};

const dummyPartyStatements: PartyStatements = {
  'Supplier A': [
    { id: 1, date: '2023-09-15', description: 'Payment for services', type: 'Debit', amount: 5000, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
    { id: 2, date: '2023-10-01', description: 'Invoice #12345', type: 'Credit', amount: 7500, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
    { id: 3, date: '2023-10-20', description: 'Payment for goods', type: 'Debit', amount: 2000, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
  ],
  'Client B': [
    { id: 4, date: '2023-09-20', description: 'Project advance', type: 'Credit', amount: 10000, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
    { id: 5, date: '2023-10-10', description: 'Partial payment', type: 'Debit', amount: 3000, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
  ],
  'Internal Dept C': [
    { id: 6, date: '2023-10-05', description: 'Budget allocation', type: 'Credit', amount: 20000, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
  ],
};

export async function getWeeklySummary(): Promise<WeeklySummary> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyWeeklySummary;
}

export async function getPartyStatement(partyName: string): Promise<PartyStatementItem[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyPartyStatements[partyName] || [];
}
