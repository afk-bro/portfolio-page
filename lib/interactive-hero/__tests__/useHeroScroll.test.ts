// lib/interactive-hero/__tests__/useHeroScroll.test.ts
import { renderHook, act } from "@testing-library/react";
import { useHeroScroll } from "../hooks/useHeroScroll";

// Mock GSAP and ScrollTrigger
jest.mock("gsap", () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(() => ({ kill: jest.fn() })),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    kill: jest.fn(),
  })),
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: jest.fn(() => ({
      kill: jest.fn(),
      progress: 0,
      direction: 1,
      getVelocity: jest.fn(() => 0),
    })),
    refresh: jest.fn(),
  },
}));

describe("useHeroScroll", () => {
  const mockContainerRef = { current: document.createElement("div") };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: true,
      }),
    );

    expect(result.current.scrollIntent).toBe(false);
    expect(result.current.scrollProgress).toBe(0);
    expect(result.current.scrollVelocity).toBe(0);
    expect(result.current.isScrollingUp).toBe(false);
    expect(result.current.isPinned).toBe(false);
  });

  it("detects scroll intent from wheel event", () => {
    const { result } = renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: true,
      }),
    );

    act(() => {
      const wheelEvent = new WheelEvent("wheel", { deltaY: 5 });
      window.dispatchEvent(wheelEvent);
    });

    expect(result.current.scrollIntent).toBe(true);
  });

  it("does not detect scroll intent from small wheel delta", () => {
    const { result } = renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: true,
      }),
    );

    act(() => {
      const wheelEvent = new WheelEvent("wheel", { deltaY: 2 });
      window.dispatchEvent(wheelEvent);
    });

    expect(result.current.scrollIntent).toBe(false);
  });

  it("tracks scroll direction", () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: true,
      }),
    );

    // Simulate scrolling down
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });
      window.dispatchEvent(new Event("scroll"));
      // Advance time past throttle delay (16ms)
      jest.advanceTimersByTime(20);
    });

    expect(result.current.isScrollingUp).toBe(false);

    // Simulate scrolling up
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 50, writable: true });
      window.dispatchEvent(new Event("scroll"));
      // Advance time past throttle delay
      jest.advanceTimersByTime(20);
    });

    expect(result.current.isScrollingUp).toBe(true);

    jest.useRealTimers();
  });

  it("does not setup ScrollTrigger when disabled", () => {
    const { ScrollTrigger } = require("gsap/ScrollTrigger");

    renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: false,
      }),
    );

    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it("cleans up on unmount", () => {
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    const mockKill = jest.fn();
    ScrollTrigger.create.mockReturnValue({
      kill: mockKill,
      progress: 0,
      direction: 1,
      getVelocity: jest.fn(),
    });

    const { unmount } = renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: true,
      }),
    );

    unmount();

    expect(mockKill).toHaveBeenCalled();
  });

  it("provides time on page in seconds", () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useHeroScroll({
        containerRef: mockContainerRef,
        enabled: true,
      }),
    );

    expect(result.current.timeOnPage).toBe(0);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeOnPage).toBeGreaterThanOrEqual(5);

    jest.useRealTimers();
  });
});
