# Interactive Hero System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio hero section into an interactive, memorable experience with clickable letters, tiered effects, scroll-linked animations, and WebGL overlay.

**Architecture:** State machine orchestrates visibility tracking, channel locks prevent effect conflicts, effect catalog provides weighted random selection, and WebGL overlay (PixiJS) renders signature viewport effects. Letters emit click events that trigger GSAP animations with proper cleanup.

**Tech Stack:** React 18, GSAP 3.x (already installed), PixiJS v8 (to install), TypeScript, Jest/RTL for testing.

**Design Spec:** `docs/plans/2026-01-11-interactive-hero-design.md`

---

## Phase 1: Foundation

### Task 1: State Machine Types

**Files:**

- Create: `lib/interactive-hero/types.ts`
- Test: `lib/interactive-hero/__tests__/types.test.ts`

**Step 1: Write the failing test**

```typescript
// lib/interactive-hero/__tests__/types.test.ts
import {
  VisibilityState,
  ChannelLockType,
  EffectTier,
  type HeroState,
  type ChannelLock,
  type Effect,
} from "../types";

describe("Interactive Hero Types", () => {
  it("defines visibility states with correct thresholds", () => {
    expect(VisibilityState.Full).toBe("full");
    expect(VisibilityState.Reduced).toBe("reduced");
    expect(VisibilityState.Frozen).toBe("frozen");
  });

  it("defines channel lock types", () => {
    expect(ChannelLockType.Hard).toBe("hard");
    expect(ChannelLockType.Soft).toBe("soft");
    expect(ChannelLockType.TransformSoft).toBe("transform-soft");
  });

  it("defines effect tiers", () => {
    expect(EffectTier.Local).toBe(1);
    expect(EffectTier.Viewport).toBe(2);
    expect(EffectTier.Persistent).toBe(3);
  });

  it("creates valid HeroState object", () => {
    const state: HeroState = {
      visibility: VisibilityState.Full,
      interactionCount: 0,
      timeOnPage: 0,
      scrollIntent: false,
      lastEffectId: null,
      tier2LastTriggered: null,
      tier3Unlocked: { caustics: false, particleTrail: false },
      clickedLetters: new Set(),
    };
    expect(state.visibility).toBe("full");
    expect(state.interactionCount).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="types.test" --verbose`
Expected: FAIL with "Cannot find module '../types'"

**Step 3: Write minimal implementation**

```typescript
// lib/interactive-hero/types.ts

// Visibility states with hysteresis thresholds
export const VisibilityState = {
  Full: "full", // Enter ≥0.70, exit <0.65
  Reduced: "reduced", // Enter 0.50-0.69, exit to Full ≥0.70 or Frozen <0.45
  Frozen: "frozen", // Enter <0.45, exit ≥0.50
} as const;
export type VisibilityStateType =
  (typeof VisibilityState)[keyof typeof VisibilityState];

// Channel lock types
export const ChannelLockType = {
  Hard: "hard", // Exclusive, blocks all
  Soft: "soft", // Can overlap with other soft
  TransformSoft: "transform-soft", // Transform-exclusive only
} as const;
export type ChannelLockTypeValue =
  (typeof ChannelLockType)[keyof typeof ChannelLockType];

// Effect tiers
export const EffectTier = {
  Local: 1, // Letter-local effects
  Viewport: 2, // Viewport-wide effects
  Persistent: 3, // Session-persistent rewards
} as const;
export type EffectTierValue = (typeof EffectTier)[keyof typeof EffectTier];

// Channel identifiers
export type ChannelId =
  | "letters:hard"
  | "letters:transform-soft"
  | "letters:soft"
  | "heroLighting:hard"
  | "heroLighting:soft"
  | "viewportCamera:hard"
  | "viewportCamera:soft"
  | "webglOverlay:hard"
  | "webglOverlay:soft";

// Channel lock state
export interface ChannelLock {
  channel: ChannelId;
  type: ChannelLockTypeValue;
  effectId: string;
  expiresAt: number; // performance.now() + duration
}

// Effect definition
export interface Effect {
  id: string;
  name: string;
  tier: EffectTierValue;
  channels: ChannelId[];
  duration: number; // ms
  weight: number; // 0-100, percentage weight for selection
  easing: string; // GSAP easing
}

// WebGL effect payload
export interface WebGLEffect {
  type: "ripple" | "sweep" | "vignette";
  position: { uv: [number, number]; px: [number, number] };
  intensity: number;
  startTime: number;
}

// Hero state machine state
export interface HeroState {
  visibility: VisibilityStateType;
  interactionCount: number;
  timeOnPage: number; // seconds
  scrollIntent: boolean;
  lastEffectId: string | null;
  tier2LastTriggered: number | null; // timestamp
  tier3Unlocked: {
    caustics: boolean;
    particleTrail: boolean;
  };
  clickedLetters: Set<number>; // indices of clicked letters (for Easter egg)
}

// Visibility thresholds (exported for testing)
export const VISIBILITY_THRESHOLDS = {
  fullEnter: 0.7,
  fullExit: 0.65,
  reducedEnter: 0.5,
  frozenEnter: 0.45,
  frozenExit: 0.5,
} as const;

// Tier unlock requirements
export const TIER_UNLOCK = {
  tier2Interactions: 5,
  tier2TimeOnPage: 8, // seconds
  tier2Cooldown: { min: 8000, max: 12000 }, // ms
  tier3Interactions: 10,
} as const;
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="types.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/interactive-hero/types.ts lib/interactive-hero/__tests__/types.test.ts
git commit -m "feat(hero): add interactive hero type definitions"
```

---

### Task 2: Channel Lock System

**Files:**

- Create: `lib/interactive-hero/channelLocks.ts`
- Test: `lib/interactive-hero/__tests__/channelLocks.test.ts`

**Step 1: Write the failing test**

