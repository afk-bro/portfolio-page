// lib/interactive-hero/effects/webgl/__tests__/sweep.test.ts
import { createSweepEffect, type SweepEffectConfig } from "../sweep";

// Mock GSAP
jest.mock("gsap", () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    then: jest.fn((cb) => {
      cb?.();
      return Promise.resolve();
    }),
  })),
}));

describe("Light Sweep Effect", () => {
  const mockConfig: SweepEffectConfig = {
    direction: "left-to-right",
    intensity: 1.0,
    duration: 600,
    color: "#F5A623",
  };

  it("creates a sweep effect with correct config", () => {
    const result = createSweepEffect(mockConfig);

    expect(result).toBeDefined();
    expect(result.type).toBe("sweep");
    expect(result.direction).toBe("left-to-right");
  });

  it("returns timeline and update function", () => {
    const result = createSweepEffect(mockConfig);

    expect(result.timeline).toBeDefined();
    expect(result.update).toBeInstanceOf(Function);
  });

  it("calculates sweep position on update", () => {
    const result = createSweepEffect(mockConfig);

    // Initial state (off-screen left)
    const initial = result.update(0);
    expect(initial.position).toBeLessThan(0);

    // Mid animation (center)
    const mid = result.update(0.5);
    expect(mid.position).toBeCloseTo(0.5, 1);

    // End state (off-screen right)
    const end = result.update(1);
    expect(end.position).toBeGreaterThan(1);
  });

  it("has correct sweep width", () => {
    const result = createSweepEffect(mockConfig);

    const state = result.update(0.5);
    expect(state.width).toBe(0.2); // 20% of viewport
  });

  it("respects intensity for alpha", () => {
    const lowIntensity = createSweepEffect({ ...mockConfig, intensity: 0.5 });
    const highIntensity = createSweepEffect({ ...mockConfig, intensity: 1.0 });

    const lowState = lowIntensity.update(0.5);
    const highState = highIntensity.update(0.5);

    expect(lowState.alpha).toBeLessThan(highState.alpha);
  });

  it("supports right-to-left direction", () => {
    const rtlConfig = { ...mockConfig, direction: "right-to-left" as const };
    const result = createSweepEffect(rtlConfig);

    // Initial state (off-screen right)
    const initial = result.update(0);
    expect(initial.position).toBeGreaterThan(1);

    // End state (off-screen left)
    const end = result.update(1);
    expect(end.position).toBeLessThan(0);
  });

  it("returns correct color", () => {
    const result = createSweepEffect(mockConfig);

    const state = result.update(0.5);
    expect(state.color).toBe("#F5A623");
  });
});
