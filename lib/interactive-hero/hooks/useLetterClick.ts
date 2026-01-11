// lib/interactive-hero/hooks/useLetterClick.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { VisibilityState, type VisibilityStateType } from '../types';
import { TIER1_EFFECTS, selectWeightedEffect } from '../effectCatalog';
import {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  type ChannelLockManager,
} from '../channelLocks';
import { getIntensityMultiplier } from '../visibilityMachine';
import { createTier1Effect } from '../effects/tier1';
import type { ChannelId, ChannelLockTypeValue } from '../types';

type EffectFunction = (element: HTMLElement, intensity: number) => gsap.core.Timeline;
type RippleEffectFunction = (element: HTMLElement, neighbors: HTMLElement[], intensity: number) => gsap.core.Timeline;

interface UseLetterClickProps {
  letterRefs: React.RefObject<HTMLElement[]>;
  visibility: VisibilityStateType;
  enabled: boolean;
}

interface UseLetterClickReturn {
  handleClick: (index: number) => Promise<void>;
  interactionCount: number;
  lastEffectId: string | null;
  clickedLetters: Set<number>;
}

export function useLetterClick({
  letterRefs,
  visibility,
  enabled,
}: UseLetterClickProps): UseLetterClickReturn {
  const [interactionCount, setInteractionCount] = useState(0);
  const [lastEffectId, setLastEffectId] = useState<string | null>(null);
  const [clickedLetters, setClickedLetters] = useState<Set<number>>(new Set());

  const lockManagerRef = useRef<ChannelLockManager>(createChannelLockManager());
  const activeTimelinesRef = useRef<Map<string, gsap.core.Timeline>>(new Map());
  const mountedRef = useRef(true);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Kill all active timelines
      activeTimelinesRef.current.forEach(timeline => {
        timeline.kill();
      });
      activeTimelinesRef.current.clear();
      // Release all locks
      releaseAllLocks(lockManagerRef.current);
    };
  }, []);

  const handleClick = useCallback(async (index: number) => {
    // Block if frozen or disabled
    if (visibility === VisibilityState.Frozen || !enabled) {
      return;
    }

    const letters = letterRefs.current;
    if (!letters || !letters[index]) {
      return;
    }

    const element = letters[index];

    // Select effect (never same as last)
    const effect = selectWeightedEffect(TIER1_EFFECTS, lastEffectId);
    if (!effect) return;

    // Check channel locks for all required channels
    const canAcquireAll = effect.channels.every(channel => {
      const lockType = channel.split(':')[1] as ChannelLockTypeValue;
      return canAcquireLock(lockManagerRef.current, channel as ChannelId, lockType);
    });

    if (!canAcquireAll) {
      return;
    }

    // Acquire locks
    const effectId = `${effect.id}-${Date.now()}`;
    effect.channels.forEach(channel => {
      const lockType = channel.split(':')[1] as ChannelLockTypeValue;
      acquireLock(lockManagerRef.current, channel as ChannelId, lockType, effectId, effect.duration);
    });

    // Get intensity based on visibility
    const intensity = getIntensityMultiplier(visibility);

    // Get effect function
    const effectFn = createTier1Effect(effect.id);
    if (!effectFn) {
      releaseLock(lockManagerRef.current, effectId);
      return;
    }

    // Create timeline with proper type handling
    let timeline: gsap.core.Timeline;
    if (effect.id === 'neighbor-ripple') {
      // Get neighbors (1 before, 1 after)
      const neighbors: HTMLElement[] = [];
      if (letters[index - 1]) neighbors.push(letters[index - 1]);
      if (letters[index + 1]) neighbors.push(letters[index + 1]);
      timeline = (effectFn as RippleEffectFunction)(element, neighbors, intensity);
    } else {
      timeline = (effectFn as EffectFunction)(element, intensity);
    }

    activeTimelinesRef.current.set(effectId, timeline);

    // Update state
    setInteractionCount(prev => prev + 1);
    setLastEffectId(effect.id);
    setClickedLetters(prev => new Set(Array.from(prev).concat(index)));

    // Wait for completion then cleanup
    return new Promise<void>(resolve => {
      timeline.then(() => {
        if (mountedRef.current) {
          releaseLock(lockManagerRef.current, effectId);
          activeTimelinesRef.current.delete(effectId);
        }
        resolve();
      });
    });
  }, [visibility, enabled, lastEffectId, letterRefs]);

  return {
    handleClick,
    interactionCount,
    lastEffectId,
    clickedLetters,
  };
}
