"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-xl border border-red-500/50 bg-red-950/20 p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-red-300 mb-4">
          Something went wrong
        </h1>

        <p className="text-slate-300 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        {error.digest && (
          <p className="text-xs text-slate-500 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
