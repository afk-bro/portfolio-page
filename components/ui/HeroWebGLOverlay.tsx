// components/ui/HeroWebGLOverlay.tsx
"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Application, Graphics, Container } from "pixi.js";
import { cn } from "@/lib/utils";
import type {
  RippleEffect,
  RippleEffectState,
} from "@/lib/interactive-hero/effects/webgl/ripple";
import type {
  SweepEffect,
  SweepEffectState,
} from "@/lib/interactive-hero/effects/webgl/sweep";
import type {
  VignetteEffect,
  VignetteEffectState,
} from "@/lib/interactive-hero/effects/webgl/vignette";

type WebGLEffect = RippleEffect | SweepEffect | VignetteEffect;

export interface HeroWebGLOverlayRef {
  addEffect: (effect: WebGLEffect) => void;
  clearEffects: () => void;
}

interface HeroWebGLOverlayProps {
  containerRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
  intensity: number;
  className?: string;
}

interface ThemePalette {
  oceanDeep: string;
  oceanMid: string;
  bronzeGlow: string;
  sandText: string;
}

const THEME_PALETTE: ThemePalette = {
  oceanDeep: "#0d4d79",
  oceanMid: "#336588",
  bronzeGlow: "#F5A623",
  sandText: "#f4d390",
};

// Convert hex to number for PixiJS
function hexToNumber(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

export const HeroWebGLOverlay = forwardRef<
  HeroWebGLOverlayRef,
  HeroWebGLOverlayProps
>(function HeroWebGLOverlay(
  { containerRef, visible, intensity, className },
  ref,
) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const effectsContainerRef = useRef<Container | null>(null);
  const activeEffectsRef = useRef<
    Map<string, { effect: WebGLEffect; graphics: Graphics }>
  >(new Map());
  const rafIdRef = useRef<number | null>(null);

  // Check reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Detect low-power device
  const isLowPower = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const memory = (navigator as unknown as { deviceMemory?: number })
      .deviceMemory;
    const cores = navigator.hardwareConcurrency;
    return (memory && memory < 4) || (cores && cores < 4);
  }, []);

  // Render loop
  const renderEffects = useCallback(() => {
    if (!appRef.current || !visible) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    activeEffectsRef.current.forEach(({ effect, graphics }) => {
      graphics.clear();

      const progress = effect.timeline.progress();
      const state = effect.update(progress);

      switch (effect.type) {
        case "ripple": {
          const rippleState = state as RippleEffectState;
          const centerX = effect.origin.x * bounds.width;
          const centerY = effect.origin.y * bounds.height;
          const radius =
            rippleState.radius * Math.max(bounds.width, bounds.height);

          // Draw ripple ring
          graphics.circle(centerX, centerY, radius);
          graphics.stroke({
            color: hexToNumber(THEME_PALETTE.bronzeGlow),
            width: 2,
            alpha: rippleState.alpha * 0.5,
          });
          break;
        }

        case "sweep": {
          const sweepState = state as SweepEffectState;
          const x = sweepState.position * bounds.width;
          const width = sweepState.width * bounds.width;

          // Draw gradient sweep bar
          graphics.rect(x - width / 2, 0, width, bounds.height);
          graphics.fill({
            color: hexToNumber(sweepState.color),
            alpha: sweepState.alpha,
          });
          break;
        }

        case "vignette": {
          const vignetteState = state as VignetteEffectState;
          const cx = bounds.width / 2;
          const cy = bounds.height / 2;
          const outerRadius = Math.max(bounds.width, bounds.height);
          const innerRadius = vignetteState.radius * outerRadius;

          // Draw vignette as multiple concentric circles with increasing alpha
          const steps = 10;
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const r = innerRadius + (outerRadius - innerRadius) * t;
            const alpha = vignetteState.alpha * t;

            graphics.circle(cx, cy, r);
            graphics.stroke({
              color: hexToNumber(vignetteState.color),
              width: (outerRadius - innerRadius) / steps,
              alpha,
            });
          }
          break;
        }
      }
    });

    rafIdRef.current = requestAnimationFrame(renderEffects);
  }, [visible, containerRef]);

  // Add effect to render queue
  const addEffect = useCallback(
    (effect: WebGLEffect) => {
      if (!appRef.current || !effectsContainerRef.current) return;

      const graphics = new Graphics();
      effectsContainerRef.current.addChild(graphics);

      const effectId = `${effect.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      activeEffectsRef.current.set(effectId, { effect, graphics });

      // Start render loop if not running
      if (rafIdRef.current === null && visible) {
        rafIdRef.current = requestAnimationFrame(renderEffects);
      }

      // Listen for effect completion
      effect.timeline.then(() => {
        const entry = activeEffectsRef.current.get(effectId);
        if (entry) {
          entry.graphics.destroy();
          activeEffectsRef.current.delete(effectId);
        }
        effect.destroy();

        // Stop render loop if no more effects
        if (activeEffectsRef.current.size === 0 && rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      });
    },
    [visible, renderEffects],
  );

  // Clear all effects
  const clearEffects = useCallback(() => {
    activeEffectsRef.current.forEach(({ effect, graphics }) => {
      graphics.destroy();
      effect.destroy();
    });
    activeEffectsRef.current.clear();

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      addEffect,
      clearEffects,
    }),
    [addEffect, clearEffects],
  );

  // Initialize PixiJS
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return;

    const container = canvasRef.current;
    const bounds = containerRef.current?.getBoundingClientRect();
    const width = bounds?.width || window.innerWidth;
    const height = bounds?.height || 400;

    const dpr = Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 2);

    // Track if component is still mounted
    let isMounted = true;
    let canvasElement: HTMLCanvasElement | null = null;

    const app = new Application();

    app
      .init({
        width,
        height,
        backgroundAlpha: 0,
        resolution: dpr,
        autoDensity: true,
        antialias: true,
      })
      .then(() => {
        // Don't append if already unmounted
        if (!isMounted || !canvasRef.current) {
          app.destroy(true);
          return;
        }

        canvasElement = app.canvas;
        container.appendChild(canvasElement);
        canvasElement.style.width = "100%";
        canvasElement.style.height = "100%";

        // Create container for effects
        const effectsContainer = new Container();
        app.stage.addChild(effectsContainer);
        effectsContainerRef.current = effectsContainer;

        appRef.current = app;
      });

    return () => {
      isMounted = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      clearEffects();
      // Remove canvas from DOM before destroying (prevents React conflict)
      if (canvasElement && canvasElement.parentNode) {
        canvasElement.parentNode.removeChild(canvasElement);
      }
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [prefersReducedMotion, containerRef, isLowPower, clearEffects]);

  // Synchronous cleanup on unmount to prevent React DOM conflicts
  useLayoutEffect(() => {
    return () => {
      // Kill any pending animation frames synchronously
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  // Start/stop render loop based on visibility
  useEffect(() => {
    if (
      visible &&
      activeEffectsRef.current.size > 0 &&
      rafIdRef.current === null
    ) {
      rafIdRef.current = requestAnimationFrame(renderEffects);
    } else if (!visible && rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [visible, renderEffects]);

  // Handle resize
  useEffect(() => {
    if (!appRef.current || !containerRef.current) return;

    const handleResize = () => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds && appRef.current) {
        appRef.current.renderer.resize(bounds.width, bounds.height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={canvasRef}
      data-testid="webgl-overlay"
      className={cn(
        "absolute inset-0 pointer-events-none z-10",
        "transition-opacity duration-150",
        className,
      )}
      style={{
        opacity: visible ? intensity : 0,
      }}
      aria-hidden="true"
    />
  );
});
