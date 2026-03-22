import { useState } from "react";
import { Expense, Participant, SplitType, ExpenseCategory, Currency, genId } from "@/lib/billSplitter";
import { Plus, Receipt, Trash2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose,
} from "@/components/ui/drawer";

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

const SPLIT_LABELS: { value: SplitType; label: string; desc: string }[] = [
  { value: "equal", label: "Split equally", desc: "Everyone pays the same" },
  { value: "unequal", label: "Custom amounts", desc: "Set how much each pays" },
  { value: "percentage", label: "By percentage", desc: "Split by custom %" },
];

export default function ExpenseForm({ participants, expenses, currency, onChange }: Props) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const resetForm = () => {
    setDesc("");
    setAmount("");
    setCustomAmounts({});
    setCustomPcts({});
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
    resetForm();
    if (isMobile) setDrawerOpen(false);
  };

  const removeExpense = (id: string) => onChange(expenses.filter((e) => e.id !== id));
  const getName = (id: string) => participants.find((p) => p.id === id)?.name || "?";

  const customTotal = splitAmong.reduce((s, id) => s + (parseFloat(customAmounts[id] || "0")), 0);
  const pctTotal = splitAmong.reduce((s, id) => s + (parseFloat(customPcts[id] || "0")), 0);
  const amtNum = parseFloat(amount) || 0;

  const perPersonAmount = splitType === "equal" && splitAmong.length > 0 && amtNum > 0
    ? (amtNum / splitAmong.length).toFixed(2) : null;

  const isFormValid = desc.trim() && amount && parseFloat(amount) > 0;

  // ---------- Shared form fields ----------
  const formContent = (
    <div className="space-y-5">
      {/* Category */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                category === c.value
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-base">{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description & Amount */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">What was it for?</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g., Dinner, Cab, Tickets"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">How much?</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-muted-foreground">{currency}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="h-12 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Paid by */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Who paid?</label>
        <div className="flex gap-2 flex-wrap">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => setPaidBy(p.id)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                paidBy === p.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {p.avatar} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split type */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">How to split?</label>
        <div className="space-y-2">
          {SPLIT_LABELS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSplitType(s.value)}
              className={`w-full min-h-[52px] flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                splitType === s.value
                  ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                  : "bg-secondary/50 border border-border hover:bg-secondary"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                splitType === s.value ? "border-primary bg-primary" : "border-muted-foreground/40"
              }`}>
                {splitType === s.value && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${splitType === s.value ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground/70">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Split among */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Split among</label>
        <div className="flex gap-2 flex-wrap">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleSplitPerson(p.id)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                splitAmong.includes(p.id)
                  ? "bg-positive/15 text-positive ring-1 ring-positive/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {p.avatar} {p.name}
            </button>
          ))}
        </div>
        {perPersonAmount && (
          <p className="text-xs text-primary mt-2 animate-fade-in">
            💡 {currency}{perPersonAmount} per person
          </p>
        )}
      </div>

      {/* Custom amounts for unequal */}
      {splitType === "unequal" && (
        <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border animate-scale-in">
          <p className="text-xs font-medium text-muted-foreground">
            Enter how much each person owes (total should be {currency}{amtNum.toFixed(2)})
          </p>
          {splitAmong.map((id) => (
            <div key={id} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-24 truncate">{getName(id)}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{currency}</span>
                <input
                  type="number"
                  value={customAmounts[id] || ""}
                  onChange={(e) => setCustomAmounts({ ...customAmounts, [id]: e.target.value })}
                  placeholder="0.00"
                  className="w-full h-12 rounded-xl border border-input bg-background pl-7 pr-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50"
                />
              </div>
            </div>
          ))}
          {amtNum > 0 && Math.abs(customTotal - amtNum) > 0.01 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              ⚠️ Total: {currency}{customTotal.toFixed(2)} — off by {currency}{Math.abs(customTotal - amtNum).toFixed(2)}
            </p>
          )}
        </div>
      )}

      {/* Percentages */}
      {splitType === "percentage" && (
        <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border animate-scale-in">
          <p className="text-xs font-medium text-muted-foreground">Enter percentages (should total 100%)</p>
          {splitAmong.map((id) => (
            <div key={id} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-24 truncate">{getName(id)}</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  value={customPcts[id] || ""}
                  onChange={(e) => setCustomPcts({ ...customPcts, [id]: e.target.value })}
                  placeholder="0"
                  className="w-full h-12 rounded-xl border border-input bg-background px-3 pr-8 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
          {Math.abs(pctTotal - 100) > 0.01 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              ⚠️ Total: {pctTotal.toFixed(1)}% — should be 100%
            </p>
          )}
        </div>
      )}

      <Button
        onClick={addExpense}
        disabled={!isFormValid}
        className="w-full h-14 rounded-xl gap-2 text-base font-semibold"
      >
        <Plus className="h-5 w-5" />
        Add Expense
      </Button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-heading">Add expenses</h3>
        <p className="text-sm text-muted-foreground">What did you spend on? Who paid?</p>
      </div>

      {/* Mobile: show FAB + drawer | Desktop: show inline form */}
      {isMobile ? (
        <>
          {/* Quick add FAB */}
          <Button
            onClick={() => setDrawerOpen(true)}
            className="w-full h-14 rounded-2xl gap-2.5 text-base font-semibold shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
            Add New Expense
          </Button>

          {/* Bottom sheet drawer */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="max-h-[92vh]">
              <DrawerHeader className="flex items-center justify-between pb-2">
                <DrawerTitle className="text-base font-bold text-heading">New Expense</DrawerTitle>
                <DrawerClose asChild>
                  <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </DrawerClose>
              </DrawerHeader>
              <div className="px-4 pb-6 overflow-y-auto">
                {formContent}
              </div>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <div className="p-5 rounded-2xl bg-card border border-border">
          {formContent}
        </div>
      )}

      {/* Expense list */}
      {expenses.length === 0 ? (
        <div className="text-center py-8 animate-fade-in">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No expenses yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {isMobile ? "Tap the button above to add one 👆" : "Fill in the form above to add one 👆"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-1">
            {expenses.length} expense{expenses.length !== 1 ? "s" : ""} · Total: {currency}
            {expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
          </p>
          {expenses.map((e, i) => {
            const cat = CATEGORIES.find((c) => c.value === e.category);
            return (
              <div
                key={e.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border group animate-fade-slide-up hover:border-primary/20 transition-colors"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="text-2xl shrink-0">{cat?.emoji || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{e.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getName(e.paidBy)} paid · {e.splitType === "equal" ? "Split equally" : e.splitType === "unequal" ? "Custom amounts" : "By percentage"}
                  </p>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0">{currency}{e.amount.toFixed(2)}</span>
                <button
                  onClick={() => removeExpense(e.id)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  aria-label="Remove expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
