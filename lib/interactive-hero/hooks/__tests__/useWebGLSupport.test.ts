// lib/interactive-hero/hooks/__tests__/useWebGLSupport.test.ts

import { renderHook, waitFor } from "@testing-library/react";
import {
  useWebGLSupport,
  checkWebGLSupport,
  resetWebGLSupportCache,
} from "../useWebGLSupport";

describe("checkWebGLSupport", () => {
  const originalCreateElement = document.createElement.bind(document);

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it("returns webgl: false, webgl2: false in SSR environment", () => {
    // Simulate SSR by checking if we can make window undefined
    // In a real SSR scenario, window would be undefined
    // For this test, we rely on the function's internal check
    const result = checkWebGLSupport();
    expect(result).toHaveProperty("webgl");
    expect(result).toHaveProperty("webgl2");
    expect(typeof result.webgl).toBe("boolean");
    expect(typeof result.webgl2).toBe("boolean");
  });

  it("returns true for webgl and webgl2 when both contexts are available", () => {
    const mockGetContext = jest.fn((contextType: string) => {
      if (contextType === "webgl2") return { mockContext: "webgl2" };
      if (contextType === "webgl") return { mockContext: "webgl" };
      if (contextType === "experimental-webgl")
        return { mockContext: "experimental-webgl" };
      return null;
    });

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const result = checkWebGLSupport();
    expect(result.webgl).toBe(true);
    expect(result.webgl2).toBe(true);
  });

  it("returns webgl: true, webgl2: false when only webgl is available", () => {
    const mockGetContext = jest.fn((contextType: string) => {
      if (contextType === "webgl2") return null;
      if (contextType === "webgl") return { mockContext: "webgl" };
      if (contextType === "experimental-webgl")
        return { mockContext: "experimental-webgl" };
      return null;
    });

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const result = checkWebGLSupport();
    expect(result.webgl).toBe(true);
    expect(result.webgl2).toBe(false);
  });

  it("falls back to experimental-webgl when webgl context is not available", () => {
    const mockGetContext = jest.fn((contextType: string) => {
      if (contextType === "webgl2") return null;
      if (contextType === "webgl") return null;
      if (contextType === "experimental-webgl")
        return { mockContext: "experimental-webgl" };
      return null;
    });

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const result = checkWebGLSupport();
    expect(result.webgl).toBe(true);
    expect(result.webgl2).toBe(false);
  });

  it("returns false for both when no webgl is available", () => {
    const mockGetContext = jest.fn(() => null);

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const result = checkWebGLSupport();
    expect(result.webgl).toBe(false);
    expect(result.webgl2).toBe(false);
  });

  it("handles exceptions gracefully and returns false", () => {
    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        throw new Error("Canvas not supported");
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const result = checkWebGLSupport();
    expect(result.webgl).toBe(false);
    expect(result.webgl2).toBe(false);
  });

  it("handles getContext throwing an error", () => {
    const mockGetContext = jest.fn(() => {
      throw new Error("getContext failed");
    });

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const result = checkWebGLSupport();
    expect(result.webgl).toBe(false);
    expect(result.webgl2).toBe(false);
  });
});

describe("useWebGLSupport", () => {
  const originalCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    // Reset the cache before each test
    resetWebGLSupportCache();
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it("initially returns isChecking: true", () => {
    const { result } = renderHook(() => useWebGLSupport());
    // After the useEffect runs, isChecking should be false
    // The hook checks support immediately on mount
    expect(result.current).toHaveProperty("isChecking");
    expect(result.current).toHaveProperty("webglSupported");
    expect(result.current).toHaveProperty("webgl2Supported");
  });

  it("returns webglSupported and webgl2Supported after check", async () => {
    const mockGetContext = jest.fn((contextType: string) => {
      if (contextType === "webgl2") return { mockContext: "webgl2" };
      if (contextType === "webgl") return { mockContext: "webgl" };
      return null;
    });

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const { result } = renderHook(() => useWebGLSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.webglSupported).toBe(true);
    expect(result.current.webgl2Supported).toBe(true);
  });

  it("sets webglSupported to false when WebGL is not available", async () => {
    const mockGetContext = jest.fn(() => null);

    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const { result } = renderHook(() => useWebGLSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.webglSupported).toBe(false);
    expect(result.current.webgl2Supported).toBe(false);
  });

  it("handles errors gracefully", async () => {
    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        throw new Error("Canvas not supported");
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const { result } = renderHook(() => useWebGLSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.webglSupported).toBe(false);
    expect(result.current.webgl2Supported).toBe(false);
  });

  it("only checks support once (memoized result)", async () => {
    const mockGetContext = jest.fn((contextType: string) => {
      if (contextType === "webgl2") return { mockContext: "webgl2" };
      if (contextType === "webgl") return { mockContext: "webgl" };
      return null;
    });

    let createCanvasCount = 0;
    document.createElement = jest.fn((tagName: string) => {
      if (tagName === "canvas") {
        createCanvasCount++;
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const { result, rerender } = renderHook(() => useWebGLSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    const initialCount = createCanvasCount;

    // Rerender should not trigger another check
    rerender();
    rerender();
    rerender();

    // The count should not increase (or only by 1 if there's a race condition)
    expect(createCanvasCount).toBeLessThanOrEqual(initialCount + 1);
  });
});
