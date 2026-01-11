# Interactive Hero System — Design Specification

> **For Claude:** Use superpowers:writing-plans to create implementation plan from this design.

## Overview & Goals

Transform the portfolio hero section into an interactive, memorable experience that rewards curiosity while maintaining premium credibility.

**Primary emotion:** Premium & Impressive (sleek, cinematic)
**Secondary layers:** Technical Showcase (depth, not noise) → Playful (small moments) → Chaotic (Easter-egg tier)

**Core principle:** Scope = Meaning. The rarer the effect, the farther it's allowed to travel.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Scroll + Viewport Controller                                 │
│     ├── Sticky behavior (end: "+=100%", recalculated on resize) │
│     ├── Parallax exit orchestration                             │
│     ├── Viewport intensity (Full/Reduced/Frozen + hysteresis)   │
│     └── Perf Gate                                               │
│           • WebGL render loop control (debounced 150ms)         │
│           • DPR caps (2.0 max Full, 1.0 Reduced)                │
│           • prefers-reduced-motion → disable WebGL              │
│           • Tab visibility pause                                │
│           • Low-power advisory mode (reduced fidelity)          │
├─────────────────────────────────────────────────────────────────┤
│  2. WebGL Overlay Renderer (PixiJS v8)                          │
│     • Transparent canvas between background and DOM             │
│     • Receives theme palette tokens                             │
│     • Signature trio: ripple (displacement), sweep, vignette    │
│     • Paused when hero < 0.45 visible                           │
├─────────────────────────────────────────────────────────────────┤
│  3. Letter Event Layer (DOM)                                    │
│     • Click/hover handlers per letter                           │
│     • Emits hero-local normalized coords + canvas px            │
│     • Scroll-linked: continuous (velocity-based)                │
│     • Click: discrete (always plays to completion)              │
├─────────────────────────────────────────────────────────────────┤
│  4a. Effect Catalog                                             │
│     • Tier 1: 8 effects (70% transform, 20% material, 10% type) │
│     • Tier 2: 3 viewport effects (signature)                    │
│     • Tier 3: 2 persistent rewards                              │
│     • Each declares: tier, weight, cooldown, channels, duration │
├─────────────────────────────────────────────────────────────────┤
│  4b. Effect Runner                                              │
│     • Builds GSAP timelines (useGSAP hook + cleanup)            │
│     • Dispatches WebGL payloads                                 │
│     • FOUC prevention: visibility:hidden → autoAlpha            │
│     • Never cancels mid-animation                               │
├─────────────────────────────────────────────────────────────────┤
│  5. State Machine + Channel Locks                               │
│     ├── Interaction counter                                     │
│     ├── Effect history (no same effect 2x in a row)            │
│     ├── Cooldown timers per tier                                │
│     ├── Time on page gate (Tier 2 requires ≥8s OR scroll intent)│
│     └── Channel locks (soft/hard):                              │
│           • letters:hard (exclusive transforms)                 │
│           • letters:transform-soft (transform-exclusive only)   │
│           • letters:soft (can overlap anything)                 │
│           • heroLighting:soft/hard                              │
│           • viewportCamera:soft/hard                            │
│           • webglOverlay:soft/hard                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Model

### Visibility Thresholds (with hysteresis)

| State | Enter When | Exit When | Behavior |
|-------|------------|-----------|----------|
| Full | visibility ≥ 0.70 | drops below 0.65 | All effects, full intensity |
| Reduced | 0.50–0.69 | rises to 0.70 OR drops to 0.45 | Tier 1 only, 50% intensity, WebGL reduced fidelity |
| Frozen | < 0.45 | rises above 0.50 | Effects denied, WebGL paused |

### Cooldowns & Unlock Rules

| Tier | Unlock | Global Cooldown | Additional Rules |
|------|--------|-----------------|------------------|
| 1 | Always | None | Soft locks allow compatible overlaps |
| 2 | 5+ interactions AND (timeOnPage ≥ 8s OR scrollIntent) | 8–12s randomized | No same Tier 2 twice in a row, never on reverse scroll |
| 3 | 10+ interactions | Once per session | Easter-egg tier, requires intent |

### Frozen Queue Policy

- Max 1 queued event (last click only)
- Queue expires after 2 seconds
- Immediate feedback: subtle opacity dip acknowledgment

### Panic Reset Triggers

On resize, orientationchange, route change, or hot reload:
- Kill all GSAP timelines
- Clear all transforms via `gsap.set()`
- Release all channel locks
- WebGL: clear effect queue, render blank frame
- Return to clean rest state

---

## Effect Catalog

### Tier 1 — Local Effects (8 total)

