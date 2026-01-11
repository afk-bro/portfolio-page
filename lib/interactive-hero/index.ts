// lib/interactive-hero/index.ts

// Types
export * from './types';

// Channel Locks
export {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  getActiveLocks,
  type ChannelLockManager,
} from './channelLocks';

// Effect Catalog
export {
  TIER1_EFFECTS,
  TIER2_EFFECTS,
  TIER3_EFFECTS,
  selectWeightedEffect,
  getEffectById,
} from './effectCatalog';

// Visibility Machine
export {
  createVisibilityMachine,
  updateVisibility,
  getIntensityMultiplier,
  type VisibilityMachine,
} from './visibilityMachine';

// Effects
export * from './effects/tier1';

// Hooks
export { useLetterClick } from './hooks/useLetterClick';
export { useHeroScroll } from './hooks/useHeroScroll';
export { useScrollLinkedProps } from './hooks/useScrollLinkedProps';
export { useParallaxExit } from './hooks/useParallaxExit';
export { useTier2Effects } from './hooks/useTier2Effects';

// WebGL effects
export * from './effects/webgl/ripple';
export * from './effects/webgl/sweep';
export * from './effects/webgl/vignette';