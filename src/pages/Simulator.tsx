import { useState, useCallback } from "react";
import { FlaskConical, Sparkles, Sun, Moon, TestTubes } from "lucide-react";
import { Link } from "react-router-dom";
import StrategyInputForm from "@/components/StrategyInputForm";
import StrategyOutput from "@/components/StrategyOutput";
import { generateStrategy, type StrategyResult, type AppType, type TestingType } from "@/lib/generateStrategy";

const Simulator = () => {
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("light");
  };

  const handleGenerate = useCallback((appType: AppType, testingType: TestingType, module: string) => {
    setIsLoading(true);
    setResult(null);

    // Simulate a brief loading delay for UX
    setTimeout(() => {
      const strategyResult = generateStrategy(appType, testingType, module);
      setResult(strategyResult);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl py-3.5 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <FlaskConical className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-base font-semibold text-heading tracking-tight">Test Automation Simulator</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Hero / Input */}
      <section className="container max-w-3xl pt-10 sm:pt-14 pb-8 text-center px-4 sm:px-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
          <Sparkles className="h-3 w-3" />
          QA Strategy Generator
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight mb-2">
          Simulate Your Test Automation Strategy
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
          Select your application type and testing approach to get a tailored automation strategy with test cases, tool recommendations, and an execution plan.
        </p>

        <div className="text-left">
          <StrategyInputForm
            onGenerate={handleGenerate}
            isLoading={isLoading}
            hasResults={!!result}
          />
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="container max-w-5xl pb-16 px-4 sm:px-6">
          <div className="border-t border-border pt-8 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Analyzing inputs and generating strategy…</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <section className="container max-w-5xl pb-16 px-4 sm:px-6">
          <StrategyOutput result={result} />
        </section>
      )}
    </div>
  );
};

export default Simulator;
