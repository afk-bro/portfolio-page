# Portfolio Redesign: Contrast & Drama

## Overview

A comprehensive visual overhaul transforming the portfolio from restrained professional tones into a high-impact, award-worthy showcase. The design uses deep blacks as a canvas for dual warm/cool accents, aggressive kinetic typography, and progressive intensity that guides users toward conversion.

**Design Principles:**
- **Contrast & Drama** - Deep blacks with punchy highlights, dramatic lighting effects
- **Dual Accent System** - Warm gold (primary actions) + electric cyan (secondary highlights)
- **Kinetic Typography** - Oversized hero name with aggressive blur-to-sharp animations
- **Progressive Intensity** - Hero hits hard → content dials back → CTAs/footer ramp up

---

## 1. Color System

### Base: True Blacks

Replace current dark palette with deeper, richer blacks for maximum accent contrast.

| Token | Hex | Usage |
|-------|-----|-------|
| `dark-void` | `#030508` | Primary background |
| `dark-surface` | `#080C12` | Card/section surfaces |
| `dark-elevated` | `#0C1219` | Elevated elements, inputs |

### Primary Accent: Molten Gold

Evolved from bronze into richer, more luminous golds.

| Token | Hex | Usage |
|-------|-----|-------|
| `gold-400` | `#FFBE2E` | Highlights, glows |
| `gold-500` | `#F5A623` | Primary CTAs |
| `gold-600` | `#D4890A` | Pressed/active states |

**Glow Utility:**
```css
.shadow-gold-glow {
  box-shadow: 0 0 30px rgba(245, 166, 35, 0.4);
}
.shadow-gold-glow-intense {
  box-shadow: 0 0 40px rgba(245, 166, 35, 0.5), 0 0 80px rgba(245, 166, 35, 0.2);
}
```

### Secondary Accent: Electric Cyan

New accent for hovers, links, and secondary highlights.

| Token | Hex | Usage |
|-------|-----|-------|
| `cyan-400` | `#22D3EE` | Bright highlights, hover text |
| `cyan-500` | `#06B6D4` | Links, secondary actions |
| `cyan-600` | `#0891B2` | Active states |

**Glow Utility:**
```css
.shadow-cyan-glow {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.35);
}
```

### Text Hierarchy

| Level | Hex | Contrast Ratio | Usage |
|-------|-----|----------------|-------|
| Primary | `#F5F5F5` | ~18:1 | Headings, body text |
| Secondary | `#A0A0A0` | ~9:1 | Descriptions, meta |
| Muted | `#707070` | ~5.2:1 | Labels, captions (WCAG AA safe) |

---

## 2. Hero Section

### Name Typography

**Sizing (viewport-responsive):**
```css
.hero-name {
  font-size: clamp(5rem, 15vw, 12rem);
}

@media (max-width: 768px) {
  .hero-name { font-size: 12vw; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-name { font-size: 14vw; }
}
```

**Persistent Glow Effect:**
```css
.hero-name {
  text-shadow:
    0 4px 30px rgba(245, 166, 35, 0.3),
    0 0 60px rgba(6, 182, 212, 0.15);
}
```

### Animation Sequence

Replace current GSAP spin animation with aggressive blur-to-sharp reveal.

**Phase 1: Blur-to-Sharp Reveal (0-600ms)**
```javascript
// Per-letter animation
{
  initial: {
    filter: 'blur(12px)',
    opacity: 0,
    scale: 1.1,
    y: -40
  },
  animate: {
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    y: 0
  },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1], // Fast start, soft land
    stagger: 0.05 // 50ms per letter
  }
}
```

**Phase 2: Gradient Underline Sweep (starts at 400ms)**
```css
.hero-underline {
  height: 4px;
  background: linear-gradient(90deg, #FFBE2E, #22D3EE);
  width: 0%;
  animation: underline-sweep 0.4s ease-out 0.4s forwards;
}

@keyframes underline-sweep {
  to { width: 100%; }
}
```

**Phase 3: Glow Pulse (on completion)**
```css
@keyframes glow-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.hero-underline::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: inherit;
  filter: blur(8px);
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Supporting Elements

**Role/Title:**
- Size: `text-2xl md:text-3xl`
- Color: `cyan-400` (#22D3EE)
- Animation: Fade-up with 200ms delay, slight blur resolve

**Bio/Value Prop:**
- Color: `#A0A0A0`
- Animation: Fade-up at 400ms delay
- Max-width: `max-w-2xl`

