// lib/interactive-hero/utils/browserDetect.ts

import { useMemo } from 'react';

/**
 * Browser name types
 */
export type BrowserName = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'unknown';

/**
 * Browser information interface
 */
export interface BrowserInfo {
  /** Browser name */
  name: BrowserName;
  /** Browser major version number */
  version: number;
  /** Whether the device is mobile */
  isMobile: boolean;
  /** Whether the device supports touch */
  isTouch: boolean;
  /** Whether passive event listeners are supported */
  supportsPassiveEvents: boolean;
  /** Whether IntersectionObserver is supported */
  supportsIntersectionObserver: boolean;
  /** Whether ResizeObserver is supported */
  supportsResizeObserver: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
}

/**
 * Default browser info for SSR or unknown environments
 */
const DEFAULT_BROWSER_INFO: BrowserInfo = {
  name: 'unknown',
  version: 0,
  isMobile: false,
  isTouch: false,
  supportsPassiveEvents: false,
  supportsIntersectionObserver: false,
  supportsResizeObserver: false,
  prefersReducedMotion: false,
};

// Cache for browser detection result
let cachedBrowserInfo: BrowserInfo | null = null;

/**
 * Parse browser name and version from user agent string
 */
function parseBrowserFromUA(ua: string): { name: BrowserName; version: number } {
  // Order matters: check more specific patterns first

  // Edge (Chromium-based)
  const edgeMatch = ua.match(/Edg\/(\d+)/);
  if (edgeMatch) {
    return { name: 'edge', version: parseInt(edgeMatch[1], 10) };
  }

  // Opera
  const operaMatch = ua.match(/OPR\/(\d+)/);
  if (operaMatch) {
    return { name: 'opera', version: parseInt(operaMatch[1], 10) };
  }

  // Internet Explorer
  const ieMatch = ua.match(/(?:MSIE |rv:)(\d+)/);
  if (ieMatch && (ua.includes('Trident') || ua.includes('MSIE'))) {
    return { name: 'ie', version: parseInt(ieMatch[1], 10) };
  }

  // Firefox
  const firefoxMatch = ua.match(/Firefox\/(\d+)/);
  if (firefoxMatch) {
    return { name: 'firefox', version: parseInt(firefoxMatch[1], 10) };
  }

  // Safari (must check before Chrome since Chrome's UA contains Safari)
  const safariMatch = ua.match(/Version\/(\d+).*Safari/);
  if (safariMatch && !ua.includes('Chrome') && !ua.includes('Chromium')) {
    return { name: 'safari', version: parseInt(safariMatch[1], 10) };
  }

  // Chrome
  const chromeMatch = ua.match(/Chrome\/(\d+)/);
  if (chromeMatch) {
    return { name: 'chrome', version: parseInt(chromeMatch[1], 10) };
  }

  return { name: 'unknown', version: 0 };
}

/**
 * Detect if the device is mobile based on user agent
 */
function detectMobile(ua: string): boolean {
  const mobilePatterns = [
    /Android.*Mobile/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /webOS/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Opera Mini/i,
    /IEMobile/i,
    /Mobile Safari/i,
  ];

  return mobilePatterns.some(pattern => pattern.test(ua));
}

/**
 * Detect if touch is supported
 */
function detectTouch(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    (navigator.msMaxTouchPoints > 0)
  );
}

/**
 * Detect if passive event listeners are supported
 */
function detectPassiveEvents(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  let supportsPassive = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassive = true;
        return true;
      },
    });
    // Test by adding and immediately removing a listener
    // Using testPassive as a non-standard event name to avoid type conflicts
    const noop = () => {};
    window.addEventListener('testPassive' as keyof WindowEventMap, noop, options as EventListenerOptions);
    window.removeEventListener('testPassive' as keyof WindowEventMap, noop, options as EventListenerOptions);
  } catch {
    supportsPassive = false;
  }

  return supportsPassive;
}

/**
 * Detect if IntersectionObserver is supported
 */
