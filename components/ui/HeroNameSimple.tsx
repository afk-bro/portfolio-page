// components/ui/HeroNameSimple.tsx
// Simplified version without GSAP animations to prevent React DOM conflicts
"use client";

import { cn } from "@/lib/utils";

interface HeroNameProps {
  name: string;
  className?: string;
}

export function HeroNameSimple({ name, className }: HeroNameProps) {
  return (
    <div className="relative mb-8">
      <h1
        className={cn(
          "text-[clamp(2.5rem,10vw,10rem)] font-semibold leading-[1.1] whitespace-nowrap",
          "text-ocean-800 dark:text-[#F5F5F5]",
          className,
        )}
      >
        <span className="inline-flex justify-center">
          {name.split("").map((char, index) => (
            <span
              key={index}
              className={cn(
                "inline-block",
                char === " "
                  ? "w-[0.3em]"
                  : "cursor-pointer select-none hover:scale-105 hover:-translate-y-0.5 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 active:translate-y-0 transition-transform duration-150 ease-out",
              )}
              aria-hidden={char === " " ? "true" : undefined}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </h1>
      {/* Gradient underline */}
      <div
        className="absolute left-1/2 -translate-x-1/2 mt-2 h-0.5 w-24 rounded-full hero-divider"
      />
    </div>
  );
}
