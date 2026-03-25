import { describe, it, expect } from "vitest";
import { ACCEPTED_FORMATS, MAX_FILE_SIZE, MAX_BATCH_SIZE, MODEL_INPUT_SIZE } from "../types";

describe("ML Constants", () => {
  it("has correct accepted formats", () => {
    expect(ACCEPTED_FORMATS).toContain("image/jpeg");
    expect(ACCEPTED_FORMATS).toContain("image/png");
    expect(ACCEPTED_FORMATS).toContain("image/webp");
    expect(ACCEPTED_FORMATS).toContain("image/heic");
  });

  it("has correct max file size (20MB)", () => {
    expect(MAX_FILE_SIZE).toBe(20 * 1024 * 1024);
  });

  it("has correct max batch size (20)", () => {
    expect(MAX_BATCH_SIZE).toBe(20);
  });

  it("has correct model input size (1024)", () => {
    expect(MODEL_INPUT_SIZE).toBe(1024);
  });
});
