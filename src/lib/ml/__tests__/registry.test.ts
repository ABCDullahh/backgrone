import { describe, it, expect } from "vitest";
import { ModelRegistry } from "../registry";

describe("ModelRegistry", () => {
  it("initializes with 3 engines", () => {
    const registry = new ModelRegistry();
    expect(registry.getEngine("precision")).toBeDefined();
    expect(registry.getEngine("balanced")).toBeDefined();
    expect(registry.getEngine("lightweight")).toBeDefined();
  });

  it("defaults to precision engine", () => {
    const registry = new ModelRegistry();
    expect(registry.activeEngine).toBe("precision");
  });

  it("throws for unknown engine", () => {
    const registry = new ModelRegistry();
    expect(() => registry.getEngine("unknown" as any)).toThrow("Unknown engine");
  });

  it("autoSelectBest returns valid EngineId", () => {
    const registry = new ModelRegistry();
    const best = registry.autoSelectBest();
    expect(["precision", "balanced", "lightweight"]).toContain(best);
  });

  it("detectCapabilities returns correct shape", () => {
    const registry = new ModelRegistry();
    const caps = registry.detectCapabilities();
    expect(caps).toHaveProperty("webgpu");
    expect(caps).toHaveProperty("wasm");
    expect(caps).toHaveProperty("simd");
    expect(caps).toHaveProperty("sharedArrayBuffer");
    expect(typeof caps.webgpu).toBe("boolean");
    expect(typeof caps.wasm).toBe("boolean");
  });

  it("getEngine returns engine with correct interface", () => {
    const registry = new ModelRegistry();
    const engine = registry.getEngine("precision");
    expect(engine.id).toBe("precision");
    expect(engine.name).toBe("Precision");
    expect(engine.status).toBe("idle");
    expect(typeof engine.load).toBe("function");
    expect(typeof engine.process).toBe("function");
    expect(typeof engine.dispose).toBe("function");
  });

  it("disposeAll sets all engines to idle", () => {
    const registry = new ModelRegistry();
    registry.disposeAll();
    expect(registry.getEngine("precision").status).toBe("idle");
    expect(registry.getEngine("balanced").status).toBe("idle");
    expect(registry.getEngine("lightweight").status).toBe("idle");
  });
});
