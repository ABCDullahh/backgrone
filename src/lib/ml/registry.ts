import type { MLEngine } from "./types";
import type { EngineId, BrowserCapabilities } from "@/types";
import { ImglyEngine } from "./engines/imgly-engine";
import { TransformersEngine } from "./engines/transformers-engine";
import { OnnxEngine } from "./engines/onnx-engine";

export class ModelRegistry {
  private engines: Map<EngineId, MLEngine> = new Map();
  private _activeEngine: EngineId;
  private loadingPromise: Map<EngineId, Promise<void>> = new Map();

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
      this.loadingPromise.delete(this._activeEngine);
    }
    this._activeEngine = id;
    await this.ensureLoaded(onProgress);
  }

  async ensureLoaded(
    onProgress: (progress: number) => void
  ): Promise<MLEngine> {
    const id = this._activeEngine;
    const engine = this.getEngine(id);

    // Already ready — return immediately
    if (engine.status === "ready") return engine;

    // Currently loading — wait for the existing load to finish
    const existing = this.loadingPromise.get(id);
    if (existing) {
      await existing;
      return engine;
    }

    // Idle or error — start loading
    if (engine.status === "idle" || engine.status === "error") {
      const promise = engine.load(onProgress);
      this.loadingPromise.set(id, promise);
      try {
        await promise;
      } finally {
        this.loadingPromise.delete(id);
      }
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
