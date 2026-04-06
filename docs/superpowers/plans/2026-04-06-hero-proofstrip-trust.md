# Hero, ProofStrip & Trust Line Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the hero image visible in light mode, replace self-asserted ProofStrip metrics with a philosophy statement backed by verifiable proof links, and give the trust line credential weight.

**Architecture:** Four independent edits across three files in the portfolio repo, plus a new CI workflow file in the Tiger English repo. No new components or abstractions — all changes are in-place replacements. Tiger English CI workflow is a prerequisite for the ProofStrip badge link.

**Tech Stack:** Next.js 14, React, Tailwind CSS, Framer Motion, Lucide icons, GitHub Actions (tiger-english repo)

---

## File Map

| File | What changes |
|------|-------------|
| `/home/x/dev/projects/gain-english/.github/workflows/ci.yml` | **Create** — CI workflow for Tiger English (prerequisite for badge) |
| `data/projects.ts` | **Modify line 152** — `gain-english` → `tiger-english` in GitHub URL |
| `components/sections/Hero.tsx` | **Modify lines 95, 99, 1, 169–177** — image opacity, gradient, trust line pill |
| `components/sections/ProofStrip.tsx` | **Replace entirely** — philosophy statement + proof links |

---

## Task 1: Tiger English CI Workflow

**Repo:** `/home/x/dev/projects/gain-english/` (the tiger-english GitHub repo)

**Files:**
- Create: `/home/x/dev/projects/gain-english/.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflow directory and file**

```bash
mkdir -p /home/x/dev/projects/gain-english/.github/workflows
```

Then create `/home/x/dev/projects/gain-english/.github/workflows/ci.yml` with this exact content:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Test
        run: npm test -- --run
```

Note: `--run` is required for Vitest to exit after one pass instead of entering watch mode.

- [ ] **Step 2: Commit and push from the tiger-english repo**

```bash
cd /home/x/dev/projects/gain-english
git add .github/workflows/ci.yml
git commit -m "ci: add CI workflow for lint, typecheck, and tests"
git push origin main
```

- [ ] **Step 3: Verify the workflow runs on GitHub**

Go to `https://github.com/afk-bro/tiger-english/actions` and confirm the `CI` workflow appears and runs. Wait for it to complete (green or red — either way the badge URL is live).

The badge URL will be:
`https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml/badge.svg`

---

## Task 2: Update Tiger English GitHub URL in Portfolio Data

**Repo:** portfolio-page

**Files:**
- Modify: `data/projects.ts:152`

- [ ] **Step 1: Create the feature branch**

```bash
cd /home/x/dev/projects/portfolio-page
git checkout -b feat/hero-proofstrip-trust
```

- [ ] **Step 2: Update the URL**

In `data/projects.ts`, find and replace the Tiger English GitHub link:

```ts
// Before (line ~152):
github: "https://github.com/afk-bro/gain-english",

// After:
github: "https://github.com/afk-bro/tiger-english",
```

- [ ] **Step 3: Verify the build still passes**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add data/projects.ts
git commit -m "fix: update Tiger English GitHub URL to renamed repo"
```

---

## Task 3: Hero Image — Increase Light Mode Opacity and Reshape Gradient

**Files:**
- Modify: `components/sections/Hero.tsx:95,99`

- [ ] **Step 1: Update the image opacity class**

In `components/sections/Hero.tsx`, find the `<Image>` tag around line 91–98 and change the `className`:

```tsx
// Before:
className="object-cover opacity-[0.22] dark:opacity-[0.20]"

// After:
className="object-cover opacity-[0.38] dark:opacity-[0.20]"
```

- [ ] **Step 2: Reshape the light mode gradient overlay**

On the line immediately after the `<Image>` tag (the light-mode gradient div, around line 99), update the gradient classes:

```tsx
// Before:
<div className="absolute inset-0 bg-gradient-to-b from-sand-50/70 via-sand-100/50 to-sand-50/75 dark:hidden" />

// After:
<div className="absolute inset-0 bg-gradient-to-b from-sand-50/40 via-sand-50/65 to-sand-50/85 dark:hidden" />
```

This lightens the top (letting the image show) while keeping the bottom heavy to protect the text block.

- [ ] **Step 3: Visual check with Playwright**

Start the dev server (`pnpm dev`) and run:

```python
# /tmp/check_hero.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path="/tmp/hero_light.png")
    print("Saved /tmp/hero_light.png")
    browser.close()
```

```bash
python3 /tmp/check_hero.py
```

Open `/tmp/hero_light.png` and confirm the background texture is now visible while heading text remains clearly readable.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "fix: increase hero background image visibility in light mode"
```

---

## Task 4: Trust Line — Pill Treatment

**Files:**
- Modify: `components/sections/Hero.tsx:1, 169–177`

- [ ] **Step 1: Add Building2 to the lucide-react import**

At the top of `components/sections/Hero.tsx`, the existing import is:

```tsx
import { ArrowRight, Sparkles } from "lucide-react";
```

Change it to:

```tsx
import { ArrowRight, Building2, Sparkles } from "lucide-react";
```

- [ ] **Step 2: Replace the trust line element**

Find the trust anchor block around lines 168–177:

```tsx
{/* 5. Trust anchor - Slides up from bottom */}
<motion.p
  className="text-sm text-ocean-400/70 dark:text-sand-100/50"
  initial="hidden"
  animate="visible"
  variants={slideUp}
  custom={timing.trust}
>
  Previously at WestGrid Canada & TCS Canada
</motion.p>
```

