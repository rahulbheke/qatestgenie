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

  const getName = (id: string) => data.participants.find((p) => p.id === id)?.name || "?";

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

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  data.expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const categoryEmoji: Record<string, string> = {
    food: "🍕", travel: "🚗", accommodation: "🏨",
    entertainment: "🎬", shopping: "🛍️", other: "📦",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-heading">Dashboard</h3>
      </div>

      {/* Grand total */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
        <p className="text-xs text-muted-foreground">Total Expenses</p>
        <p className="text-2xl font-bold text-primary">{fmt(grandTotal, data.currency)}</p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 gap-2">
        {balanceData.map((p, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border animate-fade-slide-up ${
              p.balance > 0.01
                ? "bg-positive/5 border-positive/20"
                : p.balance < -0.01
                ? "bg-destructive/5 border-destructive/20"
                : "bg-card border-border"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{p.avatar}</span>
              <span className="text-xs font-medium text-foreground truncate">{p.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">Spent: {fmt(p.spent, data.currency)}</p>
            <p className={`text-sm font-bold ${
              p.balance > 0.01 ? "text-positive" : p.balance < -0.01 ? "text-destructive" : "text-muted-foreground"
            }`}>
              {p.balance > 0.01 ? `Gets back ${fmt(p.balance, data.currency)}` :
               p.balance < -0.01 ? `Owes ${fmt(p.balance, data.currency)}` : "Settled"}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {spentData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pie chart - spending share */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Spending Share</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={spentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {spentData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip
                  formatter={(value: number) => fmt(value, data.currency)}
                  contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 20%, 90%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {spentData.map((d, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart - balances */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Net Balance</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={balanceData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} width={50} />
                <Tooltip
                  formatter={(value: number) => fmt(value, data.currency)}
                  contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 20%, 90%)" }}
                />
                <Bar dataKey="balance" radius={[0, 4, 4, 0]}>
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
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">By Category</p>
          <div className="space-y-2">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, total]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="text-sm">{categoryEmoji[cat] || "📦"}</span>
                  <span className="text-xs text-foreground capitalize flex-1">{cat}</span>
                  <span className="text-xs font-semibold text-foreground">{fmt(total, data.currency)}</span>
                  <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
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
