// lib/interactive-hero/__tests__/useLetterClick.test.ts
import { renderHook, act } from "@testing-library/react";
import { useLetterClick } from "../hooks/useLetterClick";
import { VisibilityState } from "../types";

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
  set: jest.fn(),
  killTweensOf: jest.fn(),
}));

describe("useLetterClick", () => {
  const mockLetterRefs: React.RefObject<HTMLElement[]> = {
    current: [
      document.createElement("span"),
      document.createElement("span"),
      document.createElement("span"),
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(performance, "now").mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    expect(result.current.interactionCount).toBe(0);
    expect(result.current.lastEffectId).toBeNull();
  });

  it("handles letter click and increments count", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    expect(result.current.interactionCount).toBe(1);
  });

  it("tracks clicked letters", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
      await result.current.handleClick(2);
    });

    expect(result.current.clickedLetters.has(0)).toBe(true);
    expect(result.current.clickedLetters.has(2)).toBe(true);
    expect(result.current.clickedLetters.has(1)).toBe(false);
  });

  it("blocks clicks when frozen", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Frozen,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    expect(result.current.interactionCount).toBe(0);
  });

  it("blocks clicks when disabled", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: false,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    expect(result.current.interactionCount).toBe(0);
  });

  it("uses reduced intensity in Reduced state", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Reduced,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    // Click should still work but with reduced intensity
    expect(result.current.interactionCount).toBe(1);
  });

  it("never selects same effect twice in a row", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    const effectIds: string[] = [];

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.handleClick(0);
      });
      if (result.current.lastEffectId) {
        effectIds.push(result.current.lastEffectId);
      }
    }

    // Check no consecutive duplicates
    for (let i = 1; i < effectIds.length; i++) {
      expect(effectIds[i]).not.toBe(effectIds[i - 1]);
    }
  });
});
