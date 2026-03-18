import { useState } from "react";
import { Button } from "@/components/ui/button";
import TestCaseColumn from "@/components/TestCaseColumn";
import { generateTestCases, type GeneratedTests } from "@/lib/generateTestCases";
import { FlaskConical } from "lucide-react";

const Index = () => {
  const [feature, setFeature] = useState("");
  const [results, setResults] = useState<GeneratedTests | null>(null);

  const handleGenerate = () => {
    if (!feature.trim()) return;
    setResults(generateTestCases(feature));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl py-4 flex items-center gap-2.5">
          <FlaskConical className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold text-heading tracking-tight">
            TestGen
          </h1>
        </div>
      </header>

      {/* Input Section */}
      <section className="container max-w-3xl pt-16 pb-10 text-center">
        <h2 className="text-2xl font-bold text-heading tracking-tight mb-2">
          Generate Test Cases
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Describe a feature and get structured positive, negative, and edge-case scenarios instantly.
        </p>

        <div className="text-left">
          <textarea
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. User registration with email and password"
            className="w-full min-h-[120px] rounded-lg border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y font-mono-code"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              ⌘ + Enter to generate
            </span>
            <Button
              variant="action"
              size="lg"
              onClick={handleGenerate}
              disabled={!feature.trim()}
            >
              Generate Test Cases
            </Button>
          </div>
        </div>
      </section>

      {/* Results */}
      {results && (
        <section className="container max-w-6xl pb-16">
          <div className="border-t border-border pt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestCaseColumn title="Happy Path" type="positive" cases={results.positive} />
              <TestCaseColumn title="Error Handling" type="negative" cases={results.negative} />
              <TestCaseColumn title="Boundary" type="edge" cases={results.edge} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
