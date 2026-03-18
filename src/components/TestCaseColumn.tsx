import type { TestCase } from "@/lib/generateTestCases";
import TestCaseCard from "./TestCaseCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TestCaseColumnProps {
  title: string;
  type: "positive" | "negative" | "edge";
  cases: TestCase[];
}

const typeStyles = {
  positive: "bg-positive/10 text-positive border-positive/20",
  negative: "bg-destructive/10 text-destructive border-destructive/20",
  edge: "bg-warning/10 text-warning border-warning/20",
} as const;

const TestCaseColumn = ({ title, type, cases }: TestCaseColumnProps) => {
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
          <TestCaseCard key={tc.id} testCase={tc} index={i} />
        ))}
      </div>
    </div>
  );
};

export default TestCaseColumn;
