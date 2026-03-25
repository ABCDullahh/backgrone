"use client";

import { useState, useCallback, useRef } from "react";
import { useMLWorker } from "./use-ml-worker";
import type { ProcessingProgress, ProcessingResult } from "@/types";
import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from "@/lib/ml/types";

export function useBackgroundRemoval() {
  const { send, cleanup } = useMLWorker();
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentMessageId = useRef<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type as (typeof ACCEPTED_FORMATS)[number])) {
      return `Unsupported format: ${file.type}. Use JPEG, PNG, WebP, or HEIC.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max is 20MB.`;
    }
    return null;
  }, []);

  const processImage = useCallback(
    async (file: File): Promise<ProcessingResult | null> => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      setIsProcessing(true);
      setError(null);
      setProgress({
        stage: "preprocessing",
        progress: 0,
        message: "Preparing image...",
      });

      try {
        const bitmap = await createImageBitmap(file);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
        const buffer = imageData.data.buffer.slice(0);

        return new Promise((resolve) => {
          const id = send(
            {
              type: "process",
              imageData: buffer,
              width: bitmap.width,
              height: bitmap.height,
            },
            (msg) => {
              if (msg.type === "progress" && msg.progress) {
                setProgress(msg.progress);
              }
              if (msg.type === "result" && msg.result) {
                setIsProcessing(false);
                setProgress(null);
                cleanup(id);

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
                  .then((resultBlob) => {
                    resolve({
                      originalImage: file,
                      resultImage: resultBlob,
                      maskImage: null,
                      width: msg.result!.width,
                      height: msg.result!.height,
                      processingTime: msg.result!.processingTime,
                      engineId: msg.result!.engineId,
                    });
                  });
              }
              if (msg.type === "error") {
                setIsProcessing(false);
                setError(msg.error ?? "Processing failed");
                setProgress(null);
                cleanup(id);
                resolve(null);
              }
            }
          );
          currentMessageId.current = id;
        });
      } catch (err) {
        setIsProcessing(false);
        setError(
          err instanceof Error ? err.message : "Failed to process image"
        );
        setProgress(null);
        return null;
      }
    },
    [send, cleanup, validateFile]
  );

  const cancel = useCallback(() => {
    if (currentMessageId.current) {
      // Notify the worker so it can acknowledge the cancellation
      send({ type: "cancel" }, () => {});
      cleanup(currentMessageId.current);
      currentMessageId.current = null;
    }
    setIsProcessing(false);
    setProgress(null);
  }, [send, cleanup]);

  return {
    processImage,
    validateFile,
    cancel,
    progress,
    isProcessing,
    error,
    clearError: () => setError(null),
  };
}
