import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, RotateCcw } from "lucide-react";
import type { AppType, TestingType } from "@/lib/generateStrategy";

interface Props {
  onGenerate: (appType: AppType, testingType: TestingType, module: string) => void;
  isLoading: boolean;
  hasResults: boolean;
}

const StrategyInputForm = ({ onGenerate, isLoading, hasResults }: Props) => {
  const [appType, setAppType] = useState<AppType | "">("");
  const [testingType, setTestingType] = useState<TestingType | "">("");
  const [module, setModule] = useState("");

  const canGenerate = appType && testingType && !isLoading;

  const handleSubmit = () => {
    if (!canGenerate) return;
    onGenerate(appType as AppType, testingType as TestingType, module.trim());
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Application Type</label>
          <Select value={appType} onValueChange={(v) => setAppType(v as AppType)}>
            <SelectTrigger className="bg-card border-input h-11">
              <SelectValue placeholder="Select app type…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">🌐 Web Application</SelectItem>
              <SelectItem value="mobile">📱 Mobile Application</SelectItem>
              <SelectItem value="api">⚡ API</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Testing Type</label>
          <Select value={testingType} onValueChange={(v) => setTestingType(v as TestingType)}>
            <SelectTrigger className="bg-card border-input h-11">
              <SelectValue placeholder="Select testing type…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regression">🔄 Regression Testing</SelectItem>
              <SelectItem value="smoke">💨 Smoke Testing</SelectItem>
              <SelectItem value="sanity">✅ Sanity Testing</SelectItem>
              <SelectItem value="api">🔌 API Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Feature / Module Name <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <input
          value={module}
          onChange={(e) => setModule(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="e.g. User Registration, Payment Gateway, Search API"
          className="w-full h-11 rounded-lg border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50 transition-all"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-muted-foreground hidden sm:inline">Press Enter to generate</span>
        <Button
          variant="action"
          size="lg"
          onClick={handleSubmit}
          disabled={!canGenerate}
          className="w-full sm:w-auto gap-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating…
            </>
          ) : hasResults ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Regenerate Strategy
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate Strategy
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StrategyInputForm;
