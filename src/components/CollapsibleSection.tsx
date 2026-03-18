import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  delay?: number;
}

const CollapsibleSection = ({ title, icon, badge, defaultOpen = true, children, delay = 0 }: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden animate-fade-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary">{icon}</span>
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
          {badge && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
