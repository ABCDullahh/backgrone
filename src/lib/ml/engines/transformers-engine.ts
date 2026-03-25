import type { MLEngine } from "../types";
import type { EngineStatus } from "@/types";

export class TransformersEngine implements MLEngine {
  id = "balanced" as const;
  name = "Balanced";
  description = "RMBG-1.4 via @huggingface/transformers";
  modelSize = "~44MB";
  status: EngineStatus = "idle";

  private segmenter: any = null;

  async load(onProgress: (progress: number) => void): Promise<void> {
    this.status = "loading";
    try {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;

      this.segmenter = await pipeline(
        "image-segmentation",
        "briaai/RMBG-1.4",
        {
          progress_callback: (data: any) => {
            if (data.progress) onProgress(Math.round(data.progress));
          },
        }
      );
      onProgress(100);
      this.status = "ready";
    } catch (err) {
      this.status = "error";
      throw new Error(`Failed to load Balanced engine: ${err}`);
    }
  }

  async process(imageData: ImageData): Promise<ImageData> {
    if (!this.segmenter || this.status !== "ready") {
      throw new Error("Engine not loaded");
    }
    this.status = "processing";
    try {
      const { RawImage } = await import("@huggingface/transformers");
      const rawImage = new RawImage(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height,
        4
      );

      const result = await this.segmenter(rawImage);
      const segResult = result[0];

      // Extract the mask — handle multiple API shapes across versions
      const maskRaw = segResult.mask ?? segResult;

      let maskImageData: ImageData;

      if (typeof maskRaw.toImageData === "function") {
        // v2-style: mask has a toImageData() method
        maskImageData = maskRaw.toImageData();
      } else if (maskRaw.data && maskRaw.width && maskRaw.height) {
        // v3-style: mask is a RawImage with .data (typed array), .width, .height
        const maskWidth: number = maskRaw.width;
        const maskHeight: number = maskRaw.height;
        const maskData: Uint8ClampedArray | Uint8Array = maskRaw.data;
        const channels: number = maskRaw.channels ?? 1;

        if (channels === 4) {
          // Already RGBA
          maskImageData = new ImageData(
            new Uint8ClampedArray(maskData),
            maskWidth,
            maskHeight
          );
        } else {
          // Single-channel grayscale mask — convert to RGBA
          const rgbaData = new Uint8ClampedArray(maskWidth * maskHeight * 4);
          for (let i = 0; i < maskWidth * maskHeight; i++) {
            const val = maskData[i * channels]; // take first channel
            rgbaData[i * 4] = 255;       // R
            rgbaData[i * 4 + 1] = 255;   // G
            rgbaData[i * 4 + 2] = 255;   // B
            rgbaData[i * 4 + 3] = val;   // A = mask value
          }
          maskImageData = new ImageData(rgbaData, maskWidth, maskHeight);
        }
      } else {
        throw new Error(
          "Unsupported mask format from segmentation pipeline. " +
          `Got keys: ${Object.keys(maskRaw).join(", ")}`
        );
      }

      const maskBitmap = await createImageBitmap(maskImageData);

      const outCanvas = new OffscreenCanvas(imageData.width, imageData.height);
      const outCtx = outCanvas.getContext("2d")!;
      outCtx.putImageData(imageData, 0, 0);
      outCtx.globalCompositeOperation = "destination-in";
      outCtx.drawImage(maskBitmap, 0, 0, imageData.width, imageData.height);

      this.status = "ready";
      return outCtx.getImageData(0, 0, imageData.width, imageData.height);
    } catch (err) {
      this.status = "error";
      throw new Error(`Processing failed: ${err}`);
    }
  }

  dispose(): void {
    this.segmenter = null;
    this.status = "idle";
  }
}
