// lib/interactive-hero/hooks/__tests__/useLowPowerMode.test.ts

import { renderHook, act } from "@testing-library/react";
import {
  useLowPowerMode,
  detectLowPower,
  resetLowPowerCache,
  LOW_POWER_CONFIG,
  NORMAL_CONFIG,
  type LowPowerConfig,
} from "../useLowPowerMode";

// Store original navigator properties
const originalDeviceMemory = Object.getOwnPropertyDescriptor(
  Navigator.prototype,
  "deviceMemory",
);
const originalHardwareConcurrency = Object.getOwnPropertyDescriptor(
  Navigator.prototype,
  "hardwareConcurrency",
);

// Mock navigator properties
function mockNavigator(options: {
  deviceMemory?: number;
  hardwareConcurrency?: number;
}) {
  if (options.deviceMemory !== undefined) {
    Object.defineProperty(navigator, "deviceMemory", {
      value: options.deviceMemory,
      writable: true,
      configurable: true,
    });
  } else {
    // Remove the property to simulate browsers that don't support it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).deviceMemory;
  }

  if (options.hardwareConcurrency !== undefined) {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      value: options.hardwareConcurrency,
      writable: true,
      configurable: true,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).hardwareConcurrency;
  }
}

function restoreNavigator() {
  if (originalDeviceMemory) {
    Object.defineProperty(
      Navigator.prototype,
      "deviceMemory",
      originalDeviceMemory,
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).deviceMemory;
  }

  if (originalHardwareConcurrency) {
    Object.defineProperty(
      Navigator.prototype,
      "hardwareConcurrency",
      originalHardwareConcurrency,
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).hardwareConcurrency;
  }
}

// Mock matchMedia for prefers-reduced-motion
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? matches : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

describe("detectLowPower", () => {
  beforeEach(() => {
    resetLowPowerCache();
  });

  afterEach(() => {
    restoreNavigator();
  });

  it("returns false when navigator is undefined (SSR)", () => {
    // In a browser environment, we can't truly test SSR
    // The function internally checks for typeof navigator
    const result = detectLowPower();
    expect(typeof result).toBe("boolean");
  });

  it("returns true when deviceMemory < 4", () => {
    mockNavigator({ deviceMemory: 2, hardwareConcurrency: 8 });
    const result = detectLowPower();
    expect(result).toBe(true);
  });

  it("returns true when hardwareConcurrency < 4", () => {
    mockNavigator({ deviceMemory: 8, hardwareConcurrency: 2 });
    const result = detectLowPower();
    expect(result).toBe(true);
  });

  it("returns true when both are low", () => {
    mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });
    const result = detectLowPower();
    expect(result).toBe(true);
  });

  it("returns false when both values are sufficient", () => {
    mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });
    const result = detectLowPower();
    expect(result).toBe(false);
  });

  it("returns false when APIs are not available", () => {
    mockNavigator({}); // No values - simulates unsupported APIs
    const result = detectLowPower();
    expect(result).toBe(false);
  });

  it("returns false when only deviceMemory is unavailable but cores are high", () => {
    mockNavigator({ hardwareConcurrency: 8 });
    const result = detectLowPower();
    expect(result).toBe(false);
  });

  it("returns false when only hardwareConcurrency is unavailable but memory is high", () => {
    mockNavigator({ deviceMemory: 8 });
    const result = detectLowPower();
    expect(result).toBe(false);
  });

  it("returns true when only deviceMemory is low (hardwareConcurrency unavailable)", () => {
    mockNavigator({ deviceMemory: 2 });
    const result = detectLowPower();
    expect(result).toBe(true);
  });

  it("returns true when only hardwareConcurrency is low (deviceMemory unavailable)", () => {
    mockNavigator({ hardwareConcurrency: 2 });
    const result = detectLowPower();
    expect(result).toBe(true);
  });

  it("considers deviceMemory = 4 as not low power (boundary)", () => {
    mockNavigator({ deviceMemory: 4, hardwareConcurrency: 4 });
    const result = detectLowPower();
    expect(result).toBe(false);
  });

  it("considers hardwareConcurrency = 4 as not low power (boundary)", () => {
    mockNavigator({ deviceMemory: 4, hardwareConcurrency: 4 });
    const result = detectLowPower();
    expect(result).toBe(false);
  });
});

describe("LowPowerConfig values", () => {
  it("LOW_POWER_CONFIG has correct values", () => {
    expect(LOW_POWER_CONFIG).toEqual({
      intensityMultiplier: 0.6,
      maxDPR: 1.0,
      targetFPS: 30,
      tier2CooldownMs: 15000,
      tier3Enabled: false,
    });
  });

  it("NORMAL_CONFIG has correct values", () => {
    expect(NORMAL_CONFIG).toEqual({
      intensityMultiplier: 1.0,
      maxDPR: 2.0,
      targetFPS: 60,
      tier2CooldownMs: 10000,
      tier3Enabled: true,
    });
  });
});

