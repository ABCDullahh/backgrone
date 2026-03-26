"use client";

import { useState, useCallback, useRef } from "react";
import type { BackgroundOption } from "@/types";

function ImageUploadTab({
  fileInputRef,
  onImageUpload,
  currentSrc,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentSrc: string | null;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        // Create a synthetic event to reuse the existing handler
        const dt = new DataTransfer();
        dt.items.add(file);
        const input = fileInputRef.current;
        if (input) {
          input.files = dt.files;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    },
    [fileInputRef]
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onImageUpload}
        className="sr-only"
        tabIndex={-1}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed transition-colors ${
          isDragging
            ? "border-secondary bg-secondary/5"
            : "border-outline-variant hover:border-primary"
        }`}
      >
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          {isDragging ? "Drop image here" : "Click or drag image"}
        </span>
      </div>
      {currentSrc && (
        <img
          src={currentSrc}
          alt="Background preview"
          className="h-20 w-full object-cover"
        />
      )}
    </div>
  );
}

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#00bcd4",
  "#4caf50",
  "#ff9800",
  "#795548",
];

const PRESET_GRADIENTS: Array<{ colors: [string, string]; label: string }> = [
  { colors: ["#667eea", "#764ba2"], label: "Violet" },
  { colors: ["#f093fb", "#f5576c"], label: "Pink" },
  { colors: ["#4facfe", "#00f2fe"], label: "Cyan" },
  { colors: ["#43e97b", "#38f9d7"], label: "Mint" },
  { colors: ["#fa709a", "#fee140"], label: "Sunset" },
  { colors: ["#a18cd1", "#fbc2eb"], label: "Lavender" },
];

type TabId = "transparent" | "blank" | "color" | "gradient" | "image";

const TABS: { id: TabId; label: string }[] = [
  { id: "transparent", label: "Transparent" },
  { id: "blank", label: "Blank" },
  { id: "color", label: "Color" },
  { id: "gradient", label: "Gradient" },
  { id: "image", label: "Image" },
];

interface BackgroundReplaceProps {
  value: BackgroundOption;
  onChange: (option: BackgroundOption) => void;
}

export function BackgroundReplace({ value, onChange }: BackgroundReplaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>(value.type);
  const [hexInput, setHexInput] = useState(
    value.type === "color" ? value.value : "#ffffff"
  );
  const [gradientDirection, setGradientDirection] = useState<string>(
    value.type === "gradient" ? value.direction : "vertical"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      if (tab === "transparent") {
        onChange({ type: "transparent" });
      } else if (tab === "blank") {
        onChange({ type: "color", value: "#ffffff" });
      }
    },
    [onChange]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setHexInput(color);
      onChange({ type: "color", value: color });
    },
    [onChange]
  );

  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHexInput(val);
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        onChange({ type: "color", value: val });
      }
    },
    [onChange]
  );

  const handleGradientSelect = useCallback(
    (preset: number) => {
      onChange({ type: "gradient", preset, direction: gradientDirection });
    },
    [onChange, gradientDirection]
  );

  const handleDirectionChange = useCallback(
    (dir: string) => {
      setGradientDirection(dir);
      if (value.type === "gradient") {
        onChange({ type: "gradient", preset: value.preset, direction: dir });
      }
    },
    [onChange, value]
  );

  const previousBgUrlRef = useRef<string | null>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Revoke previous object URL to prevent memory leak
      if (previousBgUrlRef.current) {
        URL.revokeObjectURL(previousBgUrlRef.current);
      }
      const url = URL.createObjectURL(file);
      previousBgUrlRef.current = url;
      onChange({ type: "image", src: url });
      // Reset input so re-selecting the same file triggers onChange again
      e.target.value = "";
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-label text-[10px] uppercase tracking-widest text-outline">
        Background
      </h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-2 font-label text-[9px] uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "transparent" && (
          <div className="h-12 w-full checkerboard-bg" />
        )}

        {activeTab === "blank" && (
          <div className="h-12 w-full border border-outline-variant/30 bg-white" />
        )}

        {activeTab === "color" && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#ffffff"
              className="w-full border-b border-outline-variant bg-transparent px-0 py-2 font-body text-sm text-on-surface outline-none focus:border-primary"
            />
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`h-8 w-full transition-shadow ${
                    value.type === "color" && value.value === color
                      ? "ring-2 ring-primary ring-offset-1"
                      : "hover:ring-1 hover:ring-outline"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "gradient" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              {PRESET_GRADIENTS.map((grad, i) => (
                <button
                  key={grad.label}
                  type="button"
                  onClick={() => handleGradientSelect(i)}
                  className={`h-12 w-full transition-shadow ${
                    value.type === "gradient" && value.preset === i
                      ? "ring-2 ring-primary ring-offset-1"
                      : "hover:ring-1 hover:ring-outline"
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${grad.colors[0]}, ${grad.colors[1]})`,
                  }}
                  title={grad.label}
                />
              ))}
            </div>

            <div className="flex gap-1">
              {(
                [
                  { key: "horizontal", label: "H" },
                  { key: "vertical", label: "V" },
                  { key: "radial", label: "R" },
                ] as const
              ).map((dir) => (
                <button
                  key={dir.key}
                  type="button"
                  onClick={() => handleDirectionChange(dir.key)}
                  className={`flex-1 py-2 font-label text-[10px] uppercase tracking-widest transition-colors ${
                    gradientDirection === dir.key
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "image" && (
          <ImageUploadTab
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            currentSrc={value.type === "image" ? value.src : null}
          />
        )}
      </div>
    </div>
  );
}
