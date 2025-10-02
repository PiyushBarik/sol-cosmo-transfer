"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface WalletBadgeProps {
  address: string;
  className?: string;
}

export function WalletBadge({
  address,
  className = "",
}: WalletBadgeProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 ${className}`}
    >
      <code className="text-sm text-slate-300 font-mono">
        {truncatedAddress}
      </code>
      <button
        onClick={handleCopy}
        className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
        aria-label={copied ? "Address copied" : "Copy address"}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
