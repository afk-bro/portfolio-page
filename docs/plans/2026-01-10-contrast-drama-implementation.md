# Contrast & Drama Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio from restrained professional tones into a high-impact showcase with deep blacks, dual gold/cyan accents, kinetic typography, and progressive intensity.

**Architecture:** Update Tailwind config with new color tokens and animations, refactor globals.css for new base styles, rebuild HeroName with blur-to-sharp animation, update all components to use new design system.

**Tech Stack:** Next.js 14, Tailwind CSS 3.4, GSAP 3.14, TypeScript

---

## Phase 1: Foundation

### Task 1.1: Add New Color Tokens to Tailwind

**Files:**
- Modify: `tailwind.config.ts:12-145`

**Step 1: Add the new dark base colors after existing dark object**

Find the existing `dark` object and replace it with deeper blacks:

```typescript
// Replace existing dark object (lines 34-38)
dark: {
  void: "#030508",      // Primary background (near-true black)
  surface: "#080C12",   // Card/section surfaces
  elevated: "#0C1219",  // Elevated elements, inputs
  base: "#050B14",      // Keep for backwards compat
},
```

**Step 2: Add gold accent colors after bronze object**

```typescript
// Add after bronze object (after line 55)
gold: {
  400: "#FFBE2E",  // Highlights, glows
  500: "#F5A623",  // Primary CTAs
  600: "#D4890A",  // Pressed/active states
},
```

**Step 3: Add cyan accent colors**

```typescript
// Add after gold object
cyan: {
  400: "#22D3EE",  // Bright highlights, hover text
  500: "#06B6D4",  // Links, secondary actions
  600: "#0891B2",  // Active states
},
```

**Step 4: Run typecheck to verify**

Run: `npm run typecheck`
Expected: No errors

**Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(design): add dark void, gold, and cyan color tokens"
```

---

### Task 1.2: Add New Shadow Utilities to Tailwind

**Files:**
- Modify: `tailwind.config.ts:181-197`

**Step 1: Add gold and cyan glow shadows**

Find the `boxShadow` object and add after existing shadows:

```typescript
// Add after "keycap-pressed" (line 196)
"gold-glow": "0 0 30px rgba(245, 166, 35, 0.4)",
"gold-glow-intense": "0 0 40px rgba(245, 166, 35, 0.5), 0 0 80px rgba(245, 166, 35, 0.2)",
"cyan-glow": "0 0 25px rgba(6, 182, 212, 0.35)",
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(design): add gold and cyan glow shadow utilities"
```

---

### Task 1.3: Add New Animations to Tailwind

**Files:**
- Modify: `tailwind.config.ts:202-225`

**Step 1: Add new animation definitions**

Find the `animation` object and add:

```typescript
animation: {
  "fade-up": "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
  "fade-in": "fadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  shimmer: "shimmer 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  lift: "lift 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
  // New animations
  "shimmer-bg": "shimmerBg 3s ease-in-out infinite",
  "light-sweep": "lightSweep 4s ease-in-out infinite",
  "gradient-drift": "gradientDrift 8s ease-in-out infinite alternate",
  "glow-pulse": "glowPulse 2s ease-in-out infinite",
  "underline-sweep": "underlineSweep 0.4s ease-out forwards",
},
```

**Step 2: Add new keyframe definitions**

Find the `keyframes` object and add:

```typescript
keyframes: {
  // ... existing keyframes ...
  shimmerBg: {
    "0%, 100%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
  },
  lightSweep: {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
  gradientDrift: {
    "0%": { transform: "translateX(-10px)" },
    "100%": { transform: "translateX(10px)" },
  },
  glowPulse: {
    "0%, 100%": { opacity: "0.8" },
    "50%": { opacity: "1" },
  },
  underlineSweep: {
    from: { width: "0%" },
    to: { width: "100%" },
  },
},
```

**Step 3: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(design): add shimmer, glow, and sweep animation keyframes"
```

---

### Task 1.4: Update CSS Custom Properties for Dark Mode

**Files:**
- Modify: `app/globals.css:1-61`

**Step 1: Update dark mode CSS variables**

Replace the `.dark` block (lines 14-20):

```css
.dark {
  /* Dark mode - True black bg, bright text, gold accent */
  --background: 3 5 8; /* dark-void #030508 */
  --foreground: 245 245 245; /* near-white #F5F5F5 */
  --primary: 245 166 35; /* gold-500 #F5A623 */
  --primary-foreground: 12 18 25;
}
```

**Step 2: Run dev server and verify dark mode**

Run: `npm run dev`
Expected: Dark mode shows deeper black background

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): update dark mode CSS variables for true black base"
```

---

### Task 1.5: Update Body Base Styles

**Files:**
- Modify: `app/globals.css:40-44`

**Step 1: Update body dark mode class**

Replace body styles:

```css
body {
  /* Light: near-white bg, ocean text | Dark: true black bg, bright text */
  @apply bg-sand-50 text-ocean-900 antialiased;
  @apply dark:bg-dark-void dark:text-[#F5F5F5];
}
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): update body to use dark-void background"
```

---

## Phase 2: Hero Section

### Task 2.1: Update Hero Name Typography Size

**Files:**
- Modify: `components/ui/HeroName.tsx:271-278, 281-312`

**Step 1: Update reduced motion fallback with new sizing**

Replace lines 268-279:

```tsx
if (prefersReducedMotion) {
  return (
    <h1
      className={cn(
        "text-[clamp(3rem,12vw,10rem)] font-bold leading-[1.1]",
        "text-ocean-800 dark:text-[#F5F5F5]",
        "mb-4 text-balance",
        className,
      )}
    >
      {name}
    </h1>
  );
}
```

**Step 2: Update main render with new sizing**

Replace the h1 className (around line 284):

```tsx
<h1
  className={cn(
    "text-[clamp(3rem,12vw,10rem)] font-bold leading-[1.1]",
    "text-ocean-800 dark:text-[#F5F5F5]",
    "mb-4",
    className,
  )}
  style={{ perspective: "1000px" }}
