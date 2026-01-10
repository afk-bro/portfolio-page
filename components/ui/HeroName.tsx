"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface HeroNameProps {
  name: string;
  className?: string;
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
export function HeroName({ name, className }: HeroNameProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

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

  // Set ref for each letter
  const setLetterRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      letterRefs.current[index] = el;
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

  // INTRO: Drop-in animation
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) {
      setIntroComplete(true);
      return;
    }

    const container = containerRef.current;

    gsap.set(container, { y: -30, opacity: 0 });
    gsap.to(container, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => setIntroComplete(true),
    });
  }, [prefersReducedMotion]);

  // BLUR-TO-SHARP REVEAL
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

    const tl = gsap.timeline({
      onComplete: () => setIsSpinning(false),
    });
    timelineRef.current = tl;

    // Set initial state for all letters
    nonSpaceLetters.forEach((letter) => {
      gsap.set(letter, {
        filter: "blur(12px)",
        opacity: 0,
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
              opacity: proxy.progress,
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
              opacity: 1,
              scale: 1,
              y: 0,
              textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
            });
          },
        },
        staggerDelay,
      );
    });
  }, [characters]);

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
          "text-[clamp(3rem,12vw,10rem)] font-bold leading-[1.1]",
          "text-ocean-800 dark:text-[#F5F5F5]",
          "mb-4 text-balance",
          className,
        )}
      >
        {name}
      </h1>
    );
  }

  return (
    <div ref={nameWrapperRef}>
      <h1
        className={cn(
          "text-[clamp(3rem,12vw,10rem)] font-bold leading-[1.1]",
          "text-ocean-800 dark:text-[#F5F5F5]",
          "mb-4",
          className,
        )}
        style={{ perspective: "1000px" }}
      >
        <span
          ref={containerRef}
          className="inline-flex flex-wrap justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {characters.map(({ char, isSpace, index }) => (
            <span
              key={index}
              ref={setLetterRef(index)}
              className={cn("inline-block", isSpace ? "w-[0.3em]" : "")}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              aria-hidden={isSpace ? "true" : undefined}
            >
              {isSpace ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span className="sr-only">{name}</span>
      </h1>
    </div>
  );
}
