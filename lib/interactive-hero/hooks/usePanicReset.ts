// lib/interactive-hero/hooks/usePanicReset.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { releaseAllLocks, type ChannelLockManager } from '../channelLocks';

export interface UsePanicResetProps {
  letterRefs: React.RefObject<HTMLElement[]>;
  lockManager: ChannelLockManager;
  onReset?: () => void; // Callback for WebGL cleanup
}

export interface UsePanicResetReturn {
  triggerReset: () => void; // Manual reset trigger
  resetCount: number; // Number of resets (for debugging)
}

const RESIZE_DEBOUNCE_MS = 150;

/**
 * usePanicReset - Handles cleanup on resize, orientationchange, route change, or hot reload.
 *
 * On any trigger:
 * - Kill all GSAP timelines
 * - Clear all transforms via gsap.set()
 * - Release all channel locks
 * - Call onReset callback (for WebGL cleanup)
 * - Return to clean rest state
 */
export function usePanicReset({
  letterRefs,
  lockManager,
  onReset,
}: UsePanicResetProps): UsePanicResetReturn {
  const [resetCount, setResetCount] = useState(0);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  /**
   * Core reset function that performs all cleanup operations
   */
  const performReset = useCallback(() => {
    // 1. Kill all GSAP tweens on letter elements
    if (letterRefs.current && letterRefs.current.length > 0) {
      letterRefs.current.forEach((element) => {
        if (element) {
          gsap.killTweensOf(element);
        }
      });

      // 2. Clear transforms on all letter elements
      gsap.set(letterRefs.current, {
        clearProps: 'transform,filter,opacity',
      });
    }

    // 3. Release all channel locks
    releaseAllLocks(lockManager);

    // 4. Call onReset callback for WebGL cleanup
    onReset?.();

    // 5. Increment reset count for debugging
    setResetCount((prev) => prev + 1);
  }, [letterRefs, lockManager, onReset]);

  /**
   * Debounced resize handler
   */
  const handleResize = useCallback(() => {
    // Clear any pending debounce
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Set new debounce timeout
    resizeTimeoutRef.current = setTimeout(() => {
      performReset();
    }, RESIZE_DEBOUNCE_MS);
  }, [performReset]);

  /**
   * Immediate handler for orientationchange
   */
  const handleOrientationChange = useCallback(() => {
    performReset();
  }, [performReset]);

  /**
   * Handler for popstate (browser back/forward)
   */
  const handlePopState = useCallback(() => {
    performReset();
  }, [performReset]);

  // Register event listeners on mount
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Cleanup debounce timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleResize, handleOrientationChange, handlePopState]);

  // Detect pathname changes (Next.js route changes)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      performReset();
    }
  }, [pathname, performReset]);

  return {
    triggerReset: performReset,
    resetCount,
  };
}
