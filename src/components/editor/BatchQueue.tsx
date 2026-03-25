"use client";

import { useEffect, useState } from "react";
import { Download, X, CheckCircle, AlertTriangle, Loader } from "lucide-react";
import type { BatchItem } from "@/lib/hooks/use-batch-processing";
import { downloadBlob } from "@/lib/utils/canvas-compositing";

const STATUS_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  pending: {
    icon: <div className="h-2 w-2 bg-outline" />,
    color: "text-outline",
    label: "Pending",
  },
  processing: {
    icon: <Loader className="h-3 w-3 animate-spin text-primary" />,
    color: "text-primary",
    label: "Processing",
  },
  done: {
    icon: <CheckCircle className="h-3 w-3 text-secondary" />,
    color: "text-secondary",
    label: "Done",
  },
  error: {
    icon: <AlertTriangle className="h-3 w-3 text-error" />,
    color: "text-error",
    label: "Error",
  },
};

interface BatchQueueProps {
  items: BatchItem[];
  overallProgress: number;
  isRunning: boolean;
  onStart: () => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onDownloadAll: () => void;
}

function BatchThumbnail({ file }: { file: File }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  if (!url) return <div className="h-12 w-12 bg-surface-container" />;

  return (
    <img
      src={url}
      alt={file.name}
      className="h-12 w-12 object-cover"
    />
  );
}

export function BatchQueue({
  items,
  overallProgress,
  isRunning,
  onStart,
  onCancel,
  onRemove,
  onDownloadAll,
}: BatchQueueProps) {
  const doneCount = items.filter((i) => i.status === "done").length;
  const hasResults = doneCount > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Overall progress header */}
      <div className="border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">
            Batch Processing — {doneCount}/{items.length}
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">
            {overallProgress}%
          </span>
        </div>
        <div className="mt-2 h-[2px] w-full bg-surface-variant">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => {
          const statusConfig = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-outline-variant/10 px-6 py-3"
            >
              <BatchThumbnail file={item.file} />

              <div className="flex-1 min-w-0">
                <p className="truncate font-body text-sm text-on-surface">
                  {item.file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {statusConfig.icon}
                  <span
                    className={`font-label text-[10px] uppercase tracking-widest ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
                {item.status === "processing" && (
                  <div className="mt-1 h-[2px] w-full bg-surface-variant">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.error && (
                  <p className="mt-1 font-body text-xs text-error">
                    {item.error}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.status === "done" && item.result && (
                  <button
                    type="button"
                    onClick={() => {
                      const name =
                        "bg-removed-" + item.file.name.replace(/\.[^.]+$/, ".png");
                      downloadBlob(item.result!.resultImage, name);
                    }}
                    className="p-1 text-outline transition-colors hover:text-primary"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
                {item.status !== "processing" && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="p-1 text-outline transition-colors hover:text-error"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action bar */}
      <div className="flex gap-2 border-t border-outline-variant/20 bg-surface-container-lowest px-6 py-4">
        {!isRunning ? (
          <>
            <button
              type="button"
              onClick={onStart}
              disabled={items.filter((i) => i.status === "pending").length === 0}
              className="flex-1 bg-primary py-3 font-label text-[10px] uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Process All
            </button>
            {hasResults && (
              <button
                type="button"
                onClick={onDownloadAll}
                className="flex-1 bg-secondary py-3 font-label text-[10px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              >
                Download ZIP
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-outline-variant py-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors hover:border-error hover:text-error"
          >
            Cancel Batch
          </button>
        )}
      </div>
    </div>
  );
}
