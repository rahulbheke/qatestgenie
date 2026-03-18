import { useState } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { TestCase } from "@/lib/generateTestCases";
import type { CardMeta } from "@/pages/Index";
import { formatTestCase } from "@/lib/generateTestCases";
import { cn } from "@/lib/utils";

interface TestCaseCardProps {
  testCase: TestCase;
  index: number;
  meta: CardMeta;
  onUpdateMeta: (update: Partial<CardMeta>) => void;
}

const severityStyles: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-warning/15 text-warning border-warning/30",
  medium: "bg-primary/15 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

const TestCaseCard = ({ testCase, index, meta, onUpdateMeta }: TestCaseCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState(meta.feedback);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatTestCase(testCase));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveFeedback = () => {
    if (!feedbackDraft.trim()) return;
    onUpdateMeta({ feedback: feedbackDraft.trim() });
    setShowFeedback(false);
  };

  const borderByValidity =
    meta.validity === "valid"
      ? "border-positive/40"
      : meta.validity === "invalid"
        ? "border-destructive/40"
        : "border-border";

  return (
    <div
      className={cn(
        "bg-card border rounded-lg p-5 opacity-0 animate-fade-slide-up hover:border-primary/20 transition-all group relative",
        borderByValidity
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Validity ribbon */}
      {meta.validity && (
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5 rounded-t-lg",
            meta.validity === "valid" ? "bg-positive" : "bg-destructive"
          )}
        />
      )}

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
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border",
            severityStyles[testCase.severity]
          )}
        >
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
      <div className="mb-4">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Expected Result</p>
        <p className="text-sm font-mono-code text-foreground/70">{testCase.expected}</p>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-1 pt-3 border-t border-border">
        <button
          onClick={() => onUpdateMeta({ validity: meta.validity === "valid" ? null : "valid" })}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
            meta.validity === "valid"
              ? "bg-positive/15 text-positive"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
          title="Mark as valid"
        >
          <ThumbsUp className="h-3 w-3" />
          Valid
        </button>
        <button
          onClick={() => onUpdateMeta({ validity: meta.validity === "invalid" ? null : "invalid" })}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
            meta.validity === "invalid"
              ? "bg-destructive/15 text-destructive"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
          title="Mark as not valid"
        >
          <ThumbsDown className="h-3 w-3" />
          Not Valid
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
            meta.feedback
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
          title="Add feedback"
        >
          <MessageSquare className="h-3 w-3" />
          {meta.feedback ? "Feedback added" : "Feedback"}
        </button>
      </div>

      {/* Feedback input */}
      {showFeedback && (
        <div className="mt-3 space-y-2 animate-fade-slide-up" style={{ animationDelay: "0ms" }}>
          <textarea
            value={feedbackDraft}
            onChange={(e) => setFeedbackDraft(e.target.value)}
            placeholder="Describe what's wrong or suggest improvements…"
            className="w-full min-h-[72px] rounded-md border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/50 resize-y font-mono-code"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowFeedback(false)}
              className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveFeedback}
              disabled={!feedbackDraft.trim()}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Save Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseCard;
