// lib/interactive-hero/effects/cssFallbacks.ts

/**
 * CSS-only fallback effects for when WebGL is not available
 * These replace Tier 2 viewport effects with pure CSS/GSAP animations
 */

import gsap from "gsap";

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * CSS Ripple Fallback Effect
 *
 * Creates a box-shadow based ripple effect that expands outward from
 * the origin point. This replaces the WebGL ripple effect when WebGL
 * is not available.
 *
 * @param element - The element to apply the effect to
 * @param originX - X origin as a value from 0-1 (0 = left, 1 = right)
 * @param originY - Y origin as a value from 0-1 (0 = top, 1 = bottom)
 * @param intensity - Effect intensity from 0-1
 * @returns GSAP Timeline for the animation
 *
 * @example
 * ```ts
 * const timeline = createCSSRippleFallback(element, 0.5, 0.5, 1);
 * ```
 */
export function createCSSRippleFallback(
  element: HTMLElement,
  originX: number,
  originY: number,
  intensity: number,
): gsap.core.Timeline {
  const clampedIntensity = clamp(intensity, 0, 1);

  // Calculate offset from center for box-shadow positioning
  // originX/Y are 0-1, map to percentage offset from center
  const offsetX = (originX - 0.5) * 100;
  const offsetY = (originY - 0.5) * 100;

  // Calculate max spread based on intensity (up to 80px)
  const maxSpread = 80 * clampedIntensity;

  // Calculate opacity based on intensity
  const opacity = 0.15 * clampedIntensity;

  // Store original styles
  const originalBoxShadow = element.style.boxShadow;

  const tl = gsap.timeline();

  // Create a pseudo-element for the ripple using inline styles
  // We'll animate box-shadow inset to create the ripple effect
  tl.set(element, {
    boxShadow: `inset ${offsetX}px ${offsetY}px 0 0 rgba(6, 182, 212, ${opacity})`,
  });

  // Expand the ripple outward
  tl.to(element, {
    boxShadow: `inset 0 0 ${maxSpread}px ${maxSpread / 2}px rgba(6, 182, 212, 0)`,
    duration: 0.5,
    ease: "power2.out",
  });

  // Reset to original
  tl.set(element, {
    boxShadow: originalBoxShadow || "none",
  });

  return tl;
}

/**
 * CSS Sweep Fallback Effect
 *
 * Creates a linear gradient that sweeps across the element from
 * left to right. This replaces the WebGL sweep effect when WebGL
 * is not available.
 *
 * @param element - The element to apply the effect to
 * @param intensity - Effect intensity from 0-1
 * @returns GSAP Timeline for the animation
 *
 * @example
 * ```ts
 * const timeline = createCSSSweepFallback(element, 1);
 * ```
 */
export function createCSSSweepFallback(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const clampedIntensity = clamp(intensity, 0, 1);

  // Calculate gradient opacity based on intensity
  const gradientOpacity = 0.2 * clampedIntensity;

  // Store original styles
  const originalBackground = element.style.background;
  const originalBackgroundPosition = element.style.backgroundPosition;
  const originalBackgroundSize = element.style.backgroundSize;

  const tl = gsap.timeline();

  // Set up the gradient (20% band width)
  tl.set(element, {
    background: `linear-gradient(
      90deg,
      transparent 0%,
      rgba(6, 182, 212, ${gradientOpacity}) 40%,
      rgba(245, 166, 35, ${gradientOpacity}) 50%,
      rgba(6, 182, 212, ${gradientOpacity}) 60%,
      transparent 100%
    )`,
    backgroundSize: "200% 100%",
    backgroundPosition: "-100% center",
  });

  // Animate the sweep from left to right
  tl.to(element, {
    backgroundPosition: "200% center",
    duration: 0.6,
    ease: "power1.inOut",
  });

  // Reset to original
  tl.set(element, {
    background: originalBackground || "none",
    backgroundPosition: originalBackgroundPosition || "initial",
    backgroundSize: originalBackgroundSize || "initial",
  });

  return tl;
}

/**
 * CSS Vignette Fallback Effect
 *
 * Creates a radial gradient vignette effect that fades in, holds,
 * and fades out. This replaces the WebGL vignette effect when WebGL
 * is not available.
 *
 * Timeline: 150ms fade in, 100ms hold, 150ms fade out = 400ms total
 * Peak opacity: 0.25 dark mode, 0.15 light mode
 *
 * @param element - The element to apply the effect to
 * @param isDarkMode - Whether dark mode is active
 * @param intensity - Effect intensity from 0-1
 * @returns GSAP Timeline for the animation
 *
 * @example
 * ```ts
 * const timeline = createCSSVignetteFallback(element, true, 1);
 * ```
 */
export function createCSSVignetteFallback(
  element: HTMLElement,
  isDarkMode: boolean,
  intensity: number,
): gsap.core.Timeline {
  const clampedIntensity = clamp(intensity, 0, 1);

  // Peak opacity depends on mode and intensity
  const basePeakOpacity = isDarkMode ? 0.25 : 0.15;
  const peakOpacity = basePeakOpacity * clampedIntensity;

  // Create a vignette overlay element
  const vignetteId = `vignette-fallback-${Date.now()}`;
  let overlay = document.getElementById(vignetteId);

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = vignetteId;
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
      opacity: 0;
      background: radial-gradient(
        ellipse 80% 60% at center,
        transparent 30%,
        ${isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)"} 100%
      );
    `;

    // Ensure parent has position for absolute positioning to work
    const computedPosition = getComputedStyle(element).position;
    if (computedPosition === "static") {
      element.style.position = "relative";
    }

    element.appendChild(overlay);
  }

  const tl = gsap.timeline();

  // Set initial state
  tl.set(overlay, { opacity: 0 });

  // Fade in (150ms)
  tl.to(overlay, {
    opacity: peakOpacity,
    duration: 0.15,
    ease: "power1.in",
  });

  // Hold at peak (100ms)
  tl.to(overlay, {
    opacity: peakOpacity,
    duration: 0.1,
  });

  // Fade out (150ms)
  tl.to(overlay, {
    opacity: 0,
    duration: 0.15,
    ease: "power1.out",
    onComplete: () => {
      // Clean up the overlay element
      overlay?.remove();
    },
  });

  return tl;
}

/**
 * Check if CSS fallbacks should be used
 * This is a utility function to determine if the current environment
 * requires CSS fallbacks instead of WebGL effects.
 *
 * @returns true if CSS fallbacks should be used
 */
export function shouldUseCSSFallbacks(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !gl;
  } catch {
    return true;
  }
}
