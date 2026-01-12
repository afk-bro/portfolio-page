"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right";

interface AnimateOnScrollProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  threshold?: number;
}

/**
 * Component that animates its children when they scroll into view.
 * Respects the user's prefers-reduced-motion preference.
 */
export function AnimateOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 500,
  className,
  as: Component = "div",
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const { ref, isVisible, prefersReducedMotion, hasMounted } = useScrollAnimation({
    threshold,
    triggerOnce: true,
  });

  // Get initial and final styles based on animation variant
  const getAnimationStyles = (): React.CSSProperties | undefined => {
    // Before hydration, don't apply any inline styles to prevent mismatch
    if (!hasMounted) {
      return undefined;
    }

    // If reduced motion is preferred, show content immediately without transform
    if (prefersReducedMotion) {
      return {
        opacity: 1,
        transform: "none",
        transition: "none",
      };
    }

    const baseTransition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    const delayedTransition =
      delay > 0 ? `${baseTransition} ${delay}ms` : baseTransition;

    const variants: Record<
      AnimationVariant,
      { initial: React.CSSProperties; visible: React.CSSProperties }
    > = {
      "fade-up": {
        initial: {
          opacity: 0,
          transform: "translateY(24px)",
          transition: delayedTransition,
        },
        visible: {
          opacity: 1,
          transform: "translateY(0)",
          transition: delayedTransition,
        },
      },
      "fade-in": {
        initial: {
          opacity: 0,
          transition: delayedTransition,
        },
        visible: {
          opacity: 1,
          transition: delayedTransition,
        },
      },
      "fade-left": {
        initial: {
          opacity: 0,
          transform: "translateX(24px)",
          transition: delayedTransition,
        },
        visible: {
          opacity: 1,
          transform: "translateX(0)",
          transition: delayedTransition,
        },
      },
      "fade-right": {
        initial: {
          opacity: 0,
          transform: "translateX(-24px)",
          transition: delayedTransition,
        },
        visible: {
          opacity: 1,
          transform: "translateX(0)",
          transition: delayedTransition,
        },
      },
    };

    return isVisible ? variants[variant].visible : variants[variant].initial;
  };

  // Use a type assertion for the dynamic component
  const ElementComponent = Component as React.ElementType;

  return (
    <ElementComponent
      ref={ref}
      className={cn(className)}
      style={getAnimationStyles()}
    >
      {children}
    </ElementComponent>
  );
}
