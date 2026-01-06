# Visual Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the site feel calmer, more intentional, and more expensive through reduced visual noise, clearer hierarchy, and better spacing.

**Architecture:** CSS-first changes via globals.css and Tailwind classes in section components. No new features or pages. Design north star: "This site should feel like a well-architected system: calm, intentional, and quietly powerful."

**Tech Stack:** Tailwind CSS, Next.js React components, CSS custom properties

---

## Task 1: Remove Horizontal Band Backgrounds from Sections

**Files:**

- Modify: `components/sections/Skills.tsx:28`
- Modify: `components/sections/ProofStrip.tsx:35`
- Modify: `components/sections/HowIBuild.tsx:29-31`

**Context:** The repeated dark/blue horizontal gradients are visually loud and competing with content. Rule: Header = strong, Footer = strong, everything else = subtle/transparent.

**Step 1: Update Skills section background**

In `components/sections/Skills.tsx`, line 28, change:

```tsx
// FROM:
<section className="section relative bg-sand-300/30 dark:bg-dark-surface">

// TO:
<section className="section relative bg-transparent">
```

**Step 2: Update ProofStrip section background**

In `components/sections/ProofStrip.tsx`, line 35, change:

```tsx
// FROM:
<section className="relative py-16 bg-ocean-50 dark:bg-dark-surface">

// TO:
<section className="relative py-20 bg-transparent">
```

Note: Also increased `py-16` to `py-20` for breathing room (Task 2 prereq).

**Step 3: Update HowIBuild section background**

In `components/sections/HowIBuild.tsx`, lines 29-31, change:

```tsx
// FROM:
<section
  id="how-i-build"
  className="section bg-neutral-50 dark:bg-neutral-800/30"
>

// TO:
<section
  id="how-i-build"
  className="section bg-transparent"
>
```

**Step 4: Verify changes**

Run: `pnpm dev`
Expected: Sections blend together with page background instead of banding.

**Step 5: Commit**

```bash
git add components/sections/Skills.tsx components/sections/ProofStrip.tsx components/sections/HowIBuild.tsx
git commit -m "style: remove horizontal band backgrounds from sections

Sections now use transparent backgrounds, letting the page bg do
the work. Header and footer remain as the only strong visual bands."
```

---

## Task 2: Increase Vertical Breathing Room Globally

**Files:**

- Modify: `app/globals.css:100-101`
- Modify: `components/sections/FeaturedProjects.tsx:40`
- Modify: `components/sections/Skills.tsx:56`
- Modify: `components/sections/HowIBuild.tsx:40`

**Context:** Content is vertically compressed, making it feel busier. Apply +20-30% to section padding, +10-15% to gaps.

**Step 1: Update global section spacing**

In `app/globals.css`, lines 100-101, change:

```css
/* FROM: */
.section {
  @apply py-16 md:py-24;
}

/* TO: */
.section {
  @apply py-20 md:py-32;
}
```

**Step 2: Update FeaturedProjects grid gap**

In `components/sections/FeaturedProjects.tsx`, line 40, change:

```tsx
// FROM:
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// TO:
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
```

**Step 3: Update Skills grid gap**

In `components/sections/Skills.tsx`, line 56, change:

```tsx
// FROM:
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

// TO:
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
```

**Step 4: Update HowIBuild grid gap**

In `components/sections/HowIBuild.tsx`, line 40, change:

```tsx
// FROM:
<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">

// TO:
<div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
```

**Step 5: Verify changes**

Run: `pnpm dev`
Expected: Sections feel more spacious, content has room to breathe.

**Step 6: Commit**

```bash
git add app/globals.css components/sections/FeaturedProjects.tsx components/sections/Skills.tsx components/sections/HowIBuild.tsx
git commit -m "style: increase vertical breathing room

Section padding py-16/24 -> py-20/32
Grid gaps 6/8 -> 8/10
Signals senior design taste without changing content."
```

---

## Task 3: Create Text Hierarchy Utility Classes

**Files:**

