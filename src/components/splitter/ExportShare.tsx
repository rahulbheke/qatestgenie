import { useState } from "react";
import { BillData, Settlement, generateSummary } from "@/lib/billSplitter";
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
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2">
          <Share2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-heading">Share Summary</h3>
        <p className="text-sm text-muted-foreground">Copy or share via WhatsApp</p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border">
        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono-code leading-relaxed">{summary}</pre>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleCopy}
          className="h-12 rounded-xl gap-2 text-sm font-semibold"
        >
          {copied ? <Check className="h-4 w-4 text-positive" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          variant="outline"
          onClick={handleWhatsApp}
          className="h-12 rounded-xl gap-2 text-sm font-semibold"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
