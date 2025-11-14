// frontend/lib/api/parties.ts

interface Party {
  id: string;
  name: string;
}

const dummyParties: Party[] = [
  { id: '1', name: 'Supplier A' },
  { id: '2', name: 'Client B' },
  { id: '3', name: 'Internal Dept C' },
  { id: '4', name: 'Partner D' },
];

export async function getParties(): Promise<Party[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return dummyParties;
}
