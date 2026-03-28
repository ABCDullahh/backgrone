"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type {
  EditorState,
  EngineId,
  BackgroundOption,
  OutputResolution,
  ProcessingResult,
} from "@/types";
import { useBackgroundRemoval } from "@/lib/hooks/use-background-removal";
import { useModelManager } from "@/lib/hooks/use-model-manager";
import { useBatchProcessing } from "@/lib/hooks/use-batch-processing";
import { SAMPLE_IMAGES } from "@/lib/data/samples";
import {
  compositeWithColor,
  compositeWithGradient,
  compositeWithImage,
  downloadBlob,
  resizeBlob,
} from "@/lib/utils/canvas-compositing";
import type { GradientConfig } from "@/lib/utils/canvas-compositing";
import { ACCEPTED_FORMATS } from "@/lib/ml/types";
import { Upload } from "lucide-react";
import { consumePendingFile } from "@/lib/pending-file";
import { UploadZone } from "./UploadZone";
import { ProcessingOverlay } from "./ProcessingOverlay";
import { ResultView } from "./ResultView";
import { ErrorState } from "./ErrorState";
import { BatchQueue } from "./BatchQueue";
import { Inspector } from "./Inspector";
import { ToolsBar } from "./ToolsBar";

const GRADIENT_PRESETS: GradientConfig[] = [
  { colors: ["#667eea", "#764ba2"], direction: "vertical" },
  { colors: ["#f093fb", "#f5576c"], direction: "vertical" },
  { colors: ["#4facfe", "#00f2fe"], direction: "vertical" },
  { colors: ["#43e97b", "#38f9d7"], direction: "vertical" },
  { colors: ["#fa709a", "#fee140"], direction: "vertical" },
  { colors: ["#a18cd1", "#fbc2eb"], direction: "vertical" },
];

