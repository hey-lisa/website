'use client';

import { useState } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface ContactClientProps {
  pgpKey: string;
}

export default function ContactClient({ pgpKey }: ContactClientProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
      {/* Email */}
      <div className="text-xl">
        lisa@hey-lisa.com
      </div>

      {/* PGP Key */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
        <CopyButton text={pgpKey} />
        <pre className="w-full max-w-full text-[10px] sm:text-xs whitespace-pre-wrap font-mono text-left break-all md:break-normal leading-relaxed overflow-x-hidden">
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
      className="flex items-center space-x-2 rounded-md border bg-transparent px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      title={copied ? 'PGP key copied!' : 'Copy PGP key'}
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4 text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-4 w-4" />
          <span>Copy PGP Key</span>
        </>
      )}
    </button>
  );
}