- Modify: `app/globals.css` (add new utilities)

**Context:** Body text is too bright in dark mode, secondary labels compete for attention. Create three clear tiers for dark mode text.

**Step 1: Add text hierarchy utilities**

In `app/globals.css`, after line 440 (end of @layer components), add inside @layer utilities (before the closing brace around line 500):

```css
/* Text hierarchy for dark mode - three tiers */
.text-primary-content {
  @apply text-ocean-900 dark:text-sand-100;
}

.text-secondary-content {
  @apply text-ocean-500 dark:text-sand-100/70;
}

.text-tertiary-content {
  @apply text-ocean-400 dark:text-sand-100/50;
}
```

**Step 2: Verify the classes compile**

Run: `pnpm build`
Expected: Build succeeds without errors.

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add text hierarchy utility classes

Three tiers: primary (100), secondary (70%), tertiary (50%)
Makes headings feel stronger without changing them."
```

---

## Task 4: Apply Text Hierarchy to FeaturedProjects

**Files:**

- Modify: `components/sections/FeaturedProjects.tsx:33,72-73,84-96`

**Context:** Apply the three-tier text hierarchy to project cards.

**Step 1: Update section description**

In `components/sections/FeaturedProjects.tsx`, line 33, change:

```tsx
// FROM:
<p className="text-body text-ocean-300 dark:text-sand-500/75 max-w-2xl mx-auto">

// TO:
<p className="text-body text-ocean-400 dark:text-sand-100/70 max-w-2xl mx-auto">
```

**Step 2: Update card summary text**

In `components/sections/FeaturedProjects.tsx`, lines 72-73, change:

```tsx
// FROM:
<p className="text-sm text-ocean-300 dark:text-sand-500/75 mb-4 flex-1">
  {project.summary}
</p>

// TO:
<p className="text-sm text-ocean-400 dark:text-sand-100/70 mb-4 flex-1">
  {project.summary}
</p>
```

**Step 3: Update card metadata**

In `components/sections/FeaturedProjects.tsx`, lines 84-96, change:

```tsx
// FROM:
<div className="text-xs text-ocean-400 dark:text-sand-500/60 space-y-1 mb-4">
  {project.team && (
    <p>
      {project.team === "solo"
        ? "Solo"
        : `Team of ${project.teamSize || "multiple"}`}
      {project.duration && ` · ${project.duration}`}
    </p>
  )}
  {/* Tech stack as inline text */}
  <p className="text-muted-400 dark:text-sand-500/50">
    {project.technologies.join(" · ")}
  </p>
</div>

// TO:
<div className="text-xs text-ocean-400 dark:text-sand-100/50 space-y-1 mb-4">
  {project.team && (
    <p>
      {project.team === "solo"
        ? "Solo"
        : `Team of ${project.teamSize || "multiple"}`}
      {project.duration && ` · ${project.duration}`}
    </p>
  )}
  {/* Tech stack as inline text */}
  <p className="text-muted-400 dark:text-sand-100/50">
    {project.technologies.join(" · ")}
  </p>
</div>
```

**Step 4: Verify changes**

Run: `pnpm dev`
Expected: Text hierarchy is clearer - headings pop, descriptions recede.

**Step 5: Commit**

```bash
git add components/sections/FeaturedProjects.tsx
git commit -m "style: apply text hierarchy to FeaturedProjects

Use sand-100 at 70% and 50% opacity for secondary/tertiary text.
Reduces visual competition with headings."
```

---

## Task 5: Apply Text Hierarchy to Skills Section

**Files:**

- Modify: `components/sections/Skills.tsx:47-52,83,89`

**Context:** Apply consistent text hierarchy to Skills section.

**Step 1: Update section description**

In `components/sections/Skills.tsx`, lines 47-48, change:

```tsx
// FROM:
<p className="text-body text-ocean-300 dark:text-sand-500/75 max-w-2xl mx-auto mb-4">

// TO:
<p className="text-body text-ocean-400 dark:text-sand-100/70 max-w-2xl mx-auto mb-4">
```

**Step 2: Update italic subtitle**

In `components/sections/Skills.tsx`, lines 49-52, change:

```tsx
// FROM:
<p className="text-sm text-muted-400 dark:text-sand-500/60 italic max-w-xl mx-auto">

// TO:
<p className="text-sm text-muted-400 dark:text-sand-100/50 italic max-w-xl mx-auto">
```

**Step 3: Update skill name text**

In `components/sections/Skills.tsx`, line 83, change:

```tsx
// FROM:
className =
  "text-sm font-medium text-ocean-600 dark:text-sand-500/90 cursor-help";

// TO:
className =
  "text-sm font-medium text-ocean-600 dark:text-sand-100/90 cursor-help";
```

**Step 4: Update years text**

In `components/sections/Skills.tsx`, line 89, change:

```tsx
// FROM:
<span className="text-xs text-muted-400 dark:text-sand-500/60">

// TO:
<span className="text-xs text-muted-400 dark:text-sand-100/50">
```

**Step 5: Verify changes**

Run: `pnpm dev`
Expected: Skills section has clearer text hierarchy in dark mode.

**Step 6: Commit**

```bash
git add components/sections/Skills.tsx
git commit -m "style: apply text hierarchy to Skills section

Consistent use of sand-100 with opacity tiers."
```

---

## Task 6: Apply Text Hierarchy to Hero Section

**Files:**

- Modify: `components/sections/Hero.tsx:45`

**Context:** Hero bio text should use the secondary tier.

**Step 1: Update bio text**

In `components/sections/Hero.tsx`, line 45, change:

```tsx
// FROM:
<p className="text-body text-ocean-300 dark:text-sand-500/75 mb-8 max-w-2xl mx-auto leading-relaxed">

// TO:
<p className="text-body text-ocean-400 dark:text-sand-100/70 mb-8 max-w-2xl mx-auto leading-relaxed">
```

**Step 2: Verify changes**

Run: `pnpm dev`
Expected: Hero bio text is slightly less bright in dark mode.

**Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "style: apply text hierarchy to Hero bio"
```

---

## Task 7: Make Cards Quieter

**Files:**

- Modify: `app/globals.css:107-151`

**Context:** Cards are a little too "present" - reduce border contrast, glow, and make background darker.

**Step 1: Update card styles in globals.css**

In `app/globals.css`, replace the card styles section (lines 107-151) with:

```css
/* ===========================================
 * CARD STYLES - Quieter, content-focused
 * =========================================== */
.card {
  @apply bg-sand-100 rounded-card;
  @apply shadow-card-light;
  @apply border border-ocean-300/15;
  @apply transition-all duration-220 ease-smooth;
  @apply relative overflow-hidden;
}

/* Dark mode: deeper, quieter surface */
.dark .card {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Card top highlight line - more subtle */
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
    rgba(245, 158, 11, 0.08),
    transparent
  );
}

.card:hover {
  @apply shadow-lift-light;
  transform: translateY(-2px);
  border-color: rgba(46, 98, 135, 0.25);
}

.dark .card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}
```

**Step 2: Verify changes**

Run: `pnpm dev`
Expected: Cards are more subtle - less border contrast, less glow, darker background in dark mode.

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: make cards quieter

Reduced border opacity, softer shadows, darker dark-mode bg.
Content does the talking now."
```

---

## Task 8: Increase Card Padding

**Files:**

- Modify: `components/sections/FeaturedProjects.tsx:49`
- Modify: `components/sections/Skills.tsx:68`

**Context:** Card padding should increase by 10-15% for breathing room.

**Step 1: Update FeaturedProjects card padding**

In `components/sections/FeaturedProjects.tsx`, line 49, change:

```tsx
// FROM:
className = "card p-6 flex flex-col relative";

// TO:
className = "card p-7 flex flex-col relative";
```

**Step 2: Update Skills card padding**

In `components/sections/Skills.tsx`, line 68, change:

```tsx
// FROM:
className = "card p-6";

