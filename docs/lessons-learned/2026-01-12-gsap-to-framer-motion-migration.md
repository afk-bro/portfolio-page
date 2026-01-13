# Lessons Learned: GSAP to Framer Motion Migration

**Date:** 2026-01-12
**Issue:** GSAP animations causing React hydration conflicts and broken interactivity
**Resolution:** Complete migration from GSAP to Framer Motion
**Root Cause:** GSAP's direct DOM manipulation conflicts with React's virtual DOM reconciliation

---

## Context

After fixing hydration mismatches (see `2026-01-12-hydration-mismatch-debugging.md`), the GSAP-powered interactive hero name was still broken:
- Click interactions no longer worked
- Hover effects were missing
- The name was rendered as plain text

Rather than continue patching GSAP, we decided to migrate to Framer Motion.

---

## Why GSAP Struggles with React

### 1. Direct DOM Manipulation
GSAP modifies DOM elements directly (`gsap.to(element, {...})`), which bypasses React's virtual DOM. This creates race conditions where:
- React expects element X to be in state A
- GSAP has already mutated it to state B
- React tries to reconcile and fails

### 2. Cleanup Complexity
GSAP requires manual cleanup (`gsap.killTweensOf()`, `ScrollTrigger.kill()`), which must happen at exactly the right time in React's lifecycle. Missing or mistimed cleanup causes:
- Memory leaks
- Orphaned animations
- DOM nodes React can't find

### 3. Server-Side Rendering
GSAP has no concept of SSR. Any GSAP code that runs during SSR will fail or behave unexpectedly. This requires wrapping everything in `typeof window !== 'undefined'` checks or `useEffect`.

---

## Why Framer Motion Works Better

### 1. React-Native Integration
Framer Motion is built for React. Animations are declared as props on `motion` components:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

React controls the DOM; Framer Motion just tells React what to render.

### 2. Automatic Cleanup
Animations automatically stop when components unmount. No manual cleanup required.

### 3. SSR-Safe
Framer Motion handles SSR correctly. `initial` values are used for server render, then animations run on client.

### 4. Variants Pattern
Complex choreographed animations use the `Variants` pattern:
```tsx
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

<motion.p
  initial="hidden"
  animate="visible"
  variants={fadeIn}
  custom={1.5}  // delay passed to variant
>
```

---

## Animation Strategy Shift

### Before: Interactive Chaos
- Click on letters to trigger random animations
- Hover effects on individual characters
- Complex GSAP timelines
- Hidden easter eggs

### After: Calm, Deliberate Entrance
- Typewriter effect for name (character-by-character stagger)
- Cascading reveals for subsequent elements
- Directional animations (slide from left/right/up/down)
- Slower, more elegant timing

### Why the Shift
1. **Reliability over novelty** - A calm animation that always works beats a flashy one that breaks
2. **Professional tone** - Portfolio targeting hiring managers benefits from polish, not gimmicks
3. **Maintainability** - Simple Framer Motion code is easier to debug and modify

---

## Implementation Details

### TypewriterName Component
Character-by-character reveal with mechanical timing:
```tsx
const delays = letters.map((_, i) => i * 0.09 + Math.random() * 0.025);

{letters.map((char, i) => (
  <motion.span
    initial={{ opacity: 0, y: 3 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delays[i], duration: 0.15 }}
  >
    {char}
  </motion.span>
))}
```

Key design decisions:
- 0.09s per character (slower than typical typewriter for calm feel)
- Slight random variance (0.025s) for mechanical imperfection
- Small y offset (3px) for subtle stamp-down effect

### Cascade Timing
All subsequent animations wait for typewriter to complete:
```tsx
const typewriterDuration = getTypewriterDuration(name); // name.length * 0.09 + 0.3

const timing = {
  role: typewriterDuration + 0.15,
  bio: typewriterDuration + 0.65,
  ctas: typewriterDuration + 1.15,
  trust: typewriterDuration + 1.65,
  badge: typewriterDuration + 2.1,
};
```

### Directional Variety
Different elements animate from different directions:
- Role: fade in (standard)
- Bio: slide from left
- CTAs: slide from right
- Trust anchor: slide up from bottom
- Badge: slide down from top

This creates visual interest without complexity.

---

## Issues Encountered

### 1. AnimateOnScroll Bug
After migration, scroll animations weren't working. Root cause: `initial` styles included `transition` property, causing immediate transition from hidden to visible.

**Fix:** Only apply `transition` in the `visible` state, not `initial`.

### 2. TypeScript Variants Errors
Framer Motion's strict typing rejected inline transition objects.

**Fix:** Add `as const` to ease arrays:
```tsx
transition: {
  ease: [0.25, 0.1, 0.25, 1] as const,
}
```

### 3. Animation Too Fast
Initial timing felt rushed compared to reference sites like framer.com.

**Fix:** Slowed base timing from 0.045s to 0.09s per character, increased gaps between cascade elements.

### 4. Name Lacked Visual Weight
Typewriter text looked too light, didn't anchor the page.

**Fix:** Multiple adjustments:
- Increased font size: `clamp(3.9rem, 6.8vw, 6.2rem)`
- Tightened tracking: `0.1em`
- Ink stamp shadow: `0 1.5px 0 rgba(0,0,0,0.45)`
- Higher contrast: `text-white/95` in dark mode
- Subtle paper strip background gradient

---

## Key Takeaways

### 1. Choose React-Native Animation Libraries
GSAP is powerful but designed for vanilla JS. For React projects, prefer libraries built for React:
- Framer Motion (recommended)
- React Spring
- Motion One

### 2. Simplify When Migrating
Migration is a chance to simplify. We removed complex interactive animations and replaced with elegant entrance animations.

### 3. Cascade Timing Needs a System
Don't hardcode delays. Calculate them from a known starting point (typewriter duration) so the sequence stays coordinated.

### 4. Test on Fast and Slow Refresh
Animations can look different on initial load vs. hot reload. Always test with full page refresh.

---

## Files Changed

1. `components/ui/TypewriterName.tsx` - New component for typewriter effect
2. `components/sections/Hero.tsx` - Complete rewrite with Framer Motion
3. `components/ui/AnimateOnScroll.tsx` - Fixed transition bug
4. `components/sections/Navigation.tsx` - Added hover glow effect
5. `app/layout.tsx` - Added Cutive Mono font
6. `tailwind.config.ts` - Added `font-typewriter` family
7. `package.json` - Added framer-motion dependency

---

## Related Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Framer Motion Variants](https://www.framer.com/motion/animation/#variants)
- Previous: `2026-01-12-hydration-mismatch-debugging.md`
