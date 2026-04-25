"use client";

import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyTranscriptButton({
  transcriptText,
}: {
  transcriptText: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(transcriptText);
      setCopied(true);
      toast.success("Transcript copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Could not copy transcript.");
    }
  }

  return (
    <Button variant="secondary" onClick={handleCopy}>
      {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy transcript"}
    </Button>
  );
}
