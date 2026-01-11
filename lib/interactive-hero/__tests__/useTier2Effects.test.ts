// lib/interactive-hero/__tests__/useTier2Effects.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTier2Effects } from "../hooks/useTier2Effects";
import { VisibilityState } from "../types";

// Mock GSAP
jest.mock("gsap", () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    then: jest.fn((cb) => {
      cb?.();
      return Promise.resolve();
    }),
  })),
}));

describe("useTier2Effects", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("returns canTrigger as false initially", () => {
    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Full,
        interactionCount: 0,
        timeOnPage: 0,
        scrollIntent: false,
        isScrollingUp: false,
      }),
    );

    expect(result.current.canTrigger).toBe(false);
  });

  it("allows trigger after 5 interactions and 8s time", () => {
    const { result } = renderHook((props) => useTier2Effects(props), {
      initialProps: {
        visibility: VisibilityState.Full,
        interactionCount: 5,
        timeOnPage: 8,
        scrollIntent: false,
        isScrollingUp: false,
      },
    });

    expect(result.current.canTrigger).toBe(true);
  });

  it("allows trigger with scroll intent instead of time", () => {
    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Full,
        interactionCount: 5,
        timeOnPage: 3, // Less than 8s
        scrollIntent: true, // But has scroll intent
        isScrollingUp: false,
      }),
    );

    expect(result.current.canTrigger).toBe(true);
  });

  it("blocks trigger when visibility is not Full", () => {
    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Reduced,
        interactionCount: 10,
        timeOnPage: 20,
        scrollIntent: true,
        isScrollingUp: false,
      }),
    );

    expect(result.current.canTrigger).toBe(false);
  });

  it("blocks trigger when scrolling up", () => {
    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Full,
        interactionCount: 10,
        timeOnPage: 20,
        scrollIntent: true,
        isScrollingUp: true,
      }),
    );

    expect(result.current.canTrigger).toBe(false);
  });

  it("triggers effect and enters cooldown", async () => {
    jest.spyOn(performance, "now").mockReturnValue(0);

    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Full,
        interactionCount: 5,
        timeOnPage: 8,
        scrollIntent: false,
        isScrollingUp: false,
      }),
    );

    expect(result.current.canTrigger).toBe(true);

    await act(async () => {
      await result.current.triggerEffect({ x: 0.5, y: 0.5 });
    });

    expect(result.current.canTrigger).toBe(false);
    expect(result.current.lastEffectId).not.toBeNull();
  });

  it("respects cooldown period", async () => {
    let mockTime = 0;
    jest.spyOn(performance, "now").mockImplementation(() => mockTime);

    const { result, rerender } = renderHook((props) => useTier2Effects(props), {
      initialProps: {
        visibility: VisibilityState.Full,
        interactionCount: 5,
        timeOnPage: 8,
        scrollIntent: false,
        isScrollingUp: false,
      },
    });

    // Trigger first effect
    await act(async () => {
      await result.current.triggerEffect({ x: 0.5, y: 0.5 });
    });

    // Immediately after, should be in cooldown
    expect(result.current.canTrigger).toBe(false);

    // Advance time past maximum cooldown (12s)
    mockTime = 13000;
    rerender({
      visibility: VisibilityState.Full,
      interactionCount: 6,
      timeOnPage: 21,
      scrollIntent: false,
      isScrollingUp: false,
    });

    // Should be able to trigger again
    expect(result.current.canTrigger).toBe(true);
  });

  it("never selects same effect twice in a row", async () => {
    let mockTime = 0;
    jest.spyOn(performance, "now").mockImplementation(() => mockTime);

    const { result, rerender } = renderHook((props) => useTier2Effects(props), {
      initialProps: {
        visibility: VisibilityState.Full,
        interactionCount: 5,
        timeOnPage: 8,
        scrollIntent: false,
        isScrollingUp: false,
      },
    });

    const effectIds: string[] = [];

    // Trigger multiple times (simulating cooldown passing)
    for (let i = 0; i < 5; i++) {
      mockTime = i * 15000; // 15s apart

      rerender({
        visibility: VisibilityState.Full,
        interactionCount: 5 + i,
        timeOnPage: 8 + i * 15,
        scrollIntent: false,
        isScrollingUp: false,
      });

      await act(async () => {
        const effect = await result.current.triggerEffect({ x: 0.5, y: 0.5 });
        if (effect) effectIds.push(effect.type);
      });
    }

    // Check no consecutive duplicates
    for (let i = 1; i < effectIds.length; i++) {
      expect(effectIds[i]).not.toBe(effectIds[i - 1]);
    }
  });

  it("does not trigger when interaction count is below threshold", () => {
    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Full,
        interactionCount: 4, // Less than 5
        timeOnPage: 20,
        scrollIntent: true,
        isScrollingUp: false,
      }),
    );

    expect(result.current.canTrigger).toBe(false);
  });

  it("does not trigger when time is below threshold and no scroll intent", () => {
    const { result } = renderHook(() =>
      useTier2Effects({
        visibility: VisibilityState.Full,
        interactionCount: 10,
        timeOnPage: 5, // Less than 8s
        scrollIntent: false, // No scroll intent
        isScrollingUp: false,
      }),
    );

    expect(result.current.canTrigger).toBe(false);
  });

  it("returns correct cooldownRemaining value", async () => {
    let mockTime = 0;
    jest.spyOn(performance, "now").mockImplementation(() => mockTime);

    const { result, rerender } = renderHook((props) => useTier2Effects(props), {
      initialProps: {
        visibility: VisibilityState.Full,
        interactionCount: 5,
        timeOnPage: 8,
        scrollIntent: false,
        isScrollingUp: false,
      },
    });

    // Initially no cooldown
    expect(result.current.cooldownRemaining).toBe(0);

    // Trigger effect
    await act(async () => {
      await result.current.triggerEffect({ x: 0.5, y: 0.5 });
    });

    // Cooldown should be between 8000 and 12000
    expect(result.current.cooldownRemaining).toBeGreaterThanOrEqual(8000);
    expect(result.current.cooldownRemaining).toBeLessThanOrEqual(12000);

    // Advance time by 5 seconds
    mockTime = 5000;
    rerender({
      visibility: VisibilityState.Full,
      interactionCount: 5,
      timeOnPage: 13,
      scrollIntent: false,
      isScrollingUp: false,
    });

    // Cooldown remaining should decrease
    expect(result.current.cooldownRemaining).toBeGreaterThanOrEqual(3000);
    expect(result.current.cooldownRemaining).toBeLessThanOrEqual(7000);
  });
});