export function EditorLayout() {
  const searchParams = useSearchParams();
  const [editorState, setEditorState] = useState<EditorState>("empty");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [backgroundOption, setBackgroundOption] = useState<BackgroundOption>({
    type: "transparent",
  });
  const [outputResolution, setOutputResolution] =
    useState<OutputResolution>("original");
  const [pendingReprocess, setPendingReprocess] = useState(false);
  const sampleLoadedRef = useRef(false);
  // Mask overlay removed — feature was incomplete

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const {
    processImage,
    cancel: cancelProcessing,
    progress,
    isProcessing,
    error,
    clearError,
  } = useBackgroundRemoval();

  const {
    activeEngine,
    engineStatus,
    loadProgress,
    switchEngine,
  } = useModelManager();

  const {
    items: batchItems,
    isRunning: batchRunning,
    overallProgress: batchProgress,
    addFiles: addBatchFiles,
    startProcessing: startBatch,
    cancelBatch,
    removeItem: removeBatchItem,
    downloadAllAsZip,
  } = useBatchProcessing();

  // Sync error from hook to editor state — only when transitioning OUT of processing
  useEffect(() => {
    if (error && !isProcessing && editorState === "processing") {
      setEditorState("error");
    }
  }, [error, isProcessing, editorState]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      clearError();
      setResult(null);
      setOriginalFile(file);
      setEditorState("processing");

      const processingResult = await processImage(file);
      if (processingResult) {
        setResult(processingResult);
        setEditorState("result");
      }
      // Error state is handled by the effect above
    },
    [processImage, clearError]
  );

  // Pick up file stored by GlobalDropZone / LiveDemo before navigation
  const handleFileSelectRef = useRef(handleFileSelect);
  handleFileSelectRef.current = handleFileSelect;

  useEffect(() => {
    // Check in-memory store first (from GlobalDropZone)
    const pending = consumePendingFile();
    if (pending) {
      sampleLoadedRef.current = true;
      handleFileSelectRef.current(pending);
      return;
    }

    // Fallback: check sessionStorage (from LiveDemo)
    const pendingDataUrl = sessionStorage.getItem("backgrone-pending-file");
    const pendingName = sessionStorage.getItem("backgrone-pending-filename");
    const pendingType = sessionStorage.getItem("backgrone-pending-type");

    if (pendingDataUrl && pendingName) {
      sessionStorage.removeItem("backgrone-pending-file");
      sessionStorage.removeItem("backgrone-pending-filename");
      sessionStorage.removeItem("backgrone-pending-type");

      sampleLoadedRef.current = true;

      fetch(pendingDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], pendingName, {
            type: pendingType || "image/jpeg",
          });
          handleFileSelectRef.current(file);
        });
    }
  }, []);

  // Auto-load sample image from ?sample=xxx query parameter
  useEffect(() => {
    if (sampleLoadedRef.current) return;
    const sampleId = searchParams.get("sample");
    if (!sampleId) return;

    const sample = SAMPLE_IMAGES.find((s) => s.id === sampleId);
    if (!sample) return;

    sampleLoadedRef.current = true;

    (async () => {
      try {
        const response = await fetch(sample.originalSrc);
        const blob = await response.blob();
        const ext = sample.originalSrc.split(".").pop() ?? "jpg";
        const file = new File([blob], `${sample.name}.${ext}`, {
          type: blob.type || "image/jpeg",
        });
        handleFileSelect(file);
      } catch {
        // Failed to load sample — user can upload manually
      }
    })();
  }, [searchParams, handleFileSelect]);

  const handleFilesSelect = useCallback(
    (files: File[]) => {
      addBatchFiles(files);
      setEditorState("batch");
    },
    [addBatchFiles]
  );

  const handleCancel = useCallback(() => {
    cancelProcessing();
    setEditorState("empty");
    setOriginalFile(null);
  }, [cancelProcessing]);

  const handleNewImage = useCallback(() => {
    setEditorState("empty");
    setOriginalFile(null);
    setResult(null);
    setBackgroundOption({ type: "transparent" });
    setOutputResolution("original");
    clearError();
  }, [clearError]);

  const handleRetry = useCallback(() => {
    if (originalFile) {
      handleFileSelect(originalFile);
    }
  }, [originalFile, handleFileSelect]);

  const handleEngineSwitch = useCallback(
    (engineId: EngineId) => {
      switchEngine(engineId);

      // If we have an original file and a result, wait for engine to be ready
      // before re-processing (fixes "Engine not loaded" race condition)
      if (originalFile && (editorState === "result" || editorState === "bg-replace")) {
        setPendingReprocess(true);
        setEditorState("processing");
        clearError();
      }
    },
    [switchEngine, originalFile, editorState, clearError]
  );

  // Re-process after engine switch completes
  useEffect(() => {
    if (pendingReprocess && engineStatus === "ready" && originalFile) {
      setPendingReprocess(false);
      processImage(originalFile).then((newResult) => {
        if (newResult) {
          setResult(newResult);
          setEditorState("result");
        }
      });
    }
  }, [pendingReprocess, engineStatus, originalFile, processImage]);

  const handleBackgroundChange = useCallback((option: BackgroundOption) => {
    setBackgroundOption(option);
    setEditorState((prev) =>
      prev === "result" || prev === "bg-replace" ? "bg-replace" : prev
    );
  }, []);

  const handleDownload = useCallback(async () => {
    if (!result) return;

    let outputBlob = result.resultImage;

    // Apply background
    if (backgroundOption.type === "color") {
      outputBlob = await compositeWithColor(outputBlob, backgroundOption.value);
    } else if (backgroundOption.type === "gradient") {
      const preset = GRADIENT_PRESETS[backgroundOption.preset] ?? GRADIENT_PRESETS[0];
      const config: GradientConfig = {
        colors: preset.colors,
        direction: backgroundOption.direction as GradientConfig["direction"],
      };
      outputBlob = await compositeWithGradient(outputBlob, config);
    } else if (backgroundOption.type === "image") {
      outputBlob = await compositeWithImage(outputBlob, backgroundOption.src);
    }

    // Apply resolution
    const scaleMap: Record<OutputResolution, number> = {
      original: 1,
      "50": 0.5,
      "25": 0.25,
    };
    const scale = scaleMap[outputResolution];
    if (scale < 1) {
      outputBlob = await resizeBlob(outputBlob, scale);
    }

    const name = originalFile
      ? "bg-removed-" + originalFile.name.replace(/\.[^.]+$/, ".png")
      : "bg-removed-result.png";
    downloadBlob(outputBlob, name);
  }, [result, backgroundOption, outputResolution, originalFile]);

  const handleUploadClick = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd+V: paste from clipboard
      if (isCmd && e.key === "v") {
        navigator.clipboard
          .read()
          .then(async (items) => {
            for (const item of items) {
              for (const type of item.types) {
                if (
                  ACCEPTED_FORMATS.includes(
                    type as (typeof ACCEPTED_FORMATS)[number]
                  )
                ) {
                  const blob = await item.getType(type);
                  const file = new File([blob], `pasted-image.${type.split("/")[1]}`, {
                    type,
                  });
                  handleFileSelect(file);
                  return;
                }
              }
            }
          })
          .catch(() => {
            // Clipboard access denied or empty — ignore
          });
      }

      // Ctrl/Cmd+S: download
      if (isCmd && e.key === "s") {
        e.preventDefault();
        if (result) {
          handleDownload();
        }
      }

      // Ctrl/Cmd+Z: undo bg replace back to result
      if (isCmd && e.key === "z") {
        if (editorState === "bg-replace") {
          e.preventDefault();
          setBackgroundOption({ type: "transparent" });
          setEditorState("result");
        }
      }

      // Escape: cancel processing
      if (e.key === "Escape") {
        if (editorState === "processing") {
          handleCancel();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorState, result, handleCancel, handleDownload, handleFileSelect]);

  // Hidden file input for inspector upload button
  const handleHiddenInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        if (e.target.files.length > 1) {
          handleFilesSelect(Array.from(e.target.files));
        } else {
          handleFileSelect(e.target.files[0]);
        }
        e.target.value = "";
      }
    },
    [handleFileSelect, handleFilesSelect]
  );

  // Global drag-drop for editor — handles drops in any state (result, processing, etc.)
  const [isEditorDrag, setIsEditorDrag] = useState(false);
  const editorDragCounter = useRef(0);

  const handleEditorDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.types.includes("Files")) return;
    editorDragCounter.current++;
    if (editorDragCounter.current === 1) setIsEditorDrag(true);
  }, []);

  const handleEditorDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleEditorDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    editorDragCounter.current--;
    if (editorDragCounter.current <= 0) {
      editorDragCounter.current = 0;
      setIsEditorDrag(false);
    }
  }, []);

  const handleEditorDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      editorDragCounter.current = 0;
      setIsEditorDrag(false);

      const files = e.dataTransfer.files;
      if (!files.length) return;

      const validFiles = Array.from(files).filter((f) =>
        ACCEPTED_FORMATS.includes(f.type as (typeof ACCEPTED_FORMATS)[number])
      );
      if (validFiles.length === 0) return;

      if (validFiles.length > 1) {
        handleFilesSelect(validFiles);
      } else {
        handleFileSelect(validFiles[0]);
      }
    },
    [handleFileSelect, handleFilesSelect]
  );

  return (
    <div
      className="flex h-[calc(100vh-5rem)] mt-20 relative"
      onDragEnter={handleEditorDragEnter}
      onDragOver={handleEditorDragOver}
      onDragLeave={handleEditorDragLeave}
      onDrop={handleEditorDrop}
    >
      {/* Drop overlay */}
      {isEditorDrag && editorState !== "empty" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-white" />
            <p className="font-headline text-2xl font-black text-white">
              Drop to Process
            </p>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 bg-surface-container-low overflow-hidden">
        {editorState === "empty" && (
          <UploadZone
            onFileSelect={handleFileSelect}
            onFilesSelect={handleFilesSelect}
          />
        )}

        {editorState === "processing" && (
          <ProcessingOverlay
            originalFile={originalFile}
            progress={progress}
            onCancel={handleCancel}
          />
        )}

        {(editorState === "result" || editorState === "bg-replace") &&
          result && (
            <ResultView
              result={result}
              backgroundOption={backgroundOption}
            />
          )}

        {editorState === "error" && (
          <ErrorState
            message={error ?? "An unexpected error occurred"}
            onRetry={handleRetry}
          />
        )}

        {editorState === "batch" && (
          <BatchQueue
            items={batchItems}
            overallProgress={batchProgress}
            isRunning={batchRunning}
            onStart={startBatch}
            onCancel={cancelBatch}
            onRemove={removeBatchItem}
            onDownloadAll={downloadAllAsZip}
          />
        )}
      </div>

      {/* Inspector Sidebar */}
      <Inspector
        editorState={editorState}
        activeEngine={activeEngine}
        engineStatus={engineStatus}
        loadProgress={loadProgress}
        onSwitchEngine={handleEngineSwitch}
        backgroundOption={backgroundOption}
        onBackgroundChange={handleBackgroundChange}
        outputResolution={outputResolution}
        onResolutionChange={setOutputResolution}
        onUploadClick={handleUploadClick}
        onDownload={handleDownload}
        onNewImage={handleNewImage}
        onRetry={handleRetry}
        onCancel={handleCancel}
        progress={progress}
        errorMessage={error}
      />

      {/* Tools Bar */}
      <ToolsBar />

      {/* Hidden file input for inspector button */}
      <input
        ref={uploadInputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(",")}
        multiple
        onChange={handleHiddenInputChange}
        className="hidden"
      />
    </div>
  );
}