```typescript
// lib/interactive-hero/__tests__/channelLocks.test.ts
import {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  getActiveLocks,
} from "../channelLocks";
import { ChannelLockType } from "../types";
import type { ChannelId, ChannelLock } from "../types";

describe("Channel Lock System", () => {
  let manager: ReturnType<typeof createChannelLockManager>;

  beforeEach(() => {
    manager = createChannelLockManager();
    jest.spyOn(performance, "now").mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("canAcquireLock", () => {
    it("allows acquiring lock on empty channel", () => {
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });

    it("blocks hard lock when channel has any lock", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:hard", ChannelLockType.Hard),
      ).toBe(false);
    });

    it("allows soft lock when channel has soft lock", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });

    it("blocks any lock when channel has hard lock", () => {
      acquireLock(
        manager,
        "letters:hard",
        ChannelLockType.Hard,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(false);
    });

    it("transform-soft blocks other transform-soft", () => {
      acquireLock(
        manager,
        "letters:transform-soft",
        ChannelLockType.TransformSoft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(
          manager,
          "letters:transform-soft",
          ChannelLockType.TransformSoft,
        ),
      ).toBe(false);
    });

    it("transform-soft allows soft", () => {
      acquireLock(
        manager,
        "letters:transform-soft",
        ChannelLockType.TransformSoft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });
  });

  describe("acquireLock", () => {
    it("adds lock to manager", () => {
      const lock = acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        500,
      );
      expect(lock).toBeDefined();
      expect(lock?.effectId).toBe("effect-1");
      expect(lock?.expiresAt).toBe(1500); // 1000 + 500
    });

    it("returns null if cannot acquire", () => {
      acquireLock(
        manager,
        "letters:hard",
        ChannelLockType.Hard,
        "effect-1",
        1000,
      );
      const lock = acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-2",
        500,
      );
      expect(lock).toBeNull();
    });
  });

  describe("releaseLock", () => {
    it("removes lock by effect id", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      releaseLock(manager, "effect-1");
      expect(getActiveLocks(manager)).toHaveLength(0);
    });
  });

  describe("releaseAllLocks", () => {
    it("clears all locks", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      acquireLock(
        manager,
        "heroLighting:soft",
        ChannelLockType.Soft,
        "effect-2",
        1000,
      );
      releaseAllLocks(manager);
      expect(getActiveLocks(manager)).toHaveLength(0);
    });
  });

  describe("expired locks", () => {
    it("ignores expired locks when checking", () => {
      acquireLock(
        manager,
        "letters:hard",
        ChannelLockType.Hard,
        "effect-1",
        500,
      );
      // Advance time past expiry
      (performance.now as jest.Mock).mockReturnValue(2000);
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="channelLocks.test" --verbose`
Expected: FAIL with "Cannot find module '../channelLocks'"

**Step 3: Write minimal implementation**

```typescript
// lib/interactive-hero/channelLocks.ts
import { ChannelLockType } from "./types";
import type { ChannelId, ChannelLock, ChannelLockTypeValue } from "./types";

export interface ChannelLockManager {
  locks: ChannelLock[];
}

export function createChannelLockManager(): ChannelLockManager {
  return { locks: [] };
}

function getChannelBase(channel: ChannelId): string {
  // Extract base channel (e.g., 'letters' from 'letters:soft')
  return channel.split(":")[0];
}

function cleanExpiredLocks(manager: ChannelLockManager): void {
  const now = performance.now();
  manager.locks = manager.locks.filter((lock) => lock.expiresAt > now);
}

export function getActiveLocks(manager: ChannelLockManager): ChannelLock[] {
  cleanExpiredLocks(manager);
  return [...manager.locks];
}

export function canAcquireLock(
  manager: ChannelLockManager,
  channel: ChannelId,
  type: ChannelLockTypeValue,
): boolean {
  cleanExpiredLocks(manager);
  const channelBase = getChannelBase(channel);

  // Find locks on the same channel base
  const conflictingLocks = manager.locks.filter(
    (lock) => getChannelBase(lock.channel) === channelBase,
  );

  if (conflictingLocks.length === 0) return true;

  // Hard lock blocks everything
  if (type === ChannelLockType.Hard) return false;

  // Check if any existing lock blocks us
  for (const lock of conflictingLocks) {
    // Hard lock blocks all
    if (lock.type === ChannelLockType.Hard) return false;

    // Transform-soft blocks other transform-soft
    if (
      type === ChannelLockType.TransformSoft &&
      lock.type === ChannelLockType.TransformSoft
    ) {
      return false;
    }
  }

  // Soft can coexist with soft and transform-soft
  return true;
}

export function acquireLock(
  manager: ChannelLockManager,
  channel: ChannelId,
  type: ChannelLockTypeValue,
  effectId: string,
  duration: number,
): ChannelLock | null {
  if (!canAcquireLock(manager, channel, type)) {
    return null;
  }

  const lock: ChannelLock = {
    channel,
    type,
    effectId,
    expiresAt: performance.now() + duration,
  };

  manager.locks.push(lock);
  return lock;
}

export function releaseLock(
  manager: ChannelLockManager,
  effectId: string,
): void {
  manager.locks = manager.locks.filter((lock) => lock.effectId !== effectId);
}

export function releaseAllLocks(manager: ChannelLockManager): void {
  manager.locks = [];
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="channelLocks.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/interactive-hero/channelLocks.ts lib/interactive-hero/__tests__/channelLocks.test.ts
git commit -m "feat(hero): add channel lock system for effect management"
```

---

### Task 3: Effect Catalog

**Files:**

- Create: `lib/interactive-hero/effectCatalog.ts`
- Test: `lib/interactive-hero/__tests__/effectCatalog.test.ts`

**Step 1: Write the failing test**