function detectIntersectionObserver(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * Detect if ResizeObserver is supported
 */
function detectResizeObserver(): boolean {
  return typeof window !== 'undefined' && 'ResizeObserver' in window;
}

/**
 * Detect if user prefers reduced motion
 */
function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Detect browser information including capabilities and preferences.
 *
 * Features detected:
 * - Browser name and version (Chrome, Firefox, Safari, Edge, Opera, IE)
 * - Mobile device detection
 * - Touch support
 * - Passive event listener support
 * - IntersectionObserver support
 * - ResizeObserver support
 * - prefers-reduced-motion preference
 *
 * Results are cached after first detection for performance.
 *
 * @returns BrowserInfo object with detected capabilities
 *
 * @example
 * ```ts
 * const info = detectBrowser();
 *
 * if (info.isMobile && !info.supportsPassiveEvents) {
 *   // Use fallback scroll handling
 * }
 *
 * if (info.prefersReducedMotion) {
 *   // Disable animations
 * }
 * ```
 */
export function detectBrowser(): BrowserInfo {
  // Return cached result if available
  if (cachedBrowserInfo !== null) {
    return cachedBrowserInfo;
  }

  // SSR check
  if (typeof navigator === 'undefined') {
    return DEFAULT_BROWSER_INFO;
  }

  const ua = navigator.userAgent;
  const { name, version } = parseBrowserFromUA(ua);

  cachedBrowserInfo = {
    name,
    version,
    isMobile: detectMobile(ua),
    isTouch: detectTouch(),
    supportsPassiveEvents: detectPassiveEvents(),
    supportsIntersectionObserver: detectIntersectionObserver(),
    supportsResizeObserver: detectResizeObserver(),
    prefersReducedMotion: detectReducedMotion(),
  };

  return cachedBrowserInfo;
}

/**
 * Reset the cached browser info.
 * Primarily useful for testing.
 */
export function resetBrowserInfoCache(): void {
  cachedBrowserInfo = null;
}

/**
 * React hook to get browser information.
 *
 * Uses memoization to avoid unnecessary re-detection.
 * Safe for SSR - returns defaults when window is not available.
 *
 * @returns BrowserInfo object with detected capabilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const browserInfo = useBrowserInfo();
 *
 *   return (
 *     <div>
 *       {browserInfo.prefersReducedMotion ? (
 *         <StaticContent />
 *       ) : (
 *         <AnimatedContent />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBrowserInfo(): BrowserInfo {
  return useMemo(() => detectBrowser(), []);
}

/**
 * Get optimal event listener options based on browser capabilities
 *
 * @param wantsPassive - Whether you want passive behavior (default: true)
 * @returns Event listener options or boolean for legacy browsers
 *
 * @example
 * ```ts
 * const info = detectBrowser();
 * const options = getEventListenerOptions(info, true);
 * element.addEventListener('touchmove', handler, options);
 * ```
 */
export function getEventListenerOptions(
  browserInfo: BrowserInfo,
  wantsPassive = true
): AddEventListenerOptions | boolean {
  if (browserInfo.supportsPassiveEvents) {
    return { passive: wantsPassive };
  }
  return false;
}

/**
 * Get recommended scroll listener options
 *
 * @param browserInfo - Browser info from detectBrowser or useBrowserInfo
 * @returns Optimal scroll event listener options
 */
export function getScrollListenerOptions(
  browserInfo: BrowserInfo
): AddEventListenerOptions | boolean {
  return getEventListenerOptions(browserInfo, true);
}

/**
 * Check if WebGL2 is likely supported based on browser
 * Note: This is advisory only - actual support should be tested
 *
 * @param browserInfo - Browser info from detectBrowser or useBrowserInfo
 * @returns Whether WebGL2 is likely supported
 */
export function isWebGL2LikelySupported(browserInfo: BrowserInfo): boolean {
  // IE doesn't support WebGL2
  if (browserInfo.name === 'ie') {
    return false;
  }

  // Very old browser versions may not support WebGL2
  const minVersions: Record<BrowserName, number> = {
    chrome: 56,
    firefox: 51,
    safari: 15,
    edge: 79,
    opera: 43,
    ie: Infinity, // Never supported
    unknown: 0,
  };

  const minVersion = minVersions[browserInfo.name];
  return browserInfo.version >= minVersion;
}
