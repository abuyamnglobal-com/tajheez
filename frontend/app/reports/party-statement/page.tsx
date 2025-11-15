'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import SelectField from '@/components/SelectField';
import Badge from '@/components/Badge';
import TajheezHeader from '@/components/TajheezHeader';
import { BRAND_COLORS } from '@/lib/theme/brand';
import { getParties, Party, getPartyStatement, PartyStatementEntry } from '@/lib/api/parties';
import { UserGroupIcon, ArrowUpIcon, ArrowDownIcon, ScaleIcon } from '@heroicons/react/24/outline';

const deriveType = (entry: PartyStatementEntry) =>
  entry.to_party === entry.party_name ? 'Credit' : 'Debit';

export default function PartyStatementPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('');
  const [statement, setStatement] = useState<PartyStatementEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getParties()
      .then(setParties)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load parties'));
  }, []);

  useEffect(() => {
    if (!selectedPartyId) return undefined;
    let active = true;
    getPartyStatement(Number(selectedPartyId))
      .then((data) => {
        if (!active) return;
        setStatement(data);
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Unable to load statement';
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedPartyId]);

  const selectedParty = parties.find((party) => party.id === Number(selectedPartyId));

  const totals = useMemo(() => {
    return statement.reduce(
      (acc, entry) => {
        const type = deriveType(entry);
        if (type === 'Credit') {
          acc.credit += entry.amount;
        } else {
          acc.debit += entry.amount;
        }
        return acc;
      },
      { credit: 0, debit: 0 }
    );
  }, [statement]);

  const net = totals.credit - totals.debit;

  return (
    <Layout mainClassName="p-0">
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <TajheezHeader title="Reports" subtitle="Party Statement" />
        <div className="p-4 pt-6 pb-24 md:px-8 space-y-6">
          <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
            <h1 className="text-2xl font-bold" style={{ color: BRAND_COLORS.NAVY }}>
              Party Statement Report
            </h1>
            <div className="max-w-md">
              <SelectField
                label="Party"
                id="party-select"
                value={selectedPartyId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedPartyId(value);
                  if (!value) {
                    setStatement([]);
                    setLoading(false);
                    setError(null);
                  } else {
                    setLoading(true);
                    setError(null);
                  }
                }}
                options={parties.map((party) => ({ value: String(party.id), label: party.name }))}
                Icon={UserGroupIcon}
              />
            </div>
            {selectedParty && (
              <p className="text-sm text-gray-500">
                Showing approved transactions for <span className="font-semibold">{selectedParty.name}</span>
              </p>
            )}
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}

          {selectedParty && (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Total Credit</p>
                  <p className="text-3xl font-bold text-tajheez-green mt-2">{totals.credit.toLocaleString()} OMR</p>
                  <ArrowUpIcon className="h-8 w-8 text-tajheez-green mt-2" />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Total Debit</p>
                  <p className="text-3xl font-bold text-tajheez-red mt-2">{totals.debit.toLocaleString()} OMR</p>
                  <ArrowDownIcon className="h-8 w-8 text-tajheez-red mt-2" />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Net Position</p>
                  <p
                    className={`text-3xl font-bold mt-2 ${net >= 0 ? 'text-tajheez-green' : 'text-tajheez-red'}`}
                  >
                    {net.toLocaleString()} OMR
                  </p>
                  <ScaleIcon className="h-8 w-8 text-tajheez-dark-navy mt-2" />
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
                    Financial History
                  </h2>
                  {loading && <span className="text-sm text-gray-500">Loading...</span>}
                </div>
                {statement.length === 0 && !loading ? (
                  <p className="text-gray-600">No financial history available for this party.</p>
                ) : (
                  <div className="space-y-3">
                    {statement.map((item) => {
                      const type = deriveType(item);
                      const isCredit = type === 'Credit';
                      return (
                        <div key={item.transaction_id} className="border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">{item.trx_date}</p>
                            <p className="text-lg font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
                              {item.description || item.category_code}
                            </p>
                            <p className="text-sm text-gray-500">
                              From {item.from_party} · To {item.to_party}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={isCredit ? 'success' : 'danger'} Icon={isCredit ? ArrowUpIcon : ArrowDownIcon}>
                              {type}
                            </Badge>
                            <p className={`text-lg font-bold ${isCredit ? 'text-tajheez-green' : 'text-tajheez-red'}`}>
                              {isCredit ? '+' : '-'} {item.amount.toLocaleString()} OMR
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
