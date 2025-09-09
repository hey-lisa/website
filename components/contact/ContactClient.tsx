'use client';

import { useState } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface ContactClientProps {
  pgpKey: string;
}

export default function ContactClient({ pgpKey }: ContactClientProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      {/* Email */}
      <div className="text-xl">
        lisa@hey-lisa.com
      </div>

      {/* PGP Key */}
      <div className="flex flex-col items-center space-y-4 max-w-4xl">
        <CopyButton text={pgpKey} />
        <pre className="text-xs whitespace-pre-wrap font-mono text-center">
          {pgpKey}
        </pre>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="pgp-copy-button"
      title={copied ? 'Copied!' : 'Copy PGP key'}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </button>
  );
}
