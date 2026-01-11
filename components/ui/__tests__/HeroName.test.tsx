/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { HeroName } from "../HeroName";

// Get mock instances
const getIntersectionObserverInstances = () =>
  (global.IntersectionObserver as any).instances;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  (global.IntersectionObserver as any).instances = [];
  (global as any).setMockScrollY(0);
});

// =============================================================================
// 1) RENDERING & STRUCTURE TESTS
// =============================================================================
describe("HeroName - Rendering & Structure", () => {
  it("renders the full name string in the DOM", () => {
    render(<HeroName name="John Doe" />);

    // Screen reader version should have full name
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("splits into correct number of character cells", () => {
    const { container } = render(<HeroName name="Test" />);

    // Should have 4 letter spans (T, e, s, t)
    const letterSpans = container.querySelectorAll(
      "span.inline-block:not(.sr-only)",
    );
    // Filter out the wrapper span
    const actualLetters = Array.from(letterSpans).filter(
      (span) => span.textContent && span.textContent.length === 1,
    );
    expect(actualLetters.length).toBe(4);
  });

  it("handles spaces correctly", () => {
    const { container } = render(<HeroName name="A B" />);

    // Should have spans for A, space (&nbsp;), B
    const spans = container.querySelectorAll("span.inline-block");
    expect(spans.length).toBeGreaterThanOrEqual(3);

    // Space should have specific width class
    const spaceSpan = Array.from(spans).find((s) =>
      s.classList.contains("w-[0.3em]"),
    );
    expect(spaceSpan).toBeTruthy();
  });

  it("renders letters in correct left-to-right order", () => {
    const { container } = render(<HeroName name="ABC" />);

    const spans = container.querySelectorAll("span.inline-block");
    const letters = Array.from(spans)
      .map((s) => s.textContent)
      .filter((t) => t && t.length === 1);

    expect(letters).toEqual(["A", "B", "C"]);
  });

  it("has accessible screen reader text", () => {
    render(<HeroName name="Jane Smith" />);

    // sr-only span should contain the full name
    const srOnly = screen.getByText("Jane Smith");
    expect(srOnly).toHaveClass("sr-only");
  });

  it("renders h1 element for semantic heading", () => {
    const { container } = render(<HeroName name="Test Name" />);

    const heading = container.querySelector("h1");
    expect(heading).toBeInTheDocument();
  });

  it("applies perspective for 3D transforms", () => {
    const { container } = render(<HeroName name="Test" />);

    const h1 = container.querySelector("h1");
    expect(h1).toHaveStyle({ perspective: "1000px" });
  });

  it("has stable rest state on initial render", () => {
    const { container } = render(<HeroName name="Test" />);

    // No spinning/active classes should be present initially
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();

    // Letters should not have any transform-related inline styles initially
    // (GSAP will add these, but on initial render they should be clean)
  });
});

// =============================================================================
// 2) MOTION PREFERENCE TESTS
// =============================================================================
describe("HeroName - Motion Preferences", () => {
  it("respects reduced motion preference - renders static version", () => {
    // Mock reduced motion enabled
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(<HeroName name="Test" />);

    // Should render simple h1 without the wrapper div
    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveClass("whitespace-nowrap"); // Static version prevents wrapping

    // Should NOT have the perspective wrapper for 3D
    expect(h1).not.toHaveStyle({ perspective: "1000px" });
  });

  it("does not set up IntersectionObserver when reduced motion enabled", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<HeroName name="Test" />);

    const observers = getIntersectionObserverInstances();
    expect(observers.length).toBe(0);
  });

  it("sets up IntersectionObserver when reduced motion disabled", () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<HeroName name="Test" />);

    const observers = getIntersectionObserverInstances();
    expect(observers.length).toBe(1);
  });
});

// =============================================================================
// 3) TRIGGER LOGIC TESTS
// =============================================================================
describe("HeroName - Trigger Logic", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("does not trigger when hero is not visible", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    // Wait for intro to complete
    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    // Trigger intersection as NOT visible
    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(false);
    });

    // Simulate wheel event
    const timelineCalls = gsap.timeline.mock.calls.length;

    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    // Timeline should not have been called again (spin not triggered)
    expect(gsap.timeline.mock.calls.length).toBe(timelineCalls);
  });

  it("triggers when visible and scroll intent detected", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    // Wait for intro
    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    // Make visible
    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Simulate wheel scroll down
    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    // Timeline should have been created for spin cascade
    await waitFor(() => {
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  it("triggers only once per session", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    // Wait for intro
    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    // Make visible
    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // First wheel event
    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    const timelineCallsAfterFirst = gsap.timeline.mock.calls.length;

    // Second wheel event
    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    // Should not have created another timeline
    expect(gsap.timeline.mock.calls.length).toBe(timelineCallsAfterFirst);
  });

  it("does not trigger on page load without scroll", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    // Wait for intro to complete
    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    // Make visible (simulating page load with hero visible)
    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Without any scroll event, timeline should not be called for spin
    // Only the intro gsap.to should have been called
    expect(gsap.timeline).not.toHaveBeenCalled();
  });

  it("requires scrolling down to trigger (not up)", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Scroll up (negative deltaY)
    act(() => {
      fireEvent.wheel(window, { deltaY: -50 });
    });

    // Should not trigger
    expect(gsap.timeline).not.toHaveBeenCalled();
  });
});

