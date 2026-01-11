// lib/interactive-hero/types.ts

// Visibility states with hysteresis thresholds
export const VisibilityState = {
  Full: 'full',      // Enter >=0.70, exit <0.65
  Reduced: 'reduced', // Enter 0.50-0.69, exit to Full >=0.70 or Frozen <0.45
  Frozen: 'frozen',   // Enter <0.45, exit >=0.50
} as const;
export type VisibilityStateType = typeof VisibilityState[keyof typeof VisibilityState];

// Channel lock types
export const ChannelLockType = {
  Hard: 'hard',              // Exclusive, blocks all
  Soft: 'soft',              // Can overlap with other soft
  TransformSoft: 'transform-soft', // Transform-exclusive only
} as const;
export type ChannelLockTypeValue = typeof ChannelLockType[keyof typeof ChannelLockType];

// Effect tiers
export const EffectTier = {
  Local: 1,      // Letter-local effects
  Viewport: 2,   // Viewport-wide effects
  Persistent: 3, // Session-persistent rewards
} as const;
export type EffectTierValue = typeof EffectTier[keyof typeof EffectTier];

// Channel identifiers
export type ChannelId =
  | 'letters:hard'
  | 'letters:transform-soft'
  | 'letters:soft'
  | 'heroLighting:hard'
  | 'heroLighting:soft'
  | 'viewportCamera:hard'
  | 'viewportCamera:soft'
  | 'webglOverlay:hard'
  | 'webglOverlay:soft';

// Channel lock state
export interface ChannelLock {
  channel: ChannelId;
  type: ChannelLockTypeValue;
  effectId: string;
  expiresAt: number; // performance.now() + duration
}

// Effect definition
export interface Effect {
  id: string;
  name: string;
  tier: EffectTierValue;
  channels: ChannelId[];
  duration: number; // ms
  weight: number;   // 0-100, percentage weight for selection
  easing: string;   // GSAP easing
}

// WebGL effect payload
export interface WebGLEffect {
  type: 'ripple' | 'sweep' | 'vignette';
  position: { uv: [number, number]; px: [number, number] };
  intensity: number;
  startTime: number;
}

// Hero state machine state
export interface HeroState {
  visibility: VisibilityStateType;
  interactionCount: number;
  timeOnPage: number; // seconds
  scrollIntent: boolean;
  lastEffectId: string | null;
  tier2LastTriggered: number | null; // timestamp
  tier3Unlocked: {
    caustics: boolean;
    particleTrail: boolean;
  };
  clickedLetters: Set<number>; // indices of clicked letters (for Easter egg)
}

// Visibility thresholds (exported for testing)
export const VISIBILITY_THRESHOLDS = {
  fullEnter: 0.70,
  fullExit: 0.65,
  reducedEnter: 0.50,
  frozenEnter: 0.45,
  frozenExit: 0.50,
} as const;

// Tier unlock requirements
export const TIER_UNLOCK = {
  tier2Interactions: 5,
  tier2TimeOnPage: 8, // seconds
  tier2Cooldown: { min: 8000, max: 12000 }, // ms
  tier3Interactions: 10,
} as const;