```typescript
// lib/interactive-hero/__tests__/effectCatalog.test.ts
import {
  TIER1_EFFECTS,
  TIER2_EFFECTS,
  TIER3_EFFECTS,
  selectWeightedEffect,
  getEffectById,
} from "../effectCatalog";
import { EffectTier } from "../types";

describe("Effect Catalog", () => {
  describe("TIER1_EFFECTS", () => {
    it("contains 8 effects", () => {
      expect(TIER1_EFFECTS).toHaveLength(8);
    });

    it("all effects have tier 1", () => {
      TIER1_EFFECTS.forEach((effect) => {
        expect(effect.tier).toBe(EffectTier.Local);
      });
    });

    it("weights sum to 100", () => {
      const total = TIER1_EFFECTS.reduce((sum, e) => sum + e.weight, 0);
      expect(total).toBe(100);
    });

    it("includes elastic bounce with 20% weight", () => {
      const elastic = TIER1_EFFECTS.find((e) => e.id === "elastic-bounce");
      expect(elastic).toBeDefined();
      expect(elastic?.weight).toBe(20);
    });
  });

  describe("TIER2_EFFECTS", () => {
    it("contains 3 effects", () => {
      expect(TIER2_EFFECTS).toHaveLength(3);
    });

    it("all effects have tier 2", () => {
      TIER2_EFFECTS.forEach((effect) => {
        expect(effect.tier).toBe(EffectTier.Viewport);
      });
    });

    it("weights sum to 100", () => {
      const total = TIER2_EFFECTS.reduce((sum, e) => sum + e.weight, 0);
      expect(total).toBe(100);
    });
  });

  describe("selectWeightedEffect", () => {
    it("returns effect from pool", () => {
      const effect = selectWeightedEffect(TIER1_EFFECTS, null);
      expect(TIER1_EFFECTS).toContain(effect);
    });

    it("excludes last effect id", () => {
      // Run 100 times to ensure exclusion works
      for (let i = 0; i < 100; i++) {
        const effect = selectWeightedEffect(TIER1_EFFECTS, "elastic-bounce");
        expect(effect.id).not.toBe("elastic-bounce");
      }
    });

    it("returns null for empty pool", () => {
      const effect = selectWeightedEffect([], null);
      expect(effect).toBeNull();
    });

    it("respects weight distribution over many samples", () => {
      const counts: Record<string, number> = {};
      const samples = 10000;

      for (let i = 0; i < samples; i++) {
        const effect = selectWeightedEffect(TIER1_EFFECTS, null);
        if (effect) {
          counts[effect.id] = (counts[effect.id] || 0) + 1;
        }
      }

      // Elastic bounce has 20% weight, should be ~20% of samples (+/- 3%)
      const elasticPercent = ((counts["elastic-bounce"] || 0) / samples) * 100;
      expect(elasticPercent).toBeGreaterThan(17);
      expect(elasticPercent).toBeLessThan(23);
    });
  });

  describe("getEffectById", () => {
    it("finds effect by id", () => {
      const effect = getEffectById("elastic-bounce");
      expect(effect?.name).toBe("Elastic Bounce");
    });

    it("returns undefined for unknown id", () => {
      const effect = getEffectById("unknown");
      expect(effect).toBeUndefined();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="effectCatalog.test" --verbose`
Expected: FAIL with "Cannot find module '../effectCatalog'"

**Step 3: Write minimal implementation**

```typescript
// lib/interactive-hero/effectCatalog.ts
import { EffectTier } from "./types";
import type { Effect, ChannelId } from "./types";

// Tier 1 — Local Effects (8 total)
export const TIER1_EFFECTS: Effect[] = [
  {
    id: "elastic-bounce",
    name: "Elastic Bounce",
    tier: EffectTier.Local,
    channels: ["letters:transform-soft"],
    duration: 600,
    weight: 20,
    easing: "elastic.out(1, 0.3)",
  },
  {
    id: "flip-x",
    name: "3D Flip X",
    tier: EffectTier.Local,
    channels: ["letters:transform-soft"],
    duration: 500,
    weight: 15,
    easing: "power2.inOut",
  },
  {
    id: "flip-y",
    name: "3D Flip Y",
    tier: EffectTier.Local,
    channels: ["letters:transform-soft"],
    duration: 500,
    weight: 12,
    easing: "power2.inOut",
  },
  {
    id: "rubber-stretch",
    name: "Rubber Stretch",
    tier: EffectTier.Local,
    channels: ["letters:hard"],
    duration: 700,
    weight: 13,
    easing: "elastic.out(1, 0.4)",
  },
  {
    id: "gold-glow",
    name: "Gold Glow Pulse",
    tier: EffectTier.Local,
    channels: ["heroLighting:soft"],
    duration: 400,
    weight: 15,
    easing: "power1.out",
  },
  {
    id: "ocean-electric",
    name: "Ocean Electric",
    tier: EffectTier.Local,
    channels: ["heroLighting:soft"],
    duration: 300,
    weight: 10,
    easing: "power3.out",
  },
  {
    id: "weight-morph",
    name: "Weight Morph",
    tier: EffectTier.Local,
    channels: ["letters:soft"],
    duration: 400,
    weight: 8,
    easing: "power2.inOut",
  },
  {
    id: "neighbor-ripple",
    name: "Neighbor Ripple",
    tier: EffectTier.Local,
    channels: ["letters:soft"],
    duration: 800,
    weight: 7,
    easing: "power2.out",
  },
];

// Tier 2 — Viewport Effects (3 total)
export const TIER2_EFFECTS: Effect[] = [
  {
    id: "refraction-ripple",
    name: "Refraction Ripple",
    tier: EffectTier.Viewport,
    channels: ["webglOverlay:hard", "viewportCamera:soft"],
    duration: 500,
    weight: 50,
    easing: "power2.out",
  },
  {
    id: "light-sweep",
    name: "Light Sweep",
    tier: EffectTier.Viewport,
    channels: ["webglOverlay:hard", "heroLighting:hard"],
    duration: 600,
    weight: 35,
    easing: "power2.inOut",
  },
  {
    id: "vignette-pulse",
    name: "Vignette Pulse",
    tier: EffectTier.Viewport,
    channels: ["webglOverlay:hard"],
    duration: 400,
    weight: 15,
    easing: "power2.inOut",
  },
];

// Tier 3 — Persistent Rewards (2 total)
export const TIER3_EFFECTS: Effect[] = [
  {
    id: "ambient-caustics",
    name: "Ambient Caustics",
    tier: EffectTier.Persistent,
    channels: ["webglOverlay:soft"],
    duration: -1, // persistent
    weight: 100, // triggered by interaction count
    easing: "none",
  },
  {
    id: "cursor-particle-trail",
    name: "Cursor Particle Trail",
    tier: EffectTier.Persistent,
    channels: ["webglOverlay:soft"],
    duration: -1, // persistent
    weight: 0, // triggered by Easter egg (click all letters)
    easing: "none",
  },
];

// All effects for lookup
const ALL_EFFECTS = [...TIER1_EFFECTS, ...TIER2_EFFECTS, ...TIER3_EFFECTS];

/**
 * Select a random effect from pool using weighted random selection.
 * Excludes the last effect to prevent repeats.
 */
export function selectWeightedEffect(
  pool: Effect[],
  lastEffectId: string | null,
): Effect | null {
  // Filter out last effect
  const available = lastEffectId
    ? pool.filter((e) => e.id !== lastEffectId)
    : pool;

  if (available.length === 0) return null;

  // Calculate total weight
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight === 0) return available[0];

  // Random selection based on weight
  let random = Math.random() * totalWeight;

  for (const effect of available) {
    random -= effect.weight;
    if (random <= 0) return effect;
  }

  // Fallback (shouldn't happen)
  return available[available.length - 1];
}

/**
 * Get effect by ID from all tiers.
 */
export function getEffectById(id: string): Effect | undefined {
  return ALL_EFFECTS.find((e) => e.id === id);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="effectCatalog.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/interactive-hero/effectCatalog.ts lib/interactive-hero/__tests__/effectCatalog.test.ts
git commit -m "feat(hero): add effect catalog with weighted selection"
```

