import { describe, it, expect } from "vitest";
import { ENGINE_CONFIGS } from "../index";

describe("ENGINE_CONFIGS", () => {
  it("has 3 engine configs", () => {
    expect(Object.keys(ENGINE_CONFIGS)).toHaveLength(3);
  });

  it("precision config is correct", () => {
    expect(ENGINE_CONFIGS.precision.name).toBe("Precision");
    expect(ENGINE_CONFIGS.precision.quality).toBe(5);
  });

  it("balanced config is correct", () => {
    expect(ENGINE_CONFIGS.balanced.name).toBe("Balanced");
    expect(ENGINE_CONFIGS.balanced.quality).toBe(3);
  });

  it("lightweight config is correct", () => {
    expect(ENGINE_CONFIGS.lightweight.name).toBe("Lightweight");
    expect(ENGINE_CONFIGS.lightweight.quality).toBe(4);
  });

  it("all configs have required fields", () => {
    for (const config of Object.values(ENGINE_CONFIGS)) {
      expect(config.id).toBeDefined();
      expect(config.name).toBeDefined();
      expect(config.description).toBeDefined();
      expect(config.modelSize).toBeDefined();
      expect(config.quality).toBeGreaterThan(0);
    }
  });
});
