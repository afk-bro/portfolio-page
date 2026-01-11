// lib/interactive-hero/effects/tier1.ts
import gsap from "gsap";

type EffectFunction = (
  element: HTMLElement,
  intensity: number,
) => gsap.core.Timeline;
type RippleEffectFunction = (
  element: HTMLElement,
  neighbors: HTMLElement[],
  intensity: number,
) => gsap.core.Timeline;

// Color constants
const GOLD_GLOW = "245, 166, 35";
const CYAN_GLOW = "6, 182, 212";
const OCEAN_400 = "#486d8a";
const OCEAN_200 = "#8a9ba8";

/**
 * Elastic Bounce - Letter bounces with elastic easing
 */
export function createElasticBounce(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const scale = 1 + 0.3 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    y: -20 * intensity,
    scale: scale,
    duration: 0.15,
    ease: "power2.out",
  }).to(element, {
    y: 0,
    scale: 1,
    duration: 0.45,
    ease: "elastic.out(1, 0.3)",
  });

  return tl;
}

/**
 * 3D Flip X - Letter flips horizontally (320 degrees to avoid thin-frame blink)
 */
export function createFlipX(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const rotation = 320 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    rotationY: rotation,
    duration: 0.25,
    ease: "power2.in",
  }).to(element, {
    rotationY: 0,
    duration: 0.25,
    ease: "power2.out",
  });

  return tl;
}

/**
 * 3D Flip Y - Letter flips vertically (320 degrees)
 */
export function createFlipY(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const rotation = 320 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    rotationX: rotation,
    duration: 0.25,
    ease: "power2.in",
  }).to(element, {
    rotationX: 0,
    duration: 0.25,
    ease: "power2.out",
  });

  return tl;
}

/**
 * Rubber Stretch - Letter stretches elastically
 */
export function createRubberStretch(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const scaleX = 1 + 0.4 * intensity;
  const scaleY = 1 - 0.2 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    scaleX: scaleX,
    scaleY: scaleY,
    duration: 0.15,
    ease: "power2.out",
  }).to(element, {
    scaleX: 1,
    scaleY: 1,
    duration: 0.55,
    ease: "elastic.out(1, 0.4)",
  });

  return tl;
}

/**
 * Gold Glow Pulse - Letter pulses with gold glow
 */
export function createGoldGlow(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const glowIntensity = 0.6 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    textShadow: `0 0 20px rgba(${GOLD_GLOW}, ${glowIntensity}), 0 0 40px rgba(${GOLD_GLOW}, ${glowIntensity * 0.5})`,
    duration: 0.2,
    ease: "power1.out",
  }).to(element, {
    textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
    duration: 0.2,
    ease: "power1.in",
  });

  return tl;
}

/**
 * Ocean Electric - Letter flashes with ocean colors
 */
export function createOceanElectric(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(element, {
    color: OCEAN_200,
    textShadow: `0 0 15px ${OCEAN_400}, 0 0 30px ${OCEAN_200}`,
    duration: 0.1,
    ease: "power3.out",
  }).to(element, {
    color: "",
    textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
    duration: 0.2,
    ease: "power3.out",
  });

  return tl;
}

/**
 * Weight Morph - Letter font weight changes temporarily
 */
export function createWeightMorph(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const targetWeight = intensity > 0.5 ? 900 : 300;

  tl.to(element, {
    fontWeight: targetWeight,
    duration: 0.2,
    ease: "power2.inOut",
  }).to(element, {
    fontWeight: 700, // back to bold
    duration: 0.2,
    ease: "power2.inOut",
  });

  return tl;
}

/**
 * Neighbor Ripple - Clicked letter affects neighbors with stagger
 */
export function createNeighborRipple(
  element: HTMLElement,
  neighbors: HTMLElement[],
  intensity: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Center letter bounces
  tl.to(
    element,
    {
      y: -10 * intensity,
      scale: 1.1,
      duration: 0.1,
      ease: "power2.out",
    },
    0,
  ).to(
    element,
    {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    },
    0.1,
  );

  // Neighbors ripple outward
  neighbors.forEach((neighbor, i) => {
    const delay = 0.05 * (i + 1);
    const yOffset = -6 * intensity * (1 - i * 0.3);

    tl.to(
      neighbor,
      {
        y: yOffset,
        duration: 0.15,
        ease: "power2.out",
      },
      delay,
    ).to(
      neighbor,
      {
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      delay + 0.15,
    );
  });

  return tl;
}

// Effect factory map
const EFFECT_MAP: Record<string, EffectFunction | RippleEffectFunction> = {
  "elastic-bounce": createElasticBounce,
  "flip-x": createFlipX,
  "flip-y": createFlipY,
  "rubber-stretch": createRubberStretch,
  "gold-glow": createGoldGlow,
  "ocean-electric": createOceanElectric,
  "weight-morph": createWeightMorph,
  "neighbor-ripple": createNeighborRipple,
};

/**
 * Get effect function by ID
 */
export function createTier1Effect(
  effectId: string,
): EffectFunction | RippleEffectFunction | null {
  return EFFECT_MAP[effectId] || null;
}