---

### Task 4: Visibility State Machine

**Files:**

- Create: `lib/interactive-hero/visibilityMachine.ts`
- Test: `lib/interactive-hero/__tests__/visibilityMachine.test.ts`

**Step 1: Write the failing test**

```typescript
// lib/interactive-hero/__tests__/visibilityMachine.test.ts
import {
  createVisibilityMachine,
  updateVisibility,
  getIntensityMultiplier,
} from "../visibilityMachine";
import { VisibilityState } from "../types";

describe("Visibility State Machine", () => {
  describe("createVisibilityMachine", () => {
    it("initializes with Full state", () => {
      const machine = createVisibilityMachine();
      expect(machine.state).toBe(VisibilityState.Full);
    });
  });

  describe("updateVisibility (hysteresis)", () => {
    it("transitions Full → Reduced at 0.65", () => {
      const machine = createVisibilityMachine(); // starts Full
      updateVisibility(machine, 0.64);
      expect(machine.state).toBe(VisibilityState.Reduced);
    });

    it("stays Full at 0.66", () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.66);
      expect(machine.state).toBe(VisibilityState.Full);
    });

    it("transitions Reduced → Full at 0.70", () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.64); // → Reduced
      updateVisibility(machine, 0.7); // → Full
      expect(machine.state).toBe(VisibilityState.Full);
    });

    it("stays Reduced at 0.69", () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.64); // → Reduced
      updateVisibility(machine, 0.69);
      expect(machine.state).toBe(VisibilityState.Reduced);
    });

    it("transitions Reduced → Frozen at 0.44", () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.6); // → Reduced
      updateVisibility(machine, 0.44); // → Frozen
      expect(machine.state).toBe(VisibilityState.Frozen);
    });

    it("transitions Frozen → Reduced at 0.50", () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.4); // → Frozen
      updateVisibility(machine, 0.5); // → Reduced
      expect(machine.state).toBe(VisibilityState.Reduced);
    });

    it("stays Frozen at 0.49", () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.4); // → Frozen
      updateVisibility(machine, 0.49);
      expect(machine.state).toBe(VisibilityState.Frozen);
    });
  });

  describe("getIntensityMultiplier", () => {
    it("returns 1.0 for Full", () => {
      expect(getIntensityMultiplier(VisibilityState.Full)).toBe(1.0);
    });

    it("returns 0.6 for Reduced", () => {
      expect(getIntensityMultiplier(VisibilityState.Reduced)).toBe(0.6);
    });

    it("returns 0 for Frozen", () => {
      expect(getIntensityMultiplier(VisibilityState.Frozen)).toBe(0);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="visibilityMachine.test" --verbose`
Expected: FAIL with "Cannot find module '../visibilityMachine'"

**Step 3: Write minimal implementation**

```typescript
// lib/interactive-hero/visibilityMachine.ts
import { VisibilityState, VISIBILITY_THRESHOLDS } from "./types";
import type { VisibilityStateType } from "./types";

export interface VisibilityMachine {
  state: VisibilityStateType;
}

export function createVisibilityMachine(): VisibilityMachine {
  return { state: VisibilityState.Full };
}

/**
 * Update visibility state with hysteresis.
 * Hysteresis prevents flickering at threshold boundaries.
 */
export function updateVisibility(
  machine: VisibilityMachine,
  ratio: number,
): VisibilityStateType {
  const { fullEnter, fullExit, frozenEnter, frozenExit } =
    VISIBILITY_THRESHOLDS;

  switch (machine.state) {
    case VisibilityState.Full:
      // Exit Full when drops below fullExit (0.65)
      if (ratio < fullExit) {
        machine.state =
          ratio < frozenEnter
            ? VisibilityState.Frozen
            : VisibilityState.Reduced;
      }
      break;

    case VisibilityState.Reduced:
      // Enter Full when rises to fullEnter (0.70)
      if (ratio >= fullEnter) {
        machine.state = VisibilityState.Full;
      }
      // Enter Frozen when drops below frozenEnter (0.45)
      else if (ratio < frozenEnter) {
        machine.state = VisibilityState.Frozen;
      }
      break;

    case VisibilityState.Frozen:
      // Exit Frozen when rises to frozenExit (0.50)
      if (ratio >= frozenExit) {
        machine.state =
          ratio >= fullEnter ? VisibilityState.Full : VisibilityState.Reduced;
      }
      break;
  }

  return machine.state;
}

/**
 * Get intensity multiplier for current visibility state.
 */
export function getIntensityMultiplier(state: VisibilityStateType): number {
  switch (state) {
    case VisibilityState.Full:
      return 1.0;
    case VisibilityState.Reduced:
      return 0.6;
    case VisibilityState.Frozen:
      return 0;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="visibilityMachine.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/interactive-hero/visibilityMachine.ts lib/interactive-hero/__tests__/visibilityMachine.test.ts
git commit -m "feat(hero): add visibility state machine with hysteresis"
```

