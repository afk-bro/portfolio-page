// lib/interactive-hero/__tests__/visibilityMachine.test.ts
import {
  createVisibilityMachine,
  updateVisibility,
  getIntensityMultiplier,
} from '../visibilityMachine';
import { VisibilityState } from '../types';

describe('Visibility State Machine', () => {
  describe('createVisibilityMachine', () => {
    it('initializes with Full state', () => {
      const machine = createVisibilityMachine();
      expect(machine.state).toBe(VisibilityState.Full);
    });
  });

  describe('updateVisibility (hysteresis)', () => {
    it('transitions Full → Reduced at 0.65', () => {
      const machine = createVisibilityMachine(); // starts Full
      updateVisibility(machine, 0.64);
      expect(machine.state).toBe(VisibilityState.Reduced);
    });

    it('stays Full at 0.66', () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.66);
      expect(machine.state).toBe(VisibilityState.Full);
    });

    it('transitions Reduced → Full at 0.70', () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.64); // → Reduced
      updateVisibility(machine, 0.70); // → Full
      expect(machine.state).toBe(VisibilityState.Full);
    });

    it('stays Reduced at 0.69', () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.64); // → Reduced
      updateVisibility(machine, 0.69);
      expect(machine.state).toBe(VisibilityState.Reduced);
    });

    it('transitions Reduced → Frozen at 0.44', () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.60); // → Reduced
      updateVisibility(machine, 0.44); // → Frozen
      expect(machine.state).toBe(VisibilityState.Frozen);
    });

    it('transitions Frozen → Reduced at 0.50', () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.40); // → Frozen
      updateVisibility(machine, 0.50); // → Reduced
      expect(machine.state).toBe(VisibilityState.Reduced);
    });

    it('stays Frozen at 0.49', () => {
      const machine = createVisibilityMachine();
      updateVisibility(machine, 0.40); // → Frozen
      updateVisibility(machine, 0.49);
      expect(machine.state).toBe(VisibilityState.Frozen);
    });
  });

  describe('getIntensityMultiplier', () => {
    it('returns 1.0 for Full', () => {
      expect(getIntensityMultiplier(VisibilityState.Full)).toBe(1.0);
    });

    it('returns 0.6 for Reduced', () => {
      expect(getIntensityMultiplier(VisibilityState.Reduced)).toBe(0.6);
    });

    it('returns 0 for Frozen', () => {
      expect(getIntensityMultiplier(VisibilityState.Frozen)).toBe(0);
    });
  });
});
