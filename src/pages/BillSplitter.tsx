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
  ArrowLeft, RotateCcw, ChevronRight, ChevronLeft,
  Sparkles, Sun, Moon, Wallet, Users, Receipt, BarChart3, Check,
} from "lucide-react";

const CURRENCIES: Currency[] = ["₹", "$", "€", "£"];

const STEPS = [
  { id: 0, label: "People", icon: Users, desc: "Add participants" },
  { id: 1, label: "Expenses", icon: Receipt, desc: "Add what you spent" },
  { id: 2, label: "Results", icon: BarChart3, desc: "See who pays whom" },
];

export default function BillSplitter() {
  const [data, setData] = useState<BillData>(() => loadFromStorage() || { participants: [], expenses: [], currency: "₹" });
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(!document.documentElement.classList.contains("light"));

  useEffect(() => { saveToStorage(data); }, [data]);

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
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-2xl py-3 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-heading tracking-tight leading-none">Smart Split</h1>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Bill Splitter</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl px-4 py-6 sm:py-8 pb-32">
        {/* Progress steps */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <button
                  onClick={() => setStep(s.id)}
                  className="flex flex-col items-center gap-1.5 group flex-1"
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                      : isDone
                      ? "bg-positive/15 text-positive"
                      : "bg-secondary text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-semibold leading-none ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 hidden sm:block">{s.desc}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded-full transition-colors ${
                    step > i ? "bg-positive/40" : "bg-border"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Currency & actions */}
        <div className="flex items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-1 bg-card rounded-xl border border-border p-1">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all active:scale-90 ${
                  data.currency === c
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm" onClick={loadDemo} className="text-xs gap-1.5 rounded-xl h-9">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Try Demo</span>
              <span className="sm:hidden">Demo</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5 text-destructive hover:text-destructive rounded-xl h-9">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Start Over</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {step === 0 && (
            <div className="animate-fade-slide-up">
              <ParticipantManager participants={data.participants} onChange={updateParticipants} />
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-slide-up">
              <ExpenseForm
                participants={data.participants}
                expenses={data.expenses}
                currency={data.currency}
                onChange={updateExpenses}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-slide-up">
              <SettlementView settlements={settlements} participants={data.participants} currency={data.currency} />
              <Dashboard data={data} />
              <ExportShare data={data} settlements={settlements} />
            </div>
          )}
        </div>
      </main>

      {/* Sticky bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-3 sm:p-4 z-10">
        <div className="container max-w-2xl flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="h-12 rounded-xl gap-2 flex-1 text-sm font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
              {STEPS[step - 1]?.label}
            </Button>
          )}
          {step === 0 && (
            <Button
              onClick={() => setStep(1)}
              disabled={!canProceedToExpenses}
              className="h-12 rounded-xl gap-2 flex-1 text-sm font-semibold"
            >
              {canProceedToExpenses ? "Add Expenses" : `Add ${2 - data.participants.length} more people`}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {step === 1 && (
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedToResults}
              className="h-12 rounded-xl gap-2 flex-1 text-sm font-semibold"
            >
              {canProceedToResults ? "View Results" : "Add an expense first"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="h-12 rounded-xl gap-2 flex-1 text-sm font-semibold"
            >
              Edit Expenses
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
