"use client";

import { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  BarChart,
  Settings,
  CheckCircle,
  Clock,
  Trash2,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';

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

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const Header = ({ title, showBack, onBack, rightContent }: HeaderProps) => (
  <header
    className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 shadow-lg"
    style={{ backgroundColor: BRAND_COLORS.NAVY, color: 'white' }}
  >
    <button
      onClick={onBack}
      className={`text-white ${showBack ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <ChevronLeft size={24} />
    </button>
    {title === 'TAJHEEZ Dashboard' ? (
      <Image
        src="/Tajheez.gif"
        alt="TAJHEEZ Logo"
        width={120}
        height={40}
        className="h-10 w-auto mx-auto"
        draggable={false}
        priority
      />
    ) : (
      <h1 className="text-lg font-semibold">{title}</h1>
    )}
    {rightContent}
  </header>
);

interface IconButtonProps {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick?: () => void;
  isPrimary?: boolean;
}

const IconButton = ({ label, icon: Icon, onClick, isPrimary = false }: IconButtonProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 text-sm font-medium rounded-xl transition duration-150 shadow-md w-32"
    style={{ backgroundColor: isPrimary ? BRAND_COLORS.ORANGE : BRAND_COLORS.NAVY, color: 'white' }}
  >
    <Icon size={20} />
    <span className="mt-1 text-xs">{label}</span>
  </button>
);

interface KpiCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  valueColor?: string;
}

const KpiCard = ({ title, value, color, icon: Icon, valueColor = 'white' }: KpiCardProps) => (
  <div className="flex flex-col justify-between p-4 w-40 h-28 flex-shrink-0 rounded-xl shadow-lg" style={{ backgroundColor: color }}>
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-light text-white opacity-90">{title}</h3>
      <Icon size={20} color="white" />
    </div>
    <p className="text-2xl font-bold mt-2" style={{ color: valueColor }}>{value}</p>
  </div>
);

type TransactionStatus = keyof typeof BRAND_COLORS.STATUS;

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: string;
  status: TransactionStatus;
  type: 'IN' | 'OUT';
  category: string;
}

const TransactionItem = ({ data }: { data: Transaction }) => {
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
          <p
            className="text-lg font-bold"
            style={{ color: data.type === 'IN' ? BRAND_COLORS.STATUS.APPROVED : BRAND_COLORS.STATUS.REJECTED }}
          >
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

type PrototypeScreen = 'dashboard' | 'add' | 'approvals' | 'reports';

const QuickActions = ({
  onAddTransaction,
  onNavigate,
}: {
  onAddTransaction: () => void;
  onNavigate: (screen: PrototypeScreen) => void;
}) => (
  <div className="flex gap-4 p-4 overflow-x-auto">
    <IconButton label="Add Transaction" icon={Plus} onClick={onAddTransaction} isPrimary />
    <IconButton label="Approvals (5)" icon={CheckCircle} onClick={() => onNavigate('approvals')} />
    <IconButton label="Weekly Summary" icon={BarChart} onClick={() => onNavigate('reports')} />
  </div>
);

const DashboardPrototype = () => {
  const [screen, setScreen] = useState<PrototypeScreen>('dashboard');
  const mockKPIs = [
    { title: 'Total In', value: '15,450 OMR', color: BRAND_COLORS.STATUS.APPROVED, icon: Plus },
    { title: 'Total Out', value: '9,120 OMR', color: BRAND_COLORS.STATUS.REJECTED, icon: Trash2 },
    { title: 'Net Cash Position', value: '6,330 OMR', color: BRAND_COLORS.NAVY, icon: DollarSign, valueColor: BRAND_COLORS.ORANGE },
    { title: 'Pending Approvals', value: '5', color: BRAND_COLORS.STATUS.SUBMITTED, icon: Clock },
  ];

const mockTransactions: Transaction[] = [
  { id: 1, date: '2025-11-12', description: 'Loan to Raed', amount: '2,000', status: 'SUBMITTED', type: 'OUT', category: 'Loan' },
  { id: 2, date: '2025-11-11', description: 'Office Rent Payment', amount: '500', status: 'APPROVED', type: 'OUT', category: 'Expense' },
  { id: 3, date: '2025-11-11', description: 'Capital Injection', amount: '10,000', status: 'APPROVED', type: 'IN', category: 'Transfer' },
];

  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <Header title="TAJHEEZ Dashboard" showBack={false} onBack={() => setScreen('dashboard')} rightContent={<Settings />} />
        <div className="p-4 pt-24 pb-20 space-y-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {mockKPIs.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
          <QuickActions onAddTransaction={() => setScreen('add')} onNavigate={(target) => setScreen(target)} />
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: BRAND_COLORS.NAVY }}>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {mockTransactions.map((trx) => (
                <TransactionItem key={trx.id} data={trx} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full text-center">
        <p className="text-lg font-semibold mb-4">Additional prototype sections go here.</p>
        <div className="flex justify-center gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => setScreen('dashboard')}>
            Back to Dashboard
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg" onClick={() => setScreen('dashboard')}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PrototypePage() {
  return <DashboardPrototype />;
}
