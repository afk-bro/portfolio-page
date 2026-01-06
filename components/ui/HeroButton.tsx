"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/**
 * HeroButton - 3D Keycap CTA with glass sheen
 *
 * Design approach: "3D Keycap + Glass Sheen"
 * - Gradient: Golden Nugget top highlight → Polished Bronze base
 * - Glow: bronze with warm + cool shadow mix
 * - Hover: lift + shimmer pass (if not reduced motion)
 * - Active: press down + tighten glow
 * - Inner shadows for 3D depth (keycap effect)
 */

export interface HeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  size?: "md" | "lg";
  asChild?: boolean;
}

const HeroButton = forwardRef<HTMLButtonElement, HeroButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          // Base structure - flex for text + arrow alignment
          "inline-flex items-center justify-center gap-2",
          "font-semibold",
          // Focus state (accessibility) - Shiny Trumpet ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 dark:focus-visible:ring-offset-ocean-800",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50",
          // Reduced motion
          "motion-reduce:transition-none motion-reduce:transform-none",
          // Arrow micro-motion on hover
          "[&>svg]:transition-transform [&>svg]:duration-180 [&>svg]:ease-smooth",
          "hover:[&>svg]:translate-x-0.5",

          // PRIMARY - 3D Keycap with glass sheen (uses globals.css class)
          variant === "primary" && "btn-primary-cta",

          // OUTLINE - Refined secondary button (uses globals.css class)
          variant === "outline" && "btn-secondary",

          // Sizes
          size === "md" && "h-10 px-5 text-sm",
          size === "lg" && "h-12 px-7 text-base",

          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

HeroButton.displayName = "HeroButton";

export { HeroButton };
