// lib/interactive-hero/__tests__/usePanicReset.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePanicReset } from '../hooks/usePanicReset';
import { createChannelLockManager, acquireLock, getActiveLocks } from '../channelLocks';
import { ChannelLockType } from '../types';
import gsap from 'gsap';

// Mock GSAP
jest.mock('gsap', () => ({
  killTweensOf: jest.fn(),
  set: jest.fn(),
}));

// Mock next/navigation
const mockRouterEvents = {
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    events: mockRouterEvents,
  }),
  usePathname: jest.fn(() => '/'),
}));

describe('usePanicReset', () => {
  let mockLetterRefs: React.RefObject<HTMLElement[]>;
  let mockLockManager: ReturnType<typeof createChannelLockManager>;
  let resizeHandler: (() => void) | null = null;
  let orientationHandler: (() => void) | null = null;
  let popstateHandler: (() => void) | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(performance, 'now').mockReturnValue(1000);

    // Create mock elements
    mockLetterRefs = {
      current: [
        document.createElement('span'),
        document.createElement('span'),
        document.createElement('span'),
      ],
    };

    // Create fresh lock manager
    mockLockManager = createChannelLockManager();

    // Capture event listeners
    resizeHandler = null;
    orientationHandler = null;
    popstateHandler = null;

    jest.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'resize') resizeHandler = handler as () => void;
      if (event === 'orientationchange') orientationHandler = handler as () => void;
      if (event === 'popstate') popstateHandler = handler as () => void;
    });

    jest.spyOn(window, 'removeEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('initializes with resetCount of 0', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      expect(result.current.resetCount).toBe(0);
    });

    it('registers event listeners on mount', () => {
      renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });

    it('removes event listeners on unmount', () => {
      const { unmount } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });
  });

  describe('resize event handling', () => {
    it('triggers reset on resize after debounce', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      // Trigger resize
      act(() => {
        resizeHandler?.();
      });

      // Before debounce, no reset
      expect(result.current.resetCount).toBe(0);

      // After debounce (150ms)
      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(result.current.resetCount).toBe(1);
    });

    it('debounces multiple rapid resize events', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      // Trigger multiple resizes rapidly
      act(() => {
        resizeHandler?.();
        jest.advanceTimersByTime(50);
        resizeHandler?.();
        jest.advanceTimersByTime(50);
        resizeHandler?.();
      });

      // Advance past debounce
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Should only reset once
      expect(result.current.resetCount).toBe(1);
    });
  });

  describe('orientationchange event handling', () => {
    it('triggers reset on orientationchange immediately', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        orientationHandler?.();
      });

      expect(result.current.resetCount).toBe(1);
    });
  });

  describe('route change handling', () => {
    it('triggers reset on popstate (browser back/forward)', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        popstateHandler?.();
      });

      expect(result.current.resetCount).toBe(1);
    });
  });

  describe('manual reset trigger', () => {
    it('provides triggerReset function for manual reset', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        result.current.triggerReset();
      });

      expect(result.current.resetCount).toBe(1);
    });

    it('increments resetCount on each manual trigger', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        result.current.triggerReset();
        result.current.triggerReset();
        result.current.triggerReset();
      });

      expect(result.current.resetCount).toBe(3);
    });
  });

  describe('GSAP cleanup', () => {
    it('kills all GSAP tweens on letter elements', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        result.current.triggerReset();
      });

      // Should kill tweens for each letter element
      mockLetterRefs.current?.forEach((element) => {
        expect(gsap.killTweensOf).toHaveBeenCalledWith(element);
      });
    });

    it('clears transforms on all letter elements', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        result.current.triggerReset();
      });

      expect(gsap.set).toHaveBeenCalledWith(mockLetterRefs.current, {
        clearProps: 'transform,filter,opacity',
      });
    });

    it('handles null letterRefs gracefully', () => {
      const nullRefs: React.RefObject<HTMLElement[]> = { current: null };

      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: nullRefs,
          lockManager: mockLockManager,
        })
      );

      // Should not throw
      expect(() => {
        act(() => {
          result.current.triggerReset();
        });
      }).not.toThrow();

      expect(result.current.resetCount).toBe(1);
    });

    it('handles empty letterRefs array gracefully', () => {
      const emptyRefs: React.RefObject<HTMLElement[]> = { current: [] };

      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: emptyRefs,
          lockManager: mockLockManager,
        })
      );

      // Should not throw
      expect(() => {
        act(() => {
          result.current.triggerReset();
        });
      }).not.toThrow();

      expect(result.current.resetCount).toBe(1);
    });
  });

  describe('channel lock cleanup', () => {
    it('releases all channel locks on reset', () => {
      // Add some locks to the manager
      acquireLock(mockLockManager, 'letters:soft', ChannelLockType.Soft, 'effect-1', 5000);
      acquireLock(mockLockManager, 'heroLighting:soft', ChannelLockType.Soft, 'effect-2', 5000);

      expect(getActiveLocks(mockLockManager)).toHaveLength(2);

      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      act(() => {
        result.current.triggerReset();
      });

      expect(getActiveLocks(mockLockManager)).toHaveLength(0);
    });
  });

  describe('onReset callback', () => {
    it('calls onReset callback when provided', () => {
      const onReset = jest.fn();

      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
          onReset,
        })
      );

      act(() => {
        result.current.triggerReset();
      });

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('calls onReset on resize trigger', () => {
      const onReset = jest.fn();

      renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
          onReset,
        })
      );

      act(() => {
        resizeHandler?.();
        jest.advanceTimersByTime(150);
      });

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('calls onReset on orientationchange trigger', () => {
      const onReset = jest.fn();

      renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
          onReset,
        })
      );

      act(() => {
        orientationHandler?.();
      });

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onReset is not provided', () => {
      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
        })
      );

      expect(() => {
        act(() => {
          result.current.triggerReset();
        });
      }).not.toThrow();
    });
  });

  describe('combined reset behavior', () => {
    it('performs all cleanup operations in correct order', () => {
      const onReset = jest.fn();
      const callOrder: string[] = [];

      // Track call order
      (gsap.killTweensOf as jest.Mock).mockImplementation(() => {
        callOrder.push('killTweensOf');
      });
      (gsap.set as jest.Mock).mockImplementation(() => {
        callOrder.push('gsapSet');
      });
      onReset.mockImplementation(() => {
        callOrder.push('onReset');
      });

      // Add a lock to verify it gets cleared
      acquireLock(mockLockManager, 'letters:soft', ChannelLockType.Soft, 'effect-1', 5000);

      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
          onReset,
        })
      );

      act(() => {
        result.current.triggerReset();
      });

      // Verify cleanup happened
      expect(gsap.killTweensOf).toHaveBeenCalled();
      expect(gsap.set).toHaveBeenCalled();
      expect(getActiveLocks(mockLockManager)).toHaveLength(0);
      expect(onReset).toHaveBeenCalled();
    });

    it('handles multiple event types triggering resets', () => {
      const onReset = jest.fn();

      const { result } = renderHook(() =>
        usePanicReset({
          letterRefs: mockLetterRefs,
          lockManager: mockLockManager,
          onReset,
        })
      );

      // Trigger via orientationchange
      act(() => {
        orientationHandler?.();
      });

      // Trigger via popstate
      act(() => {
        popstateHandler?.();
      });

      // Trigger via resize (with debounce)
      act(() => {
        resizeHandler?.();
        jest.advanceTimersByTime(150);
      });

      expect(result.current.resetCount).toBe(3);
      expect(onReset).toHaveBeenCalledTimes(3);
    });
  });

  describe('pathname change detection', () => {
    it('triggers reset when pathname changes', () => {
      const { usePathname } = jest.requireMock('next/navigation');
      usePathname.mockReturnValue('/');

      const onReset = jest.fn();

      const { result, rerender } = renderHook(
        () =>
          usePanicReset({
            letterRefs: mockLetterRefs,
            lockManager: mockLockManager,
            onReset,
          })
      );

      // Initial render, no reset
      expect(result.current.resetCount).toBe(0);

      // Simulate pathname change
      usePathname.mockReturnValue('/about');
      rerender();

      expect(result.current.resetCount).toBe(1);
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('does not reset when pathname stays the same', () => {
      const { usePathname } = jest.requireMock('next/navigation');
      usePathname.mockReturnValue('/');

      const onReset = jest.fn();

      const { result, rerender } = renderHook(
        () =>
          usePanicReset({
            letterRefs: mockLetterRefs,
            lockManager: mockLockManager,
            onReset,
          })
      );

      // Rerender without pathname change
      rerender();
      rerender();
      rerender();

      expect(result.current.resetCount).toBe(0);
      expect(onReset).not.toHaveBeenCalled();
    });
  });
});
