// lib/interactive-hero/hooks/useScrollLinkedProps.ts
import { useMemo } from 'react';

interface UseScrollLinkedPropsInput {
  scrollProgress: number; // 0-1
  scrollVelocity: number; // px/s
  enabled: boolean;
}

interface UseScrollLinkedPropsReturn {
  letterRotation: number; // degrees, -180 to 180
  shimmerPosition: number; // 0-100 (percentage)
  glowIntensity: number; // 0.06-0.12
  cssVars: Record<string, string>;
}

// Constants from design spec
const MAX_ROTATION = 180; // degrees per second max
const VELOCITY_TO_ROTATION_SCALE = 0.1; // Convert px/s to deg/s

const MIN_GLOW = 0.06;
const MAX_GLOW = 0.12;
const VELOCITY_TO_GLOW_SCALE = 0.00006; // Scale factor for velocity to glow

export function useScrollLinkedProps({
  scrollProgress,
  scrollVelocity,
  enabled,
}: UseScrollLinkedPropsInput): UseScrollLinkedPropsReturn {
  return useMemo(() => {
    if (!enabled) {
      return {
        letterRotation: 0,
        shimmerPosition: 0,
        glowIntensity: MIN_GLOW,
        cssVars: {
          '--hero-shimmer-position': '0%',
          '--hero-glow-intensity': String(MIN_GLOW),
          '--hero-letter-rotation': '0deg',
        },
      };
    }

    // Letter rotation: velocity-based, clamped
    const rawRotation = Math.abs(scrollVelocity) * VELOCITY_TO_ROTATION_SCALE;
    const letterRotation = Math.min(rawRotation, MAX_ROTATION) * Math.sign(scrollVelocity);

    // Shimmer position: progress-based, 0-100%
    const shimmerPosition = scrollProgress * 100;

    // Glow intensity: velocity-based, clamped between 0.06-0.12
    const velocityGlow = Math.abs(scrollVelocity) * VELOCITY_TO_GLOW_SCALE;
    const glowIntensity = Math.min(MAX_GLOW, MIN_GLOW + velocityGlow);

    return {
      letterRotation,
      shimmerPosition,
      glowIntensity,
      cssVars: {
        '--hero-shimmer-position': `${shimmerPosition}%`,
        '--hero-glow-intensity': String(glowIntensity),
        '--hero-letter-rotation': `${letterRotation}deg`,
      },
    };
  }, [scrollProgress, scrollVelocity, enabled]);
}
