"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Dictionary } from "@/lib/dictionaries";

interface PgpCopyButtonProps {
  pgpKey: string;
  dict: Dictionary;
}

export default function PgpCopyButton({ pgpKey, dict }: PgpCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pgpKey);
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy PGP key:", error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = pgpKey;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mb-4 flex items-center gap-2 px-3 py-2 text-sm"
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          {dict.contact.copied}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {dict.contact.copy_button}
        </>
      )}
    </button>
  );
}
