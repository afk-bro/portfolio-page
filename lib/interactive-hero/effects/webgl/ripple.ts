// lib/interactive-hero/effects/webgl/ripple.ts
import gsap from 'gsap';

export interface RippleEffectConfig {
  origin: { x: number; y: number }; // Normalized 0-1 coordinates
  intensity: number; // 0-1 intensity multiplier
  duration: number; // Duration in ms
}

export interface RippleEffectState {
  radius: number; // Current ripple radius (0 to 1.5)
  strength: number; // Displacement strength
  alpha: number; // Opacity (1 to 0)
}

export interface RippleEffect {
  type: 'ripple';
  origin: { x: number; y: number };
  timeline: gsap.core.Timeline;
  update: (progress: number) => RippleEffectState;
  destroy: () => void;
}

// Power2.out easing function
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

// Linear easing (for alpha)
function linear(t: number): number {
  return t;
}

const MAX_RADIUS = 1.5;
const BASE_STRENGTH = 30; // Base displacement strength

export function createRippleEffect(config: RippleEffectConfig): RippleEffect {
  const { origin, intensity, duration } = config;

  const proxy = { progress: 0 };

  const timeline = gsap.timeline();
  timeline.to(proxy, {
    progress: 1,
    duration: duration / 1000,
    ease: 'none', // We handle easing in the update function
  });

  const update = (progress: number): RippleEffectState => {
    // Apply power2.out easing to radius
    const easedProgress = easeOutQuad(progress);
    const radius = MAX_RADIUS * easedProgress;

    // Strength calculation: starts strong and fades with the ripple
    // Uses a curve that peaks early and decays toward the end
    // Formula: (1 - progress) creates initial strength that fades
    const strengthMultiplier = (1 - progress) * intensity;
    const strength = BASE_STRENGTH * strengthMultiplier;

    // Alpha fades linearly
    const alpha = 1 - linear(progress);

    return { radius, strength, alpha };
  };

  const destroy = () => {
    timeline.kill();
  };

  return {
    type: 'ripple',
    origin,
    timeline,
    update,
    destroy,
  };
}
