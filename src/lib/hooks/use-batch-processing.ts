"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useBackgroundRemoval } from "./use-background-removal";
import type { ProcessingResult } from "@/types";
import { MAX_BATCH_SIZE } from "@/lib/ml/types";

export type BatchItemStatus = "pending" | "processing" | "done" | "error";

export interface BatchItem {
  id: string;
  file: File;
  status: BatchItemStatus;
  progress: number;
  result: ProcessingResult | null;
  error: string | null;
}

export function useBatchProcessing() {
  const { processImage, cancel: cancelProcessing } = useBackgroundRemoval();
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const cancelledRef = useRef(false);

  const addFiles = useCallback((files: File[]) => {
    const newItems: BatchItem[] = files.slice(0, MAX_BATCH_SIZE).map((file, i) => ({
      id: `batch-${Date.now()}-${i}`,
      file,
      status: "pending" as const,
      progress: 0,
      result: null,
      error: null,
    }));
    setItems((prev) => {
      const combined = [...prev, ...newItems];
      return combined.slice(0, MAX_BATCH_SIZE);
    });
    return newItems;
  }, []);

  const startProcessing = useCallback(async () => {
    setIsRunning(true);
    cancelledRef.current = false;

    setItems((prev) => {
      const pending = prev.filter((item) => item.status === "pending" || item.status === "error");
      const done = prev.filter((item) => item.status === "done");
      return [
        ...done,
        ...pending.map((item) => ({ ...item, status: "pending" as const, error: null })),
      ];
    });

    // Get current items to process
    const currentItems = await new Promise<BatchItem[]>((resolve) => {
      setItems((prev) => {
        resolve(prev.filter((item) => item.status === "pending"));
        return prev;
      });
    });

    for (const item of currentItems) {
      if (cancelledRef.current) break;

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "processing" as const, progress: 0 } : i
        )
      );

      try {
        const result = await processImage(item.file);
        if (result) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done" as const, progress: 100, result }
                : i
            )
          );
        } else {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "error" as const, error: "Processing failed" }
                : i
            )
          );
        }
      } catch {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error" as const, error: "Processing failed" }
              : i
          )
        );
      }
    }

    setIsRunning(false);
  }, [processImage]);

  const cancelBatch = useCallback(() => {
    cancelledRef.current = true;
    cancelProcessing();
    setIsRunning(false);
  }, [cancelProcessing]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const downloadAllAsZip = useCallback(async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const doneItems = items.filter((i) => i.status === "done" && i.result);
    for (const item of doneItems) {
      const name = item.file.name.replace(/\.[^.]+$/, "") + "_nobg.png";
      zip.file(name, item.result!.resultImage);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backgrone-batch.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [items]);

  const overallProgress = useMemo(
    () =>
      items.length
        ? Math.round(
            (items.filter((i) => i.status === "done").length / items.length) * 100
          )
        : 0,
    [items]
  );

  return {
    items,
    isRunning,
    overallProgress,
    addFiles,
    startProcessing,
    cancelBatch,
    removeItem,
    clearAll,
    downloadAllAsZip,
  };
}
