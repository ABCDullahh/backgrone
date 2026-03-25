"use client";

import { useState, useCallback, useEffect } from "react";
import { useMLWorker } from "./use-ml-worker";
import type { EngineId, EngineStatus, BrowserCapabilities } from "@/types";

export function useModelManager() {
  const { send, cleanup } = useMLWorker();
  const [activeEngine, setActiveEngine] = useState<EngineId>("precision");
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("idle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [capabilities, setCapabilities] =
    useState<BrowserCapabilities | null>(null);

  useEffect(() => {
    const id = send({ type: "detect-capabilities" }, (msg) => {
      if (msg.type === "capabilities" && msg.capabilities) {
        setCapabilities(msg.capabilities as BrowserCapabilities);
        if (msg.engineId) {
          setActiveEngine(msg.engineId);
        }
      }
      cleanup(id);
    });
  }, [send, cleanup]);

  const switchEngine = useCallback(
    (engineId: EngineId) => {
      setEngineStatus("loading");
      setLoadProgress(0);
      const id = send({ type: "switch-engine", engineId }, (msg) => {
        if (msg.type === "progress" && msg.progress) {
          setLoadProgress(msg.progress.progress);
        }
        if (msg.type === "engine-status") {
          setEngineStatus(msg.engineStatus ?? "ready");
          setActiveEngine(engineId);
          cleanup(id);
        }
        if (msg.type === "error") {
          setEngineStatus("error");
          cleanup(id);
        }
      });
    },
    [send, cleanup]
  );

  return {
    activeEngine,
    engineStatus,
    loadProgress,
    capabilities,
    switchEngine,
  };
}
