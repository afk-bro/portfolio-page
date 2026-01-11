// lib/interactive-hero/__tests__/useParallaxExit.test.ts
import { renderHook } from '@testing-library/react';
import { useParallaxExit } from '../hooks/useParallaxExit';

describe('useParallaxExit', () => {
  it('returns zero offsets when not in exit phase', () => {
    const { result } = renderHook(() => useParallaxExit({
      exitProgress: 0,
      isScrollingUp: false,
      enabled: true,
    }));

    expect(result.current.backgroundOffset).toBe(0);
    expect(result.current.overlayOffset).toBe(0);
    expect(result.current.nameOffset).toBe(0);
    expect(result.current.dividerOffset).toBe(0);
    expect(result.current.buttonsOffset).toBe(0);
  });

  it('applies parallax offsets during exit', () => {
    const { result } = renderHook(() => useParallaxExit({
      exitProgress: 0.5, // Halfway through 200px exit
      isScrollingUp: false,
      enabled: true,
    }));

    // With power1.out easing: eased(0.5) = 1 - (1 - 0.5)^2 = 0.75
    // Eased distance = 0.75 * 200 = 150px

    // Background moves slowest (0.3x) = 150 * 0.3 = 45px
    expect(result.current.backgroundOffset).toBeCloseTo(45, 0);

    // WebGL overlay (0.5x) = 150 * 0.5 = 75px
    expect(result.current.overlayOffset).toBeCloseTo(75, 0);

    // Name (0.7x) = 150 * 0.7 = 105px
    expect(result.current.nameOffset).toBeCloseTo(105, 0);

    // Divider (0.8x) = 150 * 0.8 = 120px
    expect(result.current.dividerOffset).toBeCloseTo(120, 0);

    // Buttons (1.0x) = 150 * 1.0 = 150px
    expect(result.current.buttonsOffset).toBeCloseTo(150, 0);
  });

  it('applies easing to offsets', () => {
    const { result: early } = renderHook(() => useParallaxExit({
      exitProgress: 0.25,
      isScrollingUp: false,
      enabled: true,
    }));

    const { result: late } = renderHook(() => useParallaxExit({
      exitProgress: 0.75,
      isScrollingUp: false,
      enabled: true,
    }));

    // With power1.out easing:
    // eased(0.25) = 1 - (1 - 0.25)^2 = 1 - 0.5625 = 0.4375
    // eased(0.75) = 1 - (1 - 0.75)^2 = 1 - 0.0625 = 0.9375

    // Linear values (without easing)
    const linearEarly = 0.25 * 200 * 0.7; // = 35px
    const linearLate = 0.75 * 200 * 0.7;  // = 105px

    // Eased values should be:
    // early: 0.4375 * 200 * 0.7 = 61.25px (ahead of linear 35px)
    // late: 0.9375 * 200 * 0.7 = 131.25px (ahead of linear 105px, but slowing down)

    // Early should be ahead of linear due to ease-out (starts fast)
    expect(early.current.nameOffset).toBeGreaterThan(linearEarly);
    // The difference between early and late should be less than linear would suggest
    // because ease-out slows down at the end
    const earlyLateRatio = late.current.nameOffset / early.current.nameOffset;
    const linearRatio = linearLate / linearEarly;
    expect(earlyLateRatio).toBeLessThan(linearRatio);
  });

  it('accelerates convergence on reverse scroll (1.5x rate)', () => {
    const { result: forward } = renderHook(() => useParallaxExit({
      exitProgress: 0.5,
      isScrollingUp: false,
      enabled: true,
    }));

    const { result: reverse } = renderHook(() => useParallaxExit({
      exitProgress: 0.5,
      isScrollingUp: true,
      enabled: true,
    }));

    // On reverse scroll, offsets should be smaller (converging faster)
    // At 1.5x rate, effective progress for convergence is 0.5 * 1.5 = 0.75
    // So remaining offset should be like we're at 0.75 progress going back
    expect(Math.abs(reverse.current.nameOffset)).toBeLessThan(Math.abs(forward.current.nameOffset));
  });

  it('returns zero offsets when disabled', () => {
    const { result } = renderHook(() => useParallaxExit({
      exitProgress: 0.5,
      isScrollingUp: false,
      enabled: false,
    }));

    expect(result.current.backgroundOffset).toBe(0);
    expect(result.current.overlayOffset).toBe(0);
    expect(result.current.nameOffset).toBe(0);
    expect(result.current.dividerOffset).toBe(0);
    expect(result.current.buttonsOffset).toBe(0);
  });

  it('provides CSS transform values', () => {
    const { result } = renderHook(() => useParallaxExit({
      exitProgress: 0.5,
      isScrollingUp: false,
      enabled: true,
    }));

    expect(result.current.transforms.background).toContain('translateY');
    expect(result.current.transforms.overlay).toContain('translateY');
    expect(result.current.transforms.name).toContain('translateY');
    expect(result.current.transforms.divider).toContain('translateY');
    expect(result.current.transforms.buttons).toContain('translateY');
  });
});
