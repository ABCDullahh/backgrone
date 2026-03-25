"use client";

import { useEffect, useState, useMemo } from "react";
import type { ProcessingProgress } from "@/types";

interface ProcessingOverlayProps {
  originalFile: File | null;
  progress: ProcessingProgress | null;
  onCancel: () => void;
}

export function ProcessingOverlay({
  originalFile,
  progress,
  onCancel,
}: ProcessingOverlayProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!originalFile) return;
    const url = URL.createObjectURL(originalFile);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [originalFile]);

  const stageLabel = useMemo(() => {
    if (!progress) return "Preparing";
    switch (progress.stage) {
      case "loading-model":
        return "Loading Model";
      case "preprocessing":
        return "Preprocessing";
      case "inference":
        return "Running Inference";
      case "postprocessing":
        return "Postprocessing";
      default:
        return "Processing";
    }
  }, [progress?.stage]);

  const progressPercent = progress?.progress ?? 0;

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      {/* Blurred original image background */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-contain opacity-50"
          style={{ filter: "blur(8px)" }}
        />
      )}

      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-pulse bg-surface/30" />

      {/* Progress indicator */}
      <div className="relative z-10 flex flex-col items-center gap-6 bg-surface-container-lowest/90 px-12 py-10">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {stageLabel}
        </span>

        <div className="w-64">
          <div className="h-[2px] w-full bg-surface-variant">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <p className="text-center font-body text-sm text-on-surface-variant">
          {progress?.message ?? "Preparing image..."}
        </p>

        <button
          type="button"
          onClick={onCancel}
          className="mt-2 border border-outline-variant px-6 py-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
