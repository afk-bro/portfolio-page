// lib/interactive-hero/utils/__tests__/performance.test.ts

import {
  throttle,
  rafDebounce,
  measurePerformance,
  createFrameRateMonitor,
  memoizeWithTTL,
} from "../performance";

describe("performance utilities", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("throttle", () => {
    it("should execute function immediately on first call", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should not execute function again within wait period", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should execute function after wait period", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should pass arguments to the throttled function", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled("arg1", "arg2");

      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("should use the latest arguments when executing after throttle", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled("first");
      throttled("second");
      throttled("third");

      // First call happens immediately
      expect(fn).toHaveBeenCalledWith("first");

      // After wait, trailing call with latest args should execute
      jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith("third");
    });

    it("should be cancelable", () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled("first");
      throttled("second");

      throttled.cancel();

      jest.advanceTimersByTime(100);

      // Only the first immediate call should have happened
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("first");
    });
  });

  describe("rafDebounce", () => {
    let rafCallbacks: FrameRequestCallback[] = [];
    let rafId = 0;

    beforeEach(() => {
      rafCallbacks = [];
      rafId = 0;
      jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rafCallbacks.push(cb);
        return ++rafId;
      });
      jest.spyOn(window, "cancelAnimationFrame").mockImplementation((_id) => {
        // Mock implementation - id parameter unused but required by type
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should schedule function on animation frame", () => {
      const fn = jest.fn();
      const debounced = rafDebounce(fn);

      debounced();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(fn).not.toHaveBeenCalled();

      // Simulate RAF callback
      rafCallbacks[0](16.67);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should cancel pending RAF when called multiple times", () => {
      const fn = jest.fn();
      const debounced = rafDebounce(fn);

      debounced();
      debounced();
      debounced();

      expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(2);
    });

    it("should pass arguments to the debounced function", () => {
      const fn = jest.fn();
      const debounced = rafDebounce(fn);

      debounced("arg1", "arg2");
      rafCallbacks[0](16.67);

      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("should use latest arguments when called multiple times", () => {
      const fn = jest.fn();
      const debounced = rafDebounce(fn);

      debounced("first");
      debounced("second");
      debounced("third");

      // Only the last RAF callback will have the latest arguments
      rafCallbacks[rafCallbacks.length - 1](16.67);

      expect(fn).toHaveBeenCalledWith("third");
    });

    it("should be cancelable", () => {
      const fn = jest.fn();
      const debounced = rafDebounce(fn);

      debounced();
      debounced.cancel();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();

      // Simulate RAF callback (if any)
      rafCallbacks.forEach((cb) => cb(16.67));

      // Function should not have been called due to cancel
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("measurePerformance", () => {
    let originalPerformance: typeof performance;

    beforeEach(() => {
      originalPerformance = global.performance;
      let now = 0;
      global.performance = {
        now: jest.fn(() => {
          now += 10;
          return now;
        }),
      } as unknown as typeof performance;
    });

    afterEach(() => {
      global.performance = originalPerformance;
    });

    it("should return the function result", () => {
      const result = measurePerformance("test", () => 42);

      expect(result.result).toBe(42);
    });

    it("should measure execution time", () => {
      const result = measurePerformance("test", () => {
        // Function executes
        return "done";
      });

      expect(result.duration).toBeGreaterThan(0);
    });

    it("should include the name in the measurement", () => {
      const result = measurePerformance("myFunction", () => null);

      expect(result.name).toBe("myFunction");
    });

    it("should handle throwing functions", () => {
      expect(() => {
        measurePerformance("throwing", () => {
          throw new Error("test error");
        });
      }).toThrow("test error");
    });
  });

  describe("createFrameRateMonitor", () => {
    let rafCallbacks: FrameRequestCallback[] = [];
    let rafId = 0;

    beforeEach(() => {
      rafCallbacks = [];
      rafId = 0;
      jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rafCallbacks.push(cb);
        return ++rafId;
      });
      jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should start monitoring when created", () => {
      const monitor = createFrameRateMonitor();

      expect(window.requestAnimationFrame).toHaveBeenCalled();

      monitor.stop();
    });

    it("should calculate FPS based on frame intervals", () => {
      const onUpdate = jest.fn();
      const monitor = createFrameRateMonitor({ onUpdate, sampleSize: 3 });

      // Simulate 60fps frames (16.67ms apart)
      rafCallbacks[0](0);
      rafCallbacks[1](16.67);
      rafCallbacks[2](33.33);
      rafCallbacks[3](50);

      monitor.stop();

      // Should have called onUpdate with FPS data
      expect(onUpdate).toHaveBeenCalled();
    });

    it("should detect dropped frames", () => {
      const onUpdate = jest.fn();
      const monitor = createFrameRateMonitor({ onUpdate, sampleSize: 3 });

      // Simulate frames with a dropped frame (50ms gap = ~2 dropped frames at 60fps)
      // Target frame time is ~16.67ms, so 50ms > 16.67 * 1.5 = 25ms threshold
      rafCallbacks[0](0);
      rafCallbacks[1](16.67); // Normal frame
      rafCallbacks[2](66.67); // 50ms gap = dropped frames (50/16.67 - 1 = 2 dropped)
      rafCallbacks[3](83.33); // Normal frame

      monitor.stop();

      // Find a call where dropped frames were detected
      const callWithDropped = onUpdate.mock.calls.find(
        (call) => call[0].droppedFrames > 0,
      );
      expect(callWithDropped).toBeDefined();
      expect(callWithDropped[0].droppedFrames).toBeGreaterThan(0);
    });

    it("should stop monitoring when stop is called", () => {
      const monitor = createFrameRateMonitor();
      const initialCalls = (window.cancelAnimationFrame as jest.Mock).mock.calls
        .length;

      monitor.stop();

      expect(
        (window.cancelAnimationFrame as jest.Mock).mock.calls.length,
      ).toBeGreaterThan(initialCalls);
    });

    it("should return current metrics via getMetrics", () => {
      const monitor = createFrameRateMonitor({ sampleSize: 2 });

      // Simulate some frames
      rafCallbacks[0](0);
      rafCallbacks[1](16.67);
      rafCallbacks[2](33.33);

      const metrics = monitor.getMetrics();

      expect(metrics).toHaveProperty("fps");
      expect(metrics).toHaveProperty("frameTime");
      expect(metrics).toHaveProperty("droppedFrames");

      monitor.stop();
    });
  });

  describe("memoizeWithTTL", () => {
    it("should cache function results", () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoizeWithTTL(fn, 1000);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should cache different arguments separately", () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoizeWithTTL(fn, 1000);

      expect(memoized(5)).toBe(10);
      expect(memoized(10)).toBe(20);
      expect(memoized(5)).toBe(10);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should invalidate cache after TTL", () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoizeWithTTL(fn, 100);

      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(150);

      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should support custom key functions", () => {
      const fn = jest.fn((obj: { id: number; name: string }) => obj.id);
      const memoized = memoizeWithTTL(fn, 1000, (obj) => obj.id.toString());

      expect(memoized({ id: 1, name: "a" })).toBe(1);
      expect(memoized({ id: 1, name: "b" })).toBe(1); // Different name but same id

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should be clearable", () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoizeWithTTL(fn, 1000);

      expect(memoized(5)).toBe(10);
      memoized.clear();
      expect(memoized(5)).toBe(10);

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
