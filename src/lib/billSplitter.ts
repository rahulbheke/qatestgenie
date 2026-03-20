// Types
export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export type SplitType = "equal" | "unequal" | "percentage" | "itemwise";
export type ExpenseCategory = "food" | "travel" | "accommodation" | "entertainment" | "shopping" | "other";
export type Currency = "₹" | "$" | "€" | "£";

export interface SplitDetail {
  participantId: string;
  amount?: number;      // for unequal
  percentage?: number;  // for percentage
  items?: { name: string; amount: number }[]; // for itemwise
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitType: SplitType;
  splitAmong: string[];      // participant IDs for equal split
  splitDetails?: SplitDetail[];
  category: ExpenseCategory;
  date: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface BillData {
  participants: Participant[];
  expenses: Expense[];
  currency: Currency;
}

// Generate unique IDs
export const genId = () => Math.random().toString(36).slice(2, 10);

// Calculate how much each person owes for an expense
export function calculateExpenseSplit(expense: Expense): Record<string, number> {
  const shares: Record<string, number> = {};

  switch (expense.splitType) {
    case "equal": {
      const perPerson = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach((id) => {
        shares[id] = perPerson;
      });
      break;
    }
    case "unequal": {
      expense.splitDetails?.forEach((d) => {
        shares[d.participantId] = d.amount || 0;
      });
      break;
    }
    case "percentage": {
      expense.splitDetails?.forEach((d) => {
        shares[d.participantId] = (expense.amount * (d.percentage || 0)) / 100;
      });
      break;
    }
    case "itemwise": {
      expense.splitDetails?.forEach((d) => {
        const total = d.items?.reduce((s, i) => s + i.amount, 0) || 0;
        shares[d.participantId] = total;
      });
      break;
    }
  }

  return shares;
}

// Calculate net balance for each participant
export function calculateBalances(data: BillData): Record<string, number> {
  const balances: Record<string, number> = {};
  data.participants.forEach((p) => (balances[p.id] = 0));

  data.expenses.forEach((expense) => {
    // Payer gets credited
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

    // Each person's share gets debited
    const shares = calculateExpenseSplit(expense);
    Object.entries(shares).forEach(([id, amount]) => {
      balances[id] = (balances[id] || 0) - amount;
    });
  });

  return balances;
}

// Greedy algorithm to minimize number of transactions
export function minimizeSettlements(balances: Record<string, number>): Settlement[] {
  const settlements: Settlement[] = [];

  // Separate into debtors (negative balance) and creditors (positive balance)
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  Object.entries(balances).forEach(([id, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) debtors.push({ id, amount: -rounded });
    else if (rounded > 0.01) creditors.push({ id, amount: rounded });
  });

  // Sort descending for greedy matching
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const transfer = Math.min(debtors[i].amount, creditors[j].amount);
    if (transfer > 0.01) {
      settlements.push({
        from: debtors[i].id,
        to: creditors[j].id,
        amount: Math.round(transfer * 100) / 100,
      });
    }
    debtors[i].amount -= transfer;
    creditors[j].amount -= transfer;
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
}

// Get total spent per person
export function getTotalSpent(data: BillData): Record<string, number> {
  const totals: Record<string, number> = {};
  data.participants.forEach((p) => (totals[p.id] = 0));
  data.expenses.forEach((e) => {
    totals[e.paidBy] = (totals[e.paidBy] || 0) + e.amount;
  });
  return totals;
}

// Format currency
export function fmt(amount: number, currency: Currency): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

// Generate share summary text
export function generateSummary(
  data: BillData,
  settlements: Settlement[]
): string {
  const getName = (id: string) => data.participants.find((p) => p.id === id)?.name || "Unknown";
  const lines = settlements.map(
    (s) => `${getName(s.from)} pays ${getName(s.to)} ${data.currency}${s.amount.toFixed(2)}`
  );
  return lines.length > 0 ? lines.join("\n") : "All settled! No payments needed.";
}

// LocalStorage helpers
const STORAGE_KEY = "smart-bill-splitter-data";

export function saveToStorage(data: BillData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromStorage(): BillData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Demo data
export function getDemoData(): BillData {
  const participants: Participant[] = [
    { id: "p1", name: "Rahul" },
    { id: "p2", name: "Amit" },
    { id: "p3", name: "Priya" },
    { id: "p4", name: "Sneha" },
  ];
  const expenses: Expense[] = [
    {
      id: "e1", description: "Dinner at Italian place", amount: 2400,
      paidBy: "p1", splitType: "equal", splitAmong: ["p1", "p2", "p3", "p4"],
      category: "food", date: new Date().toISOString(),
    },
    {
      id: "e2", description: "Cab to airport", amount: 800,
      paidBy: "p2", splitType: "equal", splitAmong: ["p1", "p2", "p3"],
      category: "travel", date: new Date().toISOString(),
    },
    {
      id: "e3", description: "Movie tickets", amount: 1200,
      paidBy: "p3", splitType: "equal", splitAmong: ["p1", "p3", "p4"],
      category: "entertainment", date: new Date().toISOString(),
    },
  ];
  return { participants, expenses, currency: "₹" };
}
