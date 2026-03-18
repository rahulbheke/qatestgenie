import { useState } from "react";
import { Button } from "@/components/ui/button";
import CollapsibleSection from "./CollapsibleSection";
import { ClipboardCopy, Check, FileSpreadsheet, ListChecks, Brain, Wrench, GitBranch } from "lucide-react";
import { formatStrategyAsText, type StrategyResult } from "@/lib/generateStrategy";
import * as XLSX from "xlsx";

interface Props {
  result: StrategyResult;
}

const StrategyOutput = ({ result }: Props) => {
  const [copied, setCopied] = useState(false);

  const total = result.testCases.length;

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(formatStrategyAsText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Test Cases sheet
    const tcRows = result.testCases.map((tc) => ({
      ID: tc.id,
      Scenario: tc.scenario,
      Steps: tc.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
      "Expected Result": tc.expected,
    }));
    const ws1 = XLSX.utils.json_to_sheet(tcRows);
    ws1["!cols"] = [{ wch: 10 }, { wch: 50 }, { wch: 50 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Test Cases");

    // Strategy sheet
    const stratRows = [
      ...result.strategy.automateFirst.map((a) => ({ Category: "Automate First", Item: a })),
      ...result.strategy.keepManual.map((m) => ({ Category: "Keep Manual", Item: m })),
      ...result.strategy.riskAreas.map((r) => ({ Category: "Risk Areas", Item: r })),
    ];
    const ws2 = XLSX.utils.json_to_sheet(stratRows);
    ws2["!cols"] = [{ wch: 18 }, { wch: 70 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Strategy");

    // Tools sheet
    const toolRows = result.tools.map((t) => ({ Tool: t.name, Purpose: t.purpose }));
    const ws3 = XLSX.utils.json_to_sheet(toolRows);
    ws3["!cols"] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws3, "Tools");

    // Execution Plan sheet
    const planRows = [
      ...result.executionPlan.pipeline.map((p) => ({ Section: "Pipeline", Detail: p })),
      { Section: "Frequency", Detail: result.executionPlan.frequency },
      ...result.executionPlan.environments.map((e) => ({ Section: "Environment", Detail: e })),
    ];
    const ws4 = XLSX.utils.json_to_sheet(planRows);
    ws4["!cols"] = [{ wch: 15 }, { wch: 70 }];
    XLSX.utils.book_append_sheet(wb, ws4, "Execution Plan");

    XLSX.writeFile(wb, "automation-strategy.xlsx");
  };

  return (
    <div className="border-t border-border pt-8 space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {total} test cases • 4 strategy sections generated
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-positive" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy All"}
          </Button>
        </div>
      </div>

      {/* Test Cases */}
      <CollapsibleSection title="Test Cases" icon={<ListChecks className="h-4 w-4" />} badge={`${total} cases`} delay={0}>
        <div className="space-y-3">
          {result.testCases.map((tc) => (
            <div key={tc.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-mono-code font-medium px-2 py-0.5 rounded bg-primary/15 text-primary shrink-0 mt-0.5">
                  {tc.id}
                </span>
                <p className="text-sm font-medium text-heading leading-snug">{tc.scenario}</p>
              </div>
              <div className="ml-[52px] space-y-1.5">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Steps</p>
                  <ol className="space-y-0.5">
                    {tc.steps.map((step, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex gap-2">
                        <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Expected</p>
                  <p className="text-xs text-positive">{tc.expected}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Automation Strategy */}
      <CollapsibleSection title="Automation Strategy" icon={<Brain className="h-4 w-4" />} delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-positive uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-positive" /> Automate First
            </h4>
            <ul className="space-y-1.5">
              {result.strategy.automateFirst.map((item, i) => (
                <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-warning uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" /> Keep Manual
            </h4>
            <ul className="space-y-1.5">
              {result.strategy.keepManual.map((item, i) => (
                <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive" /> Risk Areas
            </h4>
            <ul className="space-y-1.5">
              {result.strategy.riskAreas.map((item, i) => (
                <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      {/* Recommended Tools */}
      <CollapsibleSection title="Recommended Tools" icon={<Wrench className="h-4 w-4" />} delay={200}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.tools.map((tool) => (
            <div key={tool.name} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3.5">
              <span className="text-xl shrink-0">{tool.icon}</span>
              <div>
                <p className="text-sm font-semibold text-heading">{tool.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{tool.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Execution Plan */}
      <CollapsibleSection title="Execution Plan" icon={<GitBranch className="h-4 w-4" />} delay={300}>
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CI/CD Pipeline</h4>
            <div className="space-y-2">
              {result.executionPlan.pipeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-foreground/80">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 text-[10px] font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg border border-border bg-secondary/30 p-3.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Frequency</p>
              <p className="text-xs text-foreground/90">{result.executionPlan.frequency}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Environments</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {result.executionPlan.environments.map((env) => (
                  <span key={env} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {env}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default StrategyOutput;
