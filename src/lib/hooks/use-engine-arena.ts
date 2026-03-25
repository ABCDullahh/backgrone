"use client";

import { useState, useCallback, useRef } from "react";
import { useMLWorker } from "./use-ml-worker";
import type { EngineId } from "@/types";

export type ArenaEngineStatus = "idle" | "processing" | "done" | "error";

export interface ArenaResult {
  engineId: EngineId;
  status: ArenaEngineStatus;
  resultBlob: Blob | null;
  processingTime: number | null;
  error: string | null;
}

const ENGINE_ORDER: EngineId[] = ["precision", "lightweight", "balanced"];

function isOOMError(error: string): boolean {
  const oomPatterns = [
    "out of memory",
    "oom",
    "memory allocation",
    "allocate",
    "arraybuffer",
    "memory limit",
    "insufficient memory",
  ];
  const lower = error.toLowerCase();
  return oomPatterns.some((p) => lower.includes(p));
}

export function useEngineArena() {
  const { send, cleanup } = useMLWorker();
  const [results, setResults] = useState<ArenaResult[]>(
    ENGINE_ORDER.map((id) => ({
      engineId: id,
      status: "idle",
      resultBlob: null,
      processingTime: null,
      error: null,
    }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef(false);

  const runArena = useCallback(
    async (file: File) => {
      abortRef.current = false;
      setIsRunning(true);

      // Reset results
      setResults(
        ENGINE_ORDER.map((id) => ({
          engineId: id,
          status: "idle",
          resultBlob: null,
          processingTime: null,
          error: null,
        }))
      );

      // Prepare image data once
      let buffer: ArrayBuffer;
      let width: number;
      let height: number;

      try {
        const bitmap = await createImageBitmap(file);
        width = bitmap.width;
        height = bitmap.height;
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
        buffer = imageData.data.buffer.slice(0);
      } catch {
        setIsRunning(false);
        return;
      }

      // Run engines sequentially
      for (let i = 0; i < ENGINE_ORDER.length; i++) {
        if (abortRef.current) break;

        const engineId = ENGINE_ORDER[i];

        // Mark engine as processing
        setResults((prev) =>
          prev.map((r) =>
            r.engineId === engineId ? { ...r, status: "processing" } : r
          )
        );

        // Switch engine then process
        await new Promise<void>((resolve) => {
          const switchId = send(
            { type: "switch-engine", engineId },
            (msg) => {
              if (
                msg.type === "engine-status" &&
                msg.engineStatus === "ready"
              ) {
                cleanup(switchId);
                resolve();
              }
              if (msg.type === "error") {
                cleanup(switchId);
                setResults((prev) =>
                  prev.map((r) =>
                    r.engineId === engineId
                      ? {
                          ...r,
                          status: "error",
                          error: isOOMError(msg.error ?? "")
                            ? "Not enough memory"
                            : msg.error ?? "Engine load failed",
                        }
                      : r
                  )
                );
                resolve();
              }
            }
          );
        });

        // Check if engine switch errored
        const currentResults = await new Promise<ArenaResult[]>((res) => {
          setResults((prev) => {
            res(prev);
            return prev;
          });
        });
        const thisResult = currentResults.find((r) => r.engineId === engineId);
        if (thisResult?.status === "error") continue;

        if (abortRef.current) break;

        // Process image
        await new Promise<void>((resolve) => {
          const processId = send(
            {
              type: "process",
              imageData: buffer.slice(0),
              width,
              height,
            },
            (msg) => {
              if (msg.type === "result" && msg.result) {
                cleanup(processId);

                const resultData = new Uint8ClampedArray(msg.result.imageData);
                const resultImageData = new ImageData(
                  resultData,
                  msg.result.width,
                  msg.result.height
                );
                const resultCanvas = new OffscreenCanvas(
                  msg.result.width,
                  msg.result.height
                );
                const resultCtx = resultCanvas.getContext("2d")!;
                resultCtx.putImageData(resultImageData, 0, 0);

                resultCanvas
                  .convertToBlob({ type: "image/png" })
                  .then((blob) => {
                    setResults((prev) =>
                      prev.map((r) =>
                        r.engineId === engineId
                          ? {
                              ...r,
                              status: "done",
                              resultBlob: blob,
                              processingTime: msg.result!.processingTime,
                            }
                          : r
                      )
                    );
                    resolve();
                  });
              }
              if (msg.type === "error") {
                cleanup(processId);
                setResults((prev) =>
                  prev.map((r) =>
                    r.engineId === engineId
                      ? {
                          ...r,
                          status: "error",
                          error: isOOMError(msg.error ?? "")
                            ? "Not enough memory"
                            : msg.error ?? "Processing failed",
                        }
                      : r
                  )
                );
                resolve();
              }
            }
          );
        });

        // Dispose engine between runs to free memory
        if (i < ENGINE_ORDER.length - 1) {
          await new Promise<void>((resolve) => {
            const disposeId = send({ type: "dispose" }, () => {
              cleanup(disposeId);
              resolve();
            });
            // Fallback resolve in case dispose doesn't respond
            setTimeout(() => {
              cleanup(disposeId);
              resolve();
            }, 2000);
          });
        }
      }

      setIsRunning(false);
    },
    [send, cleanup]
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setResults(
      ENGINE_ORDER.map((id) => ({
        engineId: id,
        status: "idle",
        resultBlob: null,
        processingTime: null,
        error: null,
      }))
    );
  }, []);

  return { results, isRunning, runArena, reset };
}