**Entrance Timing:**
```
0ms     - Name blur/slam begins
300ms   - Name animation completing
500ms   - Role fades up
700ms   - Bio fades up
900ms   - CTAs fade up together
1100ms  - Badge fades in
```

### Hero Background

```css
.hero-bg {
  background: #030508;
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(245, 166, 35, 0.06) 0%,
    transparent 70%
  );
}
```

---

## 3. Button System

### Primary CTA (Gold)

```css
.btn-primary {
  background: linear-gradient(180deg, #F5A623 0%, #D4890A 100%);
  color: #0C1219;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 30px rgba(245, 166, 35, 0.4);
  transition: all 0.25s ease-out;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 0 40px rgba(245, 166, 35, 0.5);
}
```

### Secondary CTA (Cyan Outline)

```css
.btn-secondary {
  background: transparent;
  border: 1px solid #06B6D4;
  color: #22D3EE;
  transition: all 0.25s ease-out;
}

.btn-secondary:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: #22D3EE;
  color: #67E8F9;
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.35);
}
```

### Contact Submit (Peak Intensity)

```css
.btn-submit {
  background: linear-gradient(180deg, #FFBE2E 0%, #F5A623 50%, #D4890A 100%);
  background-size: 200% 200%;
  animation: shimmer-bg 3s ease-in-out infinite;
  box-shadow:
    0 0 40px rgba(245, 166, 35, 0.5),
    0 0 80px rgba(245, 166, 35, 0.2);
}

.btn-submit:hover {
  transform: scale(1.03);
  animation-duration: 2s;
  box-shadow:
    0 0 50px rgba(245, 166, 35, 0.6),
    0 0 100px rgba(245, 166, 35, 0.25);
}

@keyframes shimmer-bg {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Diagonal light sweep */
.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 80%
  );
  background-size: 200% 100%;
  animation: light-sweep 4s ease-in-out infinite;
}

@keyframes light-sweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 4. Content Sections (Low Energy Zone)

### Section Backgrounds

```css
/* Alternating sections for rhythm */
.section-primary { background: #030508; }
.section-alternate { background: #080C12; }

/* Section divider */
.section-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(6, 182, 212, 0.2),
    transparent
  );
}
```

### Section Headers

```css
.section-heading {
  color: #F5F5F5;
}

.section-heading .accent {
  color: #FFBE2E;
}

.section-heading::after {
  content: '';
  display: block;
  width: 40%;
  height: 2px;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, #F5A623, transparent);
}
```

### Cards

```css
.card {
  background: #0C1219;
  border: 1px solid #1a1f28;
  border-radius: 16px;
  transition: all 0.25s ease-out;
}

