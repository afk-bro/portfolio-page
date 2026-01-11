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
