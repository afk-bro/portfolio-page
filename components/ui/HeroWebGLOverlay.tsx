"use client";

import { useEffect, useRef, useMemo } from 'react';
import { Application, Graphics } from 'pixi.js';
import { cn } from '@/lib/utils';

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
  oceanDeep: '#0d4d79',
  oceanMid: '#336588',
  bronzeGlow: '#F5A623',
  sandText: '#f4d390',
};

export function HeroWebGLOverlay({
  containerRef,
  visible,
  intensity,
  className,
}: HeroWebGLOverlayProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const graphicsRef = useRef<Graphics | null>(null);

  // Check reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Detect low-power device
  const isLowPower = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    return (memory && memory < 4) || (cores && cores < 4);
  }, []);

  // Initialize PixiJS
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return;

    const container = canvasRef.current;
    const bounds = containerRef.current?.getBoundingClientRect();
    const width = bounds?.width || window.innerWidth;
    const height = bounds?.height || 400;

    // Calculate DPR (capped)
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      isLowPower ? 1 : 2
    );

    const app = new Application();

    app.init({
      width,
      height,
      backgroundAlpha: 0,
      resolution: dpr,
      autoDensity: true,
      antialias: true,
    }).then(() => {
      if (!canvasRef.current) return;

      container.appendChild(app.canvas);
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';

      // Create base graphics for effects
      const graphics = new Graphics();
      app.stage.addChild(graphics);
      graphicsRef.current = graphics;

      appRef.current = app;
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [prefersReducedMotion, containerRef, isLowPower]);

  // Handle visibility changes
  useEffect(() => {
    if (!appRef.current) return;

    if (visible && intensity > 0) {
      appRef.current.ticker.start();
    } else {
      appRef.current.ticker.stop();
    }
  }, [visible, intensity]);

  // Handle resize
  useEffect(() => {
    if (!appRef.current || !containerRef.current) return;

    const handleResize = () => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds && appRef.current) {
        appRef.current.renderer.resize(bounds.width, bounds.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  // Don't render if reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={canvasRef}
      data-testid="webgl-overlay"
      className={cn(
        'absolute inset-0 pointer-events-none z-10',
        'transition-opacity duration-150',
        className
      )}
      style={{
        opacity: visible ? intensity : 0,
      }}
      aria-hidden="true"
    />
  );
}
