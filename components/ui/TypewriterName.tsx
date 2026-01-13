"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TypewriterNameProps {
  name: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * TypewriterName - Calm, mechanical typewriter reveal
 *
 * Slower, deliberate typing with proper mechanical rhythm
 * Features a massive background initial for visual anchoring
 */
export function TypewriterName({ name, className }: TypewriterNameProps) {
  const letters = useMemo(() => Array.from(name), [name]);
  const firstLetter = name.charAt(0).toUpperCase();

  // Pre-compute delays - slower base speed with subtle variance
  const delays = useMemo(
    () => letters.map((_, i) => i * 0.09 + Math.random() * 0.025),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name]
  );

  return (
    <div className="relative inline-block">
      {/* Massive background initial - visual anchor */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1] as const,
          delay: 0,
        }}
        className={cn(
          "absolute",
          "select-none pointer-events-none",
          // Position: left-aligned, vertically centered
          "-left-[0.15em] top-1/2 -translate-y-[52%]",
          // Size: ~4x the name height
          "text-[clamp(14rem,28vw,22rem)]",
          // Weight: heavier than name
          "font-black",
          // Opacity: subtle but present
          "opacity-[0.045] dark:opacity-[0.06]",
          // Color
          "text-ocean-950 dark:text-white",
          // Behind the text
          "z-0"
        )}
        style={{
          lineHeight: 1,
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
      >
        {firstLetter}
      </motion.span>

      {/* Paper strip background - subtle gradient for anchoring */}
      <div
        className="absolute -inset-x-6 -inset-y-2 rounded-sm pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        }}
        aria-hidden="true"
      />

      <h1
        className={cn(
          "font-typewriter",
          "text-[clamp(3.9rem,6.8vw,6.2rem)]",
          "tracking-[0.1em]",
          "leading-[1.2]",
          // Higher contrast - name pops forward
          "text-ocean-900 dark:text-white/95",
          // Above the background initial
          "relative z-10",
          className
        )}
        style={{
          // Deeper ink impression - stamped, not glowing
          textShadow:
            "0 1.5px 0 rgba(0,0,0,0.45), 0 0 3px rgba(255,255,255,0.06)",
        }}
      >
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: delays[i],
              duration: 0.15,
              ease: [0.2, 0, 0.4, 1] as const,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}

/**
 * Calculate how long the typewriter animation takes
 * Use this to sync subsequent animations
 */
export function getTypewriterDuration(name: string): number {
  return name.length * 0.09 + 0.3; // base timing + buffer
}
