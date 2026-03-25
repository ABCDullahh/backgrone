"use client";

import { Upload } from "lucide-react";
import type {
  EditorState,
  EngineId,
  EngineStatus,
  BackgroundOption,
  OutputResolution,
  ProcessingProgress,
} from "@/types";
import { EngineSelector } from "./EngineSelector";
import { BackgroundReplace } from "./BackgroundReplace";

interface InspectorProps {
  editorState: EditorState;
  activeEngine: EngineId;
  engineStatus: EngineStatus;
  loadProgress: number;
  onSwitchEngine: (engineId: EngineId) => void;
  backgroundOption: BackgroundOption;
  onBackgroundChange: (option: BackgroundOption) => void;
  outputResolution: OutputResolution;
  onResolutionChange: (res: OutputResolution) => void;
  onUploadClick: () => void;
  onDownload: () => void;
  onNewImage: () => void;
  onRetry: () => void;
  onCancel: () => void;
  progress: ProcessingProgress | null;
  errorMessage: string | null;
}

const RESOLUTION_OPTIONS: { value: OutputResolution; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "50", label: "50%" },
  { value: "25", label: "25%" },
];

export function Inspector({
  editorState,
  activeEngine,
  engineStatus,
  loadProgress,
  onSwitchEngine,
  backgroundOption,
  onBackgroundChange,
  outputResolution,
  onResolutionChange,
  onUploadClick,
  onDownload,
  onNewImage,
  onRetry,
  onCancel,
  progress,
  errorMessage,
}: InspectorProps) {
  return (
    <div className="flex h-full w-80 min-w-[320px] max-w-[320px] shrink-0 flex-col border-l border-outline-variant/20 bg-surface-container-lowest">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4 p-4">
          {/* Engine selector — always visible */}
          <EngineSelector
            activeEngine={activeEngine}
            engineStatus={engineStatus}
            loadProgress={loadProgress}
            onSwitch={onSwitchEngine}
          />

          {/* Divider */}
          <div className="h-px bg-outline-variant/20" />

          {/* State-specific content */}
          {editorState === "empty" && (
            <button
              type="button"
              onClick={onUploadClick}
              className="flex items-center justify-center gap-2 border border-dashed border-outline-variant py-4 font-label text-[10px] uppercase tracking-widest text-outline transition-colors hover:border-primary hover:text-primary"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </button>
          )}

          {editorState === "processing" && (
            <div className="flex flex-col gap-4">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-outline">
                Progress
              </h3>
              <div className="flex flex-col gap-2">
                <span className="font-body text-sm text-on-surface">
                  {progress?.message ?? "Preparing..."}
                </span>
                <div className="h-[2px] w-full bg-surface-variant">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress?.progress ?? 0}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="border border-outline-variant py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors hover:border-error hover:text-error"
              >
                Cancel
              </button>
            </div>
          )}

          {(editorState === "result" || editorState === "bg-replace") && (
            <>
              <BackgroundReplace
                value={backgroundOption}
                onChange={onBackgroundChange}
              />

              <div className="h-px bg-outline-variant/20" />

              {/* Output resolution — compact horizontal */}
              <div className="flex flex-col gap-1">
                <h3 className="font-label text-[10px] uppercase tracking-widest text-outline">
                  Resolution
                </h3>
                <div className="flex gap-1">
                  {RESOLUTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onResolutionChange(opt.value)}
                      className={`flex-1 py-2 font-label text-[9px] uppercase tracking-wider transition-colors ${
                        outputResolution === opt.value
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {editorState === "error" && (
            <div className="flex flex-col gap-4">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-error">
                Error
              </h3>
              <p className="font-body text-sm text-on-surface-variant">
                {errorMessage}
              </p>
              {errorMessage?.toLowerCase().includes("memory") && (
                <p className="font-label text-[10px] uppercase tracking-widest text-outline">
                  Try the Lightweight engine
                </p>
              )}
              <button
                type="button"
                onClick={onRetry}
                className="w-full bg-primary py-3 font-label text-[10px] uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={onNewImage}
                className="w-full border border-outline-variant py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                New Image
              </button>
            </div>
          )}
        </div>

        {/* Bottom actions — always pinned at bottom */}
        {(editorState === "result" || editorState === "bg-replace") && (
          <div className="flex flex-col gap-2 border-t border-outline-variant/20 p-4">
            <button
              type="button"
              onClick={onDownload}
              className="w-full bg-secondary py-3 font-label text-[10px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Download PNG
            </button>
            <button
              type="button"
              onClick={onNewImage}
              className="w-full border border-outline-variant py-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              New Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
