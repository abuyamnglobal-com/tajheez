import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Users, BarChart, Settings, CheckCircle, Clock, XCircle, Trash2, Save, Send, DollarSign, Briefcase } from 'lucide-react';

// --- BRANDING AND UTILITIES ---
const BRAND_COLORS = {
  NAVY: '#101F3B',
  ORANGE: '#FF8C00',
  BG_LIGHT: '#F7F8F9',
  STATUS: {
    APPROVED: '#10B981', // Green
    SUBMITTED: '#FF8C00', // Orange (same as accent for consistency)
    REJECTED: '#EF4444', // Red
    DRAFT: '#6B7280', // Grey
  }
};

// --- GLOBAL COMPONENTS ---

const Header = ({ title, showBack, onBack, rightContent }) => (
  <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 shadow-lg" style={{ backgroundColor: BRAND_COLORS.NAVY, color: 'white' }}>
    <button onClick={onBack} className={`text-white ${showBack ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <ChevronLeft size={24} />
    </button>
    {/* LOGO INTEGRATION */}
    {title === 'TAJHEEZ Dashboard' ? (
      <img
        src="uploaded:Tajheez.gif"
        alt="TAJHEEZ Logo"
        className="h-8 md:h-10 mx-auto" // Center and control size
        style={{ filter: 'brightness(0) invert(1) hue-rotate(180deg) saturate(1.5)' }} // Simple inversion for dark background
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x32/101F3B/FFFFFF?text=TAJHEEZ"; }}
      />
    ) : (
      <h1 className="text-lg font-semibold">{title}</h1>
    )}
    {rightContent}
  </header>
);

const IconButton = ({ label, icon: Icon, onClick, isPrimary = false, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 text-sm font-medium rounded-xl transition duration-150 shadow-md ${className}`}
    style={{
      backgroundColor: isPrimary ? BRAND_COLORS.ORANGE : BRAND_COLORS.NAVY,
      color: 'white',
    }}
  >
    <Icon size={20} />
    <span className="mt-1 text-xs">{label}</span>
  </button>
);

const TransactionItem = ({ data, onAction }) => {
  const statusColor = BRAND_COLORS.STATUS[data.status] || BRAND_COLORS.STATUS.DRAFT;
  const isPending = data.status === 'SUBMITTED';

  return (
    <div className="flex flex-col p-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">{data.date}</span>
          <p className="font-semibold" style={{ color: BRAND_COLORS.NAVY }}>{data.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color: data.type === 'IN' ? BRAND_COLORS.STATUS.APPROVED : BRAND_COLORS.STATUS.REJECTED }}>
            {data.type === 'IN' ? '+' : '-'} {data.amount}
          </p>
          <p className="text-xs text-gray-500">{data.category}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs font-medium p-1 rounded" style={{ backgroundColor: statusColor, color: 'white', display: 'inline-block' }}>
            {data.status}
          </div>
          {isPending && (
            <div className="flex gap-2">
              <button onClick={() => onAction('APPROVE', data.id)} className="text-xs text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600">Approve</button>
              <button onClick={() => onAction('REJECT', data.id)} className="text-xs text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">Reject</button>
            </div>
          )}
      </div>
    </div>
  );
};


// --- 1. DASHBOARD VIEW ---

const KpiCard = ({ title, value, color, icon: Icon, valueColor = 'white' }) => (
  <div
    className="flex flex-col justify-between p-4 w-40 h-28 flex-shrink-0 rounded-xl shadow-lg"
    style={{ backgroundColor: color }}
  >
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-light text-white opacity-90">{title}</h3>
      <Icon size={20} color="white" />
    </div>
    <p className="text-2xl font-bold mt-2" style={{ color: valueColor }}>{value}</p>
  </div>
);

const QuickActions = ({ onAddTransaction, onNavigate }) => (
  <div className="flex gap-4 p-4 overflow-x-auto">
    <IconButton
      label="Add Transaction"
      icon={Plus}
      onClick={onAddTransaction}
      isPrimary={true}
      className="w-32"
    />
    <IconButton
      label="Approvals (5)"
      icon={CheckCircle}
      onClick={() => onNavigate('approvals')}
      className="w-32"
      style={{ backgroundColor: BRAND_COLORS.STATUS.SUBMITTED }}
    />
    <IconButton
      label="Weekly Summary"
      icon={BarChart}
      onClick={() => onNavigate('reports')}
      className="w-32"
    />
  </div>
);

