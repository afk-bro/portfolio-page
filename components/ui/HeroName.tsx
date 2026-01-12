"use client";

import { useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import {
  useLetterClick,
  useTier3Effects,
  VisibilityState,
} from "@/lib/interactive-hero";

type Tier3EffectType = "caustics" | "particle-trail";

interface HeroNameProps {
  name: string;
  className?: string;
  onTier3Change?: (effects: Tier3EffectType[]) => void;
}

/**
 * HeroName - Animated hero name with blur-to-sharp reveal
 *
 * Trigger strategy (Option A):
 * - Viewport detection: name must be 50%+ visible
 * - Trigger on first scroll WHILE visible
 * - Minimum 700ms on-screen runtime (won't cancel early)
 * - Play once per session
 *
 * Blur-to-sharp effect:
 * - Letters start blurred, scaled up, and above position
 * - They animate to sharp, normal scale, and final position
 * - Dual glow (gold + cyan) appears during animation
 */
export function HeroName({ name, className, onTier3Change }: HeroNameProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterRefsArray = useRef<HTMLSpanElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);

  const [introComplete, setIntroComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [, setIsSpinning] = useState(false);
  const hasPlayedRef = useRef(false); // Once per session
  const spinStartTimeRef = useRef(0);
  const lastScrollYRef = useRef(0);

  // Reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Split name into characters
  const characters = useMemo(() => {
    return name.split("").map((char, index) => ({
      char,
      isSpace: char === " ",
      index,
    }));
  }, [name]);

  // Calculate total letters (excluding spaces) for Tier 3 unlock detection
  const totalLetters = useMemo(() => name.replace(/\s/g, "").length, [name]);

  // Current visibility state
  const visibility = isVisible ? VisibilityState.Full : VisibilityState.Frozen;

  // Click handler for interactive effects
  const { handleClick, interactionCount, clickedLetters } = useLetterClick({
    letterRefs: { current: letterRefsArray.current },
    visibility,
    enabled: !prefersReducedMotion && introComplete,
  });

  // Tier 3 Easter egg effects
  const { activeTier3Effects } = useTier3Effects({
    interactionCount,
    clickedLetters,
    totalLetters,
    visibility,
    enabled: !prefersReducedMotion && introComplete,
  });

  // Notify parent when Tier 3 effects change
  useEffect(() => {
    onTier3Change?.(activeTier3Effects);
  }, [activeTier3Effects, onTier3Change]);

  // Set ref for each letter
  const setLetterRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      letterRefs.current[index] = el;
      if (el) {
        letterRefsArray.current[index] = el;
      }
    },
    [],
  );

  /**
   * Compute blur-to-sharp visuals from progress
   * Uses dual gold/cyan for dramatic effect
   */
  const computeBlurVisuals = (progress: number) => {
    // Blur: starts at 12px, resolves to 0
    const blur = 12 * (1 - progress);

    // Scale: starts at 1.1, settles to 1
    const scale = 1 + 0.1 * (1 - progress);

    // Y position: drops from -40 to 0
    const y = -40 * (1 - progress);

    // Glow peaks at 0.5 progress, fades by end
    let glowIntensity = 0;
    if (progress < 0.8) {
      glowIntensity = Math.sin((progress / 0.8) * Math.PI) * 0.6;
    }

    return { blur, scale, y, glowIntensity };
  };

  // Dual accent glow colors
  const GOLD_GLOW = "245, 166, 35"; // gold-500
  const CYAN_GLOW = "6, 182, 212"; // cyan-500

  // VIEWPORT DETECTION: Track when name is 50%+ visible
  useEffect(() => {
    if (!nameWrapperRef.current || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5, // 50% visible
        rootMargin: "0px",
      },
    );

    observer.observe(nameWrapperRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // INTRO: Drop-in animation with proper cleanup using gsap.context()
  // useLayoutEffect ensures cleanup runs synchronously before React removes DOM nodes
  useLayoutEffect(() => {
    if (!containerRef.current || prefersReducedMotion) {
      setIntroComplete(true);
      return;
    }

    const container = containerRef.current;

    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Use autoAlpha (visibility + opacity) to avoid FOUC
      gsap.set(container, { y: -30, autoAlpha: 0 });
      gsap.to(container, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => setIntroComplete(true),
      });
    }, nameWrapperRef);

    // Cleanup: revert all GSAP changes when component unmounts
    return () => {
      // Kill all tweens on this element immediately
      gsap.killTweensOf(container);
      ctx.revert();
      // Reset for StrictMode double-mount
      hasPlayedRef.current = false;
      setIntroComplete(false);
    };
  }, [prefersReducedMotion]);

  // BLUR-TO-SHARP REVEAL with proper cleanup
  const triggerBlurReveal = useCallback(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    spinStartTimeRef.current = Date.now();
    setIsSpinning(true);

    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const nonSpaceLetters: HTMLSpanElement[] = [];

    letters.forEach((letter, i) => {
      if (!characters[i]?.isSpace) {
        nonSpaceLetters.push(letter);
      }
    });

    // Create context for cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsSpinning(false),
      });
      timelineRef.current = tl;

      // Set initial state for all letters using autoAlpha
      nonSpaceLetters.forEach((letter) => {
        gsap.set(letter, {
          filter: "blur(12px)",
          autoAlpha: 0,
          scale: 1.1,
          y: -40,
        });
      });

      // Animate each letter with stagger
      nonSpaceLetters.forEach((letter, i) => {
        const staggerDelay = i * 0.05; // 50ms stagger
        const duration = 0.6;

        const proxy = { progress: 0 };

        tl.to(
          proxy,
          {
            progress: 1,
            duration: duration,
            ease: "power3.out",
            onUpdate: () => {
              const { blur, scale, y, glowIntensity } = computeBlurVisuals(
                proxy.progress,
              );

              gsap.set(letter, {
                filter: `blur(${blur}px)`,
                autoAlpha: proxy.progress,
                scale: scale,
                y: y,
                textShadow:
                  glowIntensity > 0.05
                    ? `0 4px 30px rgba(${GOLD_GLOW}, ${glowIntensity * 0.5}), 0 0 60px rgba(${CYAN_GLOW}, ${glowIntensity * 0.25})`
                    : "none",
              });
            },
            onComplete: () => {
              gsap.set(letter, {
                filter: "blur(0px)",
                autoAlpha: 1,
                scale: 1,
                y: 0,
                textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
              });
            },
          },
          staggerDelay,
        );
      });
    }, nameWrapperRef);

    gsapContextRef.current = ctx;
  }, [characters]);

  // Cleanup GSAP context on unmount - useLayoutEffect for sync cleanup before DOM removal
  useLayoutEffect(() => {
    return () => {
      // Kill all tweens on letter elements
      letterRefs.current.forEach((letter) => {
        if (letter) gsap.killTweensOf(letter);
      });
      // Kill timeline first before reverting context
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
        gsapContextRef.current = null;
      }
    };
  }, []);

  // SCROLL HANDLING: Trigger only when visible
  useEffect(() => {
    if (!introComplete || prefersReducedMotion) return;

    const handleScrollIntent = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollYRef.current;
      const scrollingDown = currentY > previousY;

      lastScrollYRef.current = currentY;

      // Trigger when:
      // 1. User is scrolling down
      // 2. Name is currently visible (50%+)
      // 3. Haven't played yet this session
      if (
        scrollingDown &&
        isVisible &&
        !hasPlayedRef.current &&
        currentY > 10
      ) {
        triggerBlurReveal();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Trigger on wheel if visible and scrolling down
      if (e.deltaY > 3 && isVisible && !hasPlayedRef.current) {
        triggerBlurReveal();
      }
    };

    const handleTouchMove = () => {
      if (isVisible && !hasPlayedRef.current && window.scrollY > 10) {
        triggerBlurReveal();
      }
    };

    window.addEventListener("scroll", handleScrollIntent, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollIntent);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [introComplete, isVisible, triggerBlurReveal, prefersReducedMotion]);

  // MINIMUM RUNTIME: Don't allow early cancel
  // Timeline will complete naturally - no early termination

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <h1
        className={cn(
          "text-[clamp(2.5rem,10vw,10rem)] font-semibold leading-[1.1] whitespace-nowrap",
          "text-ocean-800 dark:text-[#F5F5F5]",
          "mb-4",
          className,
        )}
      >
        {name}
      </h1>
    );
  }

  return (
    <div ref={nameWrapperRef} className="relative mb-8">
      <h1
        className={cn(
          "text-[clamp(2.5rem,10vw,10rem)] font-semibold leading-[1.1] whitespace-nowrap",
          "text-ocean-800 dark:text-[#F5F5F5]",
          className,
        )}
        style={{ perspective: "1000px" }}
      >
        <span
          ref={containerRef}
          className="inline-flex justify-center"
          style={{ transformStyle: "preserve-3d", visibility: "hidden" }}
        >
          {characters.map(({ char, isSpace, index }) => (
            <span
              key={index}
              ref={setLetterRef(index)}
              className={cn(
                "inline-block",
                isSpace
                  ? "w-[0.3em]"
                  : "cursor-pointer select-none hover:scale-105 hover:-translate-y-0.5 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 active:translate-y-0 transition-transform duration-150 ease-out",
              )}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              aria-hidden={isSpace ? "true" : undefined}
              onClick={isSpace ? undefined : () => handleClick(index)}
              role={isSpace ? undefined : "button"}
              tabIndex={isSpace ? undefined : 0}
              onKeyDown={
                isSpace
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick(index);
                      }
                    }
              }
            >
              {isSpace ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span className="sr-only">{name}</span>
      </h1>
      {/* Animated gradient underline */}
      <div
        className="absolute left-1/2 -translate-x-1/2 mt-2 h-0.5 rounded-full hero-divider animate-underline-sweep"
        style={{
          animationDelay: "0.4s",
          animationFillMode: "both",
        }}
      />
    </div>
  );
}
