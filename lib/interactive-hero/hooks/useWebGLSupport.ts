// lib/interactive-hero/hooks/useWebGLSupport.ts

import { useState, useEffect } from 'react';

/**
 * Result of WebGL support detection
 */
export interface WebGLSupportResult {
  webgl: boolean;
  webgl2: boolean;
}

/**
 * Return type for the useWebGLSupport hook
 */
export interface UseWebGLSupportReturn {
  webglSupported: boolean;
  webgl2Supported: boolean;
  isChecking: boolean;
}

/**
 * Check WebGL support by attempting to create canvas contexts
 * Returns an object indicating support for WebGL and WebGL2
 *
 * @returns {WebGLSupportResult} Object with webgl and webgl2 boolean properties
 */
export function checkWebGLSupport(): WebGLSupportResult {
  // SSR check
  if (typeof window === 'undefined') {
    return { webgl: false, webgl2: false };
  }

  try {
    const canvas = document.createElement('canvas');

    // Check WebGL2 first (superset of WebGL1)
    const webgl2 = !!(canvas.getContext('webgl2'));

    // Check WebGL1 (also try experimental-webgl for older browsers)
    const webgl = webgl2 || !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );

    return { webgl, webgl2 };
  } catch {
    // Any error means no WebGL support
    return { webgl: false, webgl2: false };
  }
}

// Cache the result to avoid repeated DOM operations
let cachedResult: WebGLSupportResult | null = null;

/**
 * React hook to detect WebGL support
 *
 * The check is performed once on mount and the result is cached.
 * Returns isChecking: true during initial check.
 *
 * @returns {UseWebGLSupportReturn} Object with webglSupported, webgl2Supported, and isChecking
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { webglSupported, webgl2Supported, isChecking } = useWebGLSupport();
 *
 *   if (isChecking) return <Loading />;
 *
 *   if (!webglSupported) {
 *     return <CSSFallback />;
 *   }
 *
 *   return <WebGLEffect />;
 * }
 * ```
 */
export function useWebGLSupport(): UseWebGLSupportReturn {
  const [state, setState] = useState<UseWebGLSupportReturn>(() => {
    // Use cached result if available (avoids flash during SSR hydration)
    if (cachedResult) {
      return {
        webglSupported: cachedResult.webgl,
        webgl2Supported: cachedResult.webgl2,
        isChecking: false,
      };
    }

    return {
      webglSupported: false,
      webgl2Supported: false,
      isChecking: true,
    };
  });

  useEffect(() => {
    // Skip if already checked
    if (cachedResult) {
      setState({
        webglSupported: cachedResult.webgl,
        webgl2Supported: cachedResult.webgl2,
        isChecking: false,
      });
      return;
    }

    // Perform the check
    const result = checkWebGLSupport();
    cachedResult = result;

    setState({
      webglSupported: result.webgl,
      webgl2Supported: result.webgl2,
      isChecking: false,
    });
  }, []);

  return state;
}

/**
 * Reset the cached WebGL support result
 * Primarily useful for testing
 */
export function resetWebGLSupportCache(): void {
  cachedResult = null;
}
