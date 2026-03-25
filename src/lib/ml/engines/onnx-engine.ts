import type { MLEngine } from "../types";
import type { EngineStatus } from "@/types";

export class OnnxEngine implements MLEngine {
  id = "lightweight" as const;
  name = "Lightweight";
  description = "ISNet uint8 — Smallest, fast on old hardware";
  modelSize = "~42MB";
  status: EngineStatus = "idle";

  private removeBackground:
    | ((blob: Blob, config?: any) => Promise<Blob>)
    | null = null;

  async load(onProgress: (progress: number) => void): Promise<void> {
    this.status = "loading";
    try {
      const mod = await import("@imgly/background-removal");
      this.removeBackground = mod.removeBackground;
      onProgress(20);

      // Force model preload with tiny image
      const tiny = new OffscreenCanvas(1, 1);
      const ctx = tiny.getContext("2d")!;
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(0, 0, 1, 1);
      const tinyBlob = await tiny.convertToBlob({ type: "image/png" });
      await this.removeBackground(tinyBlob, {
        model: "isnet_quint8",
        output: { format: "image/png", type: "foreground" },
        progress: (key: string, current: number, total: number) => {
          if (total > 0) onProgress(20 + Math.round((current / total) * 80));
        },
      });

      onProgress(100);
      this.status = "ready";
    } catch (err) {
      this.status = "error";
      throw new Error(`Failed to load Lightweight engine: ${err}`);
    }
  }

  async process(imageData: ImageData): Promise<ImageData> {
    if (!this.removeBackground || this.status !== "ready") {
      throw new Error("Engine not loaded");
    }
    this.status = "processing";
    try {
      const canvas = new OffscreenCanvas(imageData.width, imageData.height);
      const ctx = canvas.getContext("2d")!;
      ctx.putImageData(imageData, 0, 0);
      const blob = await canvas.convertToBlob({ type: "image/png" });

      const resultBlob = await this.removeBackground(blob, {
        model: "isnet_quint8",
        output: { format: "image/png", type: "foreground" },
      });

      const resultBitmap = await createImageBitmap(resultBlob);
      const resultCanvas = new OffscreenCanvas(
        resultBitmap.width,
        resultBitmap.height
      );
      const resultCtx = resultCanvas.getContext("2d")!;
      resultCtx.drawImage(resultBitmap, 0, 0);
      this.status = "ready";
      return resultCtx.getImageData(
        0,
        0,
        resultBitmap.width,
        resultBitmap.height
      );
    } catch (err) {
      this.status = "error";
      throw new Error(`Processing failed: ${err}`);
    }
  }

  dispose(): void {
    this.removeBackground = null;
    this.status = "idle";
  }
}
