declare module "onnxruntime-web" {
  export const env: {
    wasm: {
      wasmPaths: string;
      numThreads: number;
      simd: boolean;
    };
    logLevel: string;
  };

  export class Tensor {
    constructor(
      type: string,
      data: Float32Array | Int32Array | Uint8Array | BigInt64Array,
      dims: number[]
    );
    data: Float32Array | Int32Array | Uint8Array | BigInt64Array;
    dims: number[];
    type: string;
  }

  export class InferenceSession {
    static create(
      model: ArrayBuffer | string,
      options?: {
        executionProviders?: string[];
        graphOptimizationLevel?: string;
      }
    ): Promise<InferenceSession>;

    run(
      feeds: Record<string, Tensor>
    ): Promise<Record<string, Tensor>>;

    inputNames: string[];
    outputNames: string[];
    release(): void;
  }
}
