// lib/interactive-hero/hooks/useTier3Effects.ts
import { useState, useMemo, useEffect } from 'react';
import { VisibilityState, type VisibilityStateType, TIER_UNLOCK } from '../types';

interface UseTier3EffectsProps {
  interactionCount: number;
  clickedLetters: Set<number>;
  totalLetters: number;
  visibility: VisibilityStateType;
  enabled: boolean;
}

type Tier3EffectType = 'caustics' | 'particle-trail';

interface UseTier3EffectsReturn {
  causticsUnlocked: boolean;
  particleTrailUnlocked: boolean;
  // For WebGL layer to query
  activeTier3Effects: Tier3EffectType[];
}

export function useTier3Effects({
  interactionCount,
  clickedLetters,
  totalLetters,
  visibility,
  enabled,
}: UseTier3EffectsProps): UseTier3EffectsReturn {
  // Session-persistent state: once unlocked, stays unlocked
  const [causticsUnlocked, setCausticsUnlocked] = useState(false);
  const [particleTrailUnlocked, setParticleTrailUnlocked] = useState(false);

  // Check caustics unlock condition (10+ interactions)
  useEffect(() => {
    if (!causticsUnlocked && interactionCount >= TIER_UNLOCK.tier3Interactions) {
      setCausticsUnlocked(true);
    }
  }, [interactionCount, causticsUnlocked]);

  // Check particle trail unlock condition (all letters clicked)
  useEffect(() => {
    if (!particleTrailUnlocked && totalLetters > 0 && clickedLetters.size >= totalLetters) {
      setParticleTrailUnlocked(true);
    }
  }, [clickedLetters.size, totalLetters, particleTrailUnlocked]);

  // Compute active effects based on unlock state and visibility
  const activeTier3Effects = useMemo<Tier3EffectType[]>(() => {
    // Don't render effects when frozen or disabled
    if (visibility === VisibilityState.Frozen || !enabled) {
      return [];
    }

    const effects: Tier3EffectType[] = [];

    if (causticsUnlocked) {
      effects.push('caustics');
    }

    if (particleTrailUnlocked) {
      effects.push('particle-trail');
    }

    return effects;
  }, [visibility, enabled, causticsUnlocked, particleTrailUnlocked]);

  return {
    causticsUnlocked,
    particleTrailUnlocked,
    activeTier3Effects,
  };
}
