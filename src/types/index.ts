export type EngineId = "precision" | "balanced" | "lightweight";

export type EngineStatus =
  | "idle"
  | "loading"
  | "ready"
  | "processing"
  | "error";

export type EditorState =
  | "empty"
  | "processing"
  | "result"
  | "bg-replace"
  | "batch"
  | "error";

export interface EngineConfig {
  id: EngineId;
  name: string;
  description: string;
  modelSize: string;
  quality: number;
}

export const ENGINE_CONFIGS: Record<EngineId, EngineConfig> = {
  precision: {
    id: "precision",
    name: "Precision",
    description: "ISNet fp16 — Best quality, largest download",
    modelSize: "~84MB",
    quality: 5,
  },
  balanced: {
    id: "balanced",
    name: "Balanced",
    description: "RMBG-1.4 — Good quality via Transformers.js",
    modelSize: "~44MB",
    quality: 3,
  },
  lightweight: {
    id: "lightweight",
    name: "Lightweight",
    description: "ISNet uint8 — Great quality, smallest download",
    modelSize: "~42MB",
    quality: 4,
  },
};

export interface ProcessingResult {
  originalImage: Blob;
  resultImage: Blob;
  maskImage: Blob | null;
  width: number;
  height: number;
  processingTime: number;
  engineId: EngineId;
}

export interface ProcessingProgress {
  stage: "loading-model" | "preprocessing" | "inference" | "postprocessing";
  progress: number;
  message: string;
}

export interface BrowserCapabilities {
  webgpu: boolean;
  wasm: boolean;
  simd: boolean;
  sharedArrayBuffer: boolean;
}

export type BackgroundOption =
  | { type: "transparent" }
  | { type: "color"; value: string }
  | { type: "gradient"; preset: number; direction: string }
  | { type: "image"; src: string };

export type OutputResolution = "original" | "50" | "25";

export interface SampleImage {
  id: string;
  category: "product" | "people" | "animal" | "car" | "graphic";
  name: string;
  originalSrc: string;
  resultSrc: string;
}
