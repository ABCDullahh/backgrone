"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, Download } from "lucide-react";
import JSZip from "jszip";
import { ANIM } from "@/lib/animations";
import { ENGINE_CONFIGS } from "@/types";
import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from "@/lib/ml/types";
import { useEngineArena } from "@/lib/hooks/use-engine-arena";
import { ArenaResult } from "./ArenaResult";

export function EngineArena() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { results, isRunning, runArena, reset } = useEngineArena();

  const hasResults = results.some((r) => r.status === "done");
  const allDone = results.every(
    (r) => r.status === "done" || r.status === "error"
  );
  const hasStarted = results.some((r) => r.status !== "idle");

  const handleFile = useCallback(
    (file: File) => {
      if (
        !ACCEPTED_FORMATS.includes(
          file.type as (typeof ACCEPTED_FORMATS)[number]
        )
      )
        return;
      if (file.size > MAX_FILE_SIZE) return;

      // Clean up previous preview
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      runArena(file);
    },
    [runArena, previewUrl]
  );


  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    reset();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [reset, previewUrl]);

  const downloadBest = useCallback(() => {
    const best = results
      .filter((r) => r.status === "done" && r.resultBlob)
      .sort((a, b) => {
        const qa = ENGINE_CONFIGS[a.engineId].quality;
        const qb = ENGINE_CONFIGS[b.engineId].quality;
        return qb - qa;
      })[0];

    if (!best?.resultBlob) return;

    const url = URL.createObjectURL(best.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backgrone-${best.engineId}-result.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const downloadAll = useCallback(async () => {
    const zip = new JSZip();
    for (const r of results) {
      if (r.status === "done" && r.resultBlob) {
        zip.file(`${r.engineId}-result.png`, r.resultBlob);
      }
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backgrone-arena-results.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <section className="mt-32 px-6 md:px-12 lg:px-20">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ANIM.viewport}
        transition={{ duration: ANIM.medium, ease: ANIM.smooth }}
      >
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          SECTION // 02
        </span>
        <h2 className="mt-2 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
          ENGINE
          <br />
          ARENA.
        </h2>
        <p className="mt-4 font-label text-sm uppercase tracking-widest text-on-surface-variant">
          Upload one image. See three results.
        </p>
      </motion.div>

      {/* Upload zone */}
      {!hasStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={ANIM.viewport}
          transition={{
            delay: 0.2,
            duration: ANIM.medium,
            ease: ANIM.smooth,
          }}
          className="mt-12"
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full max-w-2xl flex-col items-center justify-center gap-6 border-2 border-dashed p-16 transition-colors border-outline-variant hover:border-outline"
          >
            <Upload className="h-12 w-12 text-outline" />
            <div className="text-center">
              <p className="font-headline text-xl text-on-surface">
                Click here to upload
              </p>
              <p className="mt-2 font-label text-[10px] uppercase tracking-widest text-outline">
                One image, three engines, side by side
              </p>
            </div>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_FORMATS.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />
        </motion.div>
      )}

      {/* Results grid */}
      {hasStarted && (
        <div className="mt-12">
          {/* Source preview + reset */}
          <div className="mb-8 flex items-center gap-4">
            {previewUrl && (
              <div className="h-16 w-16 border-2 border-outline-variant bg-surface-container">
                <img
                  src={previewUrl}
                  alt="Source"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                {isRunning ? "Running arena..." : "Arena complete"}
              </span>
              {!isRunning && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="self-start font-label text-[10px] uppercase tracking-widest text-on-surface-variant underline underline-offset-4 hover:text-on-surface"
                >
                  Try another image
                </button>
              )}
            </div>
          </div>

          {/* 3-column result grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, i) => (
              <ArenaResult key={result.engineId} result={result} index={i} />
            ))}
          </div>

          {/* Download actions */}
          {allDone && hasResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: ANIM.medium, ease: ANIM.smooth }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button
                type="button"
                onClick={downloadBest}
                className="flex items-center gap-2 bg-primary px-6 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-on-surface"
              >
                <Download className="h-4 w-4" />
                Download Best
              </button>
              <button
                type="button"
                onClick={downloadAll}
                className="flex items-center gap-2 border-2 border-primary px-6 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container"
              >
                <Download className="h-4 w-4" />
                Download All as ZIP
              </button>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
