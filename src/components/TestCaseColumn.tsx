import type { TestCase } from "@/lib/generateTestCases";
import type { CardMeta } from "@/pages/Index";
import TestCaseCard from "./TestCaseCard";
import { cn } from "@/lib/utils";

interface TestCaseColumnProps {
  title: string;
  type: "positive" | "negative" | "edge";
  cases: TestCase[];
  cardMeta: Record<string, CardMeta>;
  onUpdateMeta: (id: string, update: Partial<CardMeta>) => void;
}

const typeStyles = {
  positive: "bg-positive/10 text-positive border-positive/20",
  negative: "bg-destructive/10 text-destructive border-destructive/20",
  edge: "bg-warning/10 text-warning border-warning/20",
} as const;

const TestCaseColumn = ({ title, type, cases, cardMeta, onUpdateMeta }: TestCaseColumnProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            typeStyles[type]
          )}
        >
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{cases.length} cases</span>
      </div>
      <div className="space-y-3">
        {cases.map((tc, i) => (
          <TestCaseCard
            key={tc.id}
            testCase={tc}
            index={i}
            meta={cardMeta[tc.id] || { validity: null, feedback: "" }}
            onUpdateMeta={(update) => onUpdateMeta(tc.id, update)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestCaseColumn;
