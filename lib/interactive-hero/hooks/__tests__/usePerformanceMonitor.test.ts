// lib/interactive-hero/hooks/__tests__/usePerformanceMonitor.test.ts

import { renderHook, act } from '@testing-library/react';
import { usePerformanceMonitor, DEFAULT_THRESHOLDS } from '../usePerformanceMonitor';

describe('usePerformanceMonitor', () => {
  let rafCallbacks: FrameRequestCallback[] = [];
  let rafId = 0;

  beforeEach(() => {
    rafCallbacks = [];
    rafId = 0;
    jest.useFakeTimers();

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return ++rafId;
    });

    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('when disabled', () => {
    it('should return default metrics', () => {
      const { result } = renderHook(() => usePerformanceMonitor(false));

      expect(result.current.metrics).toEqual({
        fps: 60,
        frameTime: 16.67,
        droppedFrames: 0,
        effectsRunning: 0,
      });
    });

    it('should report performance as OK', () => {
      const { result } = renderHook(() => usePerformanceMonitor(false));

      expect(result.current.isPerformanceOK).toBe(true);
    });

    it('should not reduce effects', () => {
      const { result } = renderHook(() => usePerformanceMonitor(false));

      expect(result.current.shouldReduceEffects).toBe(false);
    });

    it('should not start monitoring', () => {
      renderHook(() => usePerformanceMonitor(false));

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('when enabled', () => {
    it('should start monitoring', () => {
      renderHook(() => usePerformanceMonitor(true));

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should update metrics on frame', () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));

      // Simulate frames at 60fps
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](16.67);
        rafCallbacks[2](33.33);
      });

      // Metrics should update
      expect(result.current.metrics.fps).toBeCloseTo(60, 0);
    });

    it('should stop monitoring on unmount', () => {
      const { unmount } = renderHook(() => usePerformanceMonitor(true));

      unmount();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should stop monitoring when disabled', () => {
      const { rerender } = renderHook(
        ({ enabled }) => usePerformanceMonitor(enabled),
        { initialProps: { enabled: true } }
      );

      expect(window.requestAnimationFrame).toHaveBeenCalled();

      rerender({ enabled: false });

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('isPerformanceOK', () => {
    it('should be true when FPS is above threshold', () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));

      // Simulate good frames (60fps)
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](16.67);
        rafCallbacks[2](33.33);
      });

      expect(result.current.isPerformanceOK).toBe(true);
    });

    it('should be false when FPS drops below threshold', () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor(true, { lowFPSThreshold: 30 })
      );

      // Simulate slow frames (10fps = 100ms per frame)
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](100);
        rafCallbacks[2](200);
        rafCallbacks[3](300);
      });

      expect(result.current.isPerformanceOK).toBe(false);
    });
  });

  describe('shouldReduceEffects', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));

      expect(result.current.shouldReduceEffects).toBe(false);
    });

    it('should be true after consistent low FPS', () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor(true, {
          lowFPSThreshold: 30,
          consecutiveLowFrames: 3,
        })
      );

      // Simulate consistently slow frames
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](100); // 10fps
        rafCallbacks[2](200); // 10fps
        rafCallbacks[3](300); // 10fps
        rafCallbacks[4](400); // 10fps - should trigger after 3 consecutive
      });

      expect(result.current.shouldReduceEffects).toBe(true);
    });

    it('should reset when FPS recovers', () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor(true, {
          lowFPSThreshold: 20, // Very low threshold
          consecutiveLowFrames: 2,
        })
      );

      // Simulate slow frames (2 consecutive low FPS to trigger)
      // FPS < 20 means frame time > 50ms
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](60); // 16.67 FPS - low
        rafCallbacks[2](120); // 16.67 FPS - low - triggers shouldReduceEffects
      });

      expect(result.current.shouldReduceEffects).toBe(true);

      // Simulate recovery with many fast frames to improve average FPS above 20
      // We need enough fast frames to push the average frame time below 50ms
      act(() => {
        let t = 120;
        for (let i = 3; i < 35; i++) {
          t += 16.67; // 60fps frames
          rafCallbacks[i](t);
        }
      });

      // After many consecutive high FPS frames, should recover
      expect(result.current.shouldReduceEffects).toBe(false);
    });
  });

  describe('trackEffectStart and trackEffectEnd', () => {
    it('should track effects running count', () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));

      expect(result.current.metrics.effectsRunning).toBe(0);

      act(() => {
        result.current.trackEffectStart();
      });

      expect(result.current.metrics.effectsRunning).toBe(1);

      act(() => {
        result.current.trackEffectStart();
      });

      expect(result.current.metrics.effectsRunning).toBe(2);

      act(() => {
        result.current.trackEffectEnd();
      });

      expect(result.current.metrics.effectsRunning).toBe(1);
    });

    it('should not go below zero', () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));

      act(() => {
        result.current.trackEffectEnd();
        result.current.trackEffectEnd();
      });

      expect(result.current.metrics.effectsRunning).toBe(0);
    });
  });

  describe('custom thresholds', () => {
    it('should use custom low FPS threshold', () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor(true, { lowFPSThreshold: 50 })
      );

      // Simulate 40fps frames (25ms per frame)
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](25);
        rafCallbacks[2](50);
        rafCallbacks[3](75);
      });

      expect(result.current.isPerformanceOK).toBe(false);
    });

    it('should use custom consecutive frames threshold', () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor(true, {
          lowFPSThreshold: 30,
          consecutiveLowFrames: 5,
        })
      );

      // Simulate 4 slow frames (should not trigger)
      act(() => {
        rafCallbacks[0](0);
        rafCallbacks[1](100);
        rafCallbacks[2](200);
        rafCallbacks[3](300);
        rafCallbacks[4](400);
      });

      expect(result.current.shouldReduceEffects).toBe(false);

      // One more slow frame
      act(() => {
        rafCallbacks[5](500);
      });

      expect(result.current.shouldReduceEffects).toBe(true);
    });
  });

  describe('DEFAULT_THRESHOLDS', () => {
    it('should have expected default values', () => {
      expect(DEFAULT_THRESHOLDS).toEqual({
        lowFPSThreshold: 30,
        consecutiveLowFrames: 10,
      });
    });
  });
});
