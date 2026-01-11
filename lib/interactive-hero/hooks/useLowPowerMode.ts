// lib/interactive-hero/hooks/useLowPowerMode.ts

import { useState, useCallback, useMemo } from 'react';

/**
 * Configuration for low-power mode adjustments
 */
export interface LowPowerConfig {
  /** Multiplier for effect intensity (0.6 for low-power, 1.0 otherwise) */
  intensityMultiplier: number;
  /** Maximum device pixel ratio (1.0 for low-power, 2.0 otherwise) */
  maxDPR: number;
  /** Target frames per second (30 for low-power, 60 otherwise) */
  targetFPS: number;
  /** Cooldown for tier 2 effects in ms (15000 for low-power, 10000 otherwise) */
  tier2CooldownMs: number;
  /** Whether tier 3 effects are enabled (false for low-power) */
  tier3Enabled: boolean;
}

/**
 * Force mode options for manual override
 */
export type ForceMode = 'auto' | 'low' | 'high';

/**
 * Return type for the useLowPowerMode hook
 */
export interface UseLowPowerModeReturn {
  /** Whether the device is in low-power mode */
  isLowPower: boolean;
  /** Configuration values adjusted for power mode */
  config: LowPowerConfig;
  /** Set force mode for testing or user preference */
  setForceMode: (mode: ForceMode) => void;
  /** Current force mode setting */
  forceMode: ForceMode;
}

/**
 * Configuration for low-power devices
 */
export const LOW_POWER_CONFIG: LowPowerConfig = {
  intensityMultiplier: 0.6,
  maxDPR: 1.0,
  targetFPS: 30,
  tier2CooldownMs: 15000,
  tier3Enabled: false,
};

/**
 * Configuration for normal devices
 */
export const NORMAL_CONFIG: LowPowerConfig = {
  intensityMultiplier: 1.0,
  maxDPR: 2.0,
  targetFPS: 60,
  tier2CooldownMs: 10000,
  tier3Enabled: true,
};

// Cache for detection result to avoid repeated checks
let cachedDetectionResult: boolean | null = null;

/**
 * Check if user prefers reduced motion
 */
function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Detect if the device is low-power based on hardware capabilities.
 * This is an advisory detection - not all browsers support these APIs.
 *
 * Detection criteria:
 * - deviceMemory < 4 GB
 * - hardwareConcurrency < 4 cores
 * - prefers-reduced-motion is set
 *
 * @returns true if the device appears to be low-power
 */
export function detectLowPower(): boolean {
  // SSR check
  if (typeof navigator === 'undefined') {
    return false;
  }

  // Check for reduced motion preference (accessibility signal)
  const reducedMotion = checkReducedMotion();
  if (reducedMotion) {
    return true;
  }

  // Get device capabilities (these APIs may not be available in all browsers)
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;

  // Advisory detection - if API not available, we can't determine low power from it
  const lowMemory = memory !== undefined && memory < 4;
  const lowCores = cores !== undefined && cores < 4;

  return lowMemory || lowCores;
}

/**
 * Reset the cached low-power detection result.
 * Primarily useful for testing.
 */
export function resetLowPowerCache(): void {
  cachedDetectionResult = null;
}

/**
 * React hook to detect and manage low-power mode.
 *
 * Detects low-power devices based on:
 * - navigator.deviceMemory < 4 GB
 * - navigator.hardwareConcurrency < 4 cores
 * - prefers-reduced-motion media query
 *
 * Provides configuration values adjusted for power mode:
 * - Effect intensity multiplier
 * - Maximum DPR for WebGL
 * - Target FPS
 * - Tier 2 cooldown duration
 * - Tier 3 availability
 *
 * Also allows manual override via setForceMode for testing or user preference.
 *
 * @returns {UseLowPowerModeReturn} Object with isLowPower, config, setForceMode, and forceMode
 *
 * @example
 * ```tsx
 * function HeroEffect() {
 *   const { isLowPower, config } = useLowPowerMode();
 *
 *   if (!config.tier3Enabled) {
 *     return <Tier2Effect intensity={config.intensityMultiplier} />;
 *   }
 *
 *   return <Tier3Effect fps={config.targetFPS} />;
 * }
 * ```
 */
export function useLowPowerMode(): UseLowPowerModeReturn {
  // Force mode state for manual override
  const [forceMode, setForceMode] = useState<ForceMode>('auto');

  // Perform detection (cached)
  const detectedLowPower = useMemo(() => {
    if (cachedDetectionResult === null) {
      cachedDetectionResult = detectLowPower();
    }
    return cachedDetectionResult;
  }, []);

  // Determine effective low-power status based on force mode
  const isLowPower = useMemo(() => {
    switch (forceMode) {
      case 'low':
        return true;
      case 'high':
        return false;
      case 'auto':
      default:
        return detectedLowPower;
    }
  }, [forceMode, detectedLowPower]);

  // Select appropriate config based on power mode
  const config = useMemo(() => {
    return isLowPower ? LOW_POWER_CONFIG : NORMAL_CONFIG;
  }, [isLowPower]);

  // Memoize setForceMode callback
  const handleSetForceMode = useCallback((mode: ForceMode) => {
    setForceMode(mode);
  }, []);

  return {
    isLowPower,
    config,
    setForceMode: handleSetForceMode,
    forceMode,
  };
}
