'use client';

import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SelectField from '@/components/SelectField';
import Badge from '@/components/Badge';


export default function PartyStatementPage() {
  const [selectedParty, setSelectedParty] = useState('');

  const parties = ['Supplier A', 'Client B', 'Internal Dept C', 'Partner D'];

  const partyStatements = {
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

  const currentStatement = selectedParty ? partyStatements[selectedParty as keyof typeof partyStatements] : [];

  return (
    <Layout>        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Party Statement Report</h1>

        {/* Party Selection */}
        <div className="mb-8 flex items-center gap-4">
          <SelectField
            label="Select Party:"
            id="party-select"
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            options={parties.map(party => ({ value: party, label: party }))}
            Icon={UserGroupIcon}
            className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tajheez-orange"
          />
        </div>

        {/* Financial History */}
        {selectedParty && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-tajheez-dark-navy mb-4">Statement for {selectedParty}</h2>
            {currentStatement.length === 0 ? (
              <p className="text-gray-600">No financial history available for this party.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentStatement.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant={item.type === 'Credit' ? 'success' : 'danger'} Icon={item.type === 'Credit' ? ArrowUpIcon : ArrowDownIcon}>{item.type}</Badge>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.amountColor}`}>
                          ${item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
    </Layout>
  );
}
