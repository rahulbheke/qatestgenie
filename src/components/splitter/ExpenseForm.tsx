import { useState } from "react";
import { Expense, Participant, SplitType, ExpenseCategory, Currency, genId } from "@/lib/billSplitter";
import { Plus, Receipt, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  participants: Participant[];
  expenses: Expense[];
  currency: Currency;
  onChange: (expenses: Expense[]) => void;
}

const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: "food", label: "Food", emoji: "🍕" },
  { value: "travel", label: "Travel", emoji: "🚗" },
  { value: "accommodation", label: "Stay", emoji: "🏨" },
  { value: "entertainment", label: "Fun", emoji: "🎬" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "other", label: "Other", emoji: "📦" },
];

const SPLIT_TYPES: { value: SplitType; label: string }[] = [
  { value: "equal", label: "Equal" },
  { value: "unequal", label: "Custom" },
  { value: "percentage", label: "%" },
];

export default function ExpenseForm({ participants, expenses, currency, onChange }: Props) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(participants[0]?.id || "");
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [splitAmong, setSplitAmong] = useState<string[]>(participants.map((p) => p.id));
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [customPcts, setCustomPcts] = useState<Record<string, string>>({});

  const toggleSplitPerson = (id: string) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addExpense = () => {
    const amt = parseFloat(amount);
    if (!desc.trim() || isNaN(amt) || amt <= 0 || !paidBy) return;

    const expense: Expense = {
      id: genId(),
      description: desc.trim(),
      amount: amt,
      paidBy,
      splitType,
      splitAmong,
      category,
      date: new Date().toISOString(),
    };

    if (splitType === "unequal") {
      expense.splitDetails = splitAmong.map((id) => ({
        participantId: id,
        amount: parseFloat(customAmounts[id] || "0"),
      }));
    } else if (splitType === "percentage") {
      expense.splitDetails = splitAmong.map((id) => ({
        participantId: id,
        percentage: parseFloat(customPcts[id] || "0"),
      }));
    }

    onChange([...expenses, expense]);
    setDesc("");
    setAmount("");
    setCustomAmounts({});
    setCustomPcts({});
  };

  const removeExpense = (id: string) => onChange(expenses.filter((e) => e.id !== id));
  const getName = (id: string) => participants.find((p) => p.id === id)?.name || "?";

  const customTotal = splitAmong.reduce((s, id) => s + (parseFloat(customAmounts[id] || "0")), 0);
  const pctTotal = splitAmong.reduce((s, id) => s + (parseFloat(customPcts[id] || "0")), 0);
  const amtNum = parseFloat(amount) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Receipt className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-heading">Expenses</h3>
        <span className="text-xs text-muted-foreground ml-auto">{expenses.length} added</span>
      </div>

      {/* Category */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              category === c.value
                ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Description & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What was it for?"
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currency}</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="h-10 w-full rounded-lg border border-input bg-card pl-7 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Paid by */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Paid by</label>
        <div className="flex gap-1.5 flex-wrap">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => setPaidBy(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                paidBy === p.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.avatar} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split type */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Split type</label>
        <div className="flex gap-1.5">
          {SPLIT_TYPES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSplitType(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                splitType === s.value
                  ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split among */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Split among</label>
        <div className="flex gap-1.5 flex-wrap">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleSplitPerson(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                splitAmong.includes(p.id)
                  ? "bg-positive/20 text-positive ring-1 ring-positive/40"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.avatar} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amounts for unequal */}
      {splitType === "unequal" && (
        <div className="space-y-2 p-3 rounded-lg bg-secondary/40 border border-border">
          <p className="text-xs text-muted-foreground">Enter custom amounts (total should equal {currency}{amtNum.toFixed(2)})</p>
          {splitAmong.map((id) => (
            <div key={id} className="flex items-center gap-2">
              <span className="text-xs text-foreground w-20 truncate">{getName(id)}</span>
              <input
                type="number"
                value={customAmounts[id] || ""}
                onChange={(e) => setCustomAmounts({ ...customAmounts, [id]: e.target.value })}
                placeholder="0"
                className="flex-1 h-8 rounded-md border border-input bg-card px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50"
              />
            </div>
          ))}
          {amtNum > 0 && Math.abs(customTotal - amtNum) > 0.01 && (
            <p className="text-xs text-destructive">
              Total: {currency}{customTotal.toFixed(2)} (off by {currency}{Math.abs(customTotal - amtNum).toFixed(2)})
            </p>
          )}
        </div>
      )}

      {/* Percentages */}
      {splitType === "percentage" && (
        <div className="space-y-2 p-3 rounded-lg bg-secondary/40 border border-border">
          <p className="text-xs text-muted-foreground">Enter percentages (should total 100%)</p>
          {splitAmong.map((id) => (
            <div key={id} className="flex items-center gap-2">
              <span className="text-xs text-foreground w-20 truncate">{getName(id)}</span>
              <input
                type="number"
                value={customPcts[id] || ""}
                onChange={(e) => setCustomPcts({ ...customPcts, [id]: e.target.value })}
                placeholder="0"
                className="flex-1 h-8 rounded-md border border-input bg-card px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          ))}
          {Math.abs(pctTotal - 100) > 0.01 && (
            <p className="text-xs text-destructive">Total: {pctTotal.toFixed(1)}% (should be 100%)</p>
          )}
        </div>
      )}

      <Button onClick={addExpense} disabled={!desc.trim() || !amount || parseFloat(amount) <= 0} className="w-full gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Add Expense
      </Button>

      {/* Expense list */}
      {expenses.length > 0 && (
        <div className="space-y-2 mt-4">
          {expenses.map((e, i) => {
            const cat = CATEGORIES.find((c) => c.value === e.category);
            return (
              <div
                key={e.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border group animate-fade-slide-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="text-lg">{cat?.emoji || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{e.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {getName(e.paidBy)} paid {currency}{e.amount.toFixed(2)} · {e.splitType}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground">{currency}{e.amount.toFixed(2)}</span>
                <button
                  onClick={() => removeExpense(e.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive transition-all"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
