// lib/interactive-hero/hooks/usePerformanceMonitor.ts

import { useState, useEffect, useCallback, useRef } from "react";
import {
  createFrameRateMonitor,
  type FrameRateMetrics,
} from "../utils/performance";

/**
 * Performance metrics for the hero section
 */
export interface PerformanceMetrics {
  /** Current frames per second */
  fps: number;
  /** Average frame time in milliseconds */
  frameTime: number;
  /** Total dropped frames since monitoring started */
  droppedFrames: number;
  /** Number of effects currently running */
  effectsRunning: number;
}

/**
 * Threshold configuration for performance monitoring
 */
export interface PerformanceThresholds {
  /** FPS threshold below which performance is considered poor (default: 30) */
  lowFPSThreshold?: number;
  /** Number of consecutive low FPS frames before suggesting effect reduction (default: 10) */
  consecutiveLowFrames?: number;
}

/**
 * Return type for the usePerformanceMonitor hook
 */
export interface UsePerformanceMonitorReturn {
  /** Current performance metrics */
  metrics: PerformanceMetrics;
  /** True if FPS is above the low threshold */
  isPerformanceOK: boolean;
  /** True if consistently low FPS suggests reducing effects */
  shouldReduceEffects: boolean;
  /** Call when an effect starts */
  trackEffectStart: () => void;
  /** Call when an effect ends */
  trackEffectEnd: () => void;
}

/**
 * Default threshold values
 */
export const DEFAULT_THRESHOLDS: Required<PerformanceThresholds> = {
  lowFPSThreshold: 30,
  consecutiveLowFrames: 10,
};

/**
 * Default performance metrics
 */
const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 60,
  frameTime: 16.67,
  droppedFrames: 0,
  effectsRunning: 0,
};

/**
 * Hook to monitor performance of the interactive hero system.
 * Tracks FPS, frame time, and dropped frames to determine if
 * effects should be reduced for better user experience.
 *
 * @param enabled - Whether to enable performance monitoring
 * @param thresholds - Optional custom threshold configuration
 * @returns Performance metrics and status indicators
 *
 * @example
 * ```tsx
 * function HeroSection() {
 *   const {
 *     metrics,
 *     isPerformanceOK,
 *     shouldReduceEffects,
 *     trackEffectStart,
 *     trackEffectEnd,
 *   } = usePerformanceMonitor(true);
 *
 *   // Reduce effect complexity if performance is poor
 *   const effectIntensity = shouldReduceEffects ? 0.5 : 1.0;
 *
 *   // Track effect lifecycle
 *   const runEffect = () => {
 *     trackEffectStart();
 *     playAnimation().then(trackEffectEnd);
 *   };
 *
 *   // Show warning if performance is degraded
 *   if (!isPerformanceOK) {
 *     console.warn(`Low FPS: ${metrics.fps.toFixed(1)}`);
 *   }
 * }
 * ```
 */
export function usePerformanceMonitor(
  enabled: boolean,
  thresholds: PerformanceThresholds = {},
): UsePerformanceMonitorReturn {
  const { lowFPSThreshold, consecutiveLowFrames } = {
    ...DEFAULT_THRESHOLDS,
    ...thresholds,
  };

  const [metrics, setMetrics] = useState<PerformanceMetrics>(DEFAULT_METRICS);
  const [isPerformanceOK, setIsPerformanceOK] = useState(true);
  const [shouldReduceEffects, setShouldReduceEffects] = useState(false);

  const effectsRunningRef = useRef(0);
  const consecutiveLowRef = useRef(0);
  const consecutiveHighRef = useRef(0);

  // Track when an effect starts
  const trackEffectStart = useCallback(() => {
    effectsRunningRef.current += 1;
    setMetrics((prev) => ({
      ...prev,
      effectsRunning: effectsRunningRef.current,
    }));
  }, []);

  // Track when an effect ends
  const trackEffectEnd = useCallback(() => {
    effectsRunningRef.current = Math.max(0, effectsRunningRef.current - 1);
    setMetrics((prev) => ({
      ...prev,
      effectsRunning: effectsRunningRef.current,
    }));
  }, []);

  // Handle metrics updates from the frame rate monitor
  const handleMetricsUpdate = useCallback(
    (frameMetrics: FrameRateMetrics) => {
      setMetrics((prev) => ({
        ...prev,
        fps: frameMetrics.fps,
        frameTime: frameMetrics.frameTime,
        droppedFrames: frameMetrics.droppedFrames,
      }));

      // Check if FPS is below threshold
      const isLow = frameMetrics.fps < lowFPSThreshold;
      setIsPerformanceOK(!isLow);

      if (isLow) {
        consecutiveLowRef.current += 1;
        consecutiveHighRef.current = 0;

        // Trigger effect reduction after consecutive low frames
        if (consecutiveLowRef.current >= consecutiveLowFrames) {
          setShouldReduceEffects(true);
        }
      } else {
        consecutiveLowRef.current = 0;
        consecutiveHighRef.current += 1;

        // Recover after consistent good performance
        if (consecutiveHighRef.current >= consecutiveLowFrames) {
          setShouldReduceEffects(false);
        }
      }
    },
    [lowFPSThreshold, consecutiveLowFrames],
  );

  // Start/stop monitoring based on enabled state
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const monitor = createFrameRateMonitor({
      sampleSize: 30, // ~0.5 seconds of samples at 60fps
      onUpdate: handleMetricsUpdate,
    });

    return () => {
      monitor.stop();
    };
  }, [enabled, handleMetricsUpdate]);

  // Reset state when disabled
  useEffect(() => {
    if (!enabled) {
      setMetrics(DEFAULT_METRICS);
      setIsPerformanceOK(true);
      setShouldReduceEffects(false);
      consecutiveLowRef.current = 0;
      consecutiveHighRef.current = 0;
    }
  }, [enabled]);

  return {
    metrics,
    isPerformanceOK,
    shouldReduceEffects,
    trackEffectStart,
    trackEffectEnd,
  };
}