| Effect | Trigger | Channels | Duration | Easing | Weight |
|--------|---------|----------|----------|--------|--------|
| **Elastic Bounce** | Click | letters:transform-soft | 600ms | elastic.out(1, 0.3) | 20% |
| **3D Flip X** | Click | letters:transform-soft | 500ms | power2.inOut | 15% |
| **3D Flip Y** | Click | letters:transform-soft | 500ms | power2.inOut | 12% |
| **Rubber Stretch** | Click | letters:hard | 700ms | elastic.out(1, 0.4) | 13% |
| **Gold Glow Pulse** | Click | heroLighting:soft | 400ms | power1.out | 15% |
| **Ocean Electric** | Click | heroLighting:soft | 300ms | power3.out | 10% |
| **Weight Morph** | Click | letters:soft | 400ms | power2.inOut | 8% |
| **Neighbor Ripple** | Click | letters:soft | 800ms | power2.out + stagger | 7% |

**Flip Rotation:** 320° (not 360°) to avoid thin-frame blink.

**Ocean Electric:** Uses ocean-400 → ocean-200 flash (stays in palette).

**Intensity Scaling:**
- Full: 100%
- Reduced: 60%
- Frozen: Skip

### Tier 2 — Viewport Effects (3 total)

| Effect | Channels | Duration | Weight | Implementation |
|--------|----------|----------|--------|----------------|
| **Refraction Ripple** | webglOverlay:hard, viewportCamera:soft | 500ms | 50% | Displacement filter |
| **Light Sweep** | webglOverlay:hard, heroLighting:hard | 600ms | 35% | Gradient sprite + mask |
| **Vignette Pulse** | webglOverlay:hard | 400ms | 15% | Radial gradient sprite |

**Conditions:** Hero ≥ 0.70 visible, no Tier 2 in last 8–12s, not reverse scroll.

**Override Rule:** Hard heroLighting lock gracefully returns running soft effects to baseline first.

**Concurrency:** Tier 2 effects are never concurrent (max 1).

### Tier 3 — Persistent Rewards (2 total)

| Effect | Trigger | Duration | Description |
|--------|---------|----------|-------------|
| **Ambient Caustics** | 10+ interactions | Session-persistent | Slow caustic drift on WebGL overlay |
| **Cursor Particle Trail** | Click all letters (Easter egg) | Session-persistent | 5–8 particles follow cursor with decay |

**Perf:** State persists, but render loop still pauses when hero < 0.50 visible.

---

## Scroll Specification

### Sticky Behavior

| Property | Value |
|----------|-------|
| Pin trigger | Hero top hits viewport top |
| Pin end | `"+=100%"` (relative, recalculated on resize) |
| Pin spacing | `true` (reserve space, prevent layout jump) |
| Engagement rule | Pin only if hero ≥ 0.50 visible when scroll intent occurs |

### Scroll Intent Detection ("Wake")

| Event | Threshold | Result |
|-------|-----------|--------|
| `wheel` | deltaY > 3 | scrollIntentDetected = true |
| `touchmove` | deltaY > 10px | scrollIntentDetected = true |
| `scroll` | scrollY > 10 | scrollIntentDetected = true |

**On wake:** Letters perform subtle spin-up cascade (50ms stagger, 500ms duration).

### Scroll-Linked Properties (3 max)

| Property | Influence | Behavior |
|----------|-----------|----------|
| Letter rotation velocity | Scroll velocity (px/s → °/s) | Clamped at 180°/s, decays to rest in 300ms |
| Divider shimmer position | Scroll progress | Shifts gradient 0–100% |
| Background glow intensity | Scroll velocity | 0.06–0.12 opacity, 200ms decay |

### Parallax Exit

After pin releases, layers exit at different speeds:

| Layer | Speed | Notes |
|-------|-------|-------|
| Background gradient | 0.3x | Lags most |
| WebGL overlay | 0.5x | Medium lag |
| Name text | 0.7x | Slight lag |
| Divider | 0.8x | Nearly synced |
| Buttons | 1.0x | Normal |

Parallax visible for ~200px after release. Easing: `power1.out`.

### Reverse Scroll Rules

- Tier 2 and Tier 3 effects never trigger while scroll direction is up
- Tier 1 clicks allowed but with Reduced intensity damping
- Parallax layers re-converge at 1.5x normal rate
- No new "wake" cascade on re-entry (already awake)

---

## WebGL Overlay Specification

### Technology

**PixiJS v8** — optimized for 2D, excellent filter system, ~150KB bundle.

### Canvas Setup

```
position: absolute
inset: 0
pointer-events: none
z-index: between background and DOM content
opacity: controlled by intensity state
```

**Resolution:**
- Full: `devicePixelRatio` (capped at 2.0)
- Reduced: DPR capped at 1.0, optional 30fps throttle
- Frozen: Canvas hidden, render loop stopped

### Coordinate Space

Coordinates normalized within **hero canvas bounds** (not full window).

Store both:
- `uv`: hero-local normalized space [0,1]
- `px`: canvas pixels (computed at dispatch time)