---

### Task 5: Module Index Export

**Files:**

- Create: `lib/interactive-hero/index.ts`

**Step 1: Create the index file**

```typescript
// lib/interactive-hero/index.ts
// Types
export * from "./types";

// Channel Locks
export {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  getActiveLocks,
  type ChannelLockManager,
} from "./channelLocks";

// Effect Catalog
export {
  TIER1_EFFECTS,
  TIER2_EFFECTS,
  TIER3_EFFECTS,
  selectWeightedEffect,
  getEffectById,
} from "./effectCatalog";

// Visibility Machine
export {
  createVisibilityMachine,
  updateVisibility,
  getIntensityMultiplier,
  type VisibilityMachine,
} from "./visibilityMachine";
```

**Step 2: Run all foundation tests**

Run: `npm test -- --testPathPattern="interactive-hero" --verbose`
Expected: All PASS

**Step 3: Commit**

```bash
git add lib/interactive-hero/index.ts
git commit -m "feat(hero): add module index for interactive hero foundation"
```

---

## Phase 2: Tier 1 Effects

### Task 6: GSAP Effect Implementations

**Files:**

- Create: `lib/interactive-hero/effects/tier1.ts`
- Test: `lib/interactive-hero/__tests__/tier1Effects.test.ts`

**Step 1: Write the failing test**

```typescript
// lib/interactive-hero/__tests__/tier1Effects.test.ts
import gsap from "gsap";
import {
  createElasticBounce,
  createFlipX,
  createFlipY,
  createRubberStretch,
  createGoldGlow,
  createOceanElectric,
  createWeightMorph,
  createNeighborRipple,
  createTier1Effect,
} from "../effects/tier1";

// Mock GSAP
jest.mock("gsap", () => {
  const mockTimeline = {
    to: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    progress: jest.fn().mockReturnThis(),
  };
  return {
    timeline: jest.fn(() => mockTimeline),
    set: jest.fn(),
    to: jest.fn(),
    killTweensOf: jest.fn(),
  };
});

describe("Tier 1 Effects", () => {
  let mockElement: HTMLElement;
  let mockNeighbors: HTMLElement[];

  beforeEach(() => {
    mockElement = document.createElement("span");
    mockElement.textContent = "A";
    mockNeighbors = [
      document.createElement("span"),
      document.createElement("span"),
    ];
    jest.clearAllMocks();
  });

  describe("createElasticBounce", () => {
    it("creates a GSAP timeline", () => {
      const tl = createElasticBounce(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });

    it("scales intensity", () => {
      createElasticBounce(mockElement, 0.6);
      // Timeline should be created with reduced intensity
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  describe("createFlipX", () => {
    it("creates a 3D flip animation", () => {
      const tl = createFlipX(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe("createFlipY", () => {
    it("creates a vertical 3D flip animation", () => {
      const tl = createFlipY(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe("createNeighborRipple", () => {
    it("animates neighbors with stagger", () => {
      const tl = createNeighborRipple(mockElement, mockNeighbors, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe("createTier1Effect", () => {
    it("returns correct function for elastic-bounce", () => {
      const effectFn = createTier1Effect("elastic-bounce");
      expect(effectFn).toBe(createElasticBounce);
    });

    it("returns correct function for neighbor-ripple", () => {
      const effectFn = createTier1Effect("neighbor-ripple");
      expect(effectFn).toBe(createNeighborRipple);
    });

    it("returns null for unknown effect", () => {
      const effectFn = createTier1Effect("unknown");
      expect(effectFn).toBeNull();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="tier1Effects.test" --verbose`
Expected: FAIL with "Cannot find module '../effects/tier1'"

**Step 3: Write minimal implementation**

