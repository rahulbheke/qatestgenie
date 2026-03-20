import { useState } from "react";
import { BillData, Settlement, generateSummary, Currency } from "@/lib/billSplitter";
import { Copy, Check, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data: BillData;
  settlements: Settlement[];
}

export default function ExportShare({ data, settlements }: Props) {
  const [copied, setCopied] = useState(false);
  const summary = generateSummary(data, settlements);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`💰 Bill Split Summary\n\n${summary}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-heading">Share & Export</h3>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">{summary}</pre>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 gap-1.5">
          {copied ? <Check className="h-3.5 w-3.5 text-positive" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleWhatsApp} className="flex-1 gap-1.5">
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