const DashboardView = ({ setScreen }) => {
  const mockKPIs = [
    { title: 'Total In', value: '15,450 OMR', color: BRAND_COLORS.STATUS.APPROVED, icon: Plus, valueColor: 'white' },
    { title: 'Total Out', value: '9,120 OMR', color: BRAND_COLORS.STATUS.REJECTED, icon: Trash2, valueColor: 'white' },
    { title: 'Net Cash Position', value: '6,330 OMR', color: BRAND_COLORS.NAVY, icon: DollarSign, valueColor: BRAND_COLORS.ORANGE },
    { title: 'Pending Approvals', value: '5', color: BRAND_COLORS.STATUS.SUBMITTED, icon: Clock, valueColor: 'white' },
  ];

  const mockTransactions = [
    { id: 1, date: '2025-11-12', description: 'Loan to Raed', amount: '2,000', status: 'SUBMITTED', type: 'OUT', category: 'Loan' },
    { id: 2, date: '2025-11-11', description: 'Office Rent Payment', amount: '500', status: 'APPROVED', type: 'OUT', category: 'Expense' },
    { id: 3, date: '2025-11-11', description: 'Capital Injection', amount: '10,000', status: 'APPROVED', type: 'IN', category: 'Transfer' },
  ];
  
  const handleTrxAction = (action, id) => console.log(`${action} transaction ${id}`);

  return (
    <div className="p-4 pt-20 pb-16 min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {mockKPIs.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <QuickActions onAddTransaction={() => setScreen('add')} onNavigate={setScreen} />

      <h2 className="text-xl font-bold mt-6 mb-3" style={{ color: BRAND_COLORS.NAVY }}>Recent Activity</h2>
      <div className="space-y-3">
        {mockTransactions.map(trx => <TransactionItem key={trx.id} data={trx} onAction={handleTrxAction} />)}
      </div>

    </div>
  );
};

// --- 2. ADD TRANSACTION VIEW (Previous implementation included for context) ---

const FormField = ({ label, type = 'text', value, onChange, options, isRequired = false, isFullWidth = true, placeholder = '', name }) => {
  const baseClass = `p-3 border rounded-lg focus:ring-2 transition duration-150 w-full ${isFullWidth ? 'col-span-2' : 'col-span-1'}`;
  const labelStyle = { color: BRAND_COLORS.NAVY };

  let input;

  switch (type) {
    case 'select':
      input = (
        <select
          value={value}
          onChange={onChange}
          className={baseClass}
          name={name}
          style={{ borderColor: '#D1D5DB' }}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
      break;
    case 'textarea':
      input = (
        <textarea
          value={value}
          onChange={onChange}
          className={baseClass}
          name={name}
          style={{ borderColor: '#D1D5DB' }}
          rows="3"
          placeholder={placeholder}
        />
      );
      break;
    case 'file':
      input = (
        <input
          type="file"
          onChange={onChange}
          name={name}
          className={`${baseClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:cursor-pointer`}
          style={{ borderColor: '#D1D5DB' }}
        />
      );
      break;
    default:
      input = (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={baseClass}
          name={name}
          style={{ borderColor: '#D1D5DB' }}
          placeholder={placeholder}
        />
      );
      break;
  }

  return (
    <div className={`mb-4 ${isFullWidth ? 'col-span-2' : 'col-span-1'}`}>
      <label className="block text-sm font-medium mb-1" style={labelStyle}>
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      {input}
    </div>
  );
};

const AddTransactionView = ({ onBack }) => {
  // ... (Form state and handlers are simplified for prototype)
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category: 'EXPENSE', amount: '', paymentMethod: 'BANK_TRANSFER', fromParty: 'USER_1', toParty: 'COMPANY_2', relatedTx: '', description: '', attachment: null });
  const handleChange = (e) => { const { name, value, type } = e.target; setFormData(prev => ({ ...prev, [name]: (type === 'file' ? e.target.files[0] : value) })); };
  const handleSave = (status) => { console.log(`Saving transaction with status: ${status}`); onBack(); };
  const isLoanReturn = formData.category === 'LOAN_RETURN';
  const categories = [{ value: 'EXPENSE', label: 'Expense' }, { value: 'LOAN', label: 'Loan to Party' }, { value: 'LOAN_RETURN', label: 'Loan Return' }, { value: 'TRANSFER', label: 'Transfer' }];
  const parties = [{ value: 'USER_1', label: 'Raed (Investor)' }, { value: 'COMPANY_1', label: 'Abu Yamen Global (Company)' }, { value: 'COMPANY_2', label: 'Yamen Trading (Company)' }];
  const paymentMethods = [{ value: 'BANK_TRANSFER', label: 'Bank Transfer' }, { value: 'CASH', label: 'Cash' }, { value: 'CARD', label: 'Card Payment' }];

  return (
    <>
      <Header title="Add New Transaction" showBack={true} onBack={onBack} rightContent={<div className="w-6" />} />
      <div className="p-4 pt-20 pb-24 space-y-4" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <p className="text-sm text-center italic" style={{ color: BRAND_COLORS.STATUS.DRAFT }}>
          Operating Company: Yamen Trading (Implicit)
        </p>
        <section className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-md font-semibold mb-3" style={{ color: BRAND_COLORS.NAVY }}>Core Details</h3>
          <FormField label="Transaction Date" type="date" name="date" value={formData.date} onChange={handleChange} isRequired={true} />
          <FormField label="Category" type="select" name="category" value={formData.category} onChange={handleChange} options={categories} isRequired={true} />
          <FormField label="Amount (OMR)" type="number" name="amount" value={formData.amount} onChange={handleChange} isRequired={true} placeholder="e.g., 500.00" />
          <FormField label="Payment Method" type="select" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={paymentMethods} isRequired={true} />
        </section>
        <section className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-md font-semibold mb-3" style={{ color: BRAND_COLORS.NAVY }}>Parties Involved</h3>
          <FormField label="From Party" type="select" name="fromParty" value={formData.fromParty} onChange={handleChange} options={parties} isRequired={true} />
          <FormField label="To Party" type="select" name="toParty" value={formData.toParty} onChange={handleChange} options={parties} isRequired={true} />
          {isLoanReturn && (
            <FormField label="Related Transaction (Original Loan)" type="select" name="relatedTx" value={formData.relatedTx} onChange={handleChange} options={[{value: '', label: 'Select Original Loan'}, {value: 'TX-123', label: 'TX-123: 1,500 OMR to Raed'}]} placeholder="Search Loan ID..." />
          )}
        </section>
        <section className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-md font-semibold mb-3" style={{ color: BRAND_COLORS.NAVY }}>Attachments & Notes</h3>
          <FormField label="Description" type="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Brief explanation for this transaction..." />
          <FormField label="Attachment (Invoice/Receipt)" type="file" name="attachment" onChange={handleChange} isFullWidth={true} />
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 shadow-2xl bg-white flex justify-end gap-3 z-10">
        <button
          onClick={() => handleSave('DRAFT')}
          className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg border transition duration-150"
          style={{ borderColor: BRAND_COLORS.NAVY, color: BRAND_COLORS.NAVY }}
        >
          <Save size={18} className="mr-2" /> Save as Draft
        </button>
        <button
          onClick={() => handleSave('SUBMITTED')}
          className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg shadow-lg transition duration-150"
          style={{ backgroundColor: BRAND_COLORS.ORANGE, color: 'white' }}
        >
          <Send size={18} className="mr-2" /> Submit for Approval
        </button>
      </footer>
    </>
  );
};

