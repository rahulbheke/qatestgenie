import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticipantManager from "@/components/splitter/ParticipantManager";
import ExpenseForm from "@/components/splitter/ExpenseForm";
import SettlementView from "@/components/splitter/SettlementView";
import Dashboard from "@/components/splitter/Dashboard";
import ExportShare from "@/components/splitter/ExportShare";
import {
  BillData, Currency, Participant, Expense,
  calculateBalances, minimizeSettlements,
  saveToStorage, loadFromStorage, clearStorage, getDemoData,
} from "@/lib/billSplitter";
import {
  Receipt, ArrowLeft, RotateCcw, Users, ChevronRight,
  BarChart3, Sparkles, Sun, Moon, Wallet,
} from "lucide-react";

const CURRENCIES: Currency[] = ["₹", "$", "€", "£"];

const STEPS = [
  { id: 0, label: "People", icon: Users },
  { id: 1, label: "Expenses", icon: Receipt },
  { id: 2, label: "Results", icon: BarChart3 },
];

export default function BillSplitter() {
  const [data, setData] = useState<BillData>(() => loadFromStorage() || { participants: [], expenses: [], currency: "₹" });
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(!document.documentElement.classList.contains("light"));

  // Persist on every change
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const balances = useMemo(() => calculateBalances(data), [data]);
  const settlements = useMemo(() => minimizeSettlements(balances), [balances]);

  const updateParticipants = (participants: Participant[]) => setData((d) => ({ ...d, participants }));
  const updateExpenses = (expenses: Expense[]) => setData((d) => ({ ...d, expenses }));
  const setCurrency = (currency: Currency) => setData((d) => ({ ...d, currency }));

  const handleReset = () => {
    clearStorage();
    setData({ participants: [], expenses: [], currency: "₹" });
    setStep(0);
  };

  const loadDemo = () => {
    const demo = getDemoData();
    setData(demo);
    setStep(2);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("light");
  };

  const canProceedToExpenses = data.participants.length >= 2;
  const canProceedToResults = data.expenses.length >= 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl py-3 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-base font-semibold text-heading tracking-tight">Smart Split</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-6 sm:py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : isDone
                      ? "bg-positive/15 text-positive"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                )}
              </div>
            );
          })}
        </div>

        {/* Currency selector & actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  data.currency === c
                    ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm" onClick={loadDemo} className="text-xs gap-1">
              <Sparkles className="h-3 w-3" />
              Demo
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1 text-destructive hover:text-destructive">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {step === 0 && (
            <div className="space-y-6 animate-fade-slide-up">
              <ParticipantManager participants={data.participants} onChange={updateParticipants} />
              {canProceedToExpenses && (
                <Button onClick={() => setStep(1)} className="w-full gap-1.5">
                  Next: Add Expenses
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {!canProceedToExpenses && data.participants.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">Add at least 2 people to continue</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-slide-up">
              <ExpenseForm
                participants={data.participants}
                expenses={data.expenses}
                currency={data.currency}
                onChange={updateExpenses}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  People
                </Button>
                {canProceedToResults && (
                  <Button onClick={() => setStep(2)} className="flex-1 gap-1.5">
                    View Results
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-slide-up">
              <SettlementView settlements={settlements} participants={data.participants} currency={data.currency} />
              <Dashboard data={data} />
              <ExportShare data={data} settlements={settlements} />
              <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Edit Expenses
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