Replace it with:

```tsx
{/* 5. Trust anchor - Slides up from bottom */}
<motion.div
  className="flex justify-center"
  initial="hidden"
  animate="visible"
  variants={slideUp}
  custom={timing.trust}
>
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-ocean-300/30 dark:border-white/15 bg-white/40 dark:bg-white/5">
    <Building2 className="w-3.5 h-3.5 text-ocean-500 dark:text-sand-100/60" />
    <span className="text-sm font-medium text-ocean-600 dark:text-sand-100/75">
      Previously at WestGrid Canada &amp; TCS Canada
    </span>
  </span>
</motion.div>
```

- [ ] **Step 3: Visual check with Playwright**

```python
# /tmp/check_trust.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2500)
    page.screenshot(path="/tmp/trust_pill.png")

    # Verify pill text is present
    pill = page.locator("text=Previously at WestGrid Canada")
    print(f"Trust pill visible: {pill.count() > 0}")
    browser.close()
```

```bash
python3 /tmp/check_trust.py
```

Expected: `Trust pill visible: True`. Open `/tmp/trust_pill.png` and confirm the pill has a visible border and icon.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "fix: give trust line credential weight with pill treatment"
```

---

## Task 5: ProofStrip — Replace with Philosophy + Proof Links

**Files:**
- Modify: `components/sections/ProofStrip.tsx` (full replacement)

- [ ] **Step 1: Replace the entire file content**

Overwrite `components/sections/ProofStrip.tsx` with:

```tsx
"use client";

import { ExternalLink, Github } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function ProofStrip() {
  return (
    <section className="relative pt-8 pb-20 bg-transparent">
      <div className="container-content relative">
        <AnimateOnScroll variant="fade-up" className="text-center">
          <p className="text-base md:text-lg font-medium text-ocean-700 dark:text-sand-200 max-w-3xl mx-auto mb-4 leading-relaxed">
            I build production-ready systems — with real-world constraints like
            authentication, data integrity, testing, and scalability — not just
            prototypes.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="https://github.com/afk-bro/watershed-campground"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ocean-500 dark:text-sand-100/70 hover:text-bronze-700 dark:hover:text-bronze-400 transition-colors duration-180"
            >
              <Github className="w-4 h-4" />
              watershed-campground
            </a>
            <a
              href="https://tiger-english.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ocean-500 dark:text-sand-100/70 hover:text-bronze-700 dark:hover:text-bronze-400 transition-colors duration-180"
            >
              <ExternalLink className="w-4 h-4" />
              tiger-english.com
            </a>
            <a
              href="https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tiger English CI status"
              className="inline-flex items-center"
            >
              <img
                src="https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml/badge.svg"
                alt="CI status"
                className="h-5"
              />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
```

Note: `img-src https:` is already permitted in the portfolio's CSP (`next.config.js`), so the badge SVG from `camo.githubusercontent.com` will load without a CSP violation.

- [ ] **Step 2: Visual check with Playwright**

```python
# /tmp/check_proofstrip.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)

    # Scroll to ProofStrip
    page.evaluate("window.scrollTo(0, 600)")
    page.wait_for_timeout(800)
    page.screenshot(path="/tmp/proofstrip.png")

    philosophy = page.locator("text=production-ready systems")
    watershed = page.locator("text=watershed-campground")
    tiger = page.locator("text=tiger-english.com")
    print(f"Philosophy text: {philosophy.count() > 0}")
    print(f"watershed-campground link: {watershed.count() > 0}")
    print(f"tiger-english.com link: {tiger.count() > 0}")
    browser.close()
```

```bash
python3 /tmp/check_proofstrip.py
```

Expected output:
```
Philosophy text: True
watershed-campground link: True
tiger-english.com link: True
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/ProofStrip.tsx
git commit -m "feat: replace ProofStrip metrics with philosophy statement and proof links"
```

---

## Task 6: Full-Page Verification and PR

- [ ] **Step 1: Take final verification screenshots**

```python
# /tmp/final_check.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Desktop light
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2500)
    page.screenshot(path="/tmp/final_desktop_light.png", full_page=True)
    print("Desktop light saved")

    # Desktop dark
    page2 = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page2.goto("http://localhost:3000")
    page2.wait_for_load_state("networkidle")
    page2.evaluate("document.documentElement.classList.add('dark')")
    page2.wait_for_timeout(2500)
    page2.screenshot(path="/tmp/final_desktop_dark.png", full_page=True)
    print("Desktop dark saved")

    # Mobile
    page3 = browser.new_context(viewport={"width": 390, "height": 844}).new_page()
    page3.goto("http://localhost:3000")
    page3.wait_for_load_state("networkidle")
    page3.wait_for_timeout(2500)
    page3.screenshot(path="/tmp/final_mobile.png")
    print("Mobile saved")

    browser.close()
```

```bash
python3 /tmp/final_check.py
```

Review all three screenshots. Confirm:
- Hero image texture is visible in light mode
- Text (name, role, CTAs) remains clearly readable
- Trust line shows as a pill with Building2 icon
- ProofStrip shows philosophy statement + three proof links
- Dark mode hero is unchanged
- Mobile layout looks clean

- [ ] **Step 2: Push and open PR**

```bash
git push -u origin feat/hero-proofstrip-trust
```

Then open a PR targeting `master`.
