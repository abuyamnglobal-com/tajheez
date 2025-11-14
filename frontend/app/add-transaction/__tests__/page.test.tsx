import { render, screen, within } from '@testing-library/react';
import AddTransactionPage from '../page';
import { getParties } from '@/lib/api/parties';
import { getCategories } from '@/lib/api/categories';
import { getPaymentMethods } from '@/lib/api/payment-methods';

// Mock the Layout component
jest.mock('@/components/Layout', () => {
  return function DummyLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock API modules
jest.mock('@/lib/api/parties');
jest.mock('@/lib/api/categories');
jest.mock('@/lib/api/payment-methods');
jest.mock('@/lib/api/transactions');

const mockParties = [
  { id: 1, name: 'Party A', type: 'INVESTOR' },
  { id: 2, name: 'Party B', type: 'COMPANY' },
];
const mockCategories = [
  { id: 1, code: 'EXPENSE', label: 'Expense' },
  { id: 2, code: 'TRANSFER', label: 'Transfer' },
];
const mockPaymentMethods = [
  { id: 1, code: 'CASH', label: 'Cash' },
  { id: 2, code: 'CARD', label: 'Card' },
];

describe('AddTransactionPage', () => {
  beforeEach(() => {
    (getParties as jest.Mock).mockResolvedValue(mockParties);
    (getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (getPaymentMethods as jest.Mock).mockResolvedValue(mockPaymentMethods);
  });

  it('renders the form and loads select field options', async () => {
    render(<AddTransactionPage />);

    expect(screen.getByRole('heading', { name: /add new transaction/i })).toBeInTheDocument();

    // Check that the select fields are populated
    const fromPartySelect = screen.getByLabelText(/from party/i);
    expect(await within(fromPartySelect).findByText('Party A')).toBeInTheDocument();

    const toPartySelect = screen.getByLabelText(/to party/i);
    expect(await within(toPartySelect).findByText('Party B')).toBeInTheDocument();

    const categorySelect = screen.getByLabelText(/category/i);
    expect(await within(categorySelect).findByText('Expense')).toBeInTheDocument();

    const paymentMethodSelect = screen.getByLabelText(/payment method/i);
    expect(await within(paymentMethodSelect).findByText('Cash')).toBeInTheDocument();
  });
});
