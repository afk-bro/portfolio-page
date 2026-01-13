import "@testing-library/jest-dom";

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  // Helper to trigger intersection
  trigger(isIntersecting) {
    this.callback([{ isIntersecting }]);
  }
}

MockIntersectionObserver.instances = [];

global.IntersectionObserver = MockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false, // Default: reduced motion disabled
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollY
let mockScrollY = 0;
Object.defineProperty(window, "scrollY", {
  get: () => mockScrollY,
  set: (value) => {
    mockScrollY = value;
  },
});

// Helper to set scroll position
global.setMockScrollY = (value) => {
  mockScrollY = value;
};

// Mock GSAP context helper
const createMockContext = () => ({
  revert: jest.fn(),
  kill: jest.fn(),
  clear: jest.fn(),
});

// Mock GSAP
jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn((target, config) => {
    // Immediately call onComplete if provided
    if (config.onComplete) {
      setTimeout(() => config.onComplete(), 0);
    }
    return { kill: jest.fn() };
  }),
  timeline: jest.fn(() => ({
    to: jest.fn(function (target, config, position) {
      if (config.onComplete) {
        setTimeout(() => config.onComplete(), 0);
      }
      return this;
    }),
    kill: jest.fn(),
    progress: jest.fn(),
    then: jest.fn((callback) => {
      setTimeout(callback, 0);
      return Promise.resolve();
    }),
  })),
  context: jest.fn((fn) => {
    fn();
    return createMockContext();
  }),
  killTweensOf: jest.fn(),
  registerPlugin: jest.fn(),
  default: {
    set: jest.fn(),
    to: jest.fn((target, config) => {
      if (config.onComplete) {
        setTimeout(() => config.onComplete(), 0);
      }
      return { kill: jest.fn() };
    }),
    timeline: jest.fn(() => ({
      to: jest.fn(function (target, config, position) {
        if (config.onComplete) {
          setTimeout(() => config.onComplete(), 0);
        }
        return this;
      }),
      kill: jest.fn(),
      progress: jest.fn(),
      then: jest.fn((callback) => {
        setTimeout(callback, 0);
        return Promise.resolve();
      }),
    })),
    context: jest.fn((fn) => {
      fn();
      return createMockContext();
    }),
    killTweensOf: jest.fn(),
    registerPlugin: jest.fn(),
  },
}));

// Mock gsap/ScrollTrigger
jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: jest.fn(() => ({
      kill: jest.fn(),
    })),
    refresh: jest.fn(),
  },
}));
