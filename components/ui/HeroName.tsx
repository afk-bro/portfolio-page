"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface HeroNameProps {
  name: string;
  className?: string;
}

/**
 * HeroName - Animated hero name with GSAP spin cascade
 *
 * Trigger strategy (Option A):
 * - Viewport detection: name must be 50%+ visible
 * - Trigger on first scroll WHILE visible
 * - Minimum 700ms on-screen runtime (won't cancel early)
 * - Play once per session
 *
 * "Start instantly" trick:
 * - First 2 letters spin within 150ms
 * - Catches the eye even in fast scroll
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
   * Compute visuals from single progress value
   * Uses bronze (#e79b47 Pumpkin Pie) for glow highlight
   */
  const computeVisuals = (progress: number, totalRotation: number) => {
    const rotation = progress * totalRotation;

    // Bell curve glow: peaks ~0.4, fades by 0.85
    let glowIntensity = 0;
    if (progress < 0.85) {
      const bellProgress = progress / 0.85;
      glowIntensity = Math.sin(bellProgress * Math.PI) * 0.7;
    }

    // Edge-on boost (only during active spin)
    const normalizedAngle = rotation % 360;
    const edgeOnness = Math.abs(Math.sin((normalizedAngle * Math.PI) / 180));
    const edgeOnBoost = progress < 0.75 ? edgeOnness * 0.3 : 0;
    const finalGlow = Math.min(glowIntensity + edgeOnBoost, 0.8);

    // Color follows glow curve
    let colorMix = 0;
    if (progress < 0.85) {
      const colorProgress = progress / 0.85;
      colorMix = Math.sin(colorProgress * Math.PI) * 0.6;
    }

    const glowSize = 8 + finalGlow * 20;

    return { rotation, glowIntensity: finalGlow, glowSize, colorMix };
  };

  // Bronze color for glow: #e79b47 (Pumpkin Pie) = rgb(231, 155, 71)
  const BRONZE_GLOW = "231, 155, 71";

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

  // SPIN CASCADE
  const triggerSpinCascade = useCallback(() => {
    if (hasPlayedRef.current) return; // Once per session
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

    const totalLetters = nonSpaceLetters.length;
    const tl = gsap.timeline({
      onComplete: () => setIsSpinning(false),
    });
    timelineRef.current = tl;

    nonSpaceLetters.forEach((letter, i) => {
      // "START INSTANTLY" TRICK:
      // First 2 letters: 0ms and 80ms (visible within 150ms)
      // Rest: normal stagger
      let staggerDelay: number;
      if (i === 0) {
        staggerDelay = 0; // Immediate
      } else if (i === 1) {
        staggerDelay = 0.08; // 80ms - both spinning by 150ms
      } else if (i < 4) {
        staggerDelay = 0.08 + (i - 1) * 0.12; // Letters 2-3: tight
      } else {
        staggerDelay = 0.44 + (i - 4) * 0.15; // Rest: normal spacing
      }

      const turns = i === 0 ? 3 : 2;
      const totalRotation = 360 * turns;
      const duration = i === 0 ? 1.5 : 1.2;

      const proxy = { progress: 0 };

      tl.to(
        proxy,
        {
          progress: 1,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            const { rotation, glowIntensity, glowSize, colorMix } =
              computeVisuals(proxy.progress, totalRotation);

            gsap.set(letter, {
              rotateY: rotation,
              textShadow:
                glowIntensity > 0.05
                  ? `0 0 ${glowSize}px rgba(${BRONZE_GLOW}, ${glowIntensity})`
                  : "none",
              color: colorMix > 0.05 ? `rgba(${BRONZE_GLOW}, ${colorMix})` : "",
            });
          },
          onComplete: () => {
            gsap.set(letter, {
              rotateY: 0,
              textShadow: "none",
              color: "",
            });
          },
        },
        staggerDelay,
      );
    });

    // Settle buffer
    const lastStagger =
      totalLetters < 4
        ? 0.08 + (totalLetters - 2) * 0.12
        : 0.44 + (totalLetters - 5) * 0.15;
    tl.to({}, { duration: 0.1 }, lastStagger + 1.2);
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
        triggerSpinCascade();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Trigger on wheel if visible and scrolling down
      if (e.deltaY > 3 && isVisible && !hasPlayedRef.current) {
        triggerSpinCascade();
      }
    };

    const handleTouchMove = () => {
      if (isVisible && !hasPlayedRef.current && window.scrollY > 10) {
        triggerSpinCascade();
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
  }, [introComplete, isVisible, triggerSpinCascade, prefersReducedMotion]);

  // MINIMUM RUNTIME: Don't allow early cancel
  // Timeline will complete naturally - no early termination

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <h1
        className={cn(
          "text-h1 md:text-display text-ocean-800 dark:text-sand-500 mb-4 text-balance",
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
          "text-h1 md:text-display text-ocean-800 dark:text-sand-500 mb-4",
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