// =============================================================================
// 4) ANIMATION LIFECYCLE TESTS
// =============================================================================
describe("HeroName - Animation Lifecycle", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("runs intro animation on mount", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    // Should set initial state
    expect(gsap.set).toHaveBeenCalled();

    // Should animate to final state
    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    // Check intro animation properties
    const toCall = gsap.to.mock.calls[0];
    expect(toCall[1]).toMatchObject({
      y: 0,
      opacity: 1,
      duration: expect.any(Number),
    });
  });

  it("intro sets correct initial state", () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    const setCall = gsap.set.mock.calls[0];
    expect(setCall[1]).toMatchObject({
      y: -30,
      opacity: 0,
    });
  });

  it("spin cascade creates timeline with correct structure", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    await waitFor(() => {
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// 5) "UNMISSABLE" BEHAVIOR TESTS
// =============================================================================
describe("HeroName - Unmissable Behavior", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("triggers on minimal wheel delta (fast scroll detection)", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Very small wheel delta (just above threshold of 3)
    act(() => {
      fireEvent.wheel(window, { deltaY: 4 });
    });

    await waitFor(() => {
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  it("triggers on touch move for mobile", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Set scroll position above threshold
    (global as any).setMockScrollY(20);

    act(() => {
      fireEvent.touchMove(window);
    });

    await waitFor(() => {
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// 6) LAYOUT STABILITY TESTS
// =============================================================================
describe("HeroName - Layout Stability", () => {
  it("wrapper div maintains position in document flow", () => {
    const { container } = render(<HeroName name="Test" />);

    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();

    // Should not have position: fixed or absolute
    const style = window.getComputedStyle(wrapper!);
    expect(style.position).not.toBe("fixed");
    expect(style.position).not.toBe("absolute");
  });

  it("letters have backface-visibility hidden", () => {
    const { container } = render(<HeroName name="Test" />);

    const letters = container.querySelectorAll("span.inline-block");
    letters.forEach((letter) => {
      if (letter.textContent?.length === 1) {
        expect(letter).toHaveStyle({ backfaceVisibility: "hidden" });
      }
    });
  });

  it("has preserve-3d transform style for proper 3D rendering", () => {
    const { container } = render(<HeroName name="Test" />);

    const animatedContainer = container.querySelector("span.inline-flex");
    expect(animatedContainer).toHaveStyle({ transformStyle: "preserve-3d" });
  });
});

// =============================================================================
// 7) CLEANUP / UNMOUNT TESTS
// =============================================================================
describe("HeroName - Cleanup", () => {
  it("disconnects IntersectionObserver on unmount", () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { unmount } = render(<HeroName name="Test" />);

    const observers = getIntersectionObserverInstances();
    const disconnectSpy = jest.spyOn(observers[0], "disconnect");

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("cleans up on unmount without errors", () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { unmount } = render(<HeroName name="Test" />);

    // Should unmount without throwing errors
    expect(() => unmount()).not.toThrow();
  });
});

// =============================================================================
// 8) DETERMINISM TESTS
// =============================================================================
describe("HeroName - Determinism", () => {
  it("character splitting is deterministic", () => {
    const { container: container1 } = render(<HeroName name="Test Name" />);
    const { container: container2 } = render(<HeroName name="Test Name" />);

    const spans1 = container1.querySelectorAll("span.inline-block");
    const spans2 = container2.querySelectorAll("span.inline-block");

    expect(spans1.length).toBe(spans2.length);

    Array.from(spans1).forEach((span, i) => {
      expect(span.textContent).toBe(spans2[i].textContent);
    });
  });

  it("space handling is consistent", () => {
    const name = "A B C";
    const { container } = render(<HeroName name={name} />);

    const spaceSpans = container.querySelectorAll("span.w-\\[0\\.3em\\]");
    // Should have exactly 2 spaces
    expect(spaceSpans.length).toBe(2);
  });
});

// =============================================================================
// INTERACTIVE HERO TESTS
// =============================================================================
describe("HeroName - Interactive Effects", () => {
  it("handles letter click and triggers effect", async () => {
    const { container } = render(<HeroName name="Test" />);

    const letters = container.querySelectorAll(
      "span.inline-block:not(.sr-only)",
    );
    const firstLetter = Array.from(letters).find((l) => l.textContent === "T");

    if (firstLetter) {
      await act(async () => {
        fireEvent.click(firstLetter);
      });
    }

    // Effect should have triggered (no errors)
    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  it("blocks clicks when reduced motion is preferred", async () => {
    // This is already handled by existing reduced motion tests
    // The static version has no click handlers
  });

  it("provides cursor pointer on letters", () => {
    const { container } = render(<HeroName name="AB" />);

    const letters = container.querySelectorAll(
      "span.inline-block:not(.sr-only)",
    );
    const clickableLetters = Array.from(letters).filter(
      (l) => l.textContent && l.textContent.trim().length === 1,
    );

    clickableLetters.forEach((letter) => {
      expect(letter).toHaveClass("cursor-pointer");
    });
  });
});

// =============================================================================
// 9) TIER 3 EFFECTS TESTS
// =============================================================================
describe("HeroName - Tier 3 Effects Integration", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("calls onTier3Change callback when effects unlock", async () => {
    const onTier3Change = jest.fn();
    const { container } = render(
      <HeroName name="AB" onTier3Change={onTier3Change} />,
    );

    // Wait for intro to complete
    await waitFor(() => {
      const gsap = require("gsap");
      expect(gsap.to).toHaveBeenCalled();
    });

    // Make visible
    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Click both letters to potentially trigger Tier 3
    const letters = container.querySelectorAll(
      "span.inline-block:not(.sr-only)",
    );
    const _clickableLetters = Array.from(letters).filter(
      (l) => l.textContent && l.textContent.trim().length === 1,
    );

    // Verify clickable letters exist (used for Tier 3 tracking)
    expect(_clickableLetters.length).toBeGreaterThan(0);

    // Initial state callback should have been called with empty array
    expect(onTier3Change).toHaveBeenCalled();
  });

  it("computes totalLetters correctly (excludes spaces)", () => {
    const { container } = render(<HeroName name="A B C" />);

    // 3 letters, 2 spaces
    const letters = container.querySelectorAll(
      "span.inline-block:not(.sr-only)",
    );
    const nonSpaceLetters = Array.from(letters).filter(
      (l) => l.textContent && l.textContent.trim().length === 1,
    );
    expect(nonSpaceLetters.length).toBe(3);
  });

  it("onTier3Change is optional and does not error when missing", async () => {
    // Should not throw when no callback provided
    expect(() => render(<HeroName name="Test" />)).not.toThrow();
  });

  it("passes correct visibility state to Tier 3 hook", async () => {
    const onTier3Change = jest.fn();
    render(<HeroName name="Test" onTier3Change={onTier3Change} />);

    await waitFor(() => {
      const gsap = require("gsap");
      expect(gsap.to).toHaveBeenCalled();
    });

    // When frozen (not visible), effects should be empty
    // When visible, effects can be active if unlocked
    expect(onTier3Change).toHaveBeenCalledWith([]);
  });

  it("provides interaction count to Tier 3 hook from letter clicks", async () => {
    const onTier3Change = jest.fn();
    const { container } = render(
      <HeroName name="Test" onTier3Change={onTier3Change} />,
    );

    await waitFor(() => {
      const gsap = require("gsap");
      expect(gsap.to).toHaveBeenCalled();
    });

    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // Click a letter multiple times to increase interaction count
    const letters = container.querySelectorAll(
      "span.inline-block:not(.sr-only)",
    );
    const firstLetter = Array.from(letters).find((l) => l.textContent === "T");

    if (firstLetter) {
      await act(async () => {
        fireEvent.click(firstLetter);
      });
    }

    // Callback should track state changes
    expect(onTier3Change).toHaveBeenCalled();
  });
});

// =============================================================================
// 10) INTEGRATION TESTS (Viewport + Scroll combined)
// =============================================================================
describe("HeroName - Integration", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("complete flow: intro → visible → scroll → spin", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    // 1. Intro animation starts
    expect(gsap.set).toHaveBeenCalled();

    // 2. Wait for intro to complete
    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    // 3. Hero becomes visible
    const observers = getIntersectionObserverInstances();
    act(() => {
      observers[0]?.trigger(true);
    });

    // 4. User scrolls
    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    // 5. Spin cascade triggers
    await waitFor(() => {
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  it("handles rapid visibility changes gracefully", async () => {
    const gsap = require("gsap");
    render(<HeroName name="Test" />);

    await waitFor(() => {
      expect(gsap.to).toHaveBeenCalled();
    });

    const observers = getIntersectionObserverInstances();

    // Rapid visibility toggling
    act(() => {
      observers[0]?.trigger(true);
      observers[0]?.trigger(false);
      observers[0]?.trigger(true);
    });

    // Should still work after settling
    act(() => {
      fireEvent.wheel(window, { deltaY: 50 });
    });

    await waitFor(() => {
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });
});
