import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import {
  ChevronLeft,
  Plus,
  CheckCircle,
  BarChart,
  Settings,
  Clock,
  Trash2,
  DollarSign,
} from 'lucide-react';

const BRAND_COLORS = {
  NAVY: '#101F3B',
  ORANGE: '#FF8C00',
  BG_LIGHT: '#F7F8F9',
  STATUS: {
    APPROVED: '#10B981',
    SUBMITTED: '#FF8C00',
    REJECTED: '#EF4444',
    DRAFT: '#6B7280',
  },
};

const KPIS = [
  { title: 'Total In', value: '15,450 OMR', color: BRAND_COLORS.STATUS.APPROVED, icon: Plus },
  { title: 'Total Out', value: '9,120 OMR', color: BRAND_COLORS.STATUS.REJECTED, icon: Trash2 },
  { title: 'Net Cash Position', value: '6,330 OMR', color: BRAND_COLORS.NAVY, icon: DollarSign, valueColor: BRAND_COLORS.ORANGE },
  { title: 'Pending Approvals', value: '5', color: BRAND_COLORS.STATUS.SUBMITTED, icon: Clock },
];

const MOCK_TRANSACTIONS = [
  { id: 1, date: '2025-11-12', description: 'Loan to Raed', amount: '2,000', status: 'SUBMITTED', type: 'OUT', category: 'Loan' },
  { id: 2, date: '2025-11-11', description: 'Office Rent Payment', amount: '500', status: 'APPROVED', type: 'OUT', category: 'Expense' },
  { id: 3, date: '2025-11-11', description: 'Capital Injection', amount: '10,000', status: 'APPROVED', type: 'IN', category: 'Transfer' },
];

const QuickActionButton = ({ label, href, isPrimary, icon: Icon }: { label: string; href: string; isPrimary?: boolean; icon: React.ComponentType<{ size?: number }> }) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center p-3 rounded-xl shadow-md w-32 text-center transition duration-150"
    style={{ backgroundColor: isPrimary ? BRAND_COLORS.ORANGE : BRAND_COLORS.NAVY, color: 'white' }}
  >
    <Icon size={20} />
    <span className="mt-1 text-xs font-medium">{label}</span>
  </Link>
);

interface KpiProps {
  title: string;
  value: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  valueColor?: string;
}

const KpiCard = ({ title, value, color, icon: Icon, valueColor = 'white' }: KpiProps) => (
  <div className="flex flex-col justify-between p-4 w-40 h-28 flex-shrink-0 rounded-xl shadow-lg" style={{ backgroundColor: color }}>
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-light text-white opacity-90">{title}</h3>
      <Icon size={20} color="white" />
    </div>
    <p className="text-2xl font-bold mt-2" style={{ color: valueColor }}>{value}</p>
  </div>
);

const TransactionCard = ({ data }: { data: typeof MOCK_TRANSACTIONS[number] }) => {
  const statusColor = BRAND_COLORS.STATUS[data.status] || BRAND_COLORS.STATUS.DRAFT;
  const isPending = data.status === 'SUBMITTED';

  return (
    <div className="flex flex-col p-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">{data.date}</span>
          <p className="font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
            {data.description}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color: data.type === 'IN' ? BRAND_COLORS.STATUS.APPROVED : BRAND_COLORS.STATUS.REJECTED }}>
            {data.type === 'IN' ? '+' : '-'} {data.amount}
          </p>
          <p className="text-xs text-gray-500">{data.category}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: statusColor, color: 'white' }}>
          {data.status}
        </div>
        {isPending && (
          <div className="flex gap-2">
            <button className="text-xs text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600">Approve</button>
            <button className="text-xs text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">Reject</button>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardHeader = () => (
  <header
    className="flex items-center justify-between p-4 shadow-lg sticky top-0 z-10"
    style={{ backgroundColor: BRAND_COLORS.NAVY, color: 'white' }}
  >
    <button className="text-white opacity-0 pointer-events-none">
      <ChevronLeft size={24} />
    </button>
    <Image src="/Tajheez.gif" alt="TAJHEEZ Logo" width={120} height={40} className="h-10 w-auto" priority />
    <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Settings">
      <Settings size={20} />
    </button>
  </header>
);

export default function DashboardPage() {
  return (
    <Layout mainClassName="p-0">
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <DashboardHeader />
        <div className="p-4 pt-6 pb-24 space-y-6 md:px-8">
          <section className="flex gap-4 overflow-x-auto pb-2">
            {KPIS.map((kpi) => (
              <KpiCard key={kpi.title} {...kpi} />
            ))}
          </section>
          <section className="flex gap-4 overflow-x-auto">
            <QuickActionButton label="Add Transaction" href="/add-transaction" isPrimary icon={Plus} />
            <QuickActionButton label="Approvals" href="/approvals" icon={CheckCircle} />
            <QuickActionButton label="Weekly Summary" href="/reports/weekly-summary" icon={BarChart} />
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: BRAND_COLORS.NAVY }}>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {MOCK_TRANSACTIONS.map((trx) => (
                <TransactionCard key={trx.id} data={trx} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
