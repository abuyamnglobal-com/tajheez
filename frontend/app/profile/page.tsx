'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import TajheezHeader from '@/components/TajheezHeader';
import { BRAND_COLORS } from '@/lib/theme/brand';
import { UserIcon, BriefcaseIcon, EnvelopeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { AppUser, getUserProfile } from '@/lib/api/users';
import { getTransactions, TransactionRecord } from '@/lib/api/transactions';
import { getPendingApprovals } from '@/lib/api/approvals';

const DEFAULT_USER_ID = 1;

export default function ProfilePage() {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionRecord[]>([]);
  const [stats, setStats] = useState({ approvals: 0, transactions: 0, lastActivity: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const [user, txs, approvals] = await Promise.all([
          getUserProfile(DEFAULT_USER_ID),
          getTransactions(),
          getPendingApprovals(),
        ]);
        if (!isMounted) return;
        setProfile(user);
        setRecentTransactions(txs.slice(0, 3));
        setStats({
          approvals: approvals.length,
          transactions: txs.length,
          lastActivity: txs[0]?.date || '',
        });
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Unable to load profile';
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    console.log('User logged out.');
  };

  return (
    <Layout mainClassName="p-0">
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <TajheezHeader title="Profile" subtitle="Account" showBackButton={false} />
        <div className="p-4 pt-6 pb-24 md:px-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}
          <section className="bg-white rounded-2xl shadow-md max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold" style={{ color: BRAND_COLORS.NAVY }}>
              Profile & Settings
            </h1>
            {loading ? (
              <p className="text-gray-500">Loading profile...</p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <UserIcon className="h-4 w-4" /> Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{profile?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" /> Role
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{profile?.role}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" /> Email
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{profile?.email}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  Icon={ArrowRightOnRectangleIcon}
                  className="w-full md:w-auto"
                >
                  Logout
                </Button>
              </>
            )}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-2xl shadow-md p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Pending Approvals</p>
              <p className="text-3xl font-bold text-tajheez-orange mt-2">{stats.approvals}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Transactions Reviewed</p>
              <p className="text-3xl font-bold text-tajheez-green mt-2">{stats.transactions}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Last Activity</p>
              <p className="text-xl font-semibold text-gray-900 mt-2">
                {stats.lastActivity || 'N/A'}
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
                Recent Activity
              </h2>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-gray-600">No recent transactions to show.</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">{tx.date}</p>
                      <p className="text-lg font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
                        {tx.company}
                      </p>
                      <p className="text-sm text-gray-500">{tx.category}</p>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        tx.type === 'In' ? 'text-tajheez-green' : 'text-tajheez-red'
                      }`}
                    >
                      {tx.type === 'In' ? '+' : '-'} {tx.amount.toLocaleString()} OMR
                    </p>
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
