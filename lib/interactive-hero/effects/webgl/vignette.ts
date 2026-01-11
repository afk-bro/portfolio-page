// lib/interactive-hero/effects/webgl/vignette.ts
import gsap from 'gsap';

export interface VignetteEffectConfig {
  intensity: number; // 0-1 intensity multiplier
  duration: number; // Duration in ms
  isDarkMode: boolean;
  color: string; // Hex color for vignette
}

export interface VignetteEffectState {
  alpha: number; // Current opacity
  color: string; // Color to render
  radius: number; // Inner radius of vignette (0-1)
}

export interface VignetteEffect {
  type: 'vignette';
  timeline: gsap.core.Timeline;
  update: (progress: number) => VignetteEffectState;
  destroy: () => void;
}

// Peak opacities by theme
const DARK_MODE_PEAK = 0.25;
const LIGHT_MODE_PEAK = 0.15;

// Phase timing (as fractions of total duration)
// 150ms in, 100ms hold, 150ms out = 400ms total
const FADE_IN_END = 150 / 400; // 0.375
const HOLD_END = 250 / 400; // 0.625
// Fade out from 0.625 to 1.0

export function createVignetteEffect(config: VignetteEffectConfig): VignetteEffect {
  const { intensity, duration, isDarkMode, color } = config;

  const peakAlpha = isDarkMode ? DARK_MODE_PEAK : LIGHT_MODE_PEAK;

  const proxy = { progress: 0 };

  const timeline = gsap.timeline();
  timeline.to(proxy, {
    progress: 1,
    duration: duration / 1000,
    ease: 'none',
  });

  const update = (progress: number): VignetteEffectState => {
    let alpha: number;

    if (progress <= FADE_IN_END) {
      // Phase 1: Fade in
      const fadeInProgress = progress / FADE_IN_END;
      alpha = peakAlpha * fadeInProgress * intensity;
    } else if (progress <= HOLD_END) {
      // Phase 2: Hold at peak
      alpha = peakAlpha * intensity;
    } else if (progress < 1) {
      // Phase 3: Fade out
      const fadeOutProgress = (progress - HOLD_END) / (1 - HOLD_END);
      alpha = peakAlpha * (1 - fadeOutProgress) * intensity;
    } else {
      // End state
      alpha = 0;
    }

    // Vignette radius stays constant (edges of screen)
    const radius = 0.7; // Inner radius where vignette starts

    return { alpha, color, radius };
  };

  const destroy = () => {
    timeline.kill();
  };

  return {
    type: 'vignette',
    timeline,
    update,
    destroy,
  };
}
