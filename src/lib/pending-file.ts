"use client";

/**
 * In-memory store for passing files between pages during client-side navigation.
 * Avoids sessionStorage size limits (~5-10MB) that fail silently on large images.
 * Uses delayed clear to survive React strict mode double-mount in dev.
 */

let pendingFile: File | null = null;
let consumed = false;

export function setPendingFile(file: File) {
  pendingFile = file;
  consumed = false;
}

export function consumePendingFile(): File | null {
  if (consumed) return null;
  const file = pendingFile;
  if (file) {
    consumed = true;
    // Clear the reference after a tick so strict mode's second mount
    // can still see the consumed flag but won't reprocess
    setTimeout(() => {
      pendingFile = null;
    }, 2000);
  }
  return file;
}
