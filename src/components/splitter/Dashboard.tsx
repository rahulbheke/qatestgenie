import { BillData, calculateBalances, getTotalSpent, Currency, fmt } from "@/lib/billSplitter";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";

interface Props {
  data: BillData;
}

const CHART_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 55%)",
  "hsl(280, 70%, 55%)",
  "hsl(190, 80%, 45%)",
];

export default function Dashboard({ data }: Props) {
  const balances = calculateBalances(data);
  const totalSpent = getTotalSpent(data);
  const grandTotal = data.expenses.reduce((s, e) => s + e.amount, 0);

  const balanceData = data.participants.map((p) => ({
    name: p.name,
    avatar: p.avatar,
    balance: Math.round((balances[p.id] || 0) * 100) / 100,
    spent: totalSpent[p.id] || 0,
  }));

  const spentData = data.participants.map((p, i) => ({
    name: p.name,
    value: totalSpent[p.id] || 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })).filter((d) => d.value > 0);

  const categoryTotals: Record<string, number> = {};
  data.expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const categoryEmoji: Record<string, string> = {
    food: "🍕", travel: "🚗", accommodation: "🏨",
    entertainment: "🎬", shopping: "🛍️", other: "📦",
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-heading">Spending Overview</h3>
      </div>

      {/* Grand total */}
      <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-center animate-scale-in">
        <p className="text-xs font-medium text-muted-foreground mb-1">Total Expenses</p>
        <p className="text-3xl font-bold text-primary">{fmt(grandTotal, data.currency)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          split among {data.participants.length} people
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 gap-3">
        {balanceData.map((p, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border animate-fade-slide-up ${
              p.balance > 0.01
                ? "bg-positive/5 border-positive/20"
                : p.balance < -0.01
                ? "bg-destructive/5 border-destructive/20"
                : "bg-card border-border"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{p.avatar}</span>
              <span className="text-sm font-semibold text-foreground truncate">{p.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Spent {fmt(p.spent, data.currency)}
            </p>
            <p className={`text-sm font-bold mt-1 ${
              p.balance > 0.01 ? "text-positive" : p.balance < -0.01 ? "text-destructive" : "text-muted-foreground"
            }`}>
              {p.balance > 0.01
                ? `Gets back ${fmt(p.balance, data.currency)}`
                : p.balance < -0.01
                ? `Owes ${fmt(p.balance, data.currency)}`
                : "All settled ✓"}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {spentData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Spending Share</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={spentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {spentData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip
                  formatter={(value: number) => fmt(value, data.currency)}
                  contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "12px", fontSize: "12px", color: "hsl(210, 20%, 90%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {spentData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Net Balance</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={balanceData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} width={50} />
                <Tooltip
                  formatter={(value: number) => fmt(value, data.currency)}
                  contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "12px", fontSize: "12px", color: "hsl(210, 20%, 90%)" }}
                />
                <Bar dataKey="balance" radius={[0, 6, 6, 0]}>
                  {balanceData.map((d, i) => (
                    <Cell key={i} fill={d.balance >= 0 ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 55%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="p-4 rounded-2xl bg-card border border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-4">By Category</p>
          <div className="space-y-3">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, total]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{categoryEmoji[cat] || "📦"}</span>
                  <span className="text-sm text-foreground capitalize flex-1">{cat}</span>
                  <span className="text-sm font-bold text-foreground">{fmt(total, data.currency)}</span>
                  <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(total / grandTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
