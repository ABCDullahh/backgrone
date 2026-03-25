import { ModelRegistry } from "../lib/ml/registry";
import type { MLWorkerIncoming, MLWorkerOutgoing } from "../lib/ml/types";

const registry = new ModelRegistry();

function send(msg: MLWorkerOutgoing): void {
  if (msg.result?.imageData) {
    self.postMessage(msg, [msg.result.imageData] as any);
  } else {
    self.postMessage(msg);
  }
}

self.onmessage = async (event: MessageEvent<MLWorkerIncoming>) => {
  const { id, type, engineId, imageData, width, height } = event.data;

  switch (type) {
    case "detect-capabilities": {
      const caps = registry.detectCapabilities();
      const bestEngine = registry.autoSelectBest();
      send({
        id,
        type: "capabilities",
        capabilities: caps,
        engineId: bestEngine,
      });
      break;
    }

    case "switch-engine": {
      if (!engineId) break;
      try {
        await registry.switchEngine(engineId, (progress) => {
          send({
            id,
            type: "progress",
            progress: {
              stage: "loading-model",
              progress,
              message: `Loading ${registry.getEngine(engineId).name} engine...`,
            },
          });
        });
        send({ id, type: "engine-status", engineId, engineStatus: "ready" });
      } catch (err) {
        send({
          id,
          type: "error",
          error:
            err instanceof Error ? err.message : "Failed to switch engine",
          engineId,
          engineStatus: "error",
        });
      }
      break;
    }

    case "process": {
      if (!imageData || !width || !height) {
        send({ id, type: "error", error: "Missing image data" });
        break;
      }
      try {
        send({
          id,
          type: "progress",
          progress: {
            stage: "preprocessing",
            progress: 0,
            message: "Preparing image...",
          },
        });

        const engine = await registry.ensureLoaded((progress) => {
          send({
            id,
            type: "progress",
            progress: {
              stage: "loading-model",
              progress,
              message: "Loading model...",
            },
          });
        });

        send({
          id,
          type: "progress",
          progress: {
            stage: "inference",
            progress: 50,
            message: "Removing background...",
          },
        });

        const inputData = new ImageData(
          new Uint8ClampedArray(imageData),
          width,
          height
        );
        const startTime = performance.now();
        const result = await engine.process(inputData);
        const processingTime = performance.now() - startTime;

        send({
          id,
          type: "progress",
          progress: {
            stage: "postprocessing",
            progress: 90,
            message: "Finalizing...",
          },
        });

        const buffer = result.data.buffer.slice(0);
        send({
          id,
          type: "result",
          result: {
            imageData: buffer,
            width: result.width,
            height: result.height,
            processingTime,
            engineId: registry.activeEngine,
          },
        });
      } catch (err) {
        send({
          id,
          type: "error",
          error: err instanceof Error ? err.message : "Processing failed",
        });
      }
      break;
    }

    case "cancel": {
      // Cannot abort a running inference mid-execution, but we acknowledge
      // the cancellation so the host can clean up its pending promise.
      send({ id, type: "cancelled" });
      break;
    }

    case "dispose": {
      registry.disposeAll();
      send({ id, type: "engine-status", engineStatus: "idle" });
      break;
    }
  }
};
