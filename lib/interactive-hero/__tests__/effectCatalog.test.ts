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

  describe("TIER3_EFFECTS", () => {
    it("contains 2 effects", () => {
      expect(TIER3_EFFECTS).toHaveLength(2);
    });

    it("all effects have tier 3", () => {
      TIER3_EFFECTS.forEach((effect) => {
        expect(effect.tier).toBe(EffectTier.Persistent);
      });
    });

    it("includes ambient caustics with weight 100", () => {
      const caustics = TIER3_EFFECTS.find((e) => e.id === "ambient-caustics");
      expect(caustics).toBeDefined();
      expect(caustics?.weight).toBe(100);
    });

    it("includes cursor particle trail with weight 0 (Easter egg)", () => {
      const trail = TIER3_EFFECTS.find((e) => e.id === "cursor-particle-trail");
      expect(trail).toBeDefined();
      expect(trail?.weight).toBe(0);
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
        expect(effect?.id).not.toBe("elastic-bounce");
      }
    });

    it("returns null for empty pool", () => {
      const effect = selectWeightedEffect([], null);
      expect(effect).toBeNull();
    });

    it("returns null when only effect is excluded", () => {
      const singleEffectPool = [TIER1_EFFECTS[0]];
      const effect = selectWeightedEffect(
        singleEffectPool,
        TIER1_EFFECTS[0].id,
      );
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
    it("finds effect by id from tier 1", () => {
      const effect = getEffectById("elastic-bounce");
      expect(effect?.name).toBe("Elastic Bounce");
    });

    it("finds effect by id from tier 2", () => {
      const effect = getEffectById("refraction-ripple");
      expect(effect?.name).toBe("Refraction Ripple");
    });

    it("finds effect by id from tier 3", () => {
      const effect = getEffectById("ambient-caustics");
      expect(effect?.name).toBe("Ambient Caustics");
    });

    it("returns undefined for unknown id", () => {
      const effect = getEffectById("unknown");
      expect(effect).toBeUndefined();
    });
  });
});
