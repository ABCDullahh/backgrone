"use client";

import { useRef, useCallback, useEffect } from "react";
import type { MLWorkerIncoming, MLWorkerOutgoing } from "@/lib/ml/types";

let workerInstance: Worker | null = null;
let listenerCount = 0;
const messageHandlers = new Map<string, (msg: MLWorkerOutgoing) => void>();

function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("@/workers/ml-worker.ts", import.meta.url)
    );
    workerInstance.onmessage = (event: MessageEvent<MLWorkerOutgoing>) => {
      const handler = messageHandlers.get(event.data.id);
      if (handler) handler(event.data);
    };
  }
  listenerCount++;
  return workerInstance;
}

function releaseWorker(): void {
  listenerCount--;
  if (listenerCount <= 0 && workerInstance) {
    workerInstance.terminate();
    workerInstance = null;
    listenerCount = 0;
    messageHandlers.clear();
  }
}

let idCounter = 0;
function nextId(): string {
  return `msg-${++idCounter}-${Date.now()}`;
}

export function useMLWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = getWorker();
    return () => releaseWorker();
  }, []);

  const send = useCallback(
    (
      msg: Omit<MLWorkerIncoming, "id">,
      onMessage: (response: MLWorkerOutgoing) => void
    ): string => {
      const id = nextId();
      messageHandlers.set(id, onMessage);
      workerRef.current?.postMessage({ ...msg, id } as MLWorkerIncoming);
      return id;
    },
    []
  );

  const cleanup = useCallback((id: string) => {
    messageHandlers.delete(id);
  }, []);

  return { send, cleanup };
}
