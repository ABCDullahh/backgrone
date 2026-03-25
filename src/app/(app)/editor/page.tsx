"use client";

import { Suspense } from "react";
import { EditorLayout } from "@/components/editor/EditorLayout";

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-5rem)] mt-20 items-center justify-center"><span className="font-label text-sm text-on-surface-variant">Loading editor...</span></div>}>
      <EditorLayout />
    </Suspense>
  );
}
