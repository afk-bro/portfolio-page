// lib/interactive-hero/effectCatalog.ts
import { EffectTier } from "./types";
import type { Effect } from "./types";

// Tier 1 — Local Effects (8 total, weights sum to 100)
export const TIER1_EFFECTS: Effect[] = [
  {
    id: "elastic-bounce",
    name: "Elastic Bounce",
    tier: EffectTier.Local,
    channels: ["letters:transform-soft"],
    duration: 600,
    weight: 20,
    easing: "elastic.out(1, 0.3)",
  },
  {
    id: "flip-x",
    name: "3D Flip X",
    tier: EffectTier.Local,
    channels: ["letters:transform-soft"],
    duration: 500,
    weight: 15,
    easing: "power2.inOut",
  },
  {
    id: "flip-y",
    name: "3D Flip Y",
    tier: EffectTier.Local,
    channels: ["letters:transform-soft"],
    duration: 500,
    weight: 12,
    easing: "power2.inOut",
  },
  {
    id: "rubber-stretch",
    name: "Rubber Stretch",
    tier: EffectTier.Local,
    channels: ["letters:hard"],
    duration: 700,
    weight: 13,
    easing: "elastic.out(1, 0.4)",
  },
  {
    id: "gold-glow",
    name: "Gold Glow Pulse",
    tier: EffectTier.Local,
    channels: ["heroLighting:soft"],
    duration: 400,
    weight: 15,
    easing: "power1.out",
  },
  {
    id: "ocean-electric",
    name: "Ocean Electric",
    tier: EffectTier.Local,
    channels: ["heroLighting:soft"],
    duration: 300,
    weight: 10,
    easing: "power3.out",
  },
  {
    id: "weight-morph",
    name: "Weight Morph",
    tier: EffectTier.Local,
    channels: ["letters:soft"],
    duration: 400,
    weight: 8,
    easing: "power2.inOut",
  },
  {
    id: "neighbor-ripple",
    name: "Neighbor Ripple",
    tier: EffectTier.Local,
    channels: ["letters:soft"],
    duration: 800,
    weight: 7,
    easing: "power2.out",
  },
];

// Tier 2 — Viewport Effects (3 total, weights sum to 100)
export const TIER2_EFFECTS: Effect[] = [
  {
    id: "refraction-ripple",
    name: "Refraction Ripple",
    tier: EffectTier.Viewport,
    channels: ["webglOverlay:hard", "viewportCamera:soft"],
    duration: 500,
    weight: 50,
    easing: "power2.out",
  },
  {
    id: "light-sweep",
    name: "Light Sweep",
    tier: EffectTier.Viewport,
    channels: ["webglOverlay:hard", "heroLighting:hard"],
    duration: 600,
    weight: 35,
    easing: "power2.inOut",
  },
  {
    id: "vignette-pulse",
    name: "Vignette Pulse",
    tier: EffectTier.Viewport,
    channels: ["webglOverlay:hard"],
    duration: 400,
    weight: 15,
    easing: "power2.inOut",
  },
];

// Tier 3 — Persistent Rewards (2 total)
export const TIER3_EFFECTS: Effect[] = [
  {
    id: "ambient-caustics",
    name: "Ambient Caustics",
    tier: EffectTier.Persistent,
    channels: ["webglOverlay:soft"],
    duration: -1, // persistent
    weight: 100, // triggered by interaction count
    easing: "none",
  },
  {
    id: "cursor-particle-trail",
    name: "Cursor Particle Trail",
    tier: EffectTier.Persistent,
    channels: ["webglOverlay:soft"],
    duration: -1, // persistent
    weight: 0, // triggered by Easter egg (click all letters)
    easing: "none",
  },
];

// All effects for lookup
const ALL_EFFECTS = [...TIER1_EFFECTS, ...TIER2_EFFECTS, ...TIER3_EFFECTS];

/**
 * Select a random effect from pool using weighted random selection.
 * Excludes the last effect to prevent repeats.
 */
export function selectWeightedEffect(
  pool: Effect[],
  lastEffectId: string | null,
): Effect | null {
  // Filter out last effect
  const available = lastEffectId
    ? pool.filter((e) => e.id !== lastEffectId)
    : pool;

  if (available.length === 0) return null;

  // Calculate total weight
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight === 0) return available[0];

  // Random selection based on weight
  let random = Math.random() * totalWeight;

  for (const effect of available) {
    random -= effect.weight;
    if (random <= 0) return effect;
  }

  // Fallback (shouldn't happen)
  return available[available.length - 1];
}

/**
 * Get effect by ID from all tiers.
 */
export function getEffectById(id: string): Effect | undefined {
  return ALL_EFFECTS.find((e) => e.id === id);
}
