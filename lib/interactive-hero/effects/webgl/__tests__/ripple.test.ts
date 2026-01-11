// lib/interactive-hero/effects/webgl/__tests__/ripple.test.ts
import { createRippleEffect, type RippleEffectConfig } from "../ripple";

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
    progress: jest.fn().mockReturnThis(),
  })),
}));

describe("Ripple Displacement Effect", () => {
  const mockConfig: RippleEffectConfig = {
    origin: { x: 0.5, y: 0.5 }, // center of canvas
    intensity: 1.0,
    duration: 500,
  };

  it("creates a ripple effect with correct config", () => {
    const result = createRippleEffect(mockConfig);

    expect(result).toBeDefined();
    expect(result.type).toBe("ripple");
    expect(result.origin).toEqual({ x: 0.5, y: 0.5 });
  });

  it("returns timeline and update function", () => {
    const result = createRippleEffect(mockConfig);

    expect(result.timeline).toBeDefined();
    expect(result.update).toBeInstanceOf(Function);
  });

  it("calculates displacement values on update", () => {
    const result = createRippleEffect(mockConfig);

    // Initial state
    const initial = result.update(0);
    expect(initial.radius).toBe(0);
    expect(initial.strength).toBeGreaterThan(0);

    // Mid animation
    const mid = result.update(0.5);
    expect(mid.radius).toBeGreaterThan(0);
    expect(mid.radius).toBeLessThan(1.5);

    // End state
    const end = result.update(1);
    expect(end.radius).toBeCloseTo(1.5, 1);
    expect(end.alpha).toBe(0);
  });

  it("respects intensity parameter", () => {
    const lowIntensity = createRippleEffect({ ...mockConfig, intensity: 0.5 });
    const highIntensity = createRippleEffect({ ...mockConfig, intensity: 1.0 });

    const lowUpdate = lowIntensity.update(0.5);
    const highUpdate = highIntensity.update(0.5);

    expect(lowUpdate.strength).toBeLessThan(highUpdate.strength);
  });

  it("applies power2.out easing to radius", () => {
    const result = createRippleEffect(mockConfig);

    // At progress 0.5, power2.out gives 0.75 (1 - (1-0.5)^2)
    const mid = result.update(0.5);
    const expectedRadius = 1.5 * 0.75; // ~1.125
    expect(mid.radius).toBeCloseTo(expectedRadius, 1);
  });
});
