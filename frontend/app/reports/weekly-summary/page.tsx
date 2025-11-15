'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import TajheezHeader from '@/components/TajheezHeader';
import { BRAND_COLORS } from '@/lib/theme/brand';
import { getWeeklySummary, WeeklySummary, WeeklySummaryFilters } from '@/lib/api/reports';
import { FunnelIcon, ArrowUpIcon, ArrowDownIcon, ScaleIcon } from '@heroicons/react/24/outline';

export default function WeeklySummaryPage() {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [filters, setFilters] = useState<WeeklySummaryFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (range: WeeklySummaryFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeeklySummary(range);
      setSummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load weekly summary';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleApplyFilters = () => {
    fetchSummary(filters);
  };

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Total Inflow', value: summary.inflow, icon: ArrowUpIcon, colorClass: 'text-tajheez-green' },
      { label: 'Total Outflow', value: summary.outflow, icon: ArrowDownIcon, colorClass: 'text-tajheez-red' },
      { label: 'Net Position', value: summary.net, icon: ScaleIcon, colorClass: 'text-tajheez-dark-navy' },
    ];
  }, [summary]);

  return (
    <Layout mainClassName="p-0">
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <TajheezHeader title="Reports" subtitle="Weekly Summary" />
        <div className="p-4 pt-6 pb-24 md:px-8 space-y-6">
          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Showing</p>
              <h1 className="text-2xl font-bold" style={{ color: BRAND_COLORS.NAVY }}>
                Weekly Summary Report
              </h1>
              {summary && (
                <p className="text-sm text-gray-500 mt-1">
                  {summary.range.start} — {summary.range.end}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col flex-1 min-w-[160px]">
                <label htmlFor="start-date" className="text-sm font-semibold text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tajheez-orange"
                />
              </div>
              <div className="flex flex-col flex-1 min-w-[160px]">
                <label htmlFor="end-date" className="text-sm font-semibold text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tajheez-orange"
                />
              </div>
              <Button Icon={FunnelIcon} onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}

          <section className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{card.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${card.colorClass}`}>{card.value.toLocaleString()} OMR</p>
                </div>
                <card.icon className={`${card.colorClass} h-10 w-10`} />
              </div>
            ))}
          </section>

          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
                  Transactions in Period
                </h2>
                <p className="text-sm text-gray-500">Live data from Cloud Run</p>
              </div>
              {loading && <span className="text-sm text-gray-500">Loading...</span>}
            </div>
            {summary && summary.transactions.length === 0 && !loading ? (
              <p className="text-gray-600">No transactions were recorded during this period.</p>
            ) : (
              <div className="space-y-3">
                {summary?.transactions.map((tx) => (
                  <div key={tx.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">{tx.date}</p>
                      <p className="text-lg font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
                        {tx.description || tx.company}
                      </p>
                      <p className="text-sm text-gray-500">{tx.company} · {tx.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={tx.type === 'In' ? 'success' : 'danger'} Icon={tx.type === 'In' ? ArrowUpIcon : ArrowDownIcon}>
                        {tx.type === 'In' ? 'Inflow' : 'Outflow'}
                      </Badge>
                      <p
                        className={`text-lg font-bold ${tx.type === 'In' ? 'text-tajheez-green' : 'text-tajheez-red'}`}
                      >
                        {tx.type === 'In' ? '+' : '-'} {tx.amount.toLocaleString()} OMR
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
