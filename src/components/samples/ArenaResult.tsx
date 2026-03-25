"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ENGINE_CONFIGS } from "@/types";
import { formatDuration } from "@/lib/utils";
import type { ArenaResult as ArenaResultType } from "@/lib/hooks/use-engine-arena";
import { ANIM } from "@/lib/animations";

interface ArenaResultProps {
  result: ArenaResultType;
  index: number;
}

function QualityStars({ count }: { count: number }) {
  return (
    <span className="font-label text-[10px] tracking-widest text-outline">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export function ArenaResult({ result, index }: ArenaResultProps) {
  const config = ENGINE_CONFIGS[result.engineId];
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (result.resultBlob) {
      const url = URL.createObjectURL(result.resultBlob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [result.resultBlob]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: ANIM.medium,
        ease: ANIM.smooth,
      }}
      className="flex flex-col border-2 border-outline-variant"
    >
      {/* Header */}
      <div className="border-b-2 border-outline-variant px-5 py-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">
          {config.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">
            {config.modelSize}
          </span>
          <QualityStars count={config.quality} />
        </div>
      </div>

      {/* Result area */}
      <div className={`relative aspect-[4/3] w-full ${result.status === "done" ? "checkerboard-bg" : "bg-surface-container"}`}>
        <AnimatePresence mode="wait">
          {result.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full items-center justify-center"
            >
              <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                Waiting
              </span>
            </motion.div>
          )}

          {result.status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col items-center justify-center gap-4"
            >
              <div className="h-8 w-8 animate-spin border-2 border-outline-variant border-t-primary" />
              <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                Processing...
              </span>
            </motion.div>
          )}

          {result.status === "done" && objectUrl && (
            <motion.img
              key="result"
              src={objectUrl}
              alt={`${config.name} result`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: ANIM.medium, ease: ANIM.dramatic }}
              className="h-full w-full object-contain"
            />
          )}

          {result.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full items-center justify-center p-4"
            >
              <span
                className={`px-4 py-2 font-label text-[10px] uppercase tracking-widest ${
                  result.error === "Not enough memory"
                    ? "bg-error/10 text-error"
                    : "bg-surface-dim text-on-surface-variant"
                }`}
              >
                {result.error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer - processing time */}
      <div className="border-t-2 border-outline-variant px-5 py-3">
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          {result.status === "done" && result.processingTime !== null
            ? `Completed in ${formatDuration(result.processingTime)}`
            : result.status === "processing"
              ? "Running..."
              : result.status === "error"
                ? "Failed"
                : "--"}
        </span>
      </div>
    </motion.div>
  );
}
