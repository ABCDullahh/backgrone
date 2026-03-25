"use client";

import { useEffect, useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import type { ProcessingResult, BackgroundOption } from "@/types";
import { ENGINE_CONFIGS } from "@/types";
import { formatFileSize, formatDuration } from "@/lib/utils";

interface ResultViewProps {
  result: ProcessingResult;
  backgroundOption?: BackgroundOption;
}

function getBackgroundConfig(
  option?: BackgroundOption
): { className: string; style?: React.CSSProperties } {
  if (!option || option.type === "transparent") {
    return { className: "checkerboard-bg" };
  }
  if (option.type === "color") {
    return { className: "", style: { backgroundColor: option.value } };
  }
  if (option.type === "gradient") {
    const GRADIENT_PRESETS: [string, string][] = [
      ["#667eea", "#764ba2"],
      ["#f093fb", "#f5576c"],
      ["#4facfe", "#00f2fe"],
      ["#43e97b", "#38f9d7"],
      ["#fa709a", "#fee140"],
      ["#a18cd1", "#fbc2eb"],
    ];
    const colors = GRADIENT_PRESETS[option.preset] ?? GRADIENT_PRESETS[0];
    const dir = option.direction;
    let gradientCss: string;
    if (dir === "radial") {
      gradientCss = `radial-gradient(circle, ${colors[0]}, ${colors[1]})`;
    } else if (dir === "horizontal") {
      gradientCss = `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
    } else {
      gradientCss = `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`;
    }
    return { className: "", style: { background: gradientCss } };
  }
  if (option.type === "image") {
    return {
      className: "",
      style: {
        backgroundImage: `url(${option.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
    };
  }
  return { className: "checkerboard-bg" };
}

export function ResultView({ result, backgroundOption }: ResultViewProps) {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");

  useEffect(() => {
    const origUrl = URL.createObjectURL(result.originalImage);
    const resUrl = URL.createObjectURL(result.resultImage);
    setOriginalUrl(origUrl);
    setResultUrl(resUrl);
    return () => {
      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(resUrl);
    };
  }, [result]);

  const engineName = ENGINE_CONFIGS[result.engineId]?.name ?? result.engineId;

  if (!originalUrl || !resultUrl) return null;

  const bgConfig = getBackgroundConfig(backgroundOption);

  return (
    <div className="flex h-full flex-col">
      {/* Container — slider fills available space, images use object-fit */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-surface-container-low">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={originalUrl}
              alt="Original"
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          }
          itemTwo={
            <div
              className={`h-full w-full ${bgConfig.className}`}
              style={bgConfig.style}
            >
              <img
                src={resultUrl}
                alt="Background removed"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          }
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Metadata bar */}
      <div className="flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-lowest px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">
            {result.width} x {result.height}
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">
            {formatFileSize(result.resultImage.size)}
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">
            {formatDuration(result.processingTime)}
          </span>
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          Engine: {engineName}
        </span>
      </div>
    </div>
  );
}
