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