// --- 3. APPROVALS VIEW ---

const ApprovalsView = ({ onBack }) => {
  const pendingTransactions = [
    { id: 101, date: '2025-11-12', description: 'Large Equipment Purchase', amount: '1,500', status: 'SUBMITTED', type: 'OUT', category: 'Expense' },
    { id: 102, date: '2025-11-12', description: 'Loan Return to Partner G.', amount: '800', status: 'SUBMITTED', type: 'OUT', category: 'Loan Return' },
    { id: 103, date: '2025-11-11', description: 'Marketing Campaign Fee', amount: '600', status: 'SUBMITTED', type: 'OUT', category: 'Expense' },
  ];
  const handleAction = (action, id) => console.log(`${action} transaction ${id}`);
  
  return (
    <>
      <Header title="Pending Approvals" showBack={true} onBack={() => onBack('dashboard')} rightContent={<div className="w-6" />} />
      <div className="p-4 pt-20 pb-16 min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <p className="text-sm font-medium mb-4" style={{ color: BRAND_COLORS.NAVY }}>
          {pendingTransactions.length} items require your attention.
        </p>
        <div className="space-y-3">
          {pendingTransactions.map(trx => <TransactionItem key={trx.id} data={trx} onAction={handleAction} />)}
        </div>
      </div>
    </>
  );
};

// --- 4. REPORTS VIEW ---

const ReportsView = ({ onBack }) => (
  <>
    <Header title="Reports & Analytics" showBack={true} onBack={() => onBack('dashboard')} rightContent={<div className="w-6" />} />
    <div className="p-4 pt-20 pb-16 min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: BRAND_COLORS.NAVY }}>Weekly Summary</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <p className="font-semibold text-lg mb-2" style={{ color: BRAND_COLORS.ORANGE }}>Filter</p>
        <FormField label="Date Range" type="select" name="reportRange" options={[{value:'weekly', label:'Last 7 Days'}, {value:'monthly', label:'Last 30 Days'}]} isFullWidth={true} />
        <button className="w-full mt-3 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: BRAND_COLORS.NAVY }}>
          Generate Report
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <p className="font-semibold text-lg mb-3" style={{ color: BRAND_COLORS.NAVY }}>Net Flow by Party (Placeholder)</p>
        <p className="text-sm text-gray-600">
          This chart will show the **Inflow / Outflow / Net** for each party (Company/Investor) based on the selected period.
          (FSD: R-01 Weekly Summary, R-02 Party Statement)
        </p>
      </div>
    </div>
  </>
);

