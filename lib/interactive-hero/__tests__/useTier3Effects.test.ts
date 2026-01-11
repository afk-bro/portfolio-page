// lib/interactive-hero/__tests__/useTier3Effects.test.ts
import { renderHook } from "@testing-library/react";
import { useTier3Effects } from "../hooks/useTier3Effects";
import { VisibilityState, TIER_UNLOCK } from "../types";

describe("useTier3Effects", () => {
  describe("caustics unlock", () => {
    it("returns causticsUnlocked as false when interactions below threshold", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 5,
          clickedLetters: new Set<number>(),
          totalLetters: 10,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.causticsUnlocked).toBe(false);
    });

    it("unlocks caustics when interactions reach threshold (10)", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: TIER_UNLOCK.tier3Interactions,
          clickedLetters: new Set<number>(),
          totalLetters: 10,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.causticsUnlocked).toBe(true);
    });

    it("unlocks caustics when interactions exceed threshold", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 15,
          clickedLetters: new Set<number>(),
          totalLetters: 10,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.causticsUnlocked).toBe(true);
    });

    it("caustics remain unlocked even when interaction count decreases (session-persistent)", () => {
      const { result, rerender } = renderHook(
        (props) => useTier3Effects(props),
        {
          initialProps: {
            interactionCount: 10,
            clickedLetters: new Set<number>(),
            totalLetters: 10,
            visibility: VisibilityState.Full,
            enabled: true,
          },
        },
      );

      // Unlock caustics
      expect(result.current.causticsUnlocked).toBe(true);

      // Rerender with lower interaction count (simulating state reset)
      rerender({
        interactionCount: 3,
        clickedLetters: new Set<number>(),
        totalLetters: 10,
        visibility: VisibilityState.Full,
        enabled: true,
      });

      // Should still be unlocked (session-persistent)
      expect(result.current.causticsUnlocked).toBe(true);
    });
  });

  describe("particle trail unlock", () => {
    it("returns particleTrailUnlocked as false when not all letters clicked", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 5,
          clickedLetters: new Set([0, 1, 2]),
          totalLetters: 10,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.particleTrailUnlocked).toBe(false);
    });

    it("returns particleTrailUnlocked as false when totalLetters is 0", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 5,
          clickedLetters: new Set<number>(),
          totalLetters: 0,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.particleTrailUnlocked).toBe(false);
    });

    it("unlocks particle trail when all letters clicked", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 10,
          clickedLetters: new Set([0, 1, 2, 3, 4]),
          totalLetters: 5,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.particleTrailUnlocked).toBe(true);
    });

    it("particle trail remains unlocked after re-render (session-persistent)", () => {
      const { result, rerender } = renderHook(
        (props) => useTier3Effects(props),
        {
          initialProps: {
            interactionCount: 5,
            clickedLetters: new Set([0, 1, 2, 3, 4]),
            totalLetters: 5,
            visibility: VisibilityState.Full,
            enabled: true,
          },
        },
      );

      // Unlock particle trail
      expect(result.current.particleTrailUnlocked).toBe(true);

      // Rerender with cleared clicked letters (simulating state reset)
      rerender({
        interactionCount: 0,
        clickedLetters: new Set<number>(),
        totalLetters: 5,
        visibility: VisibilityState.Full,
        enabled: true,
      });

      // Should still be unlocked (session-persistent)
      expect(result.current.particleTrailUnlocked).toBe(true);
    });
  });

  describe("activeTier3Effects", () => {
    it("returns empty array when no effects unlocked", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 5,
          clickedLetters: new Set<number>(),
          totalLetters: 10,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.activeTier3Effects).toEqual([]);
    });

    it("includes caustics in activeTier3Effects when unlocked and visible", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 10,
          clickedLetters: new Set<number>(),
          totalLetters: 10,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.activeTier3Effects).toContain("caustics");
    });

    it("includes particle-trail in activeTier3Effects when unlocked and visible", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 5,
          clickedLetters: new Set([0, 1, 2, 3, 4]),
          totalLetters: 5,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.activeTier3Effects).toContain("particle-trail");
    });

    it("includes both effects when both unlocked", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 15,
          clickedLetters: new Set([0, 1, 2, 3, 4]),
          totalLetters: 5,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.activeTier3Effects).toContain("caustics");
      expect(result.current.activeTier3Effects).toContain("particle-trail");
      expect(result.current.activeTier3Effects).toHaveLength(2);
    });

    it("returns empty array when visibility is Frozen (effects paused)", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 15,
          clickedLetters: new Set([0, 1, 2, 3, 4]),
          totalLetters: 5,
          visibility: VisibilityState.Frozen,
          enabled: true,
        }),
      );

      // Effects are unlocked but not active due to visibility
      expect(result.current.causticsUnlocked).toBe(true);
      expect(result.current.particleTrailUnlocked).toBe(true);
      expect(result.current.activeTier3Effects).toEqual([]);
    });

    it("returns empty array when disabled", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 15,
          clickedLetters: new Set([0, 1, 2, 3, 4]),
          totalLetters: 5,
          visibility: VisibilityState.Full,
          enabled: false,
        }),
      );

      // Effects are unlocked but not active due to being disabled
      expect(result.current.causticsUnlocked).toBe(true);
      expect(result.current.particleTrailUnlocked).toBe(true);
      expect(result.current.activeTier3Effects).toEqual([]);
    });

    it("includes effects when visibility is Reduced (not fully paused)", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 15,
          clickedLetters: new Set([0, 1, 2, 3, 4]),
          totalLetters: 5,
          visibility: VisibilityState.Reduced,
          enabled: true,
        }),
      );

      // Reduced visibility still allows effects (just at lower intensity)
      expect(result.current.activeTier3Effects).toContain("caustics");
      expect(result.current.activeTier3Effects).toContain("particle-trail");
    });
  });

  describe("progressive unlocking", () => {
    it("unlocks effects progressively as conditions are met", () => {
      const { result, rerender } = renderHook(
        (props) => useTier3Effects(props),
        {
          initialProps: {
            interactionCount: 0,
            clickedLetters: new Set<number>(),
            totalLetters: 5,
            visibility: VisibilityState.Full,
            enabled: true,
          },
        },
      );

      // Initially nothing unlocked
      expect(result.current.causticsUnlocked).toBe(false);
      expect(result.current.particleTrailUnlocked).toBe(false);

      // Reach 10 interactions - caustics unlocks
      rerender({
        interactionCount: 10,
        clickedLetters: new Set([0, 1, 2]),
        totalLetters: 5,
        visibility: VisibilityState.Full,
        enabled: true,
      });

      expect(result.current.causticsUnlocked).toBe(true);
      expect(result.current.particleTrailUnlocked).toBe(false);

      // Click all letters - particle trail unlocks
      rerender({
        interactionCount: 12,
        clickedLetters: new Set([0, 1, 2, 3, 4]),
        totalLetters: 5,
        visibility: VisibilityState.Full,
        enabled: true,
      });

      expect(result.current.causticsUnlocked).toBe(true);
      expect(result.current.particleTrailUnlocked).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles empty clickedLetters set", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 10,
          clickedLetters: new Set<number>(),
          totalLetters: 5,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.causticsUnlocked).toBe(true);
      expect(result.current.particleTrailUnlocked).toBe(false);
    });

    it("handles single letter (totalLetters: 1)", () => {
      const { result } = renderHook(() =>
        useTier3Effects({
          interactionCount: 10,
          clickedLetters: new Set([0]),
          totalLetters: 1,
          visibility: VisibilityState.Full,
          enabled: true,
        }),
      );

      expect(result.current.particleTrailUnlocked).toBe(true);
    });

    it("maintains session persistence across multiple rerenders", () => {
      const { result, rerender } = renderHook(
        (props) => useTier3Effects(props),
        {
          initialProps: {
            interactionCount: 10,
            clickedLetters: new Set([0, 1, 2, 3, 4]),
            totalLetters: 5,
            visibility: VisibilityState.Full,
            enabled: true,
          },
        },
      );

      // Both unlocked
      expect(result.current.causticsUnlocked).toBe(true);
      expect(result.current.particleTrailUnlocked).toBe(true);

      // Multiple rerenders with varying conditions
      for (let i = 0; i < 5; i++) {
        rerender({
          interactionCount: i,
          clickedLetters: new Set<number>(),
          totalLetters: 5,
          visibility: VisibilityState.Frozen,
          enabled: false,
        });

        // Should remain unlocked (session-persistent)
        expect(result.current.causticsUnlocked).toBe(true);
        expect(result.current.particleTrailUnlocked).toBe(true);
      }
    });
  });
});
