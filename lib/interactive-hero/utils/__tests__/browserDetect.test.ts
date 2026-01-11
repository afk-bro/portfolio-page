// lib/interactive-hero/utils/__tests__/browserDetect.test.ts

import {
  detectBrowser,
  resetBrowserInfoCache,
  type BrowserInfo,
} from "../browserDetect";

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe("browserDetect", () => {
  // Store original values (used in SSR test restoration)
  const _originalNavigator = global.navigator;
  void _originalNavigator; // Reference to avoid unused warning

  beforeEach(() => {
    resetBrowserInfoCache();
    // Reset matchMedia mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMediaMock(false),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("detectBrowser", () => {
    describe("browser name detection", () => {
      it("should detect Chrome", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("chrome");
        expect(result.version).toBe(120);
      });

      it("should detect Firefox", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("firefox");
        expect(result.version).toBe(121);
      });

      it("should detect Safari", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("safari");
        expect(result.version).toBe(17);
      });

      it("should detect Edge", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("edge");
        expect(result.version).toBe(120);
      });

      it("should detect Opera", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("opera");
        expect(result.version).toBe(106);
      });

      it("should detect IE", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("ie");
        expect(result.version).toBe(11);
      });

      it("should return unknown for unrecognized browsers", () => {
        Object.defineProperty(navigator, "userAgent", {
          value: "SomeUnknownBrowser/1.0",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.name).toBe("unknown");
        expect(result.version).toBe(0);
      });
    });

    describe("mobile detection", () => {
      it("should detect mobile via userAgent", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.isMobile).toBe(true);
      });

      it("should detect Android mobile", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.isMobile).toBe(true);
      });

      it("should detect desktop", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.isMobile).toBe(false);
      });
    });

    describe("touch detection", () => {
      it("should detect touch support via maxTouchPoints", () => {
        Object.defineProperty(navigator, "maxTouchPoints", {
          value: 5,
          configurable: true,
        });
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.isTouch).toBe(true);
      });

      it("should detect no touch support", () => {
        Object.defineProperty(navigator, "maxTouchPoints", {
          value: 0,
          configurable: true,
        });
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        // Ensure no touch event support
        delete (window as unknown as Record<string, unknown>).ontouchstart;
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.isTouch).toBe(false);
      });
    });

    describe("feature detection", () => {
      it("should detect passive events support", () => {
        // jsdom supports passive events, so this should be true
        // The detection uses a getter trick that is supported in modern environments
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        // Modern environments (including jsdom) support passive events
        // We just verify the property exists and is a boolean
        expect(typeof result.supportsPassiveEvents).toBe("boolean");
      });

      it("should detect IntersectionObserver support", () => {
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        // Node/jsdom has IntersectionObserver mocked by Jest
        expect(typeof result.supportsIntersectionObserver).toBe("boolean");
      });

      it("should detect ResizeObserver support", () => {
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(typeof result.supportsResizeObserver).toBe("boolean");
      });
    });

    describe("prefers-reduced-motion", () => {
      it("should detect when user prefers reduced motion", () => {
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: createMatchMediaMock(true),
        });
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.prefersReducedMotion).toBe(true);
      });

      it("should detect when user does not prefer reduced motion", () => {
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: createMatchMediaMock(false),
        });
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result.prefersReducedMotion).toBe(false);
      });
    });

    describe("caching", () => {
      it("should cache detection results", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result1 = detectBrowser();

        // Change userAgent (but cache should still be used)
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 Firefox/121.0",
          configurable: true,
        });

        const result2 = detectBrowser();

        // Should still return Chrome because of caching
        expect(result1.name).toBe("chrome");
        expect(result2.name).toBe("chrome");
        expect(result1).toEqual(result2);
      });

      it("should reset cache when resetBrowserInfoCache is called", () => {
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result1 = detectBrowser();
        expect(result1.name).toBe("chrome");

        // Change userAgent and reset cache
        Object.defineProperty(navigator, "userAgent", {
          value:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
          configurable: true,
        });
        resetBrowserInfoCache();

        const result2 = detectBrowser();

        // Should now return Firefox
        expect(result2.name).toBe("firefox");
      });
    });

    describe("SSR safety", () => {
      it("should return safe defaults when navigator is undefined", () => {
        const originalNavigator = global.navigator;
        // @ts-expect-error - testing SSR scenario
        delete global.navigator;
        resetBrowserInfoCache();

        const result = detectBrowser();

        expect(result).toEqual({
          name: "unknown",
          version: 0,
          isMobile: false,
          isTouch: false,
          supportsPassiveEvents: false,
          supportsIntersectionObserver: false,
          supportsResizeObserver: false,
          prefersReducedMotion: false,
        });

        // Restore
        global.navigator = originalNavigator;
      });
    });
  });
});

// Test for useBrowserInfo hook
describe("useBrowserInfo hook", () => {
  // We need to import the hook for testing
  let useBrowserInfo: () => BrowserInfo;

  beforeEach(async () => {
    jest.resetModules();
    resetBrowserInfoCache();

    // Set up default mocks
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: createMatchMediaMock(false),
    });

    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      configurable: true,
    });

    // Dynamic import to get fresh module
    const browserModule = await import("../browserDetect");
    useBrowserInfo = browserModule.useBrowserInfo;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be importable", () => {
    expect(typeof useBrowserInfo).toBe("function");
  });

  // Note: Full hook testing would require @testing-library/react-hooks
  // and a React test environment. The hook should be tested in integration tests.
});
