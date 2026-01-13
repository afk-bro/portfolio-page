# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking (tsc --noEmit)
pnpm format       # Format with Prettier
pnpm format:check # Check formatting without writing
```

## Architecture Overview

### Data-Driven Content with Zod Validation

All content lives in `/data` with runtime Zod schema validation:

- `projects.ts` - Project case studies with helper functions (`getProjectBySlug()`, `getFeaturedProjects()`, `getProjectsByTechnology()`)
- `skills.ts` - Skills with categorization (`getGroupedSkills()`, `getFeaturedSkills()`)
- `metadata.ts` - Site-wide configuration

Types are inferred from Zod schemas: `type Project = z.infer<typeof projectSchema>`

### Component Organization

- `/components/sections/` - Page section components (Hero, Navigation, FeaturedProjects, Skills, etc.)
- `/components/ui/` - Reusable primitives (Button, Badge, Toast, Tooltip, AnimateOnScroll)
- Sections are composed in page files (e.g., `/app/page.tsx` imports and arranges sections)

### State Management Patterns

- **Theme**: `ThemeProvider` context with `useTheme()` hook, localStorage persistence, system preference detection
- **Toasts**: `ToastProvider` context with `useToast()` hook for notifications
- **URL State**: Projects filtering uses `useSearchParams` for browser history sync
- **Local State**: React `useState` for component-level state

### Animation System

Two complementary animation approaches:

**Framer Motion (Hero animations)**

- `TypewriterName` component - Character-by-character stagger reveal with mechanical timing
- Hero section uses Framer Motion `Variants` with cascading delays
- Directional animations: `slideFromLeft`, `slideFromRight`, `slideUp`, `slideDown`, `fadeIn`
- Timing synchronized via `getTypewriterDuration()` helper

**CSS-based (Scroll animations)**

- `AnimateOnScroll` component - Wrapper with animation variants (fade-up, fade-in, fade-left, fade-right)
- `useScrollAnimation` hook - Intersection Observer for scroll-triggered animations, respects `prefers-reduced-motion`
- Uses `hasMounted` pattern to prevent hydration mismatches

### Key Custom Utilities

- `cn()` in `/lib/utils.ts` - Tailwind class merging (clsx + twMerge)
- `getTypewriterDuration()` in `/components/ui/TypewriterName.tsx` - Calculate animation duration for cascade timing

### Import Aliases (tsconfig paths)

```typescript
@/components/*  // ./components/*
@/lib/*         // ./lib/*
@/data/*        // ./data/*
@/types/*       // ./types/*
```

## Testing

Feature tests are defined in `feature_list.json` (98 tests covering functional requirements, accessibility, performance, SEO). No Jest/Vitest - uses feature-based acceptance testing documented in JSON.

## Styling

- Tailwind CSS with custom design tokens in `tailwind.config.ts`
- Class-based dark mode (`.dark` class on html element)
- Custom color palette: primary (teal), neutral (slate), semantic (success/warning/error)
- Use `cn()` utility for conditional class merging

## Security & Performance

- Security headers configured in `next.config.js` (CSP, HSTS, frame options)
- Image optimization with AVIF/WebP formats
- Suspense boundaries for lazy loading (projects page)
- Static generation for project detail pages via `generateStaticParams`
