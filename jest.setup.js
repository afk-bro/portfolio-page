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
