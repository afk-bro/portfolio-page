// lib/interactive-hero/index.ts

// Types
export * from "./types";

// Channel Locks
export {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  getActiveLocks,
  type ChannelLockManager,
} from "./channelLocks";

// Effect Catalog
export {
  TIER1_EFFECTS,
  TIER2_EFFECTS,
  TIER3_EFFECTS,
  selectWeightedEffect,
  getEffectById,
} from "./effectCatalog";

// Visibility Machine
export {
  createVisibilityMachine,
  updateVisibility,
  getIntensityMultiplier,
  type VisibilityMachine,
} from "./visibilityMachine";

// Effects
export * from "./effects/tier1";
export * from "./effects/cssFallbacks";

// Hooks
export { useLetterClick } from "./hooks/useLetterClick";
export {
  useWebGLSupport,
  checkWebGLSupport,
  resetWebGLSupportCache,
} from "./hooks/useWebGLSupport";
export type {
  UseWebGLSupportReturn,
  WebGLSupportResult,
} from "./hooks/useWebGLSupport";
export { useHeroScroll } from "./hooks/useHeroScroll";
export { useScrollLinkedProps } from "./hooks/useScrollLinkedProps";
export { useParallaxExit } from "./hooks/useParallaxExit";
export { useTier2Effects } from "./hooks/useTier2Effects";
export { useTier3Effects } from "./hooks/useTier3Effects";
export {
  useLowPowerMode,
  detectLowPower,
  resetLowPowerCache,
  LOW_POWER_CONFIG,
  NORMAL_CONFIG,
} from "./hooks/useLowPowerMode";
export type {
  LowPowerConfig,
  ForceMode,
  UseLowPowerModeReturn,
} from "./hooks/useLowPowerMode";

// WebGL effects
export * from "./effects/webgl/ripple";
export * from "./effects/webgl/sweep";
export * from "./effects/webgl/vignette";

// Performance utilities
export {
  throttle,
  rafDebounce,
  measurePerformance,
  createFrameRateMonitor,
  memoizeWithTTL,
} from "./utils/performance";
export type {
  ThrottledFunction,
  RAFDebouncedFunction,
  PerformanceMeasurement,
  FrameRateMetrics,
  FrameRateMonitorOptions,
  FrameRateMonitor,
  MemoizedFunction,
} from "./utils/performance";

// Browser detection utilities
export {
  detectBrowser,
  resetBrowserInfoCache,
  useBrowserInfo,
  getEventListenerOptions,
  getScrollListenerOptions,
  isWebGL2LikelySupported,
} from "./utils/browserDetect";
export type { BrowserName, BrowserInfo } from "./utils/browserDetect";

// Performance monitoring hook
export {
  usePerformanceMonitor,
  DEFAULT_THRESHOLDS,
} from "./hooks/usePerformanceMonitor";
export type {
  PerformanceMetrics,
  PerformanceThresholds,
  UsePerformanceMonitorReturn,
} from "./hooks/usePerformanceMonitor";

// Panic reset hook
export { usePanicReset } from "./hooks/usePanicReset";
export type {
  UsePanicResetProps,
  UsePanicResetReturn,
} from "./hooks/usePanicReset";
