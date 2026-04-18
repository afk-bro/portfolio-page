# Business Site — Phase 0 + 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `business_site` repo on disk with a buildable, stripped-down Next.js base, then add the Zod-validated content data layer (`data/services.ts`, `data/faqs.ts`, `data/process.ts`) and the pure-logic `lib/` modules (`seo.ts`, `jsonLd.ts`, `faqs.ts`, `inquirySchema.ts`) that later phases depend on.

**Architecture:** Copy the `portfolio_page` codebase into the empty `business_site` repo, strip portfolio-specific routes/components/data, update branding/config, then build the data + lib foundation. TDD is used for all pure `lib/` functions; scaffolding tasks are verified with `pnpm build` + `typecheck` + `lint`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Zod, pnpm, Jest (already configured in portfolio), React Testing Library, Resend, Vercel Web Analytics.

**Spec:** `docs/superpowers/specs/2026-04-18-business-site-design.md` (in `portfolio_page`; copied to `business_site` in Task 9).

---

## Conventions for this plan

- **Working directory** is declared at the top of each task. Tasks 1–3 run from `C:\Users\kayla\dev\projects`. Task 4 onward run from `C:\Users\kayla\dev\projects\business_site`.
- **Testing:** `lib/` modules get Jest unit tests (infrastructure already exists in the portfolio via `jest.config.js`, `jest.setup.js`, `@testing-library/*`). Data files are validated by their Zod schemas at import time. No UI tests in this plan — components come in Phase 2.
- **Commits:** one commit per task, using conventional-commits prefixes (`chore:`, `feat:`, `test:`). Never skip hooks.
- **All paths** are absolute from the repo root of whichever repo is the cwd at the time.

---

## Phase 0 — Bootstrap

### Task 1: Clone the empty business_site repo

**Working directory:** `C:\Users\kayla\dev\projects`

**Files:** None created yet locally.

- [ ] **Step 1: Clone the repo**

```bash
git clone https://github.com/afk-bro/business_site.git
```

- [ ] **Step 2: Verify the clone**

```bash
ls business_site
```

Expected: `.gitignore  LICENSE` (plus `.git/`).

- [ ] **Step 3: Verify remote**

```bash
cd business_site && git remote -v && cd ..
```

Expected: `origin  https://github.com/afk-bro/business_site.git (fetch/push)`.

---

### Task 2: Copy portfolio codebase into business_site

**Working directory:** `C:\Users\kayla\dev\projects`

**Files:** Entire portfolio source tree into `business_site/` (excluding `.git`, `node_modules`, `.next`, `pnpm-lock.yaml`).

- [ ] **Step 1: Copy with exclusions (PowerShell)**

Because this is Windows and `rsync` isn't guaranteed, use PowerShell. Run this in PowerShell (not bash):

```powershell
$src = "C:\Users\kayla\dev\projects\portfolio_page"
$dst = "C:\Users\kayla\dev\projects\business_site"
$exclude = @(".git", "node_modules", ".next", "pnpm-lock.yaml")
Get-ChildItem -Path $src -Force | Where-Object { $exclude -notcontains $_.Name } | Copy-Item -Destination $dst -Recurse -Force
```

Rationale for dropping `pnpm-lock.yaml`: we'll regenerate it in Task 11 once portfolio-specific deps are trimmed.

- [ ] **Step 2: Verify business_site .git is still intact (not overwritten)**

```bash
cd C:/Users/kayla/dev/projects/business_site
git remote -v
```

Expected: still points to `afk-bro/business_site`, not `afk-bro/portfolio-page`.

If it was overwritten, fix it:

```bash
git remote set-url origin https://github.com/afk-bro/business_site.git
```

- [ ] **Step 3: Verify expected files are present**

```bash
ls
```

Expected to include: `app/`, `components/`, `data/`, `lib/`, `public/`, `docs/`, `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `jest.config.js`, `jest.setup.js`, `LICENSE`, `.gitignore`.

- [ ] **Step 4: Commit the raw copy as a checkpoint**

```bash
git add -A
git status
```

Verify the staged list is portfolio source (not `.git/` contents or `node_modules/`). Then:

```bash
git commit -m "chore: seed from portfolio_page

Initial copy of the portfolio codebase as the starting point for the
business services site. Portfolio-specific content will be stripped
in subsequent commits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Delete portfolio-specific routes and components

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files to delete:**
- `app/projects/` (entire directory — was `/projects` and `/projects/[slug]`)
- `app/resume/` (entire directory)
- `app/test-error/` (entire directory)
- `app/test-toast/` (entire directory)
- `components/sections/FeaturedProjects.tsx`
- `components/sections/HowIBuild.tsx` (will be rebuilt as `Process.tsx` in Phase 2)
- `components/sections/ProofStrip.tsx` (will be rebuilt as `TrustStrip.tsx` in Phase 2)
- `components/sections/Skills.tsx`
- `components/sections/ResumeDetails.tsx`
- `components/sections/AboutProfileSection.tsx` (will be rewritten in Phase 3)
- `components/sections/ProjectsContent.tsx`
- `components/sections/CallToAction.tsx` (replaced by `CtaPair` in Phase 2)
- `components/ui/TypewriterName.tsx`
- `components/ui/HeroButton.tsx` (Hero will be rewritten in Phase 2)
- `components/TestErrorComponent.tsx`
- `components/dev/` (entire directory, if any contents)
- `data/projects.ts`
- `data/skills.ts`

**Files to keep (stay in repo, will evolve):**
- `app/layout.tsx`, `app/page.tsx` (simplified in Task 5)
- `app/about/page.tsx` (kept as placeholder; rewritten in Phase 3)
- `app/contact/page.tsx`, `app/contact/layout.tsx` (rewritten in Phase 4)
- `app/api/contact/route.ts` (reworked in Phase 4)
- `app/opengraph-image.tsx`, `app/twitter-image.tsx` (content refreshed in Phase 5)
- `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/globals.css`
- All of `components/ui/` except `TypewriterName.tsx` and `HeroButton.tsx`
- `components/ErrorBoundary.tsx`, `components/ThemeProvider.tsx`
- `components/sections/Hero.tsx` (rewritten in Phase 2 — delete in Task 5 below)
- `components/sections/Navigation.tsx` (simplified in Task 5)
- `components/sections/Footer.tsx` (simplified in Task 5)
- `data/metadata.ts` (updated in Task 6 and extended in Task 13)
- `lib/utils.ts`

- [ ] **Step 1: Delete the files and directories listed above**

Using bash:

```bash
rm -rf app/projects app/resume app/test-error app/test-toast components/dev
rm -f components/sections/FeaturedProjects.tsx
rm -f components/sections/HowIBuild.tsx
rm -f components/sections/ProofStrip.tsx
rm -f components/sections/Skills.tsx
rm -f components/sections/ResumeDetails.tsx
rm -f components/sections/AboutProfileSection.tsx
rm -f components/sections/ProjectsContent.tsx
rm -f components/sections/CallToAction.tsx
rm -f components/ui/TypewriterName.tsx
rm -f components/ui/HeroButton.tsx
rm -f components/TestErrorComponent.tsx
rm -f data/projects.ts
rm -f data/skills.ts
```

