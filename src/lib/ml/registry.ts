import type { MLEngine } from "./types";
import type { EngineId, BrowserCapabilities } from "@/types";
import { ImglyEngine } from "./engines/imgly-engine";
import { TransformersEngine } from "./engines/transformers-engine";
import { OnnxEngine } from "./engines/onnx-engine";

export class ModelRegistry {
  private engines: Map<EngineId, MLEngine> = new Map();
  private _activeEngine: EngineId;

  constructor() {
    this.engines.set("precision", new ImglyEngine());
    this.engines.set("balanced", new TransformersEngine());
    this.engines.set("lightweight", new OnnxEngine());
    this._activeEngine = "precision";
  }

  get activeEngine(): EngineId {
    return this._activeEngine;
  }

  getEngine(id: EngineId): MLEngine {
    const engine = this.engines.get(id);
    if (!engine) throw new Error(`Unknown engine: ${id}`);
    return engine;
  }

  async switchEngine(
    id: EngineId,
    onProgress: (progress: number) => void
  ): Promise<void> {
    const current = this.engines.get(this._activeEngine);
    if (current && current.status !== "idle") {
      current.dispose();
    }
    this._activeEngine = id;
    const engine = this.getEngine(id);
    if (engine.status === "idle" || engine.status === "error") {
      await engine.load(onProgress);
    }
  }

  async ensureLoaded(
    onProgress: (progress: number) => void
  ): Promise<MLEngine> {
    const engine = this.getEngine(this._activeEngine);
    if (engine.status === "idle" || engine.status === "error") {
      await engine.load(onProgress);
    }
    return engine;
  }

  detectCapabilities(): BrowserCapabilities {
    return {
      webgpu: typeof navigator !== "undefined" && "gpu" in navigator,
      wasm: typeof WebAssembly !== "undefined",
      simd: detectSIMD(),
      sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
    };
  }

  autoSelectBest(): EngineId {
    const caps = this.detectCapabilities();
    if (caps.webgpu) return "precision";
    if (caps.wasm && caps.simd) return "balanced";
    return "lightweight";
  }

  disposeAll(): void {
    for (const engine of this.engines.values()) {
      engine.dispose();
    }
  }
}

function detectSIMD(): boolean {
  try {
    return WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
        10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
      ])
    );
  } catch {
    return false;
  }
}
