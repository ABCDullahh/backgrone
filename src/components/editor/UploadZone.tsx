"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader } from "lucide-react";
import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from "@/lib/ml/types";

const SAMPLE_IMAGES = [
  { id: "product", label: "Product", color: "bg-surface-container", src: "/samples/watch-original.jpg" },
  { id: "person", label: "Person", color: "bg-surface-container-low", src: "/samples/portrait-original.jpg" },
  { id: "animal", label: "Animal", color: "bg-surface-variant", src: "/samples/dog-original.jpg" },
  { id: "car", label: "Car", color: "bg-surface-container-highest", src: "/samples/car-original.jpg" },
] as const;

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
}

export function UploadZone({ onFileSelect, onFilesSelect }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  const handleSampleClick = useCallback(
    async (sample: (typeof SAMPLE_IMAGES)[number]) => {
      setLoadingSample(sample.id);
      try {
        const response = await fetch(sample.src);
        if (!response.ok) throw new Error("Failed to fetch sample");
        const blob = await response.blob();
        const ext = sample.src.split(".").pop() ?? "jpg";
        const file = new File([blob], `sample-${sample.id}.${ext}`, {
          type: blob.type || "image/jpeg",
        });
        onFileSelect(file);
      } catch {
        // Sample not available — silently ignore
      } finally {
        setLoadingSample(null);
      }
    },
    [onFileSelect]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter(
        (f) =>
          ACCEPTED_FORMATS.includes(f.type as (typeof ACCEPTED_FORMATS)[number]) &&
          f.size <= MAX_FILE_SIZE
      );

      if (fileArray.length === 0) return;

      if (fileArray.length > 1 && onFilesSelect) {
        onFilesSelect(fileArray);
      } else if (fileArray.length > 0) {
        onFileSelect(fileArray[0]);
      }
    },
    [onFileSelect, onFilesSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    },
    [handleFiles]
  );

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <button
        type="button"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex w-full max-w-lg flex-col items-center justify-center gap-6 border-2 border-dashed p-16 transition-colors ${
          isDragOver
            ? "border-primary bg-surface-container"
            : "border-outline-variant hover:border-outline"
        }`}
      >
        <Upload className="h-12 w-12 text-outline" />
        <div className="text-center">
          <p className="font-headline text-xl text-on-surface">
            Drop image here or click to upload
          </p>
          <p className="mt-2 font-label text-[10px] uppercase tracking-widest text-outline">
            PNG, JPG, WEBP, HEIC — Max 20MB
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(",")}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="mt-8 flex items-center gap-2">
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          Try a sample
        </span>
        <div className="flex gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleClick(sample)}
              disabled={loadingSample !== null}
              className={`flex h-12 w-12 items-center justify-center ${sample.color} transition-colors hover:bg-surface-container-highest disabled:opacity-50`}
              title={`Try ${sample.label} sample`}
            >
              {loadingSample === sample.id ? (
                <Loader className="h-3 w-3 animate-spin text-on-surface-variant" />
              ) : (
                <span className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">
                  {sample.label.substring(0, 3)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-label text-[10px] uppercase tracking-widest text-outline">
        Or paste from clipboard (Ctrl+V)
      </p>
    </div>
  );
}
