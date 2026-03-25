"use client";

import type { EngineId, EngineStatus } from "@/types";
import { ENGINE_CONFIGS } from "@/types";

const ENGINE_IDS: EngineId[] = ["precision", "lightweight", "balanced"];

function StatusDot({ status }: { status: EngineStatus }) {
  const colors: Record<EngineStatus, string> = {
    idle: "bg-outline",
    loading: "bg-yellow-500 animate-pulse",
    ready: "bg-secondary-container",
    processing: "bg-secondary-container animate-pulse",
    error: "bg-error",
  };

  return <span className={`inline-block h-2 w-2 ${colors[status]}`} />;
}

function QualityStars({ count }: { count: number }) {
  return (
    <span className="font-label text-[10px] tracking-widest text-outline">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

interface EngineSelectorProps {
  activeEngine: EngineId;
  engineStatus: EngineStatus;
  loadProgress: number;
  onSwitch: (engineId: EngineId) => void;
}

export function EngineSelector({
  activeEngine,
  engineStatus,
  loadProgress,
  onSwitch,
}: EngineSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-label text-[10px] uppercase tracking-widest text-outline">
        Engine
      </h3>

      <div className="flex flex-col gap-1">
        {ENGINE_IDS.map((id) => {
          const config = ENGINE_CONFIGS[id];
          const isActive = activeEngine === id;
          const isLoading = isActive && engineStatus === "loading";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSwitch(id)}
              className={`relative flex flex-col gap-0.5 px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-l-2 border-primary bg-surface-container"
                  : "border-l-2 border-transparent hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-body text-sm font-medium text-on-surface">
                  {config.name}
                </span>
                <StatusDot
                  status={isActive ? engineStatus : "idle"}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                  {config.modelSize}
                </span>
                <QualityStars count={config.quality} />
              </div>

              {isLoading && (
                <div className="mt-1 h-[2px] w-full bg-surface-variant">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
