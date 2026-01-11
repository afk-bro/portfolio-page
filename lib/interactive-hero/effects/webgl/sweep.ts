// lib/interactive-hero/effects/webgl/sweep.ts
import gsap from "gsap";

export type SweepDirection = "left-to-right" | "right-to-left";

export interface SweepEffectConfig {
  direction: SweepDirection;
  intensity: number; // 0-1 intensity multiplier
  duration: number; // Duration in ms
  color: string; // Hex color
}

export interface SweepEffectState {
  position: number; // Current X position (0-1 normalized, can exceed bounds)
  width: number; // Sweep width as fraction of viewport
  alpha: number; // Current opacity
  color: string; // Color to render
}

export interface SweepEffect {
  type: "sweep";
  direction: SweepDirection;
  timeline: gsap.core.Timeline;
  update: (progress: number) => SweepEffectState;
  destroy: () => void;
}

const SWEEP_WIDTH = 0.2; // 20% of viewport
const BASE_ALPHA = 0.15; // 15% opacity base

export function createSweepEffect(config: SweepEffectConfig): SweepEffect {
  const { direction, intensity, duration, color } = config;

  const proxy = { progress: 0 };

  const timeline = gsap.timeline();
  timeline.to(proxy, {
    progress: 1,
    duration: duration / 1000,
    ease: "power1.inOut",
  });

  const update = (progress: number): SweepEffectState => {
    // Calculate position based on direction
    // Sweep needs to travel from off-screen to off-screen
    // Starting position: -width (fully off left)
    // Ending position: 1 + width (fully off right)
    const totalTravel = 1 + SWEEP_WIDTH * 2;

    let position: number;
    if (direction === "left-to-right") {
      position = -SWEEP_WIDTH + totalTravel * progress;
    } else {
      position = 1 + SWEEP_WIDTH - totalTravel * progress;
    }

    // Alpha peaks in the middle of the animation
    const alphaProgress = Math.sin(progress * Math.PI);
    const alpha = BASE_ALPHA * intensity * alphaProgress;

    return {
      position,
      width: SWEEP_WIDTH,
      alpha,
      color,
    };
  };

  const destroy = () => {
    timeline.kill();
  };

  return {
    type: "sweep",
    direction,
    timeline,
    update,
    destroy,
  };
}
