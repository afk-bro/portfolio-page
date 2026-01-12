# Lessons Learned: React Hydration Mismatch Causing Navigation Crashes

**Date:** 2026-01-12
**Issue:** `NotFoundError: Failed to execute 'removeChild' on 'Node'` when navigating away from landing page
**Resolution Time:** ~2 hours of debugging
**Root Cause:** Hydration mismatch in `AnimateOnScroll` component

---

## Symptoms

1. Navigating away from the landing page crashed the app with:
   ```
   NotFoundError: Failed to execute 'removeChild' on 'Node':
   The node to be removed is not a child of this node.
   ```

2. Clicking "Try again" in the error boundary worked perfectly

3. The error only occurred in development mode with React StrictMode

---

## Red Herrings We Chased

### 1. GSAP Animations in HeroName
- **Suspicion:** GSAP was manipulating DOM nodes that React thought it owned
- **Actions taken:**
  - Added `useLayoutEffect` for cleanup
  - Added `gsap.killTweensOf()` calls
  - Created simplified `HeroNameSimple` with no GSAP
- **Result:** Still crashed

### 2. PixiJS WebGL Overlay
- **Suspicion:** `container.appendChild(app.canvas)` was adding DOM nodes outside React
- **Actions taken:**
  - Added `isMounted` flag to prevent async canvas append after unmount
  - Manually removed canvas before destroying app
  - Disabled the entire WebGL overlay
- **Result:** Still crashed

### 3. Interactive Hero Hooks
- **Suspicion:** Complex scroll/parallax hooks with GSAP
- **Actions taken:**
  - Removed all interactive hooks from Hero component
  - Stripped Hero down to pure static JSX
- **Result:** Still crashed

---

## The Actual Root Cause

The error was a **hydration mismatch** in `AnimateOnScroll`, visible in the console:

```
Warning: Prop `style` did not match.
Server: "null"
Client: "opacity:1;transform:translateY(0px)"
```

### What Was Happening

1. **Server render:** `useScrollAnimation` returned `isVisible: false`, `prefersReducedMotion: false`
2. **Component rendered** with initial "hidden" styles: `opacity: 0, transform: translateY(24px)`
3. **Client hydration:** Before React could hydrate, `useEffect` ran and changed state
4. **Mismatch:** Client had different styles than server expected
5. **Cascade:** React tried to reconcile the DOM, found nodes in unexpected places
6. **Crash:** `removeChild` failed because the DOM tree didn't match React's virtual DOM

### Why "Try Again" Worked

The ErrorBoundary unmounted everything and remounted fresh. On a clean mount (not hydration), there's no server HTML to match against, so no mismatch occurs.

---

## The Fix

### Pattern: "hasMounted" Guard for Client-Only Styles

```typescript
// hooks/useScrollAnimation.ts
export function useScrollAnimation(options) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mark as mounted after hydration completes
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only run observers after mount
  useEffect(() => {
    if (!hasMounted) return;
    // ... IntersectionObserver logic
  }, [hasMounted, ...deps]);

  return { isVisible, hasMounted };
}
```

```typescript
// components/ui/AnimateOnScroll.tsx
export function AnimateOnScroll({ children }) {
  const { isVisible, hasMounted } = useScrollAnimation();

  const getStyles = () => {
    // Return undefined before hydration - no inline styles at all
    if (!hasMounted) return undefined;

    // After hydration, return animation styles
    return isVisible ? visibleStyles : hiddenStyles;
  };

  return <div style={getStyles()}>{children}</div>;
}
```

### Why This Works

1. **Server:** `hasMounted = false` → `style={undefined}` → no style attribute
2. **Client initial:** `hasMounted = false` → `style={undefined}` → matches server
3. **After hydration:** `hasMounted = true` → styles applied via state update
4. **No mismatch:** Server and client render identical HTML

---

## Key Takeaways

### 1. Hydration Mismatches Can Cause Cryptic DOM Errors

The `removeChild` error had nothing to do with manual DOM manipulation. It was React trying to reconcile a mismatched DOM tree after hydration failed.

**Lesson:** When you see DOM manipulation errors in React, check for hydration mismatches first.

### 2. The Error Message Lies About the Location

The stack trace pointed to various components (HeroName, WebGLOverlay, etc.), but the actual cause was in a completely different component (AnimateOnScroll).

**Lesson:** Hydration errors cascade. The crash location ≠ the bug location.

### 3. Client-Only Code Needs the "hasMounted" Pattern

Any component that:
- Uses `window` or `document`
- Reads from `localStorage`
- Uses `matchMedia`
- Applies different styles on client vs server

...needs to guard against hydration mismatches.

**Lesson:** Use the `hasMounted` pattern for any client-only behavior that affects rendered output.

### 4. React StrictMode Amplifies These Issues

StrictMode double-invokes effects, which can expose race conditions and make hydration issues more frequent/visible.

**Lesson:** If it only crashes in dev, it might be a hydration or effect cleanup issue.

### 5. "Try Again Working" Is a Diagnostic Clue

If the error boundary recovery works, it means:
- The component works fine on fresh mount
- The issue is specifically with hydration or cleanup
- Look for server/client mismatches

---

## Prevention Checklist

Before shipping any component with client-side behavior:

- [ ] Does it render the same HTML on server and client initially?
- [ ] Are all `window`/`document` accesses inside `useEffect`?
- [ ] Do computed styles depend on client-only state?
- [ ] Is there a `hasMounted` guard if needed?
- [ ] Test: Does a hard refresh show any hydration warnings?

---

## Files Changed

1. `hooks/useScrollAnimation.ts` - Added `hasMounted` state and guards
2. `components/ui/AnimateOnScroll.tsx` - Return `undefined` styles before mount

---

## Related Resources

- [Next.js Hydration Error Docs](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration Documentation](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Josh Comeau: The Perils of Hydration](https://www.joshwcomeau.com/react/the-perils-of-rehydration/)
