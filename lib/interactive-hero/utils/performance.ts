// lib/interactive-hero/utils/performance.ts

/**
 * Performance utilities for the interactive hero system.
 * Provides throttling, debouncing, measurement, and monitoring tools.
 */

/**
 * Throttled function interface with cancel method
 */
export interface ThrottledFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

/**
 * Throttle a function to execute at most once per wait period.
 * Uses leading + trailing edge execution pattern.
 *
 * @param fn - Function to throttle
 * @param wait - Minimum time between executions in milliseconds
 * @returns Throttled function with cancel method
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(handleScroll, 16); // ~60fps
 * window.addEventListener('scroll', throttledScroll, { passive: true });
 *
 * // Cleanup
 * throttledScroll.cancel();
 * window.removeEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): ThrottledFunction<T> {
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    lastArgs = args;

    if (remaining <= 0) {
      // Execute immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timeoutId) {
      // Schedule trailing call
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        if (lastArgs) {
          fn(...lastArgs);
        }
      }, remaining);
    }
  }) as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  return throttled;
}

/**
 * RAF-debounced function interface with cancel method
 */
export interface RAFDebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

/**
 * Debounce a function using requestAnimationFrame.
 * Ideal for visual updates that need to sync with the display refresh.
 *
 * @param fn - Function to debounce
 * @returns Debounced function with cancel method
 *
 * @example
 * ```ts
 * const updatePosition = rafDebounce((x, y) => {
 *   element.style.transform = `translate(${x}px, ${y}px)`;
 * });
 *
 * document.addEventListener('mousemove', (e) => {
 *   updatePosition(e.clientX, e.clientY);
 * });
 * ```
 */
export function rafDebounce<T extends (...args: unknown[]) => void>(
  fn: T
): RAFDebouncedFunction<T> {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let cancelled = false;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      if (!cancelled && lastArgs) {
        fn(...lastArgs);
      }
      rafId = null;
    });
  }) as RAFDebouncedFunction<T>;

  debounced.cancel = () => {
    cancelled = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastArgs = null;
  };

  return debounced;
}

/**
 * Performance measurement result
 */
export interface PerformanceMeasurement<T> {
  name: string;
  duration: number; // milliseconds
  result: T;
}

/**
 * Measure the execution time of a synchronous function.
 *
 * @param name - Name for the measurement
 * @param fn - Function to measure
 * @returns Measurement result with duration and function return value
 *
 * @example
 * ```ts
 * const { result, duration } = measurePerformance('renderChart', () => {
 *   return renderComplexChart(data);
 * });
 * console.log(`Chart rendered in ${duration}ms`);
 * ```
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): PerformanceMeasurement<T> {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  return {
    name,
    duration: end - start,
    result,
  };
}

/**
 * Frame rate monitoring metrics
 */
export interface FrameRateMetrics {
  fps: number;
  frameTime: number; // average ms per frame
  droppedFrames: number;
}

/**
 * Frame rate monitor options
 */
export interface FrameRateMonitorOptions {
  /** Number of frames to sample for averaging (default: 60) */
  sampleSize?: number;
  /** Callback called on each update with current metrics */
  onUpdate?: (metrics: FrameRateMetrics) => void;
}

/**
 * Frame rate monitor instance
 */
export interface FrameRateMonitor {
  /** Stop monitoring */
  stop: () => void;
  /** Get current metrics */
  getMetrics: () => FrameRateMetrics;
}

/**
 * Create a frame rate monitor that tracks FPS and dropped frames.
 *
 * @param options - Monitor configuration options
 * @returns Monitor instance with stop and getMetrics methods
 *
 * @example
 * ```ts
 * const monitor = createFrameRateMonitor({
 *   sampleSize: 30,
 *   onUpdate: (metrics) => {
 *     if (metrics.fps < 30) {
 *       console.warn('Low FPS detected:', metrics.fps);
 *     }
 *   },
 * });
 *
 * // Later...
 * monitor.stop();
 * ```
 */
export function createFrameRateMonitor(
  options: FrameRateMonitorOptions = {}
): FrameRateMonitor {
  const { sampleSize = 60, onUpdate } = options;

  let rafId: number | null = null;
  let lastTimestamp: number | null = null;
  const frameTimes: number[] = [];
  let totalDroppedFrames = 0;

  const metrics: FrameRateMetrics = {
    fps: 60,
    frameTime: 16.67,
    droppedFrames: 0,
  };

  const targetFrameTime = 1000 / 60; // ~16.67ms for 60fps

  const tick = (timestamp: number) => {
    if (lastTimestamp !== null) {
      const delta = timestamp - lastTimestamp;
      frameTimes.push(delta);

      // Keep only the last N frames
      if (frameTimes.length > sampleSize) {
        frameTimes.shift();
      }

      // Detect dropped frames (more than 1.5x target frame time)
      if (delta > targetFrameTime * 1.5) {
        totalDroppedFrames += Math.floor(delta / targetFrameTime) - 1;
      }

      // Calculate metrics
      if (frameTimes.length > 0) {
        const avgFrameTime =
          frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        metrics.frameTime = avgFrameTime;
        metrics.fps = 1000 / avgFrameTime;
        metrics.droppedFrames = totalDroppedFrames;

        onUpdate?.(metrics);
      }
    }

    lastTimestamp = timestamp;
    rafId = requestAnimationFrame(tick);
  };

  // Start monitoring
  rafId = requestAnimationFrame(tick);

  return {
    stop: () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    getMetrics: () => ({ ...metrics }),
  };
}

/**
 * Memoized function with TTL and clear method
 */
export interface MemoizedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  clear: () => void;
}

/**
 * Memoize a function with a time-to-live for cached values.
 * Useful for caching expensive computations that may become stale.
 *
 * @param fn - Function to memoize
 * @param ttl - Time-to-live in milliseconds
 * @param keyFn - Optional function to generate cache key from arguments
 * @returns Memoized function with clear method
 *
 * @example
 * ```ts
 * const memoizedFetch = memoizeWithTTL(
 *   async (url) => fetch(url).then(r => r.json()),
 *   60000, // 1 minute TTL
 *   (url) => url
 * );
 * ```
 */
export function memoizeWithTTL<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ttl: number,
  keyFn?: (...args: Parameters<T>) => string
): MemoizedFunction<T> {
  const cache = new Map<string, { value: ReturnType<T>; expires: number }>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    const now = Date.now();

    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      return cached.value;
    }

    const value = fn(...args) as ReturnType<T>;
    cache.set(key, { value, expires: now + ttl });
    return value;
  }) as MemoizedFunction<T>;

  memoized.clear = () => {
    cache.clear();
  };

  return memoized;
}