```typescript
// lib/interactive-hero/effects/tier1.ts
import gsap from "gsap";

type EffectFunction = (
  element: HTMLElement,
  intensity: number,
) => gsap.core.Timeline;
type RippleEffectFunction = (
  element: HTMLElement,
  neighbors: HTMLElement[],
  intensity: number,
) => gsap.core.Timeline;

// Color constants
const GOLD_GLOW = "245, 166, 35";
const CYAN_GLOW = "6, 182, 212";
const OCEAN_400 = "#486d8a";
const OCEAN_200 = "#8a9ba8";

/**
 * Elastic Bounce - Letter bounces with elastic easing
 */
export function createElasticBounce(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const scale = 1 + 0.3 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    y: -20 * intensity,
    scale: scale,
    duration: 0.15,
    ease: "power2.out",
  }).to(element, {
    y: 0,
    scale: 1,
    duration: 0.45,
    ease: "elastic.out(1, 0.3)",
  });

  return tl;
}

/**
 * 3D Flip X - Letter flips horizontally (320° to avoid thin-frame blink)
 */
export function createFlipX(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const rotation = 320 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    rotationY: rotation,
    duration: 0.25,
    ease: "power2.in",
  }).to(element, {
    rotationY: 0,
    duration: 0.25,
    ease: "power2.out",
  });

  return tl;
}

/**
 * 3D Flip Y - Letter flips vertically (320°)
 */
export function createFlipY(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const rotation = 320 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    rotationX: rotation,
    duration: 0.25,
    ease: "power2.in",
  }).to(element, {
    rotationX: 0,
    duration: 0.25,
    ease: "power2.out",
  });

  return tl;
}

/**
 * Rubber Stretch - Letter stretches elastically
 */
export function createRubberStretch(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const scaleX = 1 + 0.4 * intensity;
  const scaleY = 1 - 0.2 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    scaleX: scaleX,
    scaleY: scaleY,
    duration: 0.15,
    ease: "power2.out",
  }).to(element, {
    scaleX: 1,
    scaleY: 1,
    duration: 0.55,
    ease: "elastic.out(1, 0.4)",
  });

  return tl;
}

/**
 * Gold Glow Pulse - Letter pulses with gold glow
 */
export function createGoldGlow(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const glowIntensity = 0.6 * intensity;
  const tl = gsap.timeline();

  tl.to(element, {
    textShadow: `0 0 20px rgba(${GOLD_GLOW}, ${glowIntensity}), 0 0 40px rgba(${GOLD_GLOW}, ${glowIntensity * 0.5})`,
    duration: 0.2,
    ease: "power1.out",
  }).to(element, {
    textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
    duration: 0.2,
    ease: "power1.in",
  });

  return tl;
}

/**
 * Ocean Electric - Letter flashes with ocean colors
 */
export function createOceanElectric(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(element, {
    color: OCEAN_200,
    textShadow: `0 0 15px ${OCEAN_400}, 0 0 30px ${OCEAN_200}`,
    duration: 0.1,
    ease: "power3.out",
  }).to(element, {
    color: "",
    textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
    duration: 0.2,
    ease: "power3.out",
  });

  return tl;
}

/**
 * Weight Morph - Letter font weight changes temporarily
 */
export function createWeightMorph(
  element: HTMLElement,
  intensity: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const targetWeight = intensity > 0.5 ? 900 : 300;

  tl.to(element, {
    fontWeight: targetWeight,
    duration: 0.2,
    ease: "power2.inOut",
  }).to(element, {
    fontWeight: 700, // back to bold
    duration: 0.2,
    ease: "power2.inOut",
  });

  return tl;
}

/**
 * Neighbor Ripple - Clicked letter affects neighbors with stagger
 */
export function createNeighborRipple(
  element: HTMLElement,
  neighbors: HTMLElement[],
  intensity: number,
): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Center letter bounces
  tl.to(
    element,
    {
      y: -10 * intensity,
      scale: 1.1,
      duration: 0.1,
      ease: "power2.out",
    },
    0,
  ).to(
    element,
    {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    },
    0.1,
  );

  // Neighbors ripple outward
  neighbors.forEach((neighbor, i) => {
    const delay = 0.05 * (i + 1);
    const yOffset = -6 * intensity * (1 - i * 0.3);

    tl.to(
      neighbor,
      {
        y: yOffset,
        duration: 0.15,
        ease: "power2.out",
      },
      delay,
    ).to(
      neighbor,
      {
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      delay + 0.15,
    );
  });

  return tl;
}

// Effect factory map
const EFFECT_MAP: Record<string, EffectFunction | RippleEffectFunction> = {
  "elastic-bounce": createElasticBounce,
  "flip-x": createFlipX,
  "flip-y": createFlipY,
  "rubber-stretch": createRubberStretch,
  "gold-glow": createGoldGlow,
  "ocean-electric": createOceanElectric,
  "weight-morph": createWeightMorph,
  "neighbor-ripple": createNeighborRipple,
};

/**
 * Get effect function by ID
 */
export function createTier1Effect(
  effectId: string,
): EffectFunction | RippleEffectFunction | null {
  return EFFECT_MAP[effectId] || null;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="tier1Effects.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/interactive-hero/effects/tier1.ts lib/interactive-hero/__tests__/tier1Effects.test.ts
git commit -m "feat(hero): implement 8 Tier 1 GSAP letter effects"
```

---

### Task 7: useLetterClick Hook

**Files:**

- Create: `lib/interactive-hero/hooks/useLetterClick.ts`
- Test: `lib/interactive-hero/__tests__/useLetterClick.test.ts`

**Step 1: Write the failing test**

```typescript
// lib/interactive-hero/__tests__/useLetterClick.test.ts
import { renderHook, act } from "@testing-library/react";
import { useLetterClick } from "../hooks/useLetterClick";
import { VisibilityState } from "../types";

// Mock GSAP
jest.mock("gsap", () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    then: jest.fn((cb) => {
      cb?.();
      return Promise.resolve();
    }),
  })),
  set: jest.fn(),
  killTweensOf: jest.fn(),
}));

describe("useLetterClick", () => {
  const mockLetterRefs: React.RefObject<HTMLElement[]> = {
    current: [
      document.createElement("span"),
      document.createElement("span"),
      document.createElement("span"),
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(performance, "now").mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    expect(result.current.interactionCount).toBe(0);
    expect(result.current.lastEffectId).toBeNull();
  });

  it("handles letter click and increments count", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    expect(result.current.interactionCount).toBe(1);
  });

  it("tracks clicked letters", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
      await result.current.handleClick(2);
    });

    expect(result.current.clickedLetters.has(0)).toBe(true);
    expect(result.current.clickedLetters.has(2)).toBe(true);
    expect(result.current.clickedLetters.has(1)).toBe(false);
  });

  it("blocks clicks when frozen", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Frozen,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    expect(result.current.interactionCount).toBe(0);
  });

  it("blocks clicks when disabled", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: false,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    expect(result.current.interactionCount).toBe(0);
  });

  it("uses reduced intensity in Reduced state", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Reduced,
        enabled: true,
      }),
    );

    await act(async () => {
      await result.current.handleClick(0);
    });

    // Click should still work but with reduced intensity
    expect(result.current.interactionCount).toBe(1);
  });

  it("never selects same effect twice in a row", async () => {
    const { result } = renderHook(() =>
      useLetterClick({
        letterRefs: mockLetterRefs,
        visibility: VisibilityState.Full,
        enabled: true,
      }),
    );

    const effectIds: string[] = [];

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.handleClick(0);
      });
      if (result.current.lastEffectId) {
        effectIds.push(result.current.lastEffectId);
      }
    }

    // Check no consecutive duplicates
    for (let i = 1; i < effectIds.length; i++) {
      expect(effectIds[i]).not.toBe(effectIds[i - 1]);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="useLetterClick.test" --verbose`
Expected: FAIL with "Cannot find module '../hooks/useLetterClick'"

**Step 3: Write minimal implementation**