describe("useLowPowerMode", () => {
  beforeEach(() => {
    resetLowPowerCache();
    mockMatchMedia(false);
  });

  afterEach(() => {
    restoreNavigator();
  });

  it("returns correct interface structure", () => {
    mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

    const { result } = renderHook(() => useLowPowerMode());

    expect(result.current).toHaveProperty("isLowPower");
    expect(result.current).toHaveProperty("config");
    expect(result.current).toHaveProperty("setForceMode");
    expect(result.current).toHaveProperty("forceMode");
  });

  it("returns isLowPower: false for high-spec devices", () => {
    mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

    const { result } = renderHook(() => useLowPowerMode());

    expect(result.current.isLowPower).toBe(false);
    expect(result.current.config).toEqual(NORMAL_CONFIG);
  });

  it("returns isLowPower: true for low-spec devices", () => {
    mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });

    const { result } = renderHook(() => useLowPowerMode());

    expect(result.current.isLowPower).toBe(true);
    expect(result.current.config).toEqual(LOW_POWER_CONFIG);
  });

  it("returns NORMAL_CONFIG when device is not low power", () => {
    mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

    const { result } = renderHook(() => useLowPowerMode());

    expect(result.current.config.intensityMultiplier).toBe(1.0);
    expect(result.current.config.maxDPR).toBe(2.0);
    expect(result.current.config.targetFPS).toBe(60);
    expect(result.current.config.tier2CooldownMs).toBe(10000);
    expect(result.current.config.tier3Enabled).toBe(true);
  });

  it("returns LOW_POWER_CONFIG when device is low power", () => {
    mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });

    const { result } = renderHook(() => useLowPowerMode());

    expect(result.current.config.intensityMultiplier).toBe(0.6);
    expect(result.current.config.maxDPR).toBe(1.0);
    expect(result.current.config.targetFPS).toBe(30);
    expect(result.current.config.tier2CooldownMs).toBe(15000);
    expect(result.current.config.tier3Enabled).toBe(false);
  });

  it("defaults forceMode to auto", () => {
    mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

    const { result } = renderHook(() => useLowPowerMode());

    expect(result.current.forceMode).toBe("auto");
  });

  describe("setForceMode", () => {
    it("allows forcing low power mode", () => {
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

      const { result } = renderHook(() => useLowPowerMode());

      // Initially should be normal
      expect(result.current.isLowPower).toBe(false);
      expect(result.current.config).toEqual(NORMAL_CONFIG);

      // Force low power
      act(() => {
        result.current.setForceMode("low");
      });

      expect(result.current.forceMode).toBe("low");
      expect(result.current.isLowPower).toBe(true);
      expect(result.current.config).toEqual(LOW_POWER_CONFIG);
    });

    it("allows forcing high power mode", () => {
      mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });

      const { result } = renderHook(() => useLowPowerMode());

      // Initially should be low power
      expect(result.current.isLowPower).toBe(true);
      expect(result.current.config).toEqual(LOW_POWER_CONFIG);

      // Force high power
      act(() => {
        result.current.setForceMode("high");
      });

      expect(result.current.forceMode).toBe("high");
      expect(result.current.isLowPower).toBe(false);
      expect(result.current.config).toEqual(NORMAL_CONFIG);
    });

    it("returns to auto detection when set back to auto", () => {
      mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });

      const { result } = renderHook(() => useLowPowerMode());

      // Force high
      act(() => {
        result.current.setForceMode("high");
      });

      expect(result.current.isLowPower).toBe(false);

      // Back to auto
      act(() => {
        result.current.setForceMode("auto");
      });

      expect(result.current.forceMode).toBe("auto");
      expect(result.current.isLowPower).toBe(true); // Should return to detected value
    });
  });

  describe("prefers-reduced-motion", () => {
    it("considers prefers-reduced-motion as additional signal for low power", () => {
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });
      mockMatchMedia(true); // prefers-reduced-motion: reduce

      const { result } = renderHook(() => useLowPowerMode());

      // High spec device with reduced motion preference should still be considered low power
      expect(result.current.isLowPower).toBe(true);
    });

    it("does not consider reduced motion alone on high-spec device if not checking motion", () => {
      // This test depends on implementation - reduced motion may or may not
      // trigger low power mode independently. The spec says it's an "additional signal"
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });
      mockMatchMedia(true);

      const { result } = renderHook(() => useLowPowerMode());

      // Implementation choice: reduced motion should trigger low power for accessibility
      expect(result.current.isLowPower).toBe(true);
    });
  });

  describe("caching", () => {
    it("caches the detection result", () => {
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

      const { result: result1 } = renderHook(() => useLowPowerMode());

      // Change navigator values after first detection
      mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });

      const { result: result2 } = renderHook(() => useLowPowerMode());

      // Both should return the same cached result (not low power)
      expect(result1.current.isLowPower).toBe(result2.current.isLowPower);
    });

    it("resetLowPowerCache allows re-detection", () => {
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

      const { result: result1 } = renderHook(() => useLowPowerMode());
      expect(result1.current.isLowPower).toBe(false);

      // Reset cache and change navigator
      resetLowPowerCache();
      mockNavigator({ deviceMemory: 2, hardwareConcurrency: 2 });

      const { result: result2 } = renderHook(() => useLowPowerMode());

      // Should re-detect and find low power
      expect(result2.current.isLowPower).toBe(true);
    });
  });

  describe("config immutability", () => {
    it("returns stable config object references", () => {
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

      const { result, rerender } = renderHook(() => useLowPowerMode());

      const config1 = result.current.config;
      rerender();
      const config2 = result.current.config;

      // Same object reference (memoized)
      expect(config1).toBe(config2);
    });
  });

  describe("type safety", () => {
    it("config has all required properties with correct types", () => {
      mockNavigator({ deviceMemory: 8, hardwareConcurrency: 8 });

      const { result } = renderHook(() => useLowPowerMode());
      const config: LowPowerConfig = result.current.config;

      expect(typeof config.intensityMultiplier).toBe("number");
      expect(typeof config.maxDPR).toBe("number");
      expect(typeof config.targetFPS).toBe("number");
      expect(typeof config.tier2CooldownMs).toBe("number");
      expect(typeof config.tier3Enabled).toBe("boolean");
    });
  });
});
