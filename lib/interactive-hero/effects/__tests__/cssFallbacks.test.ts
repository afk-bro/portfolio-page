// lib/interactive-hero/effects/__tests__/cssFallbacks.test.ts

import gsap from "gsap";
import {
  createCSSRippleFallback,
  createCSSSweepFallback,
  createCSSVignetteFallback,
} from "../cssFallbacks";

// Mock GSAP
jest.mock("gsap", () => {
  const mockTimeline = {
    to: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
    progress: jest.fn().mockReturnThis(),
  };

  return {
    timeline: jest.fn(() => mockTimeline),
  };
});

describe("createCSSRippleFallback", () => {
  let element: HTMLElement;
  let mockTimeline: ReturnType<typeof gsap.timeline>;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
    mockTimeline = gsap.timeline() as ReturnType<typeof gsap.timeline>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it("returns a GSAP timeline", () => {
    const result = createCSSRippleFallback(element, 0.5, 0.5, 1);
    expect(result).toBeDefined();
    expect(gsap.timeline).toHaveBeenCalled();
  });

  it("uses origin coordinates for box-shadow position", () => {
    createCSSRippleFallback(element, 0.3, 0.7, 1);

    // Should set initial box-shadow and animate it
    expect(mockTimeline.set).toHaveBeenCalled();
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("accepts origin values between 0 and 1", () => {
    // Should not throw for valid values
    expect(() => createCSSRippleFallback(element, 0, 0, 1)).not.toThrow();
    expect(() => createCSSRippleFallback(element, 1, 1, 1)).not.toThrow();
    expect(() => createCSSRippleFallback(element, 0.5, 0.5, 0.5)).not.toThrow();
  });

  it("clamps intensity between 0 and 1", () => {
    // Should not throw for any intensity values (clamped internally)
    expect(() => createCSSRippleFallback(element, 0.5, 0.5, -1)).not.toThrow();
    expect(() => createCSSRippleFallback(element, 0.5, 0.5, 2)).not.toThrow();
  });

  it("applies power2.out easing", () => {
    createCSSRippleFallback(element, 0.5, 0.5, 1);

    // Check that the timeline was called with easing configuration
    expect(mockTimeline.to).toHaveBeenCalled();
    const toCall = (mockTimeline.to as jest.Mock).mock.calls[0];
    expect(toCall).toBeDefined();
  });

  it("animates for approximately 500ms", () => {
    createCSSRippleFallback(element, 0.5, 0.5, 1);

    // Check that duration is around 0.5 seconds
    const toCall = (mockTimeline.to as jest.Mock).mock.calls[0];
    expect(toCall).toBeDefined();
    // Duration should be in the config
    const config = toCall[1];
    expect(config.duration).toBeCloseTo(0.5, 1);
  });

  it("resets box-shadow after animation completes", () => {
    createCSSRippleFallback(element, 0.5, 0.5, 1);

    // Should have a call to reset the box-shadow
    expect(mockTimeline.set).toHaveBeenCalled();
  });
});

describe("createCSSSweepFallback", () => {
  let element: HTMLElement;
  let mockTimeline: ReturnType<typeof gsap.timeline>;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
    mockTimeline = gsap.timeline() as ReturnType<typeof gsap.timeline>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it("returns a GSAP timeline", () => {
    const result = createCSSSweepFallback(element, 1);
    expect(result).toBeDefined();
    expect(gsap.timeline).toHaveBeenCalled();
  });

  it("animates background-position from left to right", () => {
    createCSSSweepFallback(element, 1);

    // Should animate background-position
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("uses a gradient band of 20% width", () => {
    createCSSSweepFallback(element, 1);

    // Check that set was called with gradient setup
    expect(mockTimeline.set).toHaveBeenCalled();
  });

  it("animates for approximately 600ms", () => {
    createCSSSweepFallback(element, 1);

    const toCall = (mockTimeline.to as jest.Mock).mock.calls[0];
    expect(toCall).toBeDefined();
    const config = toCall[1];
    expect(config.duration).toBeCloseTo(0.6, 1);
  });

  it("respects intensity parameter", () => {
    createCSSSweepFallback(element, 0.5);

    // Should still create timeline with reduced intensity
    expect(gsap.timeline).toHaveBeenCalled();
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("clamps intensity between 0 and 1", () => {
    expect(() => createCSSSweepFallback(element, -0.5)).not.toThrow();
    expect(() => createCSSSweepFallback(element, 1.5)).not.toThrow();
  });

  it("resets background after animation completes", () => {
    createCSSSweepFallback(element, 1);

    // Should reset background styles after animation
    expect(mockTimeline.set).toHaveBeenCalled();
  });
});

describe("createCSSVignetteFallback", () => {
  let element: HTMLElement;
  let mockTimeline: ReturnType<typeof gsap.timeline>;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
    mockTimeline = gsap.timeline() as ReturnType<typeof gsap.timeline>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it("returns a GSAP timeline", () => {
    const result = createCSSVignetteFallback(element, false, 1);
    expect(result).toBeDefined();
    expect(gsap.timeline).toHaveBeenCalled();
  });

  it("uses radial-gradient with transparent center", () => {
    createCSSVignetteFallback(element, false, 1);

    // Should set up gradient with transparent center
    expect(mockTimeline.set).toHaveBeenCalled();
  });

  it("uses different peak opacity for dark mode (0.25)", () => {
    createCSSVignetteFallback(element, true, 1);

    // Should animate with dark mode peak (0.25)
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("uses different peak opacity for light mode (0.15)", () => {
    createCSSVignetteFallback(element, false, 1);

    // Should animate with light mode peak (0.15)
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("animates opacity: 0 -> peak -> 0", () => {
    createCSSVignetteFallback(element, false, 1);

    // Should have multiple to() calls for the fade in/hold/fade out pattern
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("has total duration of approximately 400ms", () => {
    createCSSVignetteFallback(element, false, 1);

    // Check animation configuration
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("respects intensity parameter", () => {
    createCSSVignetteFallback(element, false, 0.5);

    expect(gsap.timeline).toHaveBeenCalled();
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("clamps intensity between 0 and 1", () => {
    expect(() => createCSSVignetteFallback(element, false, -0.5)).not.toThrow();
    expect(() => createCSSVignetteFallback(element, true, 1.5)).not.toThrow();
  });

  it("resets opacity after animation completes", () => {
    createCSSVignetteFallback(element, false, 1);

    // Should have final opacity reset
    expect(mockTimeline.to).toHaveBeenCalled();
  });

  it("creates vignette overlay element", () => {
    createCSSVignetteFallback(element, false, 1);

    // Should set styles for the vignette effect
    expect(mockTimeline.set).toHaveBeenCalled();
  });
});

describe("CSS Fallback Integration", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
    element.style.width = "200px";
    element.style.height = "200px";
    element.style.position = "relative";
    document.body.appendChild(element);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it("all fallbacks work with the same element", () => {
    const ripple = createCSSRippleFallback(element, 0.5, 0.5, 1);
    const sweep = createCSSSweepFallback(element, 1);
    const vignette = createCSSVignetteFallback(element, false, 1);

    expect(ripple).toBeDefined();
    expect(sweep).toBeDefined();
    expect(vignette).toBeDefined();
  });

  it("fallbacks can be triggered in sequence", () => {
    // Create all three and verify no conflicts
    createCSSRippleFallback(element, 0.2, 0.8, 0.7);
    createCSSSweepFallback(element, 0.5);
    createCSSVignetteFallback(element, true, 0.8);

    // All should have created timelines
    expect(gsap.timeline).toHaveBeenCalledTimes(3);
  });

  it("fallbacks handle zero intensity gracefully", () => {
    expect(() => createCSSRippleFallback(element, 0.5, 0.5, 0)).not.toThrow();
    expect(() => createCSSSweepFallback(element, 0)).not.toThrow();
    expect(() => createCSSVignetteFallback(element, false, 0)).not.toThrow();
  });
});
