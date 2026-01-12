// components/sections/Hero.tsx
"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteMetadata } from "@/data/metadata";
import { HeroButton } from "@/components/ui/HeroButton";
import { HeroName } from "@/components/ui/HeroName";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  HeroWebGLOverlay,
  type HeroWebGLOverlayRef,
} from "@/components/ui/HeroWebGLOverlay";
import {
  useHeroScroll,
  useScrollLinkedProps,
  useParallaxExit,
  useTier2Effects,
  VisibilityState,
} from "@/lib/interactive-hero";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const webglRef = useRef<HeroWebGLOverlayRef>(null);

  // Check reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Scroll tracking and pin behavior
  const {
    scrollIntent,
    scrollProgress,
    scrollVelocity,
    isScrollingUp,
    isPinned,
    timeOnPage,
  } = useHeroScroll({
    containerRef,
    enabled: !prefersReducedMotion,
  });

  // Scroll-linked property values
  const { shimmerPosition, glowIntensity, cssVars } = useScrollLinkedProps({
    scrollProgress,
    scrollVelocity,
    enabled: !prefersReducedMotion && isPinned,
  });

  // Parallax exit (after pin releases)
  const exitProgress = isPinned ? 0 : Math.max(0, scrollProgress - 1);
  const { transforms } = useParallaxExit({
    exitProgress,
    isScrollingUp,
    enabled: !prefersReducedMotion,
  });

  // Tier 2 viewport effects
  const interactionCount = 0; // This would come from HeroName via context or prop drilling
  const { canTrigger, triggerEffect } = useTier2Effects({
    visibility: isPinned ? VisibilityState.Full : VisibilityState.Reduced,
    interactionCount,
    timeOnPage,
    scrollIntent,
    isScrollingUp,
  });

  // Handle Tier 2 effect trigger (would be called from click handler)
  const handleTier2Trigger = async (origin: { x: number; y: number }) => {
    if (!canTrigger || !webglRef.current) return;

    const effect = await triggerEffect(origin);
    if (effect) {
      webglRef.current.addEffect(effect);
    }
  };

  // Suppress unused variable warnings - these are wired up for future use
  void shimmerPosition;
  void handleTier2Trigger;

  return (
    <section
      ref={containerRef}
      className="section hero-bg relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32"
      style={cssVars as React.CSSProperties}
    >
      {/* WebGL Overlay for Tier 2 effects */}
      {!prefersReducedMotion && (
        <HeroWebGLOverlay
          ref={webglRef}
          containerRef={containerRef}
          visible={isPinned}
          intensity={1}
          className="z-5"
        />
      )}

      {/* Localized amber glow behind hero content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-bronze-500/[0.04] blur-3xl dark:bg-amber-500/[0.06]"
        style={{
          opacity: glowIntensity / 0.06, // Scale relative to base
          transform: transforms.background,
        }}
      />

      <div className="container-content relative">
        <AnimateOnScroll
          variant="fade-up"
          className="max-w-3xl mx-auto text-center"
        >
          {/* Availability Badge */}
          {siteMetadata.availability === "available" && (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-pill bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-500 text-sm font-medium border border-success-500/20 dark:border-success-500/25 hover:bg-success-100 dark:hover:bg-success-500/25 transition-colors"
              style={{ transform: transforms.buttons }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Open to opportunities</span>
            </Link>
          )}

          {/* Name - Animated */}
          <div style={{ transform: transforms.name }}>
            <HeroName name={siteMetadata.name} />
          </div>

          {/* Role */}
          <p
            className="text-xl md:text-2xl font-normal text-ocean-400 dark:text-cyan-400/80 mb-6"
            style={{ transform: transforms.name }}
          >
            {siteMetadata.role}
          </p>

          {/* Bio */}
          <p
            className="text-body text-ocean-400 dark:text-sand-100/70 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ transform: transforms.name }}
          >
            {siteMetadata.bio}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ transform: transforms.buttons }}
          >
            <HeroButton asChild size="lg" variant="primary">
              <Link href="/projects">
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </HeroButton>
            <HeroButton asChild size="lg" variant="outline">
              <Link href="#how-i-build">
                How I Build Software
                <ArrowRight className="w-4 h-4" />
              </Link>
            </HeroButton>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
