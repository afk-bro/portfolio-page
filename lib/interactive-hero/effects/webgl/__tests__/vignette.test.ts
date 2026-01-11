// lib/interactive-hero/effects/webgl/__tests__/vignette.test.ts
import { createVignetteEffect, type VignetteEffectConfig } from '../vignette';

// Mock GSAP
jest.mock('gsap', () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    then: jest.fn((cb) => { cb?.(); return Promise.resolve(); }),
  })),
}));

describe('Vignette Pulse Effect', () => {
  const mockConfig: VignetteEffectConfig = {
    intensity: 1.0,
    duration: 400,
    isDarkMode: true,
    color: '#0d4d79',
  };

  it('creates a vignette effect with correct config', () => {
    const result = createVignetteEffect(mockConfig);

    expect(result).toBeDefined();
    expect(result.type).toBe('vignette');
  });

  it('returns timeline and update function', () => {
    const result = createVignetteEffect(mockConfig);

    expect(result.timeline).toBeDefined();
    expect(result.update).toBeInstanceOf(Function);
  });

  it('calculates vignette alpha with in-hold-out phases', () => {
    const result = createVignetteEffect(mockConfig);

    // Phase 1: Fade in (0 to 0.375 = 150ms of 400ms)
    const fadeIn = result.update(0.2);
    expect(fadeIn.alpha).toBeGreaterThan(0);
    expect(fadeIn.alpha).toBeLessThan(0.25);

    // Phase 2: Hold (0.375 to 0.625)
    const hold = result.update(0.5);
    expect(hold.alpha).toBeCloseTo(0.25, 1); // Peak for dark mode

    // Phase 3: Fade out (0.625 to 1)
    const fadeOut = result.update(0.9);
    expect(fadeOut.alpha).toBeGreaterThan(0);
    expect(fadeOut.alpha).toBeLessThan(0.25);

    // End state
    const end = result.update(1);
    expect(end.alpha).toBe(0);
  });

  it('uses lower peak alpha for light mode', () => {
    const lightConfig = { ...mockConfig, isDarkMode: false };
    const result = createVignetteEffect(lightConfig);

    const hold = result.update(0.5);
    expect(hold.alpha).toBeCloseTo(0.15, 1); // Lower for light mode
  });

  it('respects intensity multiplier', () => {
    const lowIntensity = createVignetteEffect({ ...mockConfig, intensity: 0.5 });
    const highIntensity = createVignetteEffect({ ...mockConfig, intensity: 1.0 });

    const lowHold = lowIntensity.update(0.5);
    const highHold = highIntensity.update(0.5);

    expect(lowHold.alpha).toBeLessThan(highHold.alpha);
  });

  it('returns correct color', () => {
    const result = createVignetteEffect(mockConfig);

    const state = result.update(0.5);
    expect(state.color).toBe('#0d4d79');
  });

  it('has destroy method', () => {
    const result = createVignetteEffect(mockConfig);

    expect(result.destroy).toBeInstanceOf(Function);
  });
});
