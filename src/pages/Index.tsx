import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import TestCaseColumn from "@/components/TestCaseColumn";
import { generateTestCases, formatAllTestCases, mergeGeneratedTests, type GeneratedTests } from "@/lib/generateTestCases";
import { FlaskConical, Sparkles, ClipboardCopy, Check, Info, FileSpreadsheet, Upload, X } from "lucide-react";
import * as XLSX from "xlsx";

const legend = [
  { label: "P0 / Critical", color: "bg-destructive", desc: "Must test — blocks release" },
  { label: "P1 / High", color: "bg-warning", desc: "Should test — major impact" },
  { label: "P2 / Medium", color: "bg-primary", desc: "Nice to test — moderate impact" },
  { label: "P3 / Low", color: "bg-muted-foreground", desc: "Optional — minimal impact" },
];

export type Validity = "valid" | "invalid" | null;
export interface CardMeta {
  validity: Validity;
  feedback: string;
}

const Index = () => {
  const [feature, setFeature] = useState("");
  const [results, setResults] = useState<GeneratedTests | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [uploadedFeatures, setUploadedFeatures] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cardMeta, setCardMeta] = useState<Record<string, CardMeta>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCardMeta = (id: string, update: Partial<CardMeta>) => {
    setCardMeta((prev) => ({
      ...prev,
      [id]: { validity: null, feedback: "", ...prev[id], ...update },
    }));
  };

  const handleGenerate = () => {
    const manualFeatures = feature.trim() ? [feature.trim()] : [];
    const allFeatures = [...manualFeatures, ...uploadedFeatures];
    if (allFeatures.length === 0) return;

    const allResults = allFeatures.map((f) => generateTestCases(f));
    setResults(mergeGeneratedTests(allResults));
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet);

      const featureKeys = Object.keys(rows[0] || {});
      const key =
        featureKeys.find((k) =>
          /feature|requirement|description|title|name|story/i.test(k)
        ) || featureKeys[0];

      if (key) {
        const features = rows
          .map((row) => String(row[key] || "").trim())
          .filter(Boolean);
        setUploadedFeatures(features);
        setFileName(file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && /\.(xlsx|xls|csv)$/i.test(file.name)) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClearFile = () => {
    setUploadedFeatures([]);
    setFileName(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  const handleCopyAll = async () => {
    if (!results) return;
    await navigator.clipboard.writeText(formatAllTestCases(results));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1500);
  };

  const handleExportExcel = () => {
    if (!results) return;
    const allCases = [
      ...results.positive.map((tc) => ({ ...tc, category: "Happy Path" })),
      ...results.negative.map((tc) => ({ ...tc, category: "Error Handling" })),
      ...results.edge.map((tc) => ({ ...tc, category: "Boundary" })),
    ];
    const rows = allCases.map((tc) => ({
      ID: tc.id,
      Category: tc.category,
      Title: tc.title,
      Priority: tc.priority,
      Severity: tc.severity,
      Steps: tc.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
      "Expected Result": tc.expected,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 10 }, { wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 10 }, { wch: 50 }, { wch: 50 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
    XLSX.writeFile(wb, "test-cases.xlsx");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl py-4 flex items-center gap-2.5 px-4 sm:px-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <FlaskConical className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-base font-semibold text-heading tracking-tight">TestGen</h1>
        </div>
      </header>

      <section className="container max-w-3xl pt-12 sm:pt-16 pb-10 text-center px-4 sm:px-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
          <Sparkles className="h-3 w-3" />
          Test Case Generator
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight mb-2">Generate Test Cases</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          Describe a feature and get structured positive, negative, and edge-case scenarios instantly.
        </p>

        <div className="text-left space-y-4">
          <textarea
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. User registration with email and password"
            className="w-full min-h-[120px] rounded-lg border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50 resize-y font-mono-code transition-all"
          />

          {/* File upload area */}
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            {fileName ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/30 bg-primary/5">
                <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                  <p className="text-xs text-muted-foreground">{uploadedFeatures.length} feature{uploadedFeatures.length !== 1 ? "s" : ""} found</p>
                </div>
                <button onClick={handleClearFile} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed transition-all text-sm ${
                  isDragging
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="h-4 w-4" />
                {isDragging ? "Drop your file here" : "Drag & drop or click to upload Excel/CSV"}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">⌘ + Enter to generate</span>
            <Button variant="action" size="lg" onClick={handleGenerate} disabled={!feature.trim() && uploadedFeatures.length === 0} className="w-full sm:w-auto">
              Generate Test Cases
            </Button>
          </div>
        </div>
      </section>

      {results && (
        <section className="container max-w-6xl pb-16 px-4 sm:px-6">
          <div className="border-t border-border pt-10">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {results.positive.length + results.negative.length + results.edge.length} test cases generated
                </p>
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  Legend
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-1.5">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Export Excel
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-1.5">
                  {allCopied ? <Check className="h-3.5 w-3.5 text-positive" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                  {allCopied ? "Copied!" : "Copy All"}
                </Button>
              </div>
            </div>

            {/* Legend */}
            {showLegend && (
              <div className="mb-6 p-4 rounded-lg border border-border bg-card/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 mb-1">
                  <p className="text-xs font-semibold text-heading uppercase tracking-widest">Priority & Severity Key</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Use 👍 / 👎 on each card to mark validity. Click <strong>Feedback</strong> to suggest changes.
                  </p>
                </div>
                {legend.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                    <div>
                      <span className="text-xs font-medium text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">— {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
