// lib/interactive-hero/hooks/useTier2Effects.ts
import { useState, useCallback, useMemo } from "react";
import {
  VisibilityState,
  type VisibilityStateType,
  TIER_UNLOCK,
} from "../types";
import { TIER2_EFFECTS, selectWeightedEffect } from "../effectCatalog";
import { createRippleEffect, type RippleEffect } from "../effects/webgl/ripple";
import { createSweepEffect, type SweepEffect } from "../effects/webgl/sweep";
import {
  createVignetteEffect,
  type VignetteEffect,
} from "../effects/webgl/vignette";

interface UseTier2EffectsProps {
  visibility: VisibilityStateType;
  interactionCount: number;
  timeOnPage: number; // seconds
  scrollIntent: boolean;
  isScrollingUp: boolean;
  isDarkMode?: boolean;
}

type Tier2EffectInstance = RippleEffect | SweepEffect | VignetteEffect;

interface UseTier2EffectsReturn {
  canTrigger: boolean;
  lastEffectId: string | null;
  cooldownRemaining: number;
  triggerEffect: (origin: {
    x: number;
    y: number;
  }) => Promise<Tier2EffectInstance | null>;
}

export function useTier2Effects({
  visibility,
  interactionCount,
  timeOnPage,
  scrollIntent,
  isScrollingUp,
  isDarkMode = true,
}: UseTier2EffectsProps): UseTier2EffectsReturn {
  const [lastEffectId, setLastEffectId] = useState<string | null>(null);
  const [lastTriggerTime, setLastTriggerTime] = useState<number | null>(null);
  const [cooldownDuration, setCooldownDuration] = useState<number>(0);

  // Calculate if conditions are met for Tier 2
  const meetsUnlockConditions = useMemo(() => {
    // Need 5+ interactions
    if (interactionCount < TIER_UNLOCK.tier2Interactions) return false;

    // Need either 8s time OR scroll intent
    const hasTimeRequirement = timeOnPage >= TIER_UNLOCK.tier2TimeOnPage;
    if (!hasTimeRequirement && !scrollIntent) return false;

    return true;
  }, [interactionCount, timeOnPage, scrollIntent]);

  // Calculate cooldown state - these need to recalculate on each render
  // since they depend on the current time via performance.now()
  const now = performance.now();

  // Check cooldown - computed fresh each render
  const isInCooldown =
    lastTriggerTime !== null && now - lastTriggerTime < cooldownDuration;

  // Calculate remaining cooldown - computed fresh each render
  const cooldownRemaining =
    lastTriggerTime === null
      ? 0
      : Math.max(0, cooldownDuration - (now - lastTriggerTime));

  // Final canTrigger check
  const canTrigger = useMemo(() => {
    // Must be Full visibility
    if (visibility !== VisibilityState.Full) return false;

    // Never trigger while scrolling up
    if (isScrollingUp) return false;

    // Must meet unlock conditions
    if (!meetsUnlockConditions) return false;

    // Must not be in cooldown
    if (isInCooldown) return false;

    return true;
  }, [visibility, isScrollingUp, meetsUnlockConditions, isInCooldown]);

  const triggerEffect = useCallback(
    async (origin: {
      x: number;
      y: number;
    }): Promise<Tier2EffectInstance | null> => {
      if (!canTrigger) return null;

      // Select effect (never same as last)
      const effect = selectWeightedEffect(TIER2_EFFECTS, lastEffectId);
      if (!effect) return null;

      // Set random cooldown between 8-12s
      const { min, max } = TIER_UNLOCK.tier2Cooldown;
      setCooldownDuration(min + Math.random() * (max - min));

      // Record trigger time
      setLastTriggerTime(performance.now());
      setLastEffectId(effect.id);

      // Create the appropriate effect instance
      let effectInstance: Tier2EffectInstance;

      switch (effect.id) {
        case "refraction-ripple":
          effectInstance = createRippleEffect({
            origin,
            intensity: 1.0,
            duration: effect.duration,
          });
          break;
        case "light-sweep":
          effectInstance = createSweepEffect({
            direction: "left-to-right",
            intensity: 1.0,
            duration: effect.duration,
            color: "#F5A623", // bronzeGlow
          });
          break;
        case "vignette-pulse":
          effectInstance = createVignetteEffect({
            intensity: 1.0,
            duration: effect.duration,
            isDarkMode,
            color: "#0d4d79", // oceanDeep
          });
          break;
        default:
          return null;
      }

      return effectInstance;
    },
    [canTrigger, lastEffectId, isDarkMode],
  );

  return {
    canTrigger,
    lastEffectId,
    cooldownRemaining,
    triggerEffect,
  };
}