>
```

**Step 3: Run tests to verify no regressions**

Run: `npm test`
Expected: All 30 tests pass

**Step 4: Commit**

```bash
git add components/ui/HeroName.tsx
git commit -m "feat(hero): increase name size to viewport-responsive clamp"
```

---

### Task 2.2: Replace HeroName Animation with Blur-to-Sharp

**Files:**
- Modify: `components/ui/HeroName.tsx:60-95, 133-213`

**Step 1: Update glow colors for dual accent**

Replace BRONZE_GLOW constant (line 94):

```tsx
// Dual accent glow colors
const GOLD_GLOW = "245, 166, 35";   // gold-500
const CYAN_GLOW = "6, 182, 212";    // cyan-500
```

**Step 2: Replace computeVisuals function**

Replace the function (lines 65-91):

```tsx
/**
 * Compute blur-to-sharp visuals from progress
 * Uses dual gold/cyan for dramatic effect
 */
const computeBlurVisuals = (progress: number) => {
  // Blur: starts at 12px, resolves to 0
  const blur = 12 * (1 - progress);

  // Scale: starts at 1.1, settles to 1
  const scale = 1 + 0.1 * (1 - progress);

  // Y position: drops from -40 to 0
  const y = -40 * (1 - progress);

  // Glow peaks at 0.5 progress, fades by end
  let glowIntensity = 0;
  if (progress < 0.8) {
    glowIntensity = Math.sin((progress / 0.8) * Math.PI) * 0.6;
  }

  return { blur, scale, y, glowIntensity };
};
```

**Step 3: Replace triggerSpinCascade with triggerBlurReveal**

Replace the function (lines 134-213):

```tsx
// BLUR-TO-SHARP REVEAL
const triggerBlurReveal = useCallback(() => {
  if (hasPlayedRef.current) return;
  hasPlayedRef.current = true;
  spinStartTimeRef.current = Date.now();
  setIsSpinning(true);

  const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
  const nonSpaceLetters: HTMLSpanElement[] = [];

  letters.forEach((letter, i) => {
    if (!characters[i]?.isSpace) {
      nonSpaceLetters.push(letter);
    }
  });

  const tl = gsap.timeline({
    onComplete: () => setIsSpinning(false),
  });
  timelineRef.current = tl;

  // Set initial state for all letters
  nonSpaceLetters.forEach((letter) => {
    gsap.set(letter, {
      filter: "blur(12px)",
      opacity: 0,
      scale: 1.1,
      y: -40,
    });
  });

  // Animate each letter with stagger
  nonSpaceLetters.forEach((letter, i) => {
    const staggerDelay = i * 0.05; // 50ms stagger
    const duration = 0.6;

    const proxy = { progress: 0 };

    tl.to(
      proxy,
      {
        progress: 1,
        duration: duration,
        ease: "power3.out",
        onUpdate: () => {
          const { blur, scale, y, glowIntensity } = computeBlurVisuals(proxy.progress);

          gsap.set(letter, {
            filter: `blur(${blur}px)`,
            opacity: proxy.progress,
            scale: scale,
            y: y,
            textShadow: glowIntensity > 0.05
              ? `0 4px 30px rgba(${GOLD_GLOW}, ${glowIntensity * 0.5}), 0 0 60px rgba(${CYAN_GLOW}, ${glowIntensity * 0.25})`
              : "none",
          });
        },
        onComplete: () => {
          gsap.set(letter, {
            filter: "blur(0px)",
            opacity: 1,
            scale: 1,
            y: 0,
            textShadow: `0 4px 30px rgba(${GOLD_GLOW}, 0.3), 0 0 60px rgba(${CYAN_GLOW}, 0.15)`,
          });
        },
      },
      staggerDelay,
    );
  });
}, [characters]);
```

**Step 4: Update scroll handlers to use triggerBlurReveal**

Replace all instances of `triggerSpinCascade` with `triggerBlurReveal` in the scroll effect (lines 216-262).

**Step 5: Run tests**

Run: `npm test`
Expected: Tests may need updating - some will fail due to animation changes

**Step 6: Commit**

```bash
git add components/ui/HeroName.tsx
git commit -m "feat(hero): replace spin animation with blur-to-sharp reveal"
```

---

### Task 2.3: Add Gradient Underline to Hero Name

**Files:**
- Modify: `components/ui/HeroName.tsx:281-313`

**Step 1: Add underline element after the name span**

Update the return JSX to include the animated underline:

```tsx
return (
  <div ref={nameWrapperRef} className="relative">
    <h1
      className={cn(
        "text-[clamp(3rem,12vw,10rem)] font-bold leading-[1.1]",
        "text-ocean-800 dark:text-[#F5F5F5]",
        "mb-4",
        className,
      )}
      style={{ perspective: "1000px" }}
    >
      <span
        ref={containerRef}
        className="inline-flex flex-wrap justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {characters.map(({ char, isSpace, index }) => (
          <span
            key={index}
            ref={setLetterRef(index)}
            className={cn("inline-block", isSpace ? "w-[0.3em]" : "")}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            aria-hidden={isSpace ? "true" : undefined}
          >
            {isSpace ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="sr-only">{name}</span>
    </h1>
    {/* Animated gradient underline */}
    <div
      className="absolute left-1/2 -translate-x-1/2 h-1 rounded-full bg-gradient-to-r from-gold-500 to-cyan-500 animate-underline-sweep"
      style={{
        animationDelay: "0.4s",
        animationFillMode: "both",
      }}
    />
  </div>
);
```

**Step 2: Run dev and verify underline appears**

Run: `npm run dev`
Expected: Gradient underline sweeps in after name animation

**Step 3: Commit**

```bash
git add components/ui/HeroName.tsx
git commit -m "feat(hero): add animated gradient underline after name"
```

---

### Task 2.4: Update Hero Background for Drama

**Files:**
- Modify: `app/globals.css:242-274`

**Step 1: Update hero-bg dark mode styles**

Replace the hero-bg section:

```css
/* ===========================================
 * HERO BACKGROUND - Dramatic spotlight
 * =========================================== */
.hero-bg {
  position: relative;
  background: #f8fbfd;
}

/* Light mode: Subtle blue atmosphere */
.hero-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% 30%,
    rgba(72, 109, 138, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* Dark mode: True black with gold spotlight */
.dark .hero-bg {
  background: #030508;
}

.dark .hero-bg::before {
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(245, 166, 35, 0.06) 0%,
    transparent 70%
  );
}
```

**Step 2: Run dev and verify dark mode hero**

Run: `npm run dev`
Expected: Dark mode shows deep black with subtle gold spotlight

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(hero): update background for dramatic spotlight effect"
```

---

### Task 2.5: Update Hero Role Text Color

**Files:**
- Modify: `components/sections/Hero.tsx:35-37`

**Step 1: Change role to cyan accent**

Replace the role paragraph:

```tsx
{/* Role - Ocean for light, Cyan for dark */}
<p className="text-2xl md:text-3xl font-medium text-ocean-500 dark:text-cyan-400 mb-6">
  {siteMetadata.role}
</p>
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat(hero): update role text to cyan accent in dark mode"
```

---

### Task 2.6: Update Hero Buttons for Dual Accent

**Files:**
- Modify: `app/globals.css:276-353`

**Step 1: Update primary CTA for gold glow**

Replace btn-primary-cta section:

```css
/* ===========================================
 * CTA BUTTON - Gold with intense glow
 * =========================================== */
.btn-primary-cta {
  @apply relative overflow-hidden;
  @apply px-6 py-3 rounded-button font-medium;
  @apply transition-all duration-150 ease-smooth;
  background: linear-gradient(180deg, #FFBE2E 0%, #F5A623 50%, #D4890A 100%);
  color: #0C1219;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1),
    0 0 30px rgba(245, 166, 35, 0.4);
}

.btn-primary-cta:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1),
    0 0 40px rgba(245, 166, 35, 0.5);
}

.btn-primary-cta:active {
  transform: translateY(1px) scale(0.98);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(245, 166, 35, 0.3);
}

/* Glass sheen on hover */
.btn-primary-cta::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 80%
  );
  transition: left 0.5s ease;
  pointer-events: none;
}

.btn-primary-cta:hover::before {
  left: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .btn-primary-cta:hover::before {
    left: -100%;
  }
}

.dark .btn-primary-cta {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.15),
    0 0 40px rgba(245, 166, 35, 0.5),
    0 0 80px rgba(245, 166, 35, 0.2);
}

.dark .btn-primary-cta:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -2px 0 rgba(0, 0, 0, 0.15),
    0 0 50px rgba(245, 166, 35, 0.6);
}
```

**Step 2: Update secondary button for cyan accent**

Replace btn-secondary section:

```css
/* ===========================================
 * SECONDARY BUTTON - Cyan outline
 * =========================================== */
.btn-secondary {
  @apply relative px-6 py-3 rounded-button font-medium;
  @apply transition-all duration-150 ease-smooth;
  @apply bg-white text-ocean-800;
  @apply border border-ocean-500/35;
}

.dark .btn-secondary {
  background: transparent;
  color: #22D3EE;
  border-color: #06B6D4;
}

.btn-secondary:hover {
  @apply bg-ocean-400/10;
  @apply border-bronze-600/30;
  transform: translateY(-1px);
}

.dark .btn-secondary:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: #22D3EE;
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.35);
}

.btn-secondary:active {
  transform: translateY(0);
}
```

**Step 3: Run dev and verify button styles**

Run: `npm run dev`
Expected: Primary buttons glow gold, secondary buttons are cyan

**Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(buttons): update CTA buttons for dual gold/cyan accent"
```

---

## Phase 3: Content Sections

### Task 3.1: Update Card Styles for Drama

**Files:**
- Modify: `app/globals.css:104-154`

**Step 1: Replace card styles with dramatic hover**

```css
/* ===========================================
 * CARD STYLES - Dramatic hover with gradient border
 * =========================================== */
.card {
  @apply bg-sand-100 rounded-card;
  @apply shadow-card-light;
  @apply border border-ocean-300/15;
  @apply transition-all duration-250 ease-smooth;
  @apply relative overflow-hidden;
}

/* Dark mode: deep surface */
.dark .card {
  background: #0C1219;
  border: 1px solid #1a1f28;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

/* Card top highlight - subtle */
.card::before {
  content: "";
  @apply absolute top-0 left-0 right-0 h-[1px];
  background: linear-gradient(
    to right,
    transparent,
    rgba(212, 143, 78, 0.15),
    transparent
  );
}

.dark .card::before {
  background: linear-gradient(
    to right,
    transparent,
    rgba(245, 166, 35, 0.08),
    transparent
  );
}

.card:hover {
  @apply shadow-lift-light;
  transform: translateY(-4px);
}

/* Dark mode hover: gradient border effect */
.dark .card:hover {
  border-color: transparent;
  background:
    linear-gradient(#0C1219, #0C1219) padding-box,
    linear-gradient(135deg, #F5A623, #06B6D4) border-box;
  box-shadow:
    0 0 30px rgba(245, 166, 35, 0.15),
    0 0 30px rgba(6, 182, 212, 0.1),
    0 12px 32px rgba(0, 0, 0, 0.5);
}
```

**Step 2: Run dev and test card hover**

Run: `npm run dev`
Expected: Cards show gradient border glow on hover in dark mode

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(cards): add gradient border hover effect for dark mode"
```

---

### Task 3.2: Update Section Dividers

**Files:**
- Modify: `app/globals.css:386-406`

**Step 1: Update section divider for cyan accent**

```css
/* ===========================================
 * SECTION DIVIDER - Cyan accent
 * =========================================== */
.section-divider {
  @apply h-[1px] w-full;
  background: linear-gradient(
    to right,
    transparent,
    rgba(104, 116, 138, 0.24),
    transparent
  );
}

.dark .section-divider {
  background: linear-gradient(
    to right,
    transparent,
    rgba(6, 182, 212, 0.2),
    transparent
  );
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(sections): update dividers with cyan accent"
```

---

### Task 3.3: Update Text Hierarchy Classes

**Files:**
- Modify: `app/globals.css:504-516`

**Step 1: Update text content classes for new hierarchy**

```css
/* Text hierarchy for dark mode - three tiers */
.text-primary-content {
  @apply text-ocean-900 dark:text-[#F5F5F5];
}

.text-secondary-content {
  @apply text-ocean-500 dark:text-[#A0A0A0];
}

.text-tertiary-content {
  @apply text-ocean-400 dark:text-[#707070];
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(typography): update text hierarchy for contrast"
```

---

### Task 3.4: Update Focus States for Accessibility

**Files:**
- Modify: `app/globals.css:57-61`

**Step 1: Update focus-visible to use cyan**

```css
/* Focus styles for accessibility - cyan accent */
:focus-visible {
  @apply outline-2 outline-offset-2 outline-cyan-500;
}

.dark :focus-visible {
  @apply outline-cyan-400;
}
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(a11y): update focus states to cyan accent"
```

---

## Phase 4: Intensity Zones

### Task 4.1: Update CallToAction Component

**Files:**
- Modify: `components/sections/CallToAction.tsx:9-51`

**Step 1: Replace the entire component with dramatic styling**

```tsx
"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteMetadata } from "@/data/metadata";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function CallToAction() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container-content">
        <AnimateOnScroll
          variant="fade-up"
          className="relative rounded-2xl p-8 md:p-12 text-center bg-dark-surface dark:bg-dark-surface border border-[#1a1f28]"
        >
          {/* Gradient mesh background */}
          <div
            className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none animate-gradient-drift"
            style={{
              background: `
                radial-gradient(ellipse at 30% 50%, rgba(245, 166, 35, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
              `,
            }}
          />

          <div className="relative z-10">
            <h2 className="text-h2 text-[#F5F5F5] mb-4">
              Let&apos;s Build Something <span className="text-gold-400">Great</span> Together
            </h2>
            <p className="text-lg text-[#A0A0A0] mb-8 max-w-2xl mx-auto">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="btn-primary-cta"
              >
                <Link href="/contact">
                  Get In Touch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="btn-secondary"
              >
                <a href={`mailto:${siteMetadata.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {siteMetadata.email}
                </a>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/sections/CallToAction.tsx
git commit -m "feat(cta): add dramatic gradient mesh styling"
```

---

### Task 4.2: Update Footer with Gradient Border

**Files:**
- Modify: `components/sections/Footer.tsx:1-58`

**Step 1: Replace footer with dramatic styling**

```tsx
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteMetadata } from "@/data/metadata";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-dark-surface to-[#000000] border-t border-transparent"
      style={{
        borderImage: "linear-gradient(90deg, #F5A623, #06B6D4) 1",
      }}
    >
      <div className="container-content py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand and Copyright */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-bold text-[#F5F5F5] hover:text-gold-400 transition-colors"
            >
              Portfolio
            </Link>
            <p className="mt-1 text-sm text-[#707070]">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={siteMetadata.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#707070] hover:text-gold-400 hover:scale-110 transition-all duration-200"
              style={{
                filter: "drop-shadow(0 0 0px transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(245, 166, 35, 0.5))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "drop-shadow(0 0 0px transparent)";
              }}
              aria-label="GitHub profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={siteMetadata.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#707070] hover:text-gold-400 hover:scale-110 transition-all duration-200"
              style={{
                filter: "drop-shadow(0 0 0px transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(245, 166, 35, 0.5))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "drop-shadow(0 0 0px transparent)";
              }}
              aria-label="LinkedIn profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="p-2 rounded-lg text-[#707070] hover:text-gold-400 hover:scale-110 transition-all duration-200"
              style={{
                filter: "drop-shadow(0 0 0px transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(245, 166, 35, 0.5))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "drop-shadow(0 0 0px transparent)";
              }}
              aria-label="Send email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add components/sections/Footer.tsx
git commit -m "feat(footer): add gradient border and gold social hover"
```

---

### Task 4.3: Add Peak Intensity Submit Button Style

**Files:**
- Modify: `app/globals.css` (add after btn-secondary section)

**Step 1: Add submit button peak intensity class**

```css
/* ===========================================
 * SUBMIT BUTTON - Peak intensity (contact form)
 * =========================================== */
.btn-submit-peak {
  @apply relative overflow-hidden;
  @apply px-6 py-3 rounded-button font-semibold;
  @apply transition-all duration-200 ease-smooth;
  background: linear-gradient(180deg, #FFBE2E 0%, #F5A623 50%, #D4890A 100%);
  background-size: 200% 200%;
  animation: shimmerBg 3s ease-in-out infinite;
  color: #0C1219;
  box-shadow:
    0 0 40px rgba(245, 166, 35, 0.5),
    0 0 80px rgba(245, 166, 35, 0.2);
}

.btn-submit-peak:hover {
  transform: scale(1.03);
  animation-duration: 2s;
  box-shadow:
    0 0 50px rgba(245, 166, 35, 0.6),
    0 0 100px rgba(245, 166, 35, 0.25);
}

/* Light sweep effect */
.btn-submit-peak::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 80%
  );
  background-size: 200% 100%;
  animation: lightSweep 4s ease-in-out infinite;
  pointer-events: none;
}

.btn-submit-peak:hover::before {
  animation-duration: 2s;
}

@media (prefers-reduced-motion: reduce) {
  .btn-submit-peak {
    animation: none;
  }
  .btn-submit-peak::before {
    animation: none;
  }
}

.btn-submit-peak:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  animation: none;
}

.btn-submit-peak:disabled::before {
  animation: none;
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(buttons): add peak intensity submit button style"
```

---

### Task 4.4: Update Contact Form to Use Peak Submit

**Files:**
- Modify: `app/contact/page.tsx:317-333`

**Step 1: Update the submit button**

Replace the Button component:

```tsx
{/* Submit Button - Peak Intensity */}
<button
  type="submit"
  className="w-full btn-submit-peak h-12 text-base"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    "Sending..."
  ) : (
    <span className="inline-flex items-center gap-2">
      Send Message
      <ArrowRight className="w-4 h-4" />
    </span>
  )}
</button>
```

**Step 2: Run dev and verify submit button**

Run: `npm run dev`
Expected: Submit button has shimmer animation and intense glow

**Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat(contact): use peak intensity submit button"
```

---

### Task 4.5: Update Contact Form Input Focus States

**Files:**
- Modify: `app/contact/page.tsx:244-247, 264-268, 297-301`

**Step 1: Update input focus to use cyan glow**

For each input, update the className to include cyan focus:

```tsx
className={`w-full px-4 py-2 rounded-button border
  bg-dark-elevated dark:bg-dark-elevated
  text-[#F5F5F5] dark:text-[#F5F5F5]
  placeholder:text-[#707070] dark:placeholder:text-[#707070]
  focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
  focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]
  transition-all duration-180
  ${errors.email ? "border-error-500" : "border-[#1a1f28] dark:border-[#1a1f28]"}`}
```

**Step 2: Run dev and verify input focus**

Run: `npm run dev`
Expected: Inputs show cyan glow on focus

**Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat(contact): add cyan glow to form input focus states"
```

---

## Phase 5: Polish

### Task 5.1: Add Custom Scrollbar

**Files:**
- Modify: `app/globals.css` (add at end of @layer base)

**Step 1: Add scrollbar styles before closing @layer base**

```css
/* ===========================================
 * CUSTOM SCROLLBAR
 * =========================================== */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #030508;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #F5A623, #06B6D4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #FFBE2E, #22D3EE);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #F5A623 #030508;
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(polish): add gradient custom scrollbar"
```

---

### Task 5.2: Add Selection Highlight

**Files:**
- Modify: `app/globals.css` (add in @layer base)

**Step 1: Add selection styles**

```css
/* ===========================================
 * SELECTION HIGHLIGHT
 * =========================================== */
::selection {
  background: rgba(6, 182, 212, 0.3);
  color: #F5F5F5;
}

::-moz-selection {
  background: rgba(6, 182, 212, 0.3);
  color: #F5F5F5;
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(polish): add cyan selection highlight"
```

---

### Task 5.3: Update Noise Overlay Opacity

**Files:**
- Modify: `app/globals.css:46-55`

**Step 1: Reduce noise overlay opacity**

```css
/* Global noise overlay - more subtle */
.dark body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.01;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(polish): reduce noise overlay opacity"
```

---

### Task 5.4: Run Full Test Suite

**Files:**
- None (verification only)

**Step 1: Run all tests**

Run: `npm test`
Expected: Tests pass (some may need updates for animation changes)

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: No type errors

---

### Task 5.5: Update HeroName Tests for New Animation

**Files:**
- Modify: `components/ui/__tests__/HeroName.test.tsx`

**Step 1: Update test expectations for blur animation**

Update tests that check for spin animation to check for blur animation instead:

```tsx
// Update test descriptions and assertions to match new blur-to-sharp behavior
// Replace references to "spin" with "blur reveal"
// Update GSAP mock expectations
```

**Step 2: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add components/ui/__tests__/HeroName.test.tsx
git commit -m "test(hero): update tests for blur-to-sharp animation"
```

---

### Task 5.6: Final Visual QA

**Files:**
- None (manual verification)

**Step 1: Start dev server**

Run: `npm run dev`

**Step 2: Verify checklist**

- [ ] Hero name is large and animates with blur-to-sharp
- [ ] Gradient underline sweeps in after name
- [ ] Role text is cyan in dark mode
- [ ] Primary buttons glow gold
- [ ] Secondary buttons are cyan outline
- [ ] Cards show gradient border on hover (dark mode)
- [ ] Contact submit button has shimmer animation
- [ ] Footer has gradient top border
- [ ] Social icons glow gold on hover
- [ ] Scrollbar is gold-to-cyan gradient
- [ ] Text selection is cyan

**Step 3: Commit any final fixes**

```bash
git add .
git commit -m "fix: final visual polish adjustments"
```

---

## Summary

This plan implements the Contrast & Drama redesign in 5 phases with 22 tasks:

1. **Phase 1 (5 tasks):** Foundation - color tokens, shadows, animations, CSS variables
2. **Phase 2 (6 tasks):** Hero - typography, blur animation, underline, buttons
3. **Phase 3 (4 tasks):** Content - cards, dividers, text hierarchy, focus states
4. **Phase 4 (5 tasks):** Intensity - CTA, footer, submit button, form inputs
5. **Phase 5 (6 tasks):** Polish - scrollbar, selection, noise, tests, QA

Each task is atomic and can be committed independently. Tests should be run after each phase to catch regressions early.