- [ ] **Step 2: Verify deletions**

```bash
ls app components/sections components/ui data
```

Expected result — no files from the deletion list remain. The `app/` should contain: `about`, `api`, `contact`, `globals.css`, `layout.tsx`, `not-found.tsx`, `opengraph-image.tsx`, `page.tsx`, `robots.ts`, `sitemap.ts`, `twitter-image.tsx`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: strip portfolio-specific routes, components, data

Removes /projects, /resume, /test-*, dev-only components, and
portfolio-only data files (projects.ts, skills.ts). Hero, Navigation,
Footer, and app/page.tsx are simplified in the next commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Delete the Hero component and the about page body

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

The current `Hero.tsx` uses the now-deleted `TypewriterName` and `HeroButton`. Simpler to delete it entirely here; Phase 2 rebuilds it with new variants.

Likewise, `app/about/page.tsx` imports the deleted `AboutProfileSection`. Reduce it to a placeholder now; rewritten in Phase 3.

**Files:**
- Delete: `components/sections/Hero.tsx`
- Modify: `app/about/page.tsx` (replace body with placeholder)

- [ ] **Step 1: Delete Hero**

```bash
rm -f components/sections/Hero.tsx
```

- [ ] **Step 2: Replace about page with placeholder**

Overwrite `app/about/page.tsx` with:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Tom Horne",
  description: "Small business web services in Kelowna and remote.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Placeholder — rewritten in Phase 3.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove Hero and gut about page for rebuild

Hero depended on deleted TypewriterName/HeroButton; about page
depended on deleted AboutProfileSection. Both become placeholders
pending Phase 2/3 rewrites.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Simplify app/page.tsx, Navigation, Footer to minimal placeholders

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files to modify:**
- `app/page.tsx`
- `components/sections/Navigation.tsx`
- `components/sections/Footer.tsx`
- `app/contact/page.tsx` (may import deleted helpers; make it a placeholder)
- `app/contact/layout.tsx` (keep if it only sets metadata; otherwise trim)

- [ ] **Step 1: Replace app/page.tsx with placeholder**

Overwrite:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tom Horne — Small business websites, Google Maps, booking systems",
  description:
    "Small business websites, Google Maps optimization, and booking systems. Kelowna, BC and remote across Canada.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold">Tom Horne</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Small business websites, Google Maps optimization, booking systems.
        Kelowna, BC and remote.
      </p>
      <p className="mt-4 text-sm text-neutral-500">
        Site rebuild in progress.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Inspect current Navigation.tsx**

```bash
cat components/sections/Navigation.tsx
```

Identify imports that reference deleted components/routes (`/projects`, `/resume`, etc.).

- [ ] **Step 3: Replace Navigation.tsx with minimal stub**

Overwrite `components/sections/Navigation.tsx` with:

```tsx
"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          Tom Horne
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
```

(Full Services / About / Book-a-call nav lands in Phase 2.)

- [ ] **Step 4: Inspect and trim Footer.tsx**

```bash
cat components/sections/Footer.tsx
```

If it references deleted routes/components, replace with:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Tom Horne. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Reduce app/contact/page.tsx to a placeholder**

Overwrite:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Tom Horne",
  description: "Request a quote or ask a question.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Placeholder — full inquiry form lands in Phase 4.
      </p>
    </main>
  );
}
```

If `app/contact/layout.tsx` imports anything deleted, strip it down to:

```tsx
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 6: Check nothing else references a deleted symbol**

```bash
grep -rE "TypewriterName|HeroButton|FeaturedProjects|HowIBuild|ProofStrip|Skills|ResumeDetails|AboutProfileSection|ProjectsContent|CallToAction|data/projects|data/skills" app components
```

Expected: no output. If anything remains, remove the reference or delete the file.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: replace home, nav, footer, contact with placeholders

Minimal shells so the repo builds while Phases 2–4 rebuild the real
pages and components. Pages render a headline + 'rebuild in progress'
copy; navigation links are limited to About and Contact.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Update package.json for the new project

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Read the current file**

```bash
cat package.json
```

- [ ] **Step 2: Apply the following changes**

Change the `name` field from `"portfolio-website"` to `"business-site"`.

Add a `description` field:

```json
"description": "Tom Horne — small business websites, Google Maps optimization, booking systems.",
```