// TO:
className = "card p-7";
```

**Step 3: Verify changes**

Run: `pnpm dev`
Expected: Cards have more internal breathing room.

**Step 4: Commit**

```bash
git add components/sections/FeaturedProjects.tsx components/sections/Skills.tsx
git commit -m "style: increase card padding p-6 -> p-7"
```

---

## Task 9: Unify Button Hover Behavior

**Files:**

- Modify: `app/globals.css:276-350`

**Context:** Buttons should have consistent motion: 150ms timing, translateY(-1px) on hover, no bounces.

**Step 1: Update btn-primary-cta hover**

In `app/globals.css`, around line 289, change the hover transform:

```css
/* FROM: */
.btn-primary-cta:hover {
  transform: translateY(-2px);

/* TO: */
.btn-primary-cta:hover {
  transform: translateY(-1px);
```

Also update the transition in the base class (around line 279):

```css
/* FROM: */
@apply transition-all duration-180 ease-smooth;

/* TO: */
@apply transition-all duration-150 ease-smooth;
```

**Step 2: Update btn-secondary hover**

In `app/globals.css`, around line 371, change:

```css
/* FROM: */
.btn-secondary:hover {
  @apply bg-ocean-400/10;
  @apply border-bronze-600/30;
  transform: translateY(-1px);
}

/* This is already correct - just verify the transition timing */
```

Update the base class transition (around line 357):

```css
/* FROM: */
@apply transition-all duration-180 ease-smooth;

/* TO: */
@apply transition-all duration-150 ease-smooth;
```

**Step 3: Verify changes**

Run: `pnpm dev`
Expected: All buttons have consistent, calm hover behavior.

**Step 4: Commit**

```bash
git add app/globals.css
git commit -m "style: unify button hover behavior

Consistent 150ms timing, -1px lift. Calm confidence."
```

---

## Task 10: Navigation Polish

**Files:**

- Modify: `components/sections/Navigation.tsx:193,41,76-77`

**Context:** Reduce blur (xl -> lg), increase text contrast slightly.

**Step 1: Reduce backdrop blur**

In `components/sections/Navigation.tsx`, line 193, change:

```tsx
// FROM:
"backdrop-blur-xl",

// TO:
"backdrop-blur-lg",
```

**Step 2: Increase nav link text contrast**

In `components/sections/Navigation.tsx`, line 41, change:

```tsx
// FROM:
isActive ? "text-sand-50" : "text-sand-100/90 hover:text-sand-50",

// TO:
isActive ? "text-sand-50" : "text-sand-100/95 hover:text-sand-50",
```

**Step 3: Increase theme toggle text contrast**

In `components/sections/Navigation.tsx`, lines 76-77, change:

```tsx
// FROM:
"text-sand-100/80 dark:text-sand-500/80",
"hover:text-sand-50 dark:hover:text-sand-500",

// TO:
"text-sand-100/90 dark:text-sand-500/90",
"hover:text-sand-50 dark:hover:text-sand-500",
```

**Step 4: Verify changes**

Run: `pnpm dev`
Expected: Navigation is slightly sharper, text is more readable.

**Step 5: Commit**

```bash
git add components/sections/Navigation.tsx
git commit -m "style: polish navigation

Reduced blur xl->lg, increased text contrast."
```

---

## Task 11: Luxury Touch - Micro-hover on Project Cards

**Files:**

- Modify: `components/sections/FeaturedProjects.tsx:100`

**Context:** Add subtle bronze border hint on hover for project card links section.

**Step 1: Update card footer border hover**

In `components/sections/FeaturedProjects.tsx`, line 100, change:

```tsx
// FROM:
<div className="flex items-center gap-4 pt-4 border-t border-ocean-300/20 dark:border-muted-300/15">

// TO:
<div className="flex items-center gap-4 pt-4 border-t border-ocean-300/15 dark:border-white/10 transition-colors duration-150">
```

**Step 2: Verify changes**

Run: `pnpm dev`
Expected: Card footer has cleaner, more subtle border.

**Step 3: Commit**

```bash
git add components/sections/FeaturedProjects.tsx
git commit -m "style: refine card footer border

Subtle, clean separation. Less visual noise."
```

---

## Task 12: Remove Fade Overlays from Sections

**Files:**

- Modify: `components/sections/Hero.tsx:18-22`
- Modify: `components/sections/FeaturedProjects.tsx:22-26`
- Modify: `components/sections/Skills.tsx:29-38`
- Modify: `components/sections/ProofStrip.tsx:36-45`

**Context:** With transparent section backgrounds, the fade overlays are no longer needed and may create artifacts.

**Step 1: Remove Hero bottom fade**

In `components/sections/Hero.tsx`, delete lines 18-22:

```tsx
// DELETE:
{
  /* Bottom fade into next section */
}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-sand-50 dark:to-dark-base"
/>;
```

**Step 2: Remove FeaturedProjects bottom fade**

In `components/sections/FeaturedProjects.tsx`, delete lines 22-26:

```tsx
// DELETE:
{
  /* Bottom fade into next section */
}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-ocean-50 dark:to-dark-surface"
/>;
```

**Step 3: Remove Skills top and bottom fades**

In `components/sections/Skills.tsx`, delete lines 29-38:

```tsx
// DELETE:
{
  /* Top fade */
}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sand-50 dark:from-dark-base to-transparent"
/>;
{
  /* Bottom fade */
}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-sand-50 dark:to-dark-base"
/>;
```

**Step 4: Remove ProofStrip top and bottom fades**

In `components/sections/ProofStrip.tsx`, delete lines 36-45:

```tsx
// DELETE:
{
  /* Top fade from previous section */
}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-sand-50 dark:from-dark-base to-transparent"
/>;
{
  /* Bottom fade into next section */
}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-sand-50 dark:to-dark-base"
/>;
```

**Step 5: Verify changes**

Run: `pnpm dev`
Expected: Clean section transitions without fade artifacts.

**Step 6: Commit**

```bash
git add components/sections/Hero.tsx components/sections/FeaturedProjects.tsx components/sections/Skills.tsx components/sections/ProofStrip.tsx
git commit -m "style: remove section fade overlays

With transparent backgrounds, fades are no longer needed.
Cleaner separation via spacing alone."
```

---

## Task 13: Final Verification

**Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds without errors.

**Step 2: Run linter**

Run: `pnpm lint`
Expected: No linting errors.

**Step 3: Run type check**

Run: `pnpm typecheck`
Expected: No TypeScript errors.

**Step 4: Visual verification**

Run: `pnpm dev`
Check:

- [ ] Sections flow together without banding
- [ ] Increased breathing room is noticeable
- [ ] Text hierarchy is clear (headings pop, body recedes)
- [ ] Cards are quieter but still defined
- [ ] Buttons have consistent, calm hover
- [ ] Navigation is sharp and readable
- [ ] Dark mode looks cohesive

**Step 5: Final commit if any fixes needed**

If fixes were made, commit them individually with descriptive messages.

---

## Summary of Changes

| Area                | Before                 | After                                   |
| ------------------- | ---------------------- | --------------------------------------- |
| Section backgrounds | Multiple colored bands | Transparent (header/footer only strong) |
| Section padding     | py-16/24               | py-20/32                                |
| Grid gaps           | 6-8                    | 8-10                                    |
| Card padding        | p-6                    | p-7                                     |
| Dark mode text      | sand-500 variants      | sand-100 with opacity tiers             |
| Card borders        | 8% opacity             | 6% opacity                              |
| Card shadows        | Heavy                  | 30% lighter                             |
| Button timing       | 180ms                  | 150ms                                   |
| Button lift         | -2px                   | -1px                                    |
| Nav blur            | xl                     | lg                                      |
| Nav text            | 80-90% opacity         | 90-95% opacity                          |

**Design North Star:** "This site should feel like a well-architected system: calm, intentional, and quietly powerful."
