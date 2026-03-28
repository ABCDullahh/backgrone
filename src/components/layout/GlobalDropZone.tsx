"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Upload } from "lucide-react";

export function GlobalDropZone() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const isEditorPage = pathname === "/editor";

  useEffect(() => {
    if (isEditorPage) return;

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer?.types.includes("Files")) return;
      dragCounter.current++;
      if (dragCounter.current === 1) {
        setIsDragging(true);
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);

      const file = e.dataTransfer?.files[0];
      if (!file) return;

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ];
      if (!validTypes.includes(file.type)) return;

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
    };

    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);
    };
  }, [isEditorPage, router]);

  if (!isDragging || isEditorPage) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/80 backdrop-blur-sm"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragging(false);

        const file = e.dataTransfer?.files[0];
        if (!file) return;

        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
        ];
        if (!validTypes.includes(file.type)) return;

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
      }}
    >
      <div className="flex flex-col items-center gap-6 pointer-events-none">
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