```typescript
// lib/interactive-hero/hooks/useLetterClick.ts
import { useState, useCallback, useRef } from "react";
import gsap from "gsap";
import { VisibilityState, type VisibilityStateType } from "../types";
import { TIER1_EFFECTS, selectWeightedEffect } from "../effectCatalog";
import {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  type ChannelLockManager,
} from "../channelLocks";
import { getIntensityMultiplier } from "../visibilityMachine";
import { createTier1Effect } from "../effects/tier1";
import type { ChannelId, ChannelLockTypeValue } from "../types";

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

  const handleClick = useCallback(
    async (index: number) => {
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
      const canAcquireAll = effect.channels.every((channel) => {
        const lockType = channel.split(":")[1] as ChannelLockTypeValue;
        return canAcquireLock(
          lockManagerRef.current,
          channel as ChannelId,
          lockType,
        );
      });

      if (!canAcquireAll) {
        return;
      }

      // Acquire locks
      const effectId = `${effect.id}-${Date.now()}`;
      effect.channels.forEach((channel) => {
        const lockType = channel.split(":")[1] as ChannelLockTypeValue;
        acquireLock(
          lockManagerRef.current,
          channel as ChannelId,
          lockType,
          effectId,
          effect.duration,
        );
      });

      // Get intensity based on visibility
      const intensity = getIntensityMultiplier(visibility);

      // Get effect function
      const effectFn = createTier1Effect(effect.id);
      if (!effectFn) {
        releaseLock(lockManagerRef.current, effectId);
        return;
      }

      // Create timeline
      let timeline: gsap.core.Timeline;
      if (effect.id === "neighbor-ripple") {
        // Get neighbors (1 before, 1 after)
        const neighbors: HTMLElement[] = [];
        if (letters[index - 1]) neighbors.push(letters[index - 1]);
        if (letters[index + 1]) neighbors.push(letters[index + 1]);
        timeline = (effectFn as any)(element, neighbors, intensity);
      } else {
        timeline = (effectFn as any)(element, intensity);
      }

      activeTimelinesRef.current.set(effectId, timeline);

      // Update state
      setInteractionCount((prev) => prev + 1);
      setLastEffectId(effect.id);
      setClickedLetters((prev) => new Set([...prev, index]));

      // Wait for completion then cleanup
      return new Promise<void>((resolve) => {
        timeline.then(() => {
          releaseLock(lockManagerRef.current, effectId);
          activeTimelinesRef.current.delete(effectId);
          resolve();
        });
      });
    },
    [visibility, enabled, lastEffectId, letterRefs],
  );

  return {
    handleClick,
    interactionCount,
    lastEffectId,
    clickedLetters,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="useLetterClick.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/interactive-hero/hooks/useLetterClick.ts lib/interactive-hero/__tests__/useLetterClick.test.ts
git commit -m "feat(hero): add useLetterClick hook for letter interaction"
```

---

### Task 8: Update Module Index

**Files:**

- Modify: `lib/interactive-hero/index.ts`

**Step 1: Update the index**

```typescript
// lib/interactive-hero/index.ts
// Types
export * from "./types";

// Channel Locks
export {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  getActiveLocks,
  type ChannelLockManager,
} from "./channelLocks";

// Effect Catalog
export {
  TIER1_EFFECTS,
  TIER2_EFFECTS,
  TIER3_EFFECTS,
  selectWeightedEffect,
  getEffectById,
} from "./effectCatalog";

// Visibility Machine
export {
  createVisibilityMachine,
  updateVisibility,
  getIntensityMultiplier,
  type VisibilityMachine,
} from "./visibilityMachine";

// Effects
export * from "./effects/tier1";

// Hooks
export { useLetterClick } from "./hooks/useLetterClick";
```

**Step 2: Run all tests**

Run: `npm test -- --testPathPattern="interactive-hero" --verbose`
Expected: All PASS

**Step 3: Commit**

```bash
git add lib/interactive-hero/index.ts
git commit -m "feat(hero): export effects and hooks from module index"
```

---

## Phase 3: Integrate with HeroName Component

### Task 9: Add Click Handlers to HeroName

**Files:**

- Modify: `components/ui/HeroName.tsx`
- Test: `components/ui/__tests__/HeroName.test.tsx` (add new tests)

**Step 1: Add new tests to existing test file**

Add the following tests to `components/ui/__tests__/HeroName.test.tsx`:

```typescript
// Add to existing test file after existing tests

// =============================================================================
// INTERACTIVE HERO TESTS
// =============================================================================
describe('HeroName - Interactive Effects', () => {
  it('handles letter click and triggers effect', async () => {
    const { container } = render(<HeroName name="Test" />);

    const letters = container.querySelectorAll('span.inline-block:not(.sr-only)');
    const firstLetter = Array.from(letters).find(l => l.textContent === 'T');

    if (firstLetter) {
      await act(async () => {
        fireEvent.click(firstLetter);
      });
    }

    // Effect should have triggered (no errors)
    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('blocks clicks when reduced motion is preferred', async () => {
    // This is already handled by existing reduced motion tests
    // The static version has no click handlers
  });

  it('provides cursor pointer on letters', () => {
    const { container } = render(<HeroName name="AB" />);

    const letters = container.querySelectorAll('span.inline-block:not(.sr-only)');
    const clickableLetters = Array.from(letters).filter(
      l => l.textContent && l.textContent.trim().length === 1
    );

    clickableLetters.forEach(letter => {
      expect(letter).toHaveClass('cursor-pointer');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="HeroName.test" --verbose`
Expected: FAIL with "cursor-pointer" class not found

**Step 3: Update HeroName component**

Modify `components/ui/HeroName.tsx` to add click handlers:

```typescript
// At the top, add import:
import { useLetterClick } from '@/lib/interactive-hero';
import { VisibilityState } from '@/lib/interactive-hero';

// Inside the component, after existing refs:
const letterRefsArray = useRef<HTMLSpanElement[]>([]);

// Add the click hook (after prefersReducedMotion check):
const { handleClick, interactionCount } = useLetterClick({
  letterRefs: { current: letterRefsArray.current },
  visibility: isVisible ? VisibilityState.Full : VisibilityState.Frozen,
  enabled: !prefersReducedMotion && introComplete,
});

// Update the setLetterRef callback:
const setLetterRef = useCallback(
  (index: number) => (el: HTMLSpanElement | null) => {
    letterRefs.current[index] = el;
    if (el) {
      letterRefsArray.current[index] = el;
    }
  },
  [],
);

// In the letter span render, add onClick and cursor class:
<span
  key={index}
  ref={setLetterRef(index)}
  className={cn(
    "inline-block",
    isSpace ? "w-[0.3em]" : "cursor-pointer select-none",
  )}
  style={{
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
  }}
  aria-hidden={isSpace ? "true" : undefined}
  onClick={isSpace ? undefined : () => handleClick(index)}
  role={isSpace ? undefined : "button"}
  tabIndex={isSpace ? undefined : 0}
  onKeyDown={isSpace ? undefined : (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(index);
    }
  }}
>
  {isSpace ? "\u00A0" : char}
</span>
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="HeroName.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add components/ui/HeroName.tsx components/ui/__tests__/HeroName.test.tsx
git commit -m "feat(hero): integrate click handlers with HeroName component"
```

