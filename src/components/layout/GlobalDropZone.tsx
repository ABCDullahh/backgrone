"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Upload } from "lucide-react";

export function GlobalDropZone() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDragging, setIsDragging] = useState(false);

  // Don't show overlay on editor page (it has its own drop zone)
  const isEditorPage = pathname === "/editor";

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (isEditorPage) return;
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    },
    [isEditorPage]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    // Only hide if leaving the window (not entering a child element)
    if (e.relatedTarget === null) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (isEditorPage) return;

      const file = e.dataTransfer?.files[0];
      if (
        file &&
        [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
        ].includes(file.type)
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          sessionStorage.setItem(
            "backgrone-pending-file",
            reader.result as string
          );
          sessionStorage.setItem("backgrone-pending-filename", file.name);
          sessionStorage.setItem("backgrone-pending-type", file.type);
          router.push("/editor");
        };
        reader.readAsDataURL(file);
      }
    },
    [isEditorPage, router]
  );

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  if (!isDragging || isEditorPage) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center bg-secondary">
          <Upload className="h-10 w-10 text-white" />
        </div>
        <p className="font-headline text-3xl font-black text-white">
          Drop to Remove Background
        </p>
        <p className="font-label text-xs uppercase tracking-widest text-white/60">
          Release to open in editor
        </p>
      </div>
    </div>
  );
}
