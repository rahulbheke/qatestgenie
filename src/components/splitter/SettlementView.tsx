import { Settlement, Participant, Currency, fmt } from "@/lib/billSplitter";
import { ArrowRight, Sparkles, PartyPopper } from "lucide-react";

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
      <div className="text-center py-10 animate-scale-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-positive/10 mb-4">
          <PartyPopper className="h-8 w-8 text-positive" />
        </div>
        <p className="text-lg font-bold text-positive">All settled! 🎉</p>
        <p className="text-sm text-muted-foreground mt-1">No payments needed — everyone's even</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-heading">Smart Settlements</h3>
        <p className="text-sm text-muted-foreground">
          Optimized to just {settlements.length} payment{settlements.length !== 1 ? "s" : ""}
        </p>
      </div>

      {settlements.map((s, i) => (
        <div
          key={i}
          className="p-4 sm:p-5 rounded-2xl bg-card border border-border animate-fade-slide-up hover:border-primary/20 transition-colors"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* From */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-2xl shrink-0">{getAvatar(s.from)}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{getName(s.from)}</p>
                <p className="text-xs text-destructive font-medium">Pays</p>
              </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col items-center gap-1 shrink-0 px-2">
              <span className="text-base sm:text-lg font-bold text-primary">
                {fmt(s.amount, currency)}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* To */}
            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{getName(s.to)}</p>
                <p className="text-xs text-positive font-medium">Receives</p>
              </div>
              <span className="text-2xl shrink-0">{getAvatar(s.to)}</span>
            </div>
          </div>

          {/* Simple text */}
          <p className="text-xs text-muted-foreground text-center mt-3 pt-3 border-t border-border">
            {getName(s.from)} pays {getName(s.to)} {fmt(s.amount, currency)}
          </p>
        </div>
      ))}
    </div>
  );
}
