"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const isMemoryError = message.toLowerCase().includes("memory");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <AlertTriangle className="h-16 w-16 text-error" />

      <h2 className="font-headline text-xl text-on-surface">
        Processing Failed
      </h2>

      <p className="max-w-md text-center font-body text-sm text-on-surface-variant">
        {message}
      </p>

      {isMemoryError && (
        <p className="max-w-md text-center font-label text-[10px] uppercase tracking-widest text-outline">
          Try switching to the Lightweight engine for lower memory usage
        </p>
      )}

      <button
        type="button"
        onClick={onRetry}
        className="bg-primary px-8 py-3 font-label text-[10px] uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
