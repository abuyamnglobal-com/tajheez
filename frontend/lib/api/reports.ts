import { getTransactions, TransactionRecord } from './transactions';

export interface WeeklySummaryFilters {
  startDate?: string;
  endDate?: string;
}

export interface WeeklySummary {
  inflow: number;
  outflow: number;
  net: number;
  transactions: TransactionRecord[];
  range: {
    start: string;
    end: string;
  };
}

const normalizeDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getDefaultRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return { start, end };
};

const buildRange = (filters: WeeklySummaryFilters) => {
  const defaultRange = getDefaultRange();
  const start = normalizeDate(filters.startDate) || defaultRange.start;
  const end = normalizeDate(filters.endDate) || defaultRange.end;
  if (start > end) {
    return { start: end, end: start };
  }
  return { start, end };
};

const withinRange = (dateString: string, start: Date, end: Date) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  return date >= start && date <= end;
};

const sumByDirection = (transactions: TransactionRecord[], direction: TransactionRecord['type']) =>
  transactions
    .filter((tx) => tx.type === direction)
    .reduce((total, tx) => total + tx.amount, 0);

export async function getWeeklySummary(filters: WeeklySummaryFilters = {}): Promise<WeeklySummary> {
  const range = buildRange(filters);
  const transactions = await getTransactions();
  const filtered = transactions.filter((tx) => withinRange(tx.date, range.start, range.end));
  const inflow = sumByDirection(filtered, 'In');
  const outflow = sumByDirection(filtered, 'Out');
  return {
    inflow,
    outflow,
    net: inflow - outflow,
    transactions: filtered,
    range: {
      start: range.start.toISOString().slice(0, 10),
      end: range.end.toISOString().slice(0, 10),
    },
  };
}
