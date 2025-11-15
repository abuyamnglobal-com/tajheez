"use client";

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import TajheezHeader from '@/components/TajheezHeader';
import { BRAND_COLORS } from '@/lib/theme/brand';
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
import { ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';

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

  const totals = useMemo(() => {
    const inflow = transactions.filter((tx) => tx.type === 'In').reduce((sum, tx) => sum + tx.amount, 0);
    const outflow = transactions.filter((tx) => tx.type === 'Out').reduce((sum, tx) => sum + tx.amount, 0);
    return {
      inflow,
      outflow,
      net: inflow - outflow,
    };
  }, [transactions]);

  const getAmountColor = (type: TransactionRecord['type']) =>
    type === 'In' ? BRAND_COLORS.STATUS.APPROVED : BRAND_COLORS.STATUS.REJECTED;

  const summaryCards = [
    { label: 'Total In', value: totals.inflow, icon: ArrowUpRight, color: BRAND_COLORS.STATUS.APPROVED },
    { label: 'Total Out', value: totals.outflow, icon: ArrowDownRight, color: BRAND_COLORS.STATUS.REJECTED },
    { label: 'Net Position', value: totals.net, icon: Scale, color: BRAND_COLORS.NAVY },
  ];

  const renderTransactionCard = (transaction: TransactionRecord) => (
    <div key={transaction.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{transaction.date}</p>
          <h3 className="text-lg font-semibold mt-1" style={{ color: BRAND_COLORS.NAVY }}>
            {transaction.company}
          </h3>
          <p className="text-sm text-gray-500">{transaction.category}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: getAmountColor(transaction.type) }}>
            {transaction.type === 'In' ? '+' : '-'} {transaction.amount.toLocaleString()} OMR
          </p>
          <p className="text-xs text-gray-500">{transaction.type}</p>
        </div>
      </div>
      {transaction.description && <p className="text-sm text-gray-600">{transaction.description}</p>}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Status</span>
        <Badge
          variant={transaction.statusVariant}
          Icon={transaction.statusVariant === 'success' ? CheckIcon : transaction.statusVariant === 'warning' ? ClockIcon : XMarkIcon}
        >
          {transaction.status}
        </Badge>
      </div>
    </div>
  );

  return (
    <Layout mainClassName="p-0">
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <TajheezHeader title="Transactions" subtitle="Ledger" showBackButton={false} />
        <div className="p-4 pt-6 pb-24 md:px-8 space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-2xl p-4 text-white shadow-md" style={{ backgroundColor: card.color }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">{card.label}</p>
                    <p className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</p>
                  </div>
                  <card.icon size={32} className="opacity-80" />
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <InputField
                type="text"
                placeholder="Search transactions..."
                className="flex-1"
                Icon={MagnifyingGlassIcon}
                label="Search Transactions"
              />
              <SelectField
                label="Dates"
                options={[
                  { value: 'all', label: 'All Dates' },
                  { value: '7days', label: 'Last 7 Days' },
                  { value: '30days', label: 'Last 30 Days' },
                ]}
                Icon={CalendarIcon}
                className="min-w-[150px]"
              />
              <SelectField
                label="Category"
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
                label="Status"
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
          </section>

          <section data-testid="transactions-section" className="space-y-4">
            <h2 className="text-xl font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
              Recent Activity
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 min-h-[200px] space-y-4">
              {loading ? (
                <p className="text-gray-600" data-testid="transactions-loading">
                  Loading transactions...
                </p>
              ) : error ? (
                <p className="text-tajheez-red">
                  Failed to load live data: {error}. Showing cached or static data.
                </p>
              ) : null}
              <div className="space-y-4" data-testid="transactions-list">
                {transactions.map((transaction) => renderTransactionCard(transaction))}
                {!loading && transactions.length === 0 && (
                  <p className="text-gray-600">No transactions found.</p>
                )}
              </div>
            </div>
          </section>

          <section className="flex justify-center items-center gap-4">
            <Button variant="secondary" Icon={ArrowLeftIcon}>
              Previous
            </Button>
            <span className="text-gray-700">Page 1 of 5</span>
            <Button variant="secondary" Icon={ArrowRightIcon}>
              Next
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
}