Add a `repository` field:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/afk-bro/business_site.git"
},
```

Add the Vercel Analytics dependency to `dependencies`:

```json
"@vercel/analytics": "^1.3.0"
```

Add `react-hook-form` and `@hookform/resolvers` (needed by `InquiryForm` in Phase 4):

```json
"react-hook-form": "^7.52.0",
"@hookform/resolvers": "^3.9.0"
```

The final `dependencies` object should look like (keep alphabetical, versions may advance):

```json
"dependencies": {
  "@hookform/resolvers": "^3.9.0",
  "@radix-ui/react-slot": "^1.0.2",
  "@vercel/analytics": "^1.3.0",
  "clsx": "^2.1.0",
  "framer-motion": "^12.26.1",
  "lucide-react": "^0.400.0",
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "react-hook-form": "^7.52.0",
  "resend": "^6.10.0",
  "tailwind-merge": "^2.3.0",
  "zod": "^3.23.0"
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: rename to business-site, add inquiry-form and analytics deps

Adds @vercel/analytics for Phase 5, react-hook-form +
@hookform/resolvers for the Phase 4 inquiry form. Sets repo URL to
afk-bro/business_site.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Update README.md

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `README.md` (overwrite)

- [ ] **Step 1: Overwrite README.md with the new content**

```markdown
# Tom Horne — Business Site

Small business websites, Google Maps optimization, booking systems, automation, and ongoing maintenance. Based in Kelowna, BC; remote across Canada.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Zod · pnpm · Resend · Vercel Web Analytics.

## Scripts

```bash
pnpm dev          # Start dev server on localhost:3000
pnpm build        # Production build
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
pnpm test         # Jest unit tests
pnpm format       # Prettier write
```

## Environment variables

See `.env.example`. At minimum:

- `RESEND_API_KEY` — server-side Resend key for inquiry emails.
- `CONTACT_INBOX` — email address notifications are sent to.
- `CAL_EVENT_SLUG` — Cal.com booking event slug embedded on `/book`.
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for JSON-LD, OG, and sitemap.

## Content

All site content lives in `/data` as Zod-validated TypeScript objects. See `docs/superpowers/specs/2026-04-18-business-site-design.md` for the design and `docs/superpowers/plans/` for implementation plans.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for business site

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Update .env.example

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `.env.example` (overwrite)

- [ ] **Step 1: Overwrite .env.example**

```env
# Required in production.
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend for /api/contact transactional emails.
RESEND_API_KEY=
CONTACT_INBOX=contact@tomhorne.dev

# Cal.com event slug for /book.
# Example: "tomhorne/intro-call"
CAL_EVENT_SLUG=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: refresh .env.example for new site

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Copy the spec and this plan into business_site

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `docs/superpowers/specs/2026-04-18-business-site-design.md` (copy from portfolio)
- Create: `docs/superpowers/plans/2026-04-18-business-site-phase-0-1-foundation.md` (copy from portfolio)

- [ ] **Step 1: Copy the spec and plan**

```bash
mkdir -p docs/superpowers/specs docs/superpowers/plans
cp ../portfolio_page/docs/superpowers/specs/2026-04-18-business-site-design.md docs/superpowers/specs/
cp ../portfolio_page/docs/superpowers/plans/2026-04-18-business-site-phase-0-1-foundation.md docs/superpowers/plans/
```

- [ ] **Step 2: Remove any stale portfolio-era docs from this repo's copy**

```bash
rm -f docs/superpowers/specs/2026-04-06-hero-proofstrip-trust-design.md
rm -f docs/superpowers/plans/2026-04-06-hero-proofstrip-trust.md
rm -rf docs/lessons-learned
```

(The lessons-learned doc stays in `portfolio_page`; we don't need it here. If you want to reference the Resend/DNS lesson later, it's a git link away.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: bring spec and phase 0+1 plan into business_site

Removes portfolio-era superpowers docs that came across in the seed
copy; the design + this plan are the active documents here.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Update data/metadata.ts for business positioning (minimal)

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `data/metadata.ts`

This is the minimal update needed for the build to reflect the new positioning. Task 13 extends this file further with `serviceAreas` and CTA copy constants.

- [ ] **Step 1: Overwrite data/metadata.ts**

```ts
import { z } from "zod";

export const siteMetadataSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  availability: z.enum(["available", "limited", "unavailable"]),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    twitter: z.string().url().optional(),
  }),
  siteUrl: z.string().url(),
});

export type SiteMetadata = z.infer<typeof siteMetadataSchema>;

export const siteMetadata: SiteMetadata = {
  name: "Tom Horne",
  title: "Small business web services — Kelowna and remote",
  role: "Websites, Google Maps optimization, and booking systems for small businesses",
  bio: "I build and maintain websites, online booking, and Google Maps listings for small businesses in Kelowna and across Canada. Straightforward engagements, no retainers required.",
  email: "contact@tomhorne.dev",
  location: "Kelowna, BC, Canada",
  availability: "available",
  social: {
    github: "https://github.com/afk-bro",
    linkedin: "https://linkedin.com/in/tom-horne",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

siteMetadataSchema.parse(siteMetadata);
```

- [ ] **Step 2: Commit**

```bash
git add data/metadata.ts
git commit -m "feat(data): reframe site metadata around small-business services

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Install deps and verify the repo builds clean

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:** Creates `pnpm-lock.yaml`.

- [ ] **Step 1: Install dependencies**

```bash
pnpm install
```

Expected: resolves and writes `pnpm-lock.yaml`. If it errors on the Node version, verify `node --version` is ≥ 20 (see `engines` in `package.json`).

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: exits 0 with no output. If it errors, the most likely cause is a lingering import of a deleted symbol — re-run Task 5 Step 6 grep.

- [ ] **Step 3: Run lint**

```bash
pnpm lint
```

Expected: exits 0. Warnings from `eslint-config-next` about missing `alt` on images in placeholder content are acceptable; actual errors are not.

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: exits 0; `.next/` is generated; the routes list shows `/`, `/about`, `/contact`, `/api/contact`, `/opengraph-image`, `/twitter-image`, `/not-found`, plus `robots.ts` and `sitemap.ts` outputs.

- [ ] **Step 5: Run tests (should be zero for now)**

```bash
pnpm test
```

Expected: `Tests: 0 passed, 0 total` and exit 0 (Jest is configured with `--passWithNoTests`).

- [ ] **Step 6: Commit the lockfile**

```bash
git add pnpm-lock.yaml
git commit -m "chore: generate pnpm-lock.yaml

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Push Phase 0 baseline to origin

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

- [ ] **Step 1: Confirm branch**

```bash
git branch --show-current
```

Expected: `master` (matches the portfolio default). If it's `main`, use `main` in the push command.

- [ ] **Step 2: Push to origin**

```bash
git push -u origin master
```

Expected: successful push; GitHub repo now has a working baseline.

- [ ] **Step 3: Verify remote state**

```bash
git log --oneline origin/master | head
```

Expected: all Phase 0 commits visible on the remote.

---

## Phase 1 — Content model + data + lib foundation

### Task 13: Extend data/metadata.ts with serviceAreas and CTA copy

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `data/metadata.ts`

- [ ] **Step 1: Add the fields**

Replace `data/metadata.ts` with the expanded version:

```ts
import { z } from "zod";

export const siteMetadataSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  availability: z.enum(["available", "limited", "unavailable"]),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    twitter: z.string().url().optional(),
  }),
  siteUrl: z.string().url(),
  serviceAreas: z.array(z.string()).min(1),
  cta: z.object({
    primaryLabel: z.string().min(1),
    primaryHref: z.string().min(1),
    secondaryLabel: z.string().min(1),
    secondaryHref: z.string().min(1),
  }),
});

export type SiteMetadata = z.infer<typeof siteMetadataSchema>;

export const siteMetadata: SiteMetadata = {
  name: "Tom Horne",
  title: "Small business web services — Kelowna and remote",
  role: "Websites, Google Maps optimization, and booking systems for small businesses",
  bio: "I build and maintain websites, online booking, and Google Maps listings for small businesses in Kelowna and across Canada. Straightforward engagements, no retainers required.",
  email: "contact@tomhorne.dev",
  location: "Kelowna, BC, Canada",
  availability: "available",
  social: {
    github: "https://github.com/afk-bro",
    linkedin: "https://linkedin.com/in/tom-horne",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  serviceAreas: [
    "Kelowna",
    "West Kelowna",
    "Lake Country",
    "Vernon",
    "Penticton",
    "Remote across Canada",
  ],
  cta: {
    primaryLabel: "Book a call",
    primaryHref: "/book",
    secondaryLabel: "Request a quote",
    secondaryHref: "/contact",
  },
};

siteMetadataSchema.parse(siteMetadata);
```

- [ ] **Step 2: Verify it parses**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add data/metadata.ts
git commit -m "feat(data): add serviceAreas and CTA copy to site metadata

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Create data/faqs.ts (global FAQs)

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `data/faqs.ts`

- [ ] **Step 1: Write the file**

```ts
import { z } from "zod";

export const faqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export type Faq = z.infer<typeof faqSchema>;

export const globalFaqSchema = z.array(faqSchema).min(3);

export const globalFaqs: Faq[] = [
  {
    q: "How do you charge — hourly or fixed price?",
    a: "Fixed price for defined projects (websites, redesigns, Maps optimization, booking systems). Monthly flat rate for maintenance. No surprise hourly billing.",
  },
  {
    q: "How long does a typical project take?",
    a: "A standard small-business website runs 2–4 weeks from kickoff. Google Maps optimization and booking system setups usually wrap in 1–2 weeks. Timelines are agreed up front.",
  },
  {
    q: "Who owns the website and accounts after launch?",
    a: "You do. Domain, hosting, email, analytics, and content are all in your name. I can manage them for you under maintenance, but ownership stays yours.",
  },
  {
    q: "Do I need to be in Kelowna?",
    a: "No. I'm based in Kelowna and serve the Okanagan locally, but I also work with clients remotely across Canada. Booking calls and async messaging work fine.",
  },
  {
    q: "Do you work with vendors, trades, and service businesses?",
    a: "Yes — that's most of my work. Trades, restaurants, salons, clinics, gyms, and real estate are all common fits.",
  },
];

globalFaqSchema.parse(globalFaqs);
```

- [ ] **Step 2: Verify it parses**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add data/faqs.ts
git commit -m "feat(data): add global FAQs

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Create data/process.ts (global process steps)

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `data/process.ts`

- [ ] **Step 1: Write the file**

```ts
import { z } from "zod";

export const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type ProcessStep = z.infer<typeof processStepSchema>;

export const globalProcessSchema = z.array(processStepSchema).min(3);

export const globalProcess: ProcessStep[] = [
  {
    title: "Discovery call",
    description:
      "Free 20-minute call. We talk through what you want, who it's for, and what success looks like. No pitch — if we're not a fit I'll say so.",
  },
  {
    title: "Proposal + fixed price",
    description:
      "A short written proposal with scope, timeline, and a fixed price. No hourly billing surprises, no retainers unless you want them.",
  },
  {
    title: "Build",
    description:
      "I build in weekly increments and share progress you can click through. You give feedback in plain English — no Figma required.",
  },
  {
    title: "Launch + handover",
    description:
      "I deploy, hand over every login, and walk you through how to update whatever you need to. You own everything.",
  },
  {
    title: "Optional maintenance",
    description:
      "If you want me to keep the site healthy, updated, and responsive to requests, there's a flat monthly maintenance plan. Otherwise, we're done — come back whenever.",
  },
];

globalProcessSchema.parse(globalProcess);
```

- [ ] **Step 2: Verify it parses**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add data/process.ts
git commit -m "feat(data): add global process steps

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Create data/services.ts — schema + empty array

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `data/services.ts`

Schema-only for now so the rest of the plan can import from it. Services are authored one by one in Tasks 17–22.

- [ ] **Step 1: Write the file**

```ts
import { z } from "zod";
import { faqSchema } from "@/data/faqs";
import { processStepSchema } from "@/data/process";

export const serviceIconKey = z.enum([
  "globe",
  "paintbrush",
  "map-pin",
  "calendar",
  "workflow",
  "wrench",
]);

export type ServiceIconKey = z.infer<typeof serviceIconKey>;

export const servicePricingSchema = z.object({
  mode: z.enum(["starting-at", "tiered", "quote-only"]),
  startingAt: z.number().optional(),
  tiers: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number(),
        includes: z.array(z.string()).min(1),
      }),
    )
    .optional(),
});

export const serviceSeoSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  ogImage: z.string().optional(),
});

export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  tagline: z.string().min(1),
  icon: serviceIconKey,

  hasDetailPage: z.boolean(),
  order: z.number(),
  homepageOrder: z.number().optional(),

  summary: z.string().min(1),
  problems: z.array(z.string()).min(1),
  whatYouGet: z.array(z.string()).min(1),

  process: z.array(processStepSchema).optional(),

  faqs: z.array(faqSchema).min(3),

  pricing: servicePricingSchema.optional(),

  primaryCtaLabel: z.string().optional(),
  primaryCtaHref: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),

  relatedProjectSlugs: z.array(z.string()).optional(),
  audiences: z.array(z.string()).optional(),

  seo: serviceSeoSchema,
  schemaServiceType: z.string().min(1),
});

export type Service = z.infer<typeof serviceSchema>;

export const services: Service[] = [];

// Validate entire array at import time once populated.
z.array(serviceSchema).parse(services);

// Helpers
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getDetailPageServices(): Service[] {
  return services.filter((s) => s.hasDetailPage).sort((a, b) => a.order - b.order);
}

export function getOverviewServices(): Service[] {
  return [...services].sort((a, b) => a.order - b.order);
}

export function getHomepageServices(): Service[] {
  return services
    .filter((s) => s.homepageOrder !== undefined)
    .sort((a, b) => (a.homepageOrder ?? 0) - (b.homepageOrder ?? 0));
}
```

- [ ] **Step 2: Verify it parses**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add data/services.ts
git commit -m "feat(data): add services Zod schema and helpers

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 17: Author the "websites" service

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `data/services.ts`

- [ ] **Step 1: Add the service object to the `services` array**

Replace `export const services: Service[] = [];` with:

```ts
export const services: Service[] = [
  {
    slug: "websites",
    title: "Small business websites that bring in real business",
    shortTitle: "Websites",
    tagline: "A fast, clear site your customers actually use.",
    icon: "globe",
    hasDetailPage: true,
    order: 1,
    homepageOrder: 1,
    summary:
      "A website purpose-built for a small business: fast on a phone, clear about what you do, easy to update, and set up to be found on Google. Delivered in 2–4 weeks for a fixed price.",
    problems: [
      "Your site hasn't been updated since 2019.",
      "It's slow, looks dated on a phone, and the contact form doesn't work.",
      "You're losing customers to competitors whose site just looks better.",
      "You don't know how to change anything without breaking it.",
    ],
    whatYouGet: [
      "A fast, mobile-first website with pages tailored to your business.",
      "A contact form that actually reaches you, plus spam protection.",
      "Basic on-page SEO set up for your service area.",
      "Simple content editing — no developer required for copy changes.",
      "Analytics wired up so you know what's working.",
      "Every login handed over at launch. You own everything.",
    ],
    faqs: [
      {
        q: "Do I need to provide all the copy?",
        a: "No — I can draft it for you from a short interview, or start from what you have and tighten it up. You always have final say.",
      },
      {
        q: "Do I need to pay for hosting separately?",
        a: "Yes, but it's cheap — usually $20–30/month on Vercel or similar. I set it up in your name so you own the account from day one.",
      },
      {
        q: "What if I want to add pages later?",
        a: "You can. Either edit copy yourself (you'll get a short walkthrough at launch) or I can add pages under a maintenance plan or one-off engagement.",
      },
    ],
    audiences: [
      "Trades and contractors",
      "Restaurants and cafés",
      "Clinics and wellness practices",
      "Real estate",
      "Retail and service businesses",
    ],
    seo: {
      metaTitle:
        "Small business website design · Kelowna + remote · Tom Horne",
      metaDescription:
        "Fast, clear small business websites for Kelowna and remote clients across Canada. Fixed price, 2–4 weeks, no retainers. Built by Tom Horne.",
    },
    schemaServiceType: "Website Design",
  },
];
```

- [ ] **Step 2: Verify it parses**

```bash
pnpm typecheck
```

Expected: exits 0. Runtime parse happens on first import — run a quick smoke test:

```bash
node -e "require('./data/services.ts')" 2>&1 | head -5
```

This will fail (Node can't parse TS natively), but `pnpm build` does the real parse. Save the full build check for Task 24.

- [ ] **Step 3: Commit**

```bash
git add data/services.ts
git commit -m "feat(data): author websites service

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 18: Author the "google-maps" service

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `data/services.ts`

- [ ] **Step 1: Append to the `services` array (after the websites entry)**

```ts
  {
    slug: "google-maps",
    title: "Google Maps optimization for local businesses",
    shortTitle: "Google Maps",
    tagline: "Get found when someone searches 'near me'.",
    icon: "map-pin",
    hasDetailPage: true,
    order: 2,
    homepageOrder: 2,
    summary:
      "Your Google Business Profile, cleaned up and optimized for the searches that actually send you customers. Faster, cheaper, and more targeted than broad SEO.",
    problems: [
      "Your business doesn't show up when people search nearby.",
      "Your hours, phone number, or address are wrong or inconsistent.",
      "Competitors with worse service are outranking you on Maps.",
      "You have no reviews, or old negative ones are stuck at the top.",
    ],
    whatYouGet: [
      "Full audit of your Google Business Profile and local listings.",
      "NAP (name, address, phone) consistency across the web.",
      "Category and service selections tuned for your actual searches.",
      "Photos, posts, and Q&A populated for signal and trust.",
      "A review-request flow that fits how your business actually works.",
      "A 90-day plan and tracking so you can see movement.",
    ],
    faqs: [
      {
        q: "Can you guarantee I'll be number one on Maps?",
        a: "No — anyone who does is lying. I can tell you what's holding you back, fix it, and show you measurable movement within 90 days. Competition, proximity, and reviews matter as much as optimization.",
      },
      {
        q: "Do I need a website for this to work?",
        a: "Not strictly — a good Google Business Profile can carry you alone. But a matching website with consistent NAP reinforces your signals and gives customers a place to learn more.",
      },
      {
        q: "Is this a one-time thing or ongoing?",
        a: "The core optimization is one-time. Keeping it healthy (new photos, posts, review responses) is a small ongoing job — either you do it or it's part of a maintenance plan.",
      },
    ],
    audiences: [
      "Local retailers",
      "Restaurants and cafés",
      "Home service providers (plumbers, electricians, landscapers)",
      "Clinics and wellness practices",
      "Any business whose customers search 'near me'",
    ],
    seo: {
      metaTitle:
        "Google Maps optimization · Kelowna + Okanagan · Tom Horne",
      metaDescription:
        "Get your business found on Google Maps. Profile optimization, NAP consistency, and a 90-day plan for Kelowna, Okanagan, and remote clients across Canada.",
    },
    schemaServiceType: "Local SEO Service",
  },
```

- [ ] **Step 2: Verify**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add data/services.ts
git commit -m "feat(data): author google-maps service

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 19: Author the "booking-systems" service

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `data/services.ts`

- [ ] **Step 1: Append the service**

```ts
  {
    slug: "booking-systems",
    title: "Online booking that saves you hours every week",
    shortTitle: "Booking systems",
    tagline: "Customers book themselves. You stop playing phone tag.",
    icon: "calendar",
    hasDetailPage: true,
    order: 3,
    homepageOrder: 3,
    summary:
      "A booking system set up for your business — calendar, services, pricing, reminders, and payment if you want it. Integrated with your website, Google profile, and inbox.",
    problems: [
      "You're answering the same scheduling texts every day.",
      "No-shows and last-minute cancellations are killing your week.",
      "Customers want to book outside business hours and can't.",
      "Your current booking tool doesn't sync with your actual calendar.",
    ],
    whatYouGet: [
      "A booking tool chosen to fit your business (not sold to you).",
      "Services, durations, pricing, and availability configured.",
      "Calendar sync so double-bookings can't happen.",
      "Automatic confirmation and reminder emails/SMS.",
      "Optional deposits or full payment at booking.",
      "'Book now' links on your site, Google profile, and socials.",
    ],
    faqs: [
      {
        q: "Which booking tool do you use?",
        a: "It depends on your business. Cal.com, Acuity, SimplyBook, Square Appointments, and a few others all have tradeoffs. I recommend one that fits your services, volume, and budget — not whichever I have a referral code for.",
      },
      {
        q: "Will it work with my existing calendar?",
        a: "Yes — Google Calendar, iCloud, and Outlook all sync. Your day view stays the source of truth; bookings just land there automatically.",
      },
      {
        q: "Can I take deposits or full payment up front?",
        a: "Yes. Most tools integrate Stripe for deposits, full payment, or no-show fees. I'll set up whichever policy makes sense for your business.",
      },
    ],
    audiences: [
      "Salons and barbers",
      "Clinics and wellness practices",
      "Personal trainers and coaches",
      "Restaurants taking reservations",
      "Service businesses with consultations",
    ],
    seo: {
      metaTitle:
        "Online booking systems for service businesses · Tom Horne",
      metaDescription:
        "Online booking setup for salons, clinics, trainers, and service businesses. Calendar sync, reminders, and payment. Kelowna and remote.",
    },
    schemaServiceType: "Booking Service",
  },
```

- [ ] **Step 2: Verify**

```bash
pnpm typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add data/services.ts
git commit -m "feat(data): author booking-systems service

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 20: Author the remaining three services (redesigns, automation, maintenance)

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Modify: `data/services.ts`

These three are overview-only (`hasDetailPage: false`). Shorter content.

- [ ] **Step 1: Append the three services**

```ts
  {
    slug: "redesigns",
    title: "Website redesigns",
    shortTitle: "Redesigns",
    tagline: "Your site, but better — and actually yours.",
    icon: "paintbrush",
    hasDetailPage: false,
    order: 4,
    summary:
      "A tired site gets a modern redesign you control. Keep your domain and content, lose the Wix/Squarespace fees and the 2015 layout.",
    problems: [
      "Your site was built by someone who's gone, on a platform you can't update.",
      "It looks out of date on phones.",
      "You're paying a big monthly fee for software you don't use.",
    ],
    whatYouGet: [
      "A faster, cleaner site with the content reorganized for 2026.",
      "Migration to a platform you own (no lock-in).",
      "Domain and email stay in place — no downtime.",
      "Every login handed over at launch.",
    ],
    faqs: [
      {
        q: "Will my Google rankings be affected?",
        a: "Done right, rankings hold or improve. I map every old URL to a new one with redirects, preserve page titles and meta, and migrate content carefully.",
      },
      {
        q: "How long will the old site stay up?",
        a: "Until launch day. I build the new site on a staging URL, we review it, and cut over in one step. Zero downtime for customers.",
      },
      {
        q: "Can I keep my current domain and email?",
        a: "Yes. Domains move with us or stay where they are — your call. Email (Google Workspace, Microsoft 365, etc.) is untouched.",
      },
    ],
    audiences: ["Anyone on Wix, Squarespace, or GoDaddy Builder", "Sites built before 2020", "Businesses outgrowing their current platform"],
    seo: {
      metaTitle: "Website redesigns for small businesses · Tom Horne",
      metaDescription:
        "Modern redesigns with zero-downtime migration, preserved rankings, and no platform lock-in. Kelowna and remote.",
    },
    schemaServiceType: "Website Redesign",
  },
  {
    slug: "automation",
    title: "Small business automation",
    shortTitle: "Automation",
    tagline: "Stop doing the same thing every day by hand.",
    icon: "workflow",
    hasDetailPage: false,
    order: 5,
    summary:
      "The tasks you do every week that a computer could do instead — invoices, reminders, lead intake, review requests, report generation. Built with the tools you already pay for.",
    problems: [
      "You copy the same thing between Gmail, your spreadsheet, and your booking tool.",
      "Leads fall through the cracks because nobody follows up.",
      "You're paying for tools that don't talk to each other.",
    ],
    whatYouGet: [
      "A clear map of where your time is actually going.",
      "Automations built in the tools you own (Zapier, Make, Google Workspace, or custom).",
      "Documentation so a team member can run or change them.",
      "A small, focused scope — we fix the top 2–3 pain points, not everything at once.",
    ],
    faqs: [
      {
        q: "Will I be locked into a platform?",
        a: "No. I build with tools you already pay for where possible. When custom code is the right call, it lives in your account and runs on infrastructure you own.",
      },
      {
        q: "What does a typical project look like?",
        a: "A 30-minute audit, a short written plan with 2–3 automations we'll build, a fixed price, and 1–2 weeks of work. You get a walkthrough and written documentation at the end.",
      },
      {
        q: "Do you build AI chatbots?",
        a: "Sometimes — only when they make sense. For most small businesses, a better booking flow or a follow-up automation will move more revenue than a chatbot.",
      },
    ],
    audiences: ["Service businesses drowning in admin", "Owners who spend more time on ops than on work"],
    seo: {
      metaTitle: "Small business automation · Tom Horne",
      metaDescription:
        "Automation for small businesses — lead intake, invoicing, reminders, reporting. Built on tools you already use. Kelowna and remote.",
    },
    schemaServiceType: "Business Process Automation",
  },
  {
    slug: "maintenance",
    title: "Monthly website maintenance",
    shortTitle: "Maintenance",
    tagline: "Someone looking after your site so you don't have to.",
    icon: "wrench",
    hasDetailPage: false,
    order: 6,
    summary:
      "Flat monthly fee, predictable scope: I keep your site fast, up to date, and responsive to small change requests. You stop worrying about it.",
    problems: [
      "Plugins, SSL, backups, security updates — you're not going to touch any of it.",
      "Small changes pile up because you don't want to nag the last developer.",
      "Something is going to break and you won't know until a customer tells you.",
    ],
    whatYouGet: [
      "Monthly updates (framework, plugins, security patches, backups verified).",
      "A set number of small change requests per month (copy, images, pages).",
      "Uptime monitoring with alerts to me, not you.",
      "Performance and analytics check-in every quarter.",
      "One contact — me. No ticket system.",
    ],
    faqs: [
      {
        q: "Is this a long-term contract?",
        a: "No. Month-to-month. Cancel any time; you take all your logins with you.",
      },
      {
        q: "What counts as a 'small change request'?",
        a: "A paragraph rewrite, a new image, a hours-of-operation update, adding a page from existing content. Anything bigger gets a quick written quote — no surprises.",
      },
      {
        q: "Do I need to have had you build the site originally?",
        a: "No. Most of my maintenance clients come from other developers. I do a short technical audit before starting so we both know what we're getting into.",
      },
    ],
    audiences: ["Business owners who don't want to think about the website", "Sites built by developers who've moved on"],
    seo: {
      metaTitle: "Monthly website maintenance · Tom Horne",
      metaDescription:
        "Flat-rate monthly maintenance: updates, backups, monitoring, and small changes. Month-to-month. Kelowna and remote.",
    },
    schemaServiceType: "Website Maintenance",
  },
];
```

- [ ] **Step 2: Verify**

```bash
pnpm typecheck
pnpm build
```

Expected: both exit 0. `pnpm build` is now the real parse check — it imports `data/services.ts` and runs the Zod `parse` at module load.

- [ ] **Step 3: Commit**

```bash
git add data/services.ts
git commit -m "feat(data): author redesigns, automation, maintenance services

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 21: Create lib/seo.ts with canonicalUrl — TDD

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `lib/__tests__/seo.test.ts`
- Create: `lib/seo.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/seo.test.ts`:

```ts
import { canonicalUrl } from "@/lib/seo";

describe("canonicalUrl", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://tomhorne.dev";
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  });

  it("returns the site URL unchanged for the root path", () => {
    expect(canonicalUrl("/")).toBe("https://tomhorne.dev/");
  });

  it("joins a subpath without a trailing slash", () => {
    expect(canonicalUrl("/about")).toBe("https://tomhorne.dev/about");
  });

  it("normalizes leading slashes", () => {
    expect(canonicalUrl("about")).toBe("https://tomhorne.dev/about");
  });

  it("strips any trailing slash from the subpath", () => {
    expect(canonicalUrl("/services/websites/")).toBe(
      "https://tomhorne.dev/services/websites",
    );
  });

  it("collapses consecutive slashes", () => {
    expect(canonicalUrl("//services///websites")).toBe(
      "https://tomhorne.dev/services/websites",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm test -- seo.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/seo'".

- [ ] **Step 3: Write the minimal implementation**

Create `lib/seo.ts`:

```ts
/**
 * Build a canonical URL for the given path, using NEXT_PUBLIC_SITE_URL as the base.
 * Normalizes slashes and strips trailing slashes (except for the root).
 */
export function canonicalUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

  if (path === "/" || path === "") {
    return `${base}/`;
  }

  const normalized = path.replace(/\/+/g, "/").replace(/^\/?/, "/").replace(/\/$/, "");
  return `${base}${normalized}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm test -- seo.test.ts
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/seo.ts lib/__tests__/seo.test.ts
git commit -m "feat(lib): add canonicalUrl helper with tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 22: Create lib/faqs.ts with mergeFaqs — TDD

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `lib/__tests__/faqs.test.ts`
- Create: `lib/faqs.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/faqs.test.ts`:

```ts
import { mergeFaqs } from "@/lib/faqs";
import type { Faq } from "@/data/faqs";

const service: Faq[] = [
  { q: "How long does a website take?", a: "2–4 weeks." },
  { q: "Do you host the site?", a: "No — you own hosting." },
];

const global: Faq[] = [
  { q: "How do you charge?", a: "Fixed price." },
  { q: "  how long does a website take?  ", a: "Duplicate (different casing/whitespace)." },
  { q: "Who owns the site?", a: "You do." },
];

describe("mergeFaqs", () => {
  it("puts service FAQs first, globals second", () => {
    const result = mergeFaqs(service, global);
    expect(result[0].q).toBe("How long does a website take?");
    expect(result[1].q).toBe("Do you host the site?");
    expect(result[2].q).toBe("How do you charge?");
  });

  it("dedupes by question text, case-insensitive, whitespace-trimmed", () => {
    const result = mergeFaqs(service, global);
    const qs = result.map((f) => f.q.trim().toLowerCase());
    expect(qs.filter((q) => q === "how long does a website take?").length).toBe(1);
  });

  it("keeps the service answer when a duplicate would come from globals", () => {
    const result = mergeFaqs(service, global);
    const match = result.find(
      (f) => f.q.trim().toLowerCase() === "how long does a website take?",
    );
    expect(match?.a).toBe("2–4 weeks.");
  });

  it("returns an empty array when both inputs are empty", () => {
    expect(mergeFaqs([], [])).toEqual([]);
  });

  it("returns service-only when globals empty", () => {
    expect(mergeFaqs(service, [])).toEqual(service);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm test -- faqs.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/faqs'".

- [ ] **Step 3: Write the implementation**

Create `lib/faqs.ts`:

```ts
import type { Faq } from "@/data/faqs";

function normalizeQuestion(q: string): string {
  return q.trim().toLowerCase();
}

/**
 * Merge service-level and global FAQs.
 * - Service FAQs appear first, globals second.
 * - Deduplicate by question text (case-insensitive, whitespace-trimmed).
 * - When a duplicate is found across sources, the service entry wins.
 */
export function mergeFaqs(serviceFaqs: Faq[], globalFaqs: Faq[]): Faq[] {
  const seen = new Set<string>();
  const out: Faq[] = [];

  for (const faq of [...serviceFaqs, ...globalFaqs]) {
    const key = normalizeQuestion(faq.q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(faq);
  }

  return out;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm test -- faqs.test.ts
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/faqs.ts lib/__tests__/faqs.test.ts
git commit -m "feat(lib): add mergeFaqs helper with tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 23: Create lib/jsonLd.ts with structured data builders — TDD

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `lib/__tests__/jsonLd.test.ts`
- Create: `lib/jsonLd.ts`

The builders take typed inputs and emit plain objects suitable for `<script type="application/ld+json">`. No string escaping concerns — `JSON.stringify` handles that at render time in the components that use these builders.

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/jsonLd.test.ts`:

```ts
import type { SiteMetadata } from "@/data/metadata";
import type { Service } from "@/data/services";
import type { Faq } from "@/data/faqs";
import {
  buildProfessionalServiceJsonLd,
  buildServiceJsonLd,
  buildPersonJsonLd,
  buildFaqPageJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/jsonLd";

const site: SiteMetadata = {
  name: "Tom Horne",
  title: "Small business web services",
  role: "Web services",
  bio: "bio text",
  email: "contact@tomhorne.dev",
  location: "Kelowna, BC, Canada",
  availability: "available",
  social: {
    github: "https://github.com/afk-bro",
    linkedin: "https://linkedin.com/in/tom-horne",
  },
  siteUrl: "https://tomhorne.dev",
  serviceAreas: ["Kelowna", "Vernon"],
  cta: {
    primaryLabel: "Book a call",
    primaryHref: "/book",
    secondaryLabel: "Request a quote",
    secondaryHref: "/contact",
  },
};

describe("buildProfessionalServiceJsonLd", () => {
  it("emits @type ProfessionalService with provider fields", () => {
    const ld = buildProfessionalServiceJsonLd(site);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("ProfessionalService");
    expect(ld.name).toBe("Tom Horne");
    expect(ld.url).toBe("https://tomhorne.dev");
    expect(ld.email).toBe("contact@tomhorne.dev");
  });

  it("includes areaServed from serviceAreas", () => {
    const ld = buildProfessionalServiceJsonLd(site);
    expect(ld.areaServed).toEqual([
      { "@type": "AdministrativeArea", name: "Kelowna" },
      { "@type": "AdministrativeArea", name: "Vernon" },
    ]);
  });
});

describe("buildServiceJsonLd", () => {
  const service: Partial<Service> = {
    slug: "websites",
    title: "Small business websites",
    shortTitle: "Websites",
    summary: "Summary copy.",
    schemaServiceType: "Website Design",
  };

  it("emits @type Service with provider, areaServed, and serviceType", () => {
    const ld = buildServiceJsonLd(
      service as Service,
      site,
      "https://tomhorne.dev/services/websites",
    );
    expect(ld["@type"]).toBe("Service");
    expect(ld.serviceType).toBe("Website Design");
    expect(ld.url).toBe("https://tomhorne.dev/services/websites");
    expect(ld.provider?.["@type"]).toBe("ProfessionalService");
    expect(ld.provider?.name).toBe("Tom Horne");
    expect(ld.areaServed).toHaveLength(2);
  });
});

describe("buildPersonJsonLd", () => {
  it("emits @type Person for Tom", () => {
    const ld = buildPersonJsonLd(site);
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Tom Horne");
    expect(ld.sameAs).toEqual([
      "https://github.com/afk-bro",
      "https://linkedin.com/in/tom-horne",
    ]);
  });
});

describe("buildFaqPageJsonLd", () => {
  const faqs: Faq[] = [
    { q: "Q1?", a: "A1." },
    { q: "Q2?", a: "A2." },
  ];

  it("emits @type FAQPage with mainEntity array", () => {
    const ld = buildFaqPageJsonLd(faqs);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Q1?",
      acceptedAnswer: { "@type": "Answer", text: "A1." },
    });
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("emits a BreadcrumbList from URL segments", () => {
    const ld = buildBreadcrumbJsonLd("/services/websites", site);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://tomhorne.dev/",
    });
    expect(ld.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://tomhorne.dev/services",
    });
    expect(ld.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Websites",
      item: "https://tomhorne.dev/services/websites",
    });
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
pnpm test -- jsonLd.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/jsonLd'".

- [ ] **Step 3: Write the implementation**

Create `lib/jsonLd.ts`:

```ts
import type { SiteMetadata } from "@/data/metadata";
import type { Service } from "@/data/services";
import type { Faq } from "@/data/faqs";

type AreaServedEntry = { "@type": "AdministrativeArea"; name: string };

function areaServed(site: SiteMetadata): AreaServedEntry[] {
  return site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name }));
}

function titleCaseSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildProfessionalServiceJsonLd(site: SiteMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.siteUrl,
    email: site.email,
    description: site.bio,
    areaServed: areaServed(site),
    sameAs: [site.social.github, site.social.linkedin].filter(Boolean),
  } as const;
}

export function buildServiceJsonLd(
  service: Service,
  site: SiteMetadata,
  canonicalUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.schemaServiceType,
    description: service.summary,
    url: canonicalUrl,
    areaServed: areaServed(site),
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.siteUrl,
      email: site.email,
    },
  };
}

export function buildPersonJsonLd(site: SiteMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.siteUrl,
    email: site.email,
    description: site.bio,
    sameAs: [site.social.github, site.social.linkedin].filter(Boolean),
  } as const;
}

export function buildFaqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function buildBreadcrumbJsonLd(path: string, site: SiteMetadata) {
  const segments = path.split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${site.siteUrl}/`,
    },
  ];

  let acc = "";
  segments.forEach((segment, idx) => {
    acc += `/${segment}`;
    items.push({
      "@type": "ListItem",
      position: idx + 2,
      name: titleCaseSegment(segment),
      item: `${site.siteUrl}${acc}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
```

- [ ] **Step 4: Run to verify pass**

```bash
pnpm test -- jsonLd.test.ts
```

Expected: all tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/jsonLd.ts lib/__tests__/jsonLd.test.ts
git commit -m "feat(lib): add JSON-LD builders with tests

ProfessionalService, Service, Person, FAQPage, BreadcrumbList.
Derives areaServed from siteMetadata.serviceAreas; never hand-authored.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 24: Create lib/inquirySchema.ts — TDD

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

**Files:**
- Create: `lib/__tests__/inquirySchema.test.ts`
- Create: `lib/inquirySchema.ts`

The schema is used on the client (React Hook Form) and re-parsed on the server in `/api/contact`. Used in Phase 4 — built now so Phase 2 can type `<InquiryForm />` props against it.

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/inquirySchema.test.ts`:

```ts
import { inquirySchema } from "@/lib/inquirySchema";

const validInput = {
  name: "Jane Doe",
  email: "jane@example.com",
  services: ["websites"],
  description: "I need a new website for my bakery in Kelowna.",
};

describe("inquirySchema", () => {
  it("accepts the minimum required fields", () => {
    const result = inquirySchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = inquirySchema.safeParse({ ...validInput, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = inquirySchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one service", () => {
    const result = inquirySchema.safeParse({ ...validInput, services: [] });
    expect(result.success).toBe(false);
  });

  it("requires a description of at least 10 characters", () => {
    const result = inquirySchema.safeParse({
      ...validInput,
      description: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional businessName", () => {
    const result = inquirySchema.safeParse({
      ...validInput,
      businessName: "Acme Co",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional phone", () => {
    const result = inquirySchema.safeParse({
      ...validInput,
      phone: "+1-250-555-1234",
    });
    expect(result.success).toBe(true);
  });

  it("validates currentWebsite as URL when present", () => {
    const invalid = inquirySchema.safeParse({
      ...validInput,
      currentWebsite: "not a url",
    });
    expect(invalid.success).toBe(false);

    const valid = inquirySchema.safeParse({
      ...validInput,
      currentWebsite: "https://example.com",
    });
    expect(valid.success).toBe(true);
  });

  it("allows currentWebsite to be undefined or empty string", () => {
    const undef = inquirySchema.safeParse({ ...validInput });
    expect(undef.success).toBe(true);
    const empty = inquirySchema.safeParse({
      ...validInput,
      currentWebsite: "",
    });
    expect(empty.success).toBe(true);
  });

  it("accepts known budget values", () => {
    for (const budget of [
      "under-2k",
      "2k-5k",
      "5k-10k",
      "10k-25k",
      "25k-plus",
      "not-sure",
    ]) {
      const result = inquirySchema.safeParse({ ...validInput, budget });
      expect(result.success).toBe(true);
    }
  });

  it("rejects unknown budget values", () => {
    const result = inquirySchema.safeParse({
      ...validInput,
      budget: "loaded",
    });
    expect(result.success).toBe(false);
  });

  it("accepts known timeline values", () => {
    for (const timeline of [
      "asap",
      "1-3-months",
      "3-6-months",
      "6-plus-months",
      "flexible",
    ]) {
      const result = inquirySchema.safeParse({ ...validInput, timeline });
      expect(result.success).toBe(true);
    }
  });

  it("requires honeypot field to be empty when present", () => {
    const ok = inquirySchema.safeParse({ ...validInput, honeypot: "" });
    expect(ok.success).toBe(true);
    const bot = inquirySchema.safeParse({
      ...validInput,
      honeypot: "i am a bot",
    });
    expect(bot.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
pnpm test -- inquirySchema.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/inquirySchema'".

- [ ] **Step 3: Write the implementation**

Create `lib/inquirySchema.ts`:

```ts
import { z } from "zod";

export const budgetEnum = z.enum([
  "under-2k",
  "2k-5k",
  "5k-10k",
  "10k-25k",
  "25k-plus",
  "not-sure",
]);

export const timelineEnum = z.enum([
  "asap",
  "1-3-months",
  "3-6-months",
  "6-plus-months",
  "flexible",
]);

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), {
    message: "Enter a full URL (https://…) or leave empty.",
  })
  .optional();

export const inquirySchema = z.object({
  // Required
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  services: z.array(z.string().min(1)).min(1, "Choose at least one service"),
  description: z
    .string()
    .trim()
    .min(10, "Tell me a little more (10+ characters)"),

  // Optional
  businessName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  currentWebsite: optionalUrl,
  budget: budgetEnum.optional(),
  timeline: timelineEnum.optional(),

  // Honeypot — must be empty when present
  honeypot: z.literal("").optional(),
});

export type Inquiry = z.infer<typeof inquirySchema>;
```

- [ ] **Step 4: Run to verify pass**

```bash
pnpm test -- inquirySchema.test.ts
```

Expected: all tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/inquirySchema.ts lib/__tests__/inquirySchema.test.ts
git commit -m "feat(lib): add shared inquiry Zod schema with tests

Single source of truth for the Phase 4 /contact form — used by
React Hook Form on the client and re-parsed in /api/contact.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 25: Run full verification and push Phase 1

**Working directory:** `C:\Users\kayla\dev\projects\business_site`

- [ ] **Step 1: Run the full test suite**

```bash
pnpm test
```

Expected: all tests from Tasks 21–24 pass (roughly 30+ test cases across 4 files). Exit 0.

- [ ] **Step 2: Typecheck, lint, build**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Expected: all three exit 0.

- [ ] **Step 3: Sanity-check data parses at build time**

The `pnpm build` in Step 2 imports each `data/*.ts` file and runs the Zod `.parse()` call at the bottom of each — if data were invalid, the build would fail. Confirm by checking the build output doesn't contain "Zod" in any error.

```bash
pnpm build 2>&1 | grep -i zod || echo "No Zod errors"
```

Expected: `No Zod errors`.

- [ ] **Step 4: Push to origin**

```bash
git push
```

Expected: all Phase 1 commits visible on GitHub.

- [ ] **Step 5: Verify on GitHub**

Open `https://github.com/afk-bro/business_site` and check the latest commits show the Phase 1 work.

---

## Verification checklist (end of plan)

When every task above is complete, the following should all be true:

- `C:\Users\kayla\dev\projects\business_site` exists and has a working Next.js dev server (`pnpm dev`).
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test` all pass.
- `/` renders the headline placeholder; `/about` and `/contact` render their placeholders.
- `data/services.ts` exports 6 validated services; 3 have `hasDetailPage: true`.
- `data/faqs.ts` and `data/process.ts` export validated content.
- `data/metadata.ts` includes `serviceAreas` and `cta` fields.
- `lib/seo.ts`, `lib/faqs.ts`, `lib/jsonLd.ts`, `lib/inquirySchema.ts` exist with passing tests.
- Spec + this plan are committed in `business_site/docs/superpowers/{specs,plans}/`.
- Remote on GitHub (`afk-bro/business_site`) matches local.

### Intentionally deferred

- **`data/projects.ts` curation.** The spec mentions carrying a curated subset of portfolio projects across for `relatedProjectSlugs` references. None of the six services author a `relatedProjectSlugs` array in this plan, and Phase 2 components aren't built yet, so projects.ts is deferred until Phase 2 or Phase 3 — whenever a service detail page wants to reference prior work. When it lands, the field is optional on `serviceSchema`, so adding it is a non-breaking change.

### Upcoming plans

- **Phase 2** — layout primitives + section components (Hero, CtaPair, TrustStrip, FaqSection, Process, ServiceCard, PricingBlock, RelatedWork, InquiryForm, CalEmbed, Navigation, Footer).
- **Phase 3** — page composition (home, /services, /services/[slug], /about, /book, /contact, /contact/thanks, /legal/privacy).
- **Phase 4** — `/api/contact` rework + Resend wiring + rate limit + honeypot.
- **Phase 5** — JSON-LD emission, sitemap, OG images, Vercel Analytics.
- **Phase 6** — accessibility pass, Lighthouse, launch.
