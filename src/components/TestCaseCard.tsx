import type { TestCase } from "@/lib/generateTestCases";
import { cn } from "@/lib/utils";

interface TestCaseCardProps {
  testCase: TestCase;
  index: number;
}

const TestCaseCard = ({ testCase, index }: TestCaseCardProps) => {
  return (
    <div
      className="bg-card border border-border rounded-lg p-5 opacity-0 animate-fade-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <h4 className="font-semibold text-card-foreground text-sm mb-3">
        {testCase.title}
      </h4>

      <div className="mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
          Steps
        </p>
        <ol className="space-y-1">
          {testCase.steps.map((step, i) => (
            <li key={i} className="text-sm font-mono-code text-foreground/80 flex gap-2">
              <span className="text-muted-foreground select-none">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
          Expected Result
        </p>
        <p className="text-sm font-mono-code text-foreground/80">
          {testCase.expected}
        </p>
      </div>
    </div>
  );
};

export default TestCaseCard;