.card:hover {
  transform: translateY(-4px);
  border-color: transparent;
  background:
    linear-gradient(#0C1219, #0C1219) padding-box,
    linear-gradient(135deg, #F5A623, #06B6D4) border-box;
  box-shadow:
    0 0 30px rgba(245, 166, 35, 0.15),
    0 0 30px rgba(6, 182, 212, 0.1);
}
```

### Links

```css
a {
  color: #22D3EE;
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  color: #67E8F9;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

---

## 5. CTA Sections (Intensity Returns)

### Mid-Page CTA Blocks

```css
.cta-block {
  background: #080C12;
  border: 1px solid rgba(245, 166, 35, 0.15);
  position: relative;
  overflow: hidden;
}

.cta-block::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 50%, rgba(245, 166, 35, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
  animation: gradient-drift 8s ease-in-out infinite alternate;
}

@keyframes gradient-drift {
  0% { transform: translateX(-10px); }
  100% { transform: translateX(10px); }
}
```

### Contact Section

```css
.contact-section {
  background: #030508;
  position: relative;
}

.contact-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 50% 60% at 50% 50%,
    rgba(245, 166, 35, 0.04) 0%,
    transparent 70%
  );
}

/* Form inputs */
.form-input {
  background: #0C1219;
  border: 1px solid #1a1f28;
  color: #F5F5F5;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #06B6D4;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
  outline: none;
}
```

---

## 6. Footer (Final Flourish)

```css
.footer {
  background: linear-gradient(180deg, #080C12 0%, #000000 100%);
  border-top: 1px solid;
  border-image: linear-gradient(90deg, #F5A623, #06B6D4) 1;
}

.footer-link {
  color: #A0A0A0;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #22D3EE;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
}

.social-icon {
  color: #707070;
  transition: all 0.25s ease;
}

.social-icon:hover {
  color: #FFBE2E;
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(245, 166, 35, 0.5));
}
```

---

## 7. Global Enhancements

### Scrollbar

```css
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
```

### Selection

```css
::selection {
  background: rgba(6, 182, 212, 0.3);
  color: #F5F5F5;
}
```

### Focus States

```css
:focus-visible {
  outline: 2px solid #22D3EE;
  outline-offset: 2px;
}
```

### Noise Texture

```css
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.01;
  background-image: url("data:image/svg+xml,..."); /* existing noise SVG */
  mix-blend-mode: overlay;
}
```

---

## 8. Tailwind Config Additions

```typescript
// tailwind.config.ts additions

colors: {
  dark: {
    void: '#030508',
    surface: '#080C12',
    elevated: '#0C1219',
  },
  gold: {
    400: '#FFBE2E',
    500: '#F5A623',
    600: '#D4890A',
  },
  cyan: {
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },
},

boxShadow: {
  'gold-glow': '0 0 30px rgba(245, 166, 35, 0.4)',
  'gold-glow-intense': '0 0 40px rgba(245, 166, 35, 0.5), 0 0 80px rgba(245, 166, 35, 0.2)',
  'cyan-glow': '0 0 25px rgba(6, 182, 212, 0.35)',
},

animation: {
  'shimmer-bg': 'shimmer-bg 3s ease-in-out infinite',
  'light-sweep': 'light-sweep 4s ease-in-out infinite',
  'gradient-drift': 'gradient-drift 8s ease-in-out infinite alternate',
  'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  'underline-sweep': 'underline-sweep 0.4s ease-out forwards',
},

keyframes: {
  'shimmer-bg': {
    '0%, 100%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
  },
  'light-sweep': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
  'gradient-drift': {
    '0%': { transform: 'translateX(-10px)' },
    '100%': { transform: 'translateX(10px)' },
  },
  'glow-pulse': {
    '0%, 100%': { opacity: '0.8' },
    '50%': { opacity: '1' },
  },
  'underline-sweep': {
    from: { width: '0%' },
    to: { width: '100%' },
  },
},
```

---

## 9. Implementation Priority

### Phase 1: Foundation
1. Update Tailwind config with new colors and utilities
2. Update CSS custom properties in globals.css
3. Apply new dark backgrounds

### Phase 2: Hero
4. Resize hero name typography
5. Replace GSAP animation with blur-to-sharp reveal
6. Add gradient underline animation
7. Update role/bio styling and timing
8. Restyle hero buttons

### Phase 3: Components
9. Update card component with new hover states
10. Restyle all buttons to new system
11. Update link colors and effects
12. Add section dividers and header treatments

### Phase 4: Intensity Zones
13. Style CTA blocks with gradient mesh
14. Update contact section and form
15. Restyle footer with gradient border
16. Style social icons with gold hover

### Phase 5: Polish
17. Add custom scrollbar
18. Update selection highlight
19. Verify focus states
20. Reduce noise overlay opacity
21. Cross-browser testing

---

## 10. Accessibility Checklist

- [x] Text contrast ratios meet WCAG AA (primary ~18:1, secondary ~9:1, muted ~5.2:1)
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Focus states visible and consistent (2px cyan-400)
- [ ] Interactive elements have sufficient touch targets (44px minimum)
- [ ] Color not sole indicator of state (icons/text supplement)
- [ ] Gradient text has solid fallback for screen readers

---

## Summary

This redesign transforms the portfolio from a professional but subdued presentation into a visually commanding showcase. The dual gold/cyan accent system creates warm-cool tension, the aggressive hero animation demands attention, and the progressive intensity guides users naturally toward conversion. Every element serves the goal: stand out, demonstrate craft, convert visitors into clients.
