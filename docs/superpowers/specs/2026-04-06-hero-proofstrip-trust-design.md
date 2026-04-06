# Design Spec: Hero Image, ProofStrip, and Trust Line Improvements

**Date:** 2026-04-06
**Status:** Approved

---

## Overview

Three targeted visual and content improvements to the portfolio homepage:

1. Make the hero background image more visible in light mode without competing with text
2. Replace the ProofStrip's self-asserted metrics with a philosophy statement backed by verifiable proof links
3. Give the hero trust line ("Previously at WestGrid Canada & TCS Canada") more visual weight

A prerequisite CI workflow for the Tiger English repo is also included so the proof badge has something to point at.

---

## 1. Hero Background Image (Light Mode)

### Problem
The background image (`/images/old-tw.jpg`) is rendered at `opacity-[0.22]` in light mode, making it nearly invisible. The gradient overlay is applied uniformly, washing out the image across the whole section. Dark mode reads better because the amber glow has contrast to work against.

### Change
- Increase image opacity from `0.22` → `0.38` in light mode (dark mode stays at `0.20`)
- Reshape the light mode gradient overlay: instead of a uniform wash, concentrate it over the center/text area while letting the image show more at the top and edges
- Current gradient: `from-sand-50/70 via-sand-100/50 to-sand-50/75`
- New gradient: `from-sand-50/40 via-sand-50/65 to-sand-50/85` — lighter at top, heavier at bottom to protect the text block

### Constraints
- Text contrast must remain readable — the name, role, CTAs, and availability badge all sit over the image
- The parallax motion and amber glow are not changed
- Dark mode is not changed

---

## 2. ProofStrip Replacement

### Problem
The current four-stat strip (95%+ Test Coverage, Automated CI/CD, Strict Mode TypeScript, 90+ Lighthouse) makes self-asserted claims with no verification path. For a portfolio evaluator, unverifiable metrics read as filler.

### Change
Replace the four boxes entirely with a two-row layout:

**Row 1 — Philosophy statement (centered, prominent):**
> "I build production-ready systems — with real-world constraints like authentication, data integrity, testing, and scalability — not just prototypes."

Styled as body text, slightly larger than current stat labels, with the key phrase optionally given subtle emphasis (e.g. `font-medium`).

**Row 2 — Three proof links (centered, beneath the statement):**

| Link | Label | Destination |
|------|-------|-------------|
| GitHub icon | `watershed-campground` | `https://github.com/afk-bro/watershed-campground` |
| External link icon | `tiger-english.com` | `https://tiger-english.com` |
| CI badge / checkmark icon | `CI passing` | `https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml` |

The CI link uses the live GitHub Actions badge image (`...badge.svg`) rendered inline so it reflects the real run status. Falls back gracefully if the badge fails to load.

### Layout
- Section padding stays the same (`pt-8 pb-20`)
- No grid — both rows are flex/centered
- Philosophy text: `max-w-3xl mx-auto text-center`
- Proof links row: `flex items-center justify-center gap-6 mt-4`, each link `inline-flex items-center gap-1.5 text-sm`

### Prerequisite: Tiger English CI Workflow

A GitHub Actions workflow must exist at `.github/workflows/ci.yml` in the `tiger-english` repo for the badge to work. The workflow runs on push and pull_request to `main`:

```
Steps:
1. Checkout
2. Setup Node 20
3. Install dependencies (npm ci)
4. Lint (npm run lint)
5. Type check (npm run type-check)
6. Test (npm test)
```

Badge URL once workflow exists:
`https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml/badge.svg`

---

## 3. Trust Line Visual Weight

### Problem
"Previously at WestGrid Canada & TCS Canada" is styled `text-sm text-ocean-400/70` — it's the strongest professional credential in the hero but renders as a near-invisible footnote.

### Change
Wrap the trust line in a subtle pill/badge treatment:

- Border: `border border-ocean-300/30 dark:border-white/15`
- Background: `bg-white/40 dark:bg-white/5`
- Padding: `px-3 py-1`
- Border radius: `rounded-full`
- Text: upgrade from `text-sm opacity-70` to `text-sm font-medium text-ocean-600 dark:text-sand-100/75`
- Prepend a small `Building2` or `Briefcase` icon (Lucide) at `w-3.5 h-3.5` for credential signaling

The pill sits in the same position (below the availability badge), centered.

---

## 4. Data Update: Tiger English GitHub URL

Update `data/projects.ts` to reflect the renamed repo:
- `https://github.com/afk-bro/gain-english` → `https://github.com/afk-bro/tiger-english`

---

## Files Affected

| File | Change |
|------|--------|
| `components/sections/Hero.tsx` | Image opacity + gradient + trust line styling |
| `components/sections/ProofStrip.tsx` | Full replacement of stat grid |
| `data/projects.ts` | Tiger English GitHub URL |
| `tiger-english/.github/workflows/ci.yml` | New file — CI workflow (separate repo) |

---

## Out of Scope

- Dark mode hero changes
- Any other sections (Skills, HowIBuild, FeaturedProjects)
- Deploying Tiger English or setting up staging environments
