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
