"use client";

import { useState, useCallback, useMemo } from "react";
import { Keyboard, X } from "lucide-react";

function useIsMac(): boolean {
  if (typeof navigator === "undefined") return false;
  // Use userAgentData when available, fall back to userAgent
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  if (nav.userAgentData?.platform) {
    return nav.userAgentData.platform === "macOS";
  }
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

export function ToolsBar() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const isMac = useIsMac();
  const modifier = isMac ? "Cmd" : "Ctrl";

  const shortcuts = useMemo(
    () => [
      { keys: `${modifier}+V`, action: "Paste image from clipboard" },
      { keys: `${modifier}+S`, action: "Download result" },
      { keys: `${modifier}+Z`, action: "Undo background replacement" },
      { keys: "Esc", action: "Cancel processing" },
    ],
    [modifier]
  );

  const toggleShortcuts = useCallback(() => {
    setShowShortcuts((prev) => !prev);
  }, []);

  return (
    <>
      <div className="flex h-full w-16 flex-col items-center justify-between border-l border-outline-variant/20 bg-surface-container-lowest py-4">
        {/* Top tools — intentionally empty after removing incomplete mask overlay */}
        <div className="flex flex-col items-center gap-2" />

        {/* Bottom tools */}
        <div className="flex flex-col items-center gap-2">
          {/* Keyboard shortcuts toggle */}
          <button
            type="button"
            onClick={toggleShortcuts}
            className={`relative flex h-10 w-10 items-center justify-center transition-colors ${
              showShortcuts
                ? "text-primary"
                : "text-outline hover:text-primary"
            }`}
            title="Keyboard shortcuts"
          >
            {showShortcuts && (
              <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary" />
            )}
            <Keyboard className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts panel */}
      {showShortcuts && (
        <div className="absolute bottom-16 right-20 z-50 w-72 border border-outline-variant/30 bg-surface-container-lowest shadow-lg">
          <div className="flex items-center justify-between border-b border-outline-variant/20 px-4 py-3">
            <h4 className="font-label text-[10px] uppercase tracking-widest text-outline">
              Keyboard Shortcuts
            </h4>
            <button
              type="button"
              onClick={toggleShortcuts}
              className="text-outline transition-colors hover:text-on-surface"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1 p-3">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.keys}
                className="flex items-center justify-between py-1"
              >
                <span className="font-body text-sm text-on-surface-variant">
                  {shortcut.action}
                </span>
                <kbd className="bg-surface-container px-2 py-0.5 font-mono text-[10px] text-on-surface">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
