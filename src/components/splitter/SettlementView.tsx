import { Settlement, Participant, Currency, fmt } from "@/lib/billSplitter";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  settlements: Settlement[];
  participants: Participant[];
  currency: Currency;
}

export default function SettlementView({ settlements, participants, currency }: Props) {
  const getName = (id: string) => participants.find((p) => p.id === id)?.name || "?";
  const getAvatar = (id: string) => participants.find((p) => p.id === id)?.avatar || "😀";

  if (settlements.length === 0) {
    return (
      <div className="text-center py-8">
        <Sparkles className="h-8 w-8 text-positive mx-auto mb-3" />
        <p className="text-sm font-medium text-positive">All settled!</p>
        <p className="text-xs text-muted-foreground mt-1">No payments needed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-heading">Smart Settlements</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {settlements.length} transaction{settlements.length !== 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Optimized for minimum transactions</p>

      {settlements.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border animate-fade-slide-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* From */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">{getAvatar(s.from)}</span>
            <span className="text-sm font-medium text-destructive truncate">{getName(s.from)}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground whitespace-nowrap">
              {fmt(s.amount, currency)}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* To */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">{getAvatar(s.to)}</span>
            <span className="text-sm font-medium text-positive truncate">{getName(s.to)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
