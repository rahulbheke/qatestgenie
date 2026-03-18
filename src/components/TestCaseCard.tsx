import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { TestCase } from "@/lib/generateTestCases";
import { formatTestCase } from "@/lib/generateTestCases";
import { cn } from "@/lib/utils";

interface TestCaseCardProps {
  testCase: TestCase;
  index: number;
}

const severityStyles: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-warning/15 text-warning border-warning/30",
  medium: "bg-primary/15 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

const TestCaseCard = ({ testCase, index }: TestCaseCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatTestCase(testCase));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-5 opacity-0 animate-fade-slide-up hover:border-primary/20 transition-colors group relative"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono-code text-muted-foreground">{testCase.id}</span>
          <h4 className="font-semibold text-heading text-sm mt-0.5">{testCase.title}</h4>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-positive" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", severityStyles[testCase.severity])}>
          {testCase.severity}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold font-mono-code bg-secondary text-secondary-foreground border border-border">
          {testCase.priority}
        </span>
      </div>

      {/* Steps */}
      <div className="mb-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Steps</p>
        <ol className="space-y-1">
          {testCase.steps.map((step, i) => (
            <li key={i} className="text-sm font-mono-code text-foreground/70 flex gap-2">
              <span className="text-muted-foreground select-none shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Expected */}
      <div>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Expected Result</p>
        <p className="text-sm font-mono-code text-foreground/70">{testCase.expected}</p>
      </div>
    </div>
  );
};

export default TestCaseCard;
