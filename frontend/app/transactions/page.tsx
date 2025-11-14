import Link from 'next/link';
import Layout from '@/components/Layout';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  CheckBadgeIcon,
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';


export default function TransactionsPage() {
  const transactions = [
    { id: 1, company: 'ABC Corp', amount: 1200, date: '2023-10-26', status: 'Approved', category: 'Software', type: 'Out', statusColor: 'bg-tajheez-green-light text-tajheez-green' },
    { id: 2, company: 'XYZ Ltd', amount: 500, date: '2023-10-25', status: 'Pending', category: 'Hardware', type: 'In', statusColor: 'bg-tajheez-orange-light text-tajheez-orange' },
    { id: 3, company: 'Global Solutions', amount: 3000, date: '2023-10-24', status: 'Rejected', category: 'Services', type: 'Out', statusColor: 'bg-tajheez-red-light text-tajheez-red' },
    { id: 4, company: 'Tech Innovations', amount: 750, date: '2023-10-23', status: 'Approved', category: 'Software', type: 'In', statusColor: 'bg-tajheez-green-light text-tajheez-green' },
    { id: 5, company: 'New Age Marketing', amount: 150, date: '2023-10-22', status: 'Pending', category: 'Marketing', type: 'Out', statusColor: 'bg-tajheez-orange-light text-tajheez-orange' },
  ];

  return (
    <Layout>
        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Transactions</h1>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <InputField
            type="text"
            placeholder="Search transactions..."
            className="flex-1"
            Icon={MagnifyingGlassIcon}
            label="" // Label is not visually present, but good for accessibility
          />
          <SelectField
            label=""
            options={[
              { value: 'all', label: 'All Dates' },
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
            ]}
            Icon={CalendarIcon}
            className="min-w-[150px]"
          />
          <SelectField
            label=""
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'software', label: 'Software' },
              { value: 'hardware', label: 'Hardware' },
              { value: 'services', label: 'Services' },
            ]}
            Icon={TagIcon}
            className="min-w-[150px]"
          />
          <SelectField
            label=""
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            Icon={CheckBadgeIcon}
            className="min-w-[150px]"
          />
        </div>

        {/* Transactions List */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 gap-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition duration-200">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{transaction.company} - ${transaction.amount}</p>
                  <p className="text-sm text-gray-600">{transaction.category} | {transaction.date} | {transaction.type}</p>
                </div>
                <Badge variant={transaction.status === 'Approved' ? 'success' : transaction.status === 'Pending' ? 'warning' : 'danger'} Icon={transaction.status === 'Approved' ? CheckIcon : transaction.status === 'Pending' ? ClockIcon : XMarkIcon}>{transaction.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          <Button variant="secondary" Icon={ArrowLeftIcon}>Previous</Button>
          <span className="text-gray-700">Page 1 of 5</span>
          <Button variant="secondary" Icon={ArrowRightIcon}>Next</Button>
        </div>
    </Layout>
  );
}