### Effect Queue

```typescript
interface WebGLEffect {
  type: 'ripple' | 'sweep' | 'vignette';
  position: { uv: [number, number]; px: [number, number] };
  intensity: number;  // 0.0–1.0
  startTime: number;  // performance.now()
}
```

- FIFO queue, max 3 concurrent
- Drop oldest when 4th arrives (keeps interactions responsive)
- Tier 2 effects: max 1 concurrent (channel locks enforce this)

### Signature Effects

**Refraction Ripple**
- Type: Displacement filter
- Origin: Click position (hero-local)
- Expansion: 0 → 1.5 canvas units over 500ms
- Distortion: Peak at ring edge
- Easing: `power2.out` on radius, linear on alpha

**Light Sweep**
- Type: Gradient sprite with mask (no shader needed)
- Direction: Left → right (or from click origin)
- Width: 20% of viewport
- Color: `bronzeGlow` at 15% opacity (from theme palette)
- Duration: 600ms

**Vignette Pulse**
- Type: Radial gradient sprite (no shader needed)
- Origin: Viewport center
- Color: `oceanDeep` tinted edges (not black), opacity scales by theme
- Peak opacity: 0.25 (dark mode), 0.15 (light mode)
- Duration: 400ms (in 150ms, hold 100ms, out 150ms)

### Theme Integration

WebGL receives `themePalette` object:
```typescript
{
  oceanDeep: '#0d4d79',
  oceanMid: '#336588',
  bronzeGlow: '#F5A623',
  sandText: '#f4d390'
}
```

### Performance Controls

| Trigger | Action |
|---------|--------|
| Hero < 0.45 visible | renderer.stop(), opacity → 0 (debounced 150ms) |
| Hero ≥ 0.50 visible | renderer.start(), opacity → 1 (debounced 150ms) |
| document.hidden | renderer.stop() |
| prefers-reduced-motion | Disable WebGL entirely |
| Low-power advisory | Reduced fidelity (DPR 1.0, 30fps) |

**Low-power detection (advisory, not absolute):**
```javascript
navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 4
```

### Cleanup

Destroy Pixi application cleanly on unmount. Avoid manual context loss unless required. Let browser GC handle context cleanup.

---

## Fallbacks

### prefers-reduced-motion

- Skip all animations
- Render static hero (current blur-to-sharp disabled)
- No WebGL overlay
- Click feedback: subtle opacity change only

### No WebGL Support

- Tier 1 effects work normally (GSAP + CSS)
- Tier 2 viewport effects: CSS-only fallbacks
  - Ripple → brief box-shadow pulse
  - Sweep → CSS gradient animation
  - Vignette → CSS radial gradient
- Tier 3 disabled

### Low Power Mode

- All effects at Reduced intensity
- WebGL at 30fps, DPR 1.0
- Tier 2 cooldown extended to 15s
- Tier 3 disabled

---

## Testing Plan

### Deterministic Randomness

- Seed random effect selection for reproducible tests
- Verify weight distribution over 1000 samples
- Confirm "no same effect twice" rule

### State & Lock Tests

- Verify channel lock enforcement
- Test cooldown timers
- Verify tier unlock thresholds
- Test queue expiry behavior

### ScrollTrigger Behavior

- Test pin engagement at 0.50 visibility threshold
- Verify parallax exit speeds
- Test reverse scroll rules
- Verify panic reset on resize

### WebGL Tests

- Verify coordinate alignment (ripple origin matches click)
- Test performance gate transitions
- Verify cleanup on unmount (no memory leaks)
- Test theme palette injection

### Accessibility

- Verify reduced-motion fallback
- Test keyboard navigation
- Verify focus states during effects

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] State machine with visibility tracking
- [ ] Channel lock system
- [ ] Effect catalog data structure
- [ ] FOUC prevention (autoAlpha pattern)

### Phase 2: Tier 1 Effects
- [ ] Letter click handlers
- [ ] 8 Tier 1 GSAP animations
- [ ] Soft/hard lock enforcement
- [ ] Effect history tracking

### Phase 3: Scroll System
- [ ] ScrollTrigger pin setup
- [ ] Wake detection
- [ ] Scroll-linked property bindings
- [ ] Parallax exit

### Phase 4: WebGL Overlay
- [ ] PixiJS setup with React integration
- [ ] Refraction ripple displacement filter
- [ ] Light sweep gradient
- [ ] Vignette pulse
- [ ] Theme palette integration

### Phase 5: Tier 2 & 3
- [ ] Viewport effect triggers
- [ ] Time-on-page gate
- [ ] Tier 3 Easter egg detection
- [ ] Persistent reward state

### Phase 6: Polish
- [ ] Fallback implementations
- [ ] Performance profiling
- [ ] Cross-browser testing
- [ ] Mobile testing
