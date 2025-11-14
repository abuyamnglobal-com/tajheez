"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { getTransactions, TransactionRecord } from '@/lib/api/transactions';
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
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getTransactions()
      .then((data) => {
        if (isMounted) {
          setTransactions(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load transactions');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getAmountColor = (type: TransactionRecord['type']) =>
    type === 'In' ? 'text-tajheez-green' : 'text-tajheez-red';

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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 min-h-[200px]" data-testid="transactions-section">
          {loading ? (
            <p className="text-gray-600" data-testid="transactions-loading">Loading transactions...</p>
          ) : error ? (
            <p className="text-tajheez-red">Failed to load live data: {error}. Showing cached or static data.</p>
          ) : null}
          <div className="grid grid-cols-1 gap-4 mt-4" data-testid="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition duration-200">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {transaction.company} - <span className={getAmountColor(transaction.type)}>${transaction.amount.toLocaleString()}</span>
                  </p>
                  <p className="text-sm text-gray-600">{transaction.category} | {transaction.date} | {transaction.type}</p>
                </div>
                <div className="mt-3 md:mt-0 flex items-center gap-2">
                  <Badge variant={transaction.statusVariant} Icon={transaction.statusVariant === 'success' ? CheckIcon : transaction.statusVariant === 'warning' ? ClockIcon : XMarkIcon}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
            {!loading && transactions.length === 0 && (
              <p className="text-gray-600">No transactions found.</p>
            )}
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
