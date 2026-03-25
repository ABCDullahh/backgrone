import type { EngineId, EngineStatus, ProcessingProgress } from "@/types";

export interface MLEngine {
  id: EngineId;
  name: string;
  description: string;
  modelSize: string;
  status: EngineStatus;
  load(onProgress: (progress: number) => void): Promise<void>;
  process(imageData: ImageData): Promise<ImageData>;
  dispose(): void;
}

export interface MLWorkerIncoming {
  id: string;
  type:
    | "init"
    | "process"
    | "switch-engine"
    | "dispose"
    | "cancel"
    | "detect-capabilities";
  engineId?: EngineId;
  imageData?: ArrayBuffer;
  width?: number;
  height?: number;
}

export interface MLWorkerOutgoing {
  id: string;
  type:
    | "progress"
    | "result"
    | "error"
    | "engine-status"
    | "capabilities"
    | "cancelled";
  progress?: ProcessingProgress;
  result?: {
    imageData: ArrayBuffer;
    width: number;
    height: number;
    processingTime: number;
    engineId: EngineId;
  };
  error?: string;
  engineId?: EngineId;
  engineStatus?: EngineStatus;
  capabilities?: {
    webgpu: boolean;
    wasm: boolean;
    simd: boolean;
  };
}

export const ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_BATCH_SIZE = 20;
export const MODEL_INPUT_SIZE = 1024;