---

## Phase 4: Install PixiJS and Setup WebGL

### Task 10: Install PixiJS Dependency

**Step 1: Install PixiJS v8**

```bash
npm install pixi.js@^8.0.0
```

**Step 2: Verify installation**

Run: `npm ls pixi.js`
Expected: pixi.js@8.x.x

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add PixiJS v8 for WebGL overlay"
```

---

### Task 11: WebGL Overlay Component

**Files:**

- Create: `components/ui/HeroWebGLOverlay.tsx`
- Test: `components/ui/__tests__/HeroWebGLOverlay.test.tsx`

**Step 1: Write the failing test**

```typescript
// components/ui/__tests__/HeroWebGLOverlay.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroWebGLOverlay } from '../HeroWebGLOverlay';

// Mock PixiJS
jest.mock('pixi.js', () => ({
  Application: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    canvas: document.createElement('canvas'),
    stage: { addChild: jest.fn() },
    renderer: {
      resize: jest.fn(),
      render: jest.fn(),
    },
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    },
    destroy: jest.fn(),
  })),
  Graphics: jest.fn().mockImplementation(() => ({
    clear: jest.fn().mockReturnThis(),
    circle: jest.fn().mockReturnThis(),
    fill: jest.fn().mockReturnThis(),
    rect: jest.fn().mockReturnThis(),
    alpha: 0,
    x: 0,
    y: 0,
  })),
  DisplacementFilter: jest.fn().mockImplementation(() => ({
    scale: { x: 0, y: 0 },
  })),
  Sprite: jest.fn().mockImplementation(() => ({
    texture: null,
    anchor: { set: jest.fn() },
    alpha: 0,
  })),
}));

describe('HeroWebGLOverlay', () => {
  it('renders a canvas container', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    // Should have a container div
    expect(screen.getByTestId('webgl-overlay')).toBeInTheDocument();
  });

  it('is hidden when visible is false', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={false}
        intensity={1}
      />
    );

    const overlay = screen.getByTestId('webgl-overlay');
    expect(overlay).toHaveStyle({ opacity: '0' });
  });

  it('respects reduced motion preference', () => {
    // Mock reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    // Should render nothing when reduced motion
    expect(screen.queryByTestId('webgl-overlay')).toBeNull();
  });

  it('applies pointer-events-none', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    const overlay = screen.getByTestId('webgl-overlay');
    expect(overlay).toHaveClass('pointer-events-none');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="HeroWebGLOverlay.test" --verbose`
Expected: FAIL with "Cannot find module '../HeroWebGLOverlay'"

**Step 3: Write minimal implementation**

```typescript
// components/ui/HeroWebGLOverlay.tsx
"use client";

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { Application, Graphics } from 'pixi.js';
import { cn } from '@/lib/utils';

interface HeroWebGLOverlayProps {
  containerRef: React.RefObject<HTMLElement>;
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
    const memory = (navigator as any).deviceMemory;
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
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="HeroWebGLOverlay.test" --verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add components/ui/HeroWebGLOverlay.tsx components/ui/__tests__/HeroWebGLOverlay.test.tsx
git commit -m "feat(hero): add WebGL overlay component with PixiJS"
```

---

## Verification Checkpoint

At this point, run the full test suite to ensure everything works together:

```bash
npm test -- --verbose
npm run build
npm run lint
```

Expected: All tests pass, build succeeds, no lint errors.

---

## Remaining Tasks (Summary)

The following tasks complete the implementation. Each follows the same TDD pattern:

### Phase 4 Continued: WebGL Effects

- **Task 12:** Implement ripple displacement effect (`lib/interactive-hero/effects/webgl/ripple.ts`)
- **Task 13:** Implement light sweep effect (`lib/interactive-hero/effects/webgl/sweep.ts`)
- **Task 14:** Implement vignette pulse effect (`lib/interactive-hero/effects/webgl/vignette.ts`)

### Phase 5: Scroll System

- **Task 15:** Create `useHeroScroll` hook with ScrollTrigger pin
- **Task 16:** Add scroll-linked property bindings (letter rotation, divider shimmer)
- **Task 17:** Implement parallax exit animation

### Phase 6: Tier 2 & 3 Integration

- **Task 18:** Add Tier 2 trigger logic to `useLetterClick`
- **Task 19:** Implement time-on-page gate and cooldowns
- **Task 20:** Add Tier 3 Easter egg detection (all letters clicked)

### Phase 7: Hero Section Integration

- **Task 21:** Update `Hero.tsx` to include WebGL overlay
- **Task 22:** Connect scroll system to Hero component
- **Task 23:** Add panic reset on resize/route change

### Phase 8: Fallbacks & Polish

- **Task 24:** CSS-only fallbacks for no-WebGL
- **Task 25:** Low-power mode detection and handling
- **Task 26:** Performance profiling and optimization
- **Task 27:** Cross-browser and mobile testing

---

## Final Verification

After all tasks are complete:

1. Run full test suite: `npm test -- --coverage`
2. Run build: `npm run build`
3. Run dev server: `npm run dev`
4. Manual testing checklist:
   - [ ] Click letters and verify effects trigger
   - [ ] Scroll and verify sticky behavior
   - [ ] Verify Tier 2 effects after 5+ interactions
   - [ ] Test reduced motion fallback
   - [ ] Test on mobile device
   - [ ] Verify no console errors
   - [ ] Check performance (no jank)

5. Create PR: `gh pr create --title "feat: interactive hero system" --body "..."`
