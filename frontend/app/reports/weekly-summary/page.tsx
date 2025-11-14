import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { FunnelIcon, ArrowUpIcon, ArrowDownIcon, ScaleIcon } from '@heroicons/react/24/outline';


export default function WeeklySummaryPage() {
  const summary = {
    inflow: 25000,
    outflow: 18000,
    net: 7000,
  };

  const transactions = [
    { id: 1, date: '2023-10-23', description: 'Project payment', type: 'Inflow', amount: 15000, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
    { id: 2, date: '2023-10-24', description: 'Office supplies', type: 'Outflow', amount: 500, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
    { id: 3, date: '2023-10-25', description: 'Consulting fee', type: 'Inflow', amount: 10000, statusColor: 'bg-tajheez-green-light text-tajheez-green', amountColor: 'text-tajheez-green' },
    { id: 4, date: '2023-10-26', description: 'Software subscription', type: 'Outflow', amount: 1500, statusColor: 'bg-tajheez-red-light text-tajheez-red', amountColor: 'text-tajheez-red' },
  ];

  return (
    <Layout>
        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Weekly Summary Report</h1>

        {/* Date Range Filter */}
        <div className="mb-8 flex items-center gap-4">
          <label htmlFor="date-range" className="text-gray-700 font-semibold">Date Range:</label>
          <input type="date" id="start-date" className="p-2 border rounded-lg" />
          <span>to</span>
          <input type="date" id="end-date" className="p-2 border rounded-lg" />
          <Button Icon={FunnelIcon}>Apply</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h2 className="text-lg font-semibold text-gray-600 flex items-center space-x-2"><ArrowUpIcon className="h-5 w-5 text-tajheez-green" /><span>Total Inflow</span></h2>
            <p className="text-3xl font-bold text-tajheez-green">${summary.inflow.toLocaleString()}</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-600 flex items-center space-x-2"><ArrowDownIcon className="h-5 w-5 text-tajheez-red" /><span>Total Outflow</span></h2>
            <p className="text-3xl font-bold text-tajheez-red">${summary.outflow.toLocaleString()}</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-600 flex items-center space-x-2"><ScaleIcon className="h-5 w-5 text-tajheez-dark-navy" /><span>Net Position</span></h2>
            <p className="text-3xl font-bold text-tajheez-dark-navy">${summary.net.toLocaleString()}</p>
          </Card>
        </div>

        {/* Detailed Transactions List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-tajheez-dark-navy mb-4">Transactions in Period</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions found for this period.</p>
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
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={tx.type === 'Inflow' ? 'success' : 'danger'} Icon={tx.type === 'Inflow' ? ArrowUpIcon : ArrowDownIcon}>{tx.type}</Badge>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.amountColor}`}>
                        ${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </Layout>
  );
}
