// lib/interactive-hero/__tests__/useScrollLinkedProps.test.ts
import { renderHook } from "@testing-library/react";
import { useScrollLinkedProps } from "../hooks/useScrollLinkedProps";

// Mock GSAP
jest.mock("gsap", () => ({
  to: jest.fn((target, config) => {
    // Immediately apply the values for testing
    if (config.onUpdate) config.onUpdate();
    return { kill: jest.fn() };
  }),
  quickTo: jest.fn(() => jest.fn()),
}));

describe("useScrollLinkedProps", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0,
        scrollVelocity: 0,
        enabled: true,
      }),
    );

    expect(result.current.letterRotation).toBe(0);
    expect(result.current.shimmerPosition).toBe(0);
    expect(result.current.glowIntensity).toBeCloseTo(0.06, 2);
  });

  it("updates shimmer position based on scroll progress", () => {
    const { result, rerender } = renderHook(
      (props) => useScrollLinkedProps(props),
      {
        initialProps: {
          scrollProgress: 0,
          scrollVelocity: 0,
          enabled: true,
        },
      },
    );

    rerender({
      scrollProgress: 0.5,
      scrollVelocity: 0,
      enabled: true,
    });

    expect(result.current.shimmerPosition).toBe(50); // 50%
  });

  it("clamps letter rotation at max velocity", () => {
    const { result } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0,
        scrollVelocity: 5000, // Very high velocity
        enabled: true,
      }),
    );

    // Should be clamped at 180 degrees
    expect(result.current.letterRotation).toBeLessThanOrEqual(180);
  });

  it("scales glow intensity with velocity", () => {
    const { result: lowVelocity } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0,
        scrollVelocity: 100,
        enabled: true,
      }),
    );

    const { result: highVelocity } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0,
        scrollVelocity: 1000,
        enabled: true,
      }),
    );

    expect(highVelocity.current.glowIntensity).toBeGreaterThan(
      lowVelocity.current.glowIntensity,
    );
  });

  it("keeps glow intensity within bounds", () => {
    const { result } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0,
        scrollVelocity: 10000, // Extreme velocity
        enabled: true,
      }),
    );

    expect(result.current.glowIntensity).toBeGreaterThanOrEqual(0.06);
    expect(result.current.glowIntensity).toBeLessThanOrEqual(0.12);
  });

  it("returns zero values when disabled", () => {
    const { result } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0.5,
        scrollVelocity: 500,
        enabled: false,
      }),
    );

    expect(result.current.letterRotation).toBe(0);
    expect(result.current.shimmerPosition).toBe(0);
    expect(result.current.glowIntensity).toBe(0.06);
  });

  it("provides CSS variable values", () => {
    const { result } = renderHook(() =>
      useScrollLinkedProps({
        scrollProgress: 0.5,
        scrollVelocity: 500,
        enabled: true,
      }),
    );

    expect(result.current.cssVars).toBeDefined();
    expect(result.current.cssVars["--hero-shimmer-position"]).toBeDefined();
    expect(result.current.cssVars["--hero-glow-intensity"]).toBeDefined();
  });
});