// --- 5. PROFILE VIEW ---

const ProfileView = ({ onBack }) => {
  const user = { name: "Partner G.", email: "partner.g@tajheez.com", role: "Partner", company: "Abu Yamen Global" };
  
  return (
    <>
      <Header title="User Profile" showBack={true} onBack={() => onBack('dashboard')} rightContent={<div className="w-6" />} />
      <div className="p-4 pt-20 pb-16 min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-6">
            <Users size={40} className="p-2 rounded-full mr-4" style={{ backgroundColor: BRAND_COLORS.NAVY, color: 'white' }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: BRAND_COLORS.NAVY }}>{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-md font-medium" style={{ color: BRAND_COLORS.NAVY }}>
              <Briefcase size={18} className="inline mr-2 text-gray-500" />
              **Role:** <span style={{ color: BRAND_COLORS.ORANGE }}>{user.role}</span>
            </p>
            <p className="text-md font-medium" style={{ color: BRAND_COLORS.NAVY }}>
              <CheckCircle size={18} className="inline mr-2 text-gray-500" />
              **Company:** {user.company}
            </p>
          </div>
          
          <button 
            onClick={() => console.log('User Logged Out')}
            className="w-full mt-6 py-3 text-white font-semibold rounded-lg transition duration-150"
            style={{ backgroundColor: BRAND_COLORS.NAVY }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};


// --- MAIN APP ---

const App = () => {
  const [screen, setScreen] = useState('dashboard'); // 'dashboard', 'add', 'approvals', 'reports', 'profile'

  const navigateTo = (newScreen) => setScreen(newScreen);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <DashboardView setScreen={navigateTo} />;
      case 'add':
        return <AddTransactionView onBack={navigateTo} />;
      case 'approvals':
        return <ApprovalsView onBack={navigateTo} />;
      case 'reports':
        return <ReportsView onBack={navigateTo} />;
      case 'profile':
        return <ProfileView onBack={navigateTo} />;
      default:
        return <DashboardView setScreen={navigateTo} />;
    }
  };

  const getHeaderTitle = () => {
    switch (screen) {
      case 'dashboard': return 'TAJHEEZ Dashboard';
      case 'add': return 'Add New Transaction';
      default: return 'TAJHEEZ';
    }
  };

  const currentTitle = getHeaderTitle();
  const showBackButton = screen !== 'dashboard' && screen !== 'add';
  
  const NavButton = ({ target, icon: Icon, label }) => {
    const isActive = screen === target;
    return (
      <button 
        onClick={() => navigateTo(target)} 
        className="text-center flex flex-col items-center p-2 text-xs font-medium" 
        style={{ color: isActive ? BRAND_COLORS.ORANGE : BRAND_COLORS.NAVY }}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
      <style>{`
        /* Custom file input styling to apply brand colors */
        input[type="file"]::file-selector-button {
            background-color: ${BRAND_COLORS.NAVY} !important;
            color: white !important;
            cursor: pointer;
            border-radius: 9999px; /* full rounded */
            padding: 0.5rem 1rem;
            margin-right: 1rem;
            transition: background-color 0.15s ease-in-out;
        }
        input[type="file"]::file-selector-button:hover {
            background-color: ${BRAND_COLORS.ORANGE} !important;
        }

        /* Ensure form input focus styles match brand color */
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: ${BRAND_COLORS.ORANGE} !important;
            box-shadow: 0 0 0 1px ${BRAND_COLORS.ORANGE} !important;
        }
      `}</style>
      
      {/* RENDER CURRENT SCREEN */}
      {renderScreen()}

      {/* MOBILE BOTTOM NAV - Only show on the main navigation screens */}
      {['dashboard', 'approvals', 'reports', 'profile'].includes(screen) && (
        <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white shadow-2xl border-t border-gray-200 md:hidden">
          <div className="flex justify-around items-center h-16">
            <NavButton target="dashboard" icon={Users} label="Dashboard" />
            <NavButton target="approvals" icon={Clock} label="Approvals" />
            <NavButton target="reports" icon={BarChart} label="Reports" />
            <NavButton target="profile" icon={Settings} label="Profile" />
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;