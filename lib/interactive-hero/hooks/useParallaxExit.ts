// lib/interactive-hero/hooks/useParallaxExit.ts
import { useMemo } from 'react';

interface UseParallaxExitProps {
  exitProgress: number; // 0-1, progress through the exit phase
  isScrollingUp: boolean;
  enabled: boolean;
}

interface ParallaxTransforms {
  background: string;
  overlay: string;
  name: string;
  divider: string;
  buttons: string;
}

interface UseParallaxExitReturn {
  backgroundOffset: number;
  overlayOffset: number;
  nameOffset: number;
  dividerOffset: number;
  buttonsOffset: number;
  transforms: ParallaxTransforms;
}

// Layer speeds (as multipliers)
const LAYER_SPEEDS = {
  background: 0.3,
  overlay: 0.5,
  name: 0.7,
  divider: 0.8,
  buttons: 1.0,
} as const;

// Total parallax distance
const PARALLAX_DISTANCE = 200; // pixels

// Reverse scroll convergence multiplier
const REVERSE_CONVERGENCE_RATE = 1.5;

// Power1.out easing function
function easeOutPower1(t: number): number {
  return 1 - Math.pow(1 - t, 2);
}

export function useParallaxExit({
  exitProgress,
  isScrollingUp,
  enabled,
}: UseParallaxExitProps): UseParallaxExitReturn {
  return useMemo(() => {
    if (!enabled || exitProgress <= 0) {
      return {
        backgroundOffset: 0,
        overlayOffset: 0,
        nameOffset: 0,
        dividerOffset: 0,
        buttonsOffset: 0,
        transforms: {
          background: 'translateY(0px)',
          overlay: 'translateY(0px)',
          name: 'translateY(0px)',
          divider: 'translateY(0px)',
          buttons: 'translateY(0px)',
        },
      };
    }

    // Apply easing to progress
    const easedProgress = easeOutPower1(Math.min(exitProgress, 1));

    // Base scroll distance
    const baseDistance = easedProgress * PARALLAX_DISTANCE;

    // Adjust for reverse scroll (faster convergence)
    const effectiveDistance = isScrollingUp
      ? baseDistance / REVERSE_CONVERGENCE_RATE
      : baseDistance;

    // Calculate offsets for each layer
    const backgroundOffset = effectiveDistance * LAYER_SPEEDS.background;
    const overlayOffset = effectiveDistance * LAYER_SPEEDS.overlay;
    const nameOffset = effectiveDistance * LAYER_SPEEDS.name;
    const dividerOffset = effectiveDistance * LAYER_SPEEDS.divider;
    const buttonsOffset = effectiveDistance * LAYER_SPEEDS.buttons;

    return {
      backgroundOffset,
      overlayOffset,
      nameOffset,
      dividerOffset,
      buttonsOffset,
      transforms: {
        background: `translateY(-${backgroundOffset}px)`,
        overlay: `translateY(-${overlayOffset}px)`,
        name: `translateY(-${nameOffset}px)`,
        divider: `translateY(-${dividerOffset}px)`,
        buttons: `translateY(-${buttonsOffset}px)`,
      },
    };
  }, [exitProgress, isScrollingUp, enabled]);
}
