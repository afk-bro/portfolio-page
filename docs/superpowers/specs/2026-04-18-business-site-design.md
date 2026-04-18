# Business Site Design

**Date:** 2026-04-18
**Status:** Draft — pending user review
**Target repo:** `https://github.com/afk-bro/business_site`
**Target local path:** `C:\Users\kayla\dev\projects\business_site`
**Starting point:** Copy of the existing `portfolio_page` codebase, stripped and reworked.

This spec belongs with the business_site project. It is authored here in `portfolio_page` for convenience while `business_site` is still an empty remote; Phase 0 of the build copies it across to the new repo.

---

## 1. Purpose

Pivot from a personal developer portfolio to a small-business services site for Tom Horne. The portfolio site stays untouched; this is a separate project in a separate repo.

**Business model:** Solo freelance/consulting.

**Services offered:**
- Websites (new builds)
- Redesigns
- Google Maps optimization
- Booking systems
- Automation
- Monthly maintenance

**Target audience:**
- Primary: local small businesses in Kelowna / Okanagan (trades, restaurants, salons, clinics, gyms, real estate, etc.).
- Secondary: small businesses broadly (remote clients across Canada / North America).
- Tertiary: SaaS / startup work where it lands — site retains enough dev credibility to serve these without leading with it.

**Primary conversion goal:** Book a discovery call. Secondary: Request a quote.

**Brand:** Personal — "Tom Horne".

**Timeline:** ~1 month. Do it right (full IA, SEO, proper copy).

## 2. Information architecture

```
/                          Home: hero, services grid, trust strip, process, FAQ preview, CTA
/services                  Overview page: all 6 services as cards
/services/websites         Dedicated detail page (from template + data)
/services/google-maps      Dedicated detail page
/services/booking-systems  Dedicated detail page
/about                     Why work with me, who I help, how I work, where I work, what to expect
/book                      Cal.com embed — primary CTA target
/contact                   Project-inquiry form (Resend-backed) — secondary CTA target
/contact/thanks            Post-submission confirmation
/blog                      Scaffolded only; not linked in nav until posts exist
/legal/privacy             Minimal privacy policy (required because /contact collects data)
```

**Detail-page selection rationale:** websites, Google Maps, and booking systems have the strongest local-search intent. Redesigns, automation, and maintenance live as cards on `/services` (usually follow-on sales, not primary search acquisition). A fourth detail page can be added later by flipping `hasDetailPage: true` on an existing service record.

**Service card click behaviour:**
- If `service.hasDetailPage === true`: card links to `/services/<slug>`.
- If `service.hasDetailPage === false`: card links to `/contact?service=<slug>`. The inquiry form reads the query param and pre-selects that service in the multi-select.

**Navigation:**
- Header: `Services` · `About` · `Book a call` (primary button) · theme toggle.
- Mobile: hamburger with the same items.
- Footer: four columns — `Services` (Websites, Google Maps, Booking systems, All services) · `About` (How I work, Service area, Process) · `Connect` (Book a call, GitHub, LinkedIn) · `Contact` (Request a quote, Privacy).

## 3. Content model

Service content drives multiple surfaces (home, `/services`, detail pages, JSON-LD). Lives in `data/services.ts`, Zod-validated, mirrors the `data/projects.ts` pattern.

```ts
const iconKey = z.enum(["globe", "paintbrush", "map-pin", "calendar", "workflow", "wrench"]);

serviceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  tagline: z.string(),
  icon: iconKey,

  hasDetailPage: z.boolean(),
  order: z.number(),                            // position on /services overview
  homepageOrder: z.number().optional(),         // absent → not shown on home

  summary: z.string(),
  problems: z.array(z.string()),
  whatYouGet: z.array(z.string()),

  // Rendering rule: service.process ?? globalProcess
  process: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional(),

  // Service detail pages must have at least 3 FAQs for FAQPage schema emission
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(3),

  // Absent → no pricing block rendered
  pricing: z.object({
    mode: z.enum(["starting-at", "tiered", "quote-only"]),
    startingAt: z.number().optional(),
    tiers: z.array(z.object({
      name: z.string(),
      price: z.number(),
      includes: z.array(z.string()),
    })).optional(),
  }).optional(),

  // Per-service CTA overrides — fall back to global "Book a call" / "Request a quote"
  primaryCtaLabel: z.string().optional(),
  primaryCtaHref: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),

  relatedProjectSlugs: z.array(z.string()).optional(),
  audiences: z.array(z.string()).optional(),

  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogImage: z.string().optional(),
  }),

  schemaServiceType: z.string(),                // fed to JSON-LD mapper, not hand-authored
});
```

**Other data files:**
- `data/faqs.ts` — global FAQ set (payment, timeline, ownership, process-agnostic questions).
- `data/process.ts` — global process steps (fallback when a service has no `process` override).
- `data/metadata.ts` — extended with `serviceAreas: string[]` (Kelowna, West Kelowna, Lake Country, Vernon, Penticton, Remote across Canada) and CTA copy constants.
- `data/projects.ts` — curated subset of small-biz-relevant projects carried over from portfolio.

**JSON-LD derivation (`lib/jsonLd.ts`):**
- `buildProfessionalServiceJsonLd(siteMetadata)` — root-layout payload.
- `buildServiceJsonLd(service, siteMetadata, canonicalUrl)` — composes full Schema.org `Service` from `service.schemaServiceType`, `siteMetadata.serviceAreas`, and provider info.
- `buildPersonJsonLd(siteMetadata)` — `/about`.
- `buildBreadcrumbJsonLd(path)` — detail pages + legal.
- `buildFaqPageJsonLd(faqs)` — only called from service detail pages.

No hand-authored JSON-LD in page files.

**FAQ merge rule (`lib/faqs.ts`):**
1. Service FAQs first.
2. Global FAQs second.
3. Dedupe by question text (case-insensitive, whitespace-trimmed compare).
4. Visible FAQ sections appear on home, `/services`, and each service detail. `FAQPage` JSON-LD is emitted **only** on service detail pages to avoid thin/duplicated schema across the site.

## 4. Components

### Layout primitives (`components/ui/`)

| Component | Purpose |
|---|---|
| `<Section />` | Horizontal/vertical padding, max-width, optional bg variant |
| `<SectionHeading />` | Eyebrow + heading + supporting copy slots |
| `<PageHeader />` | Compact, action-oriented header for `/contact` and `/book` |

### Section components (`components/sections/`)

| Component | Used on | Notes |
|---|---|---|
| `<Hero />` | home, service detail, `/about` | Variant prop: `"home" \| "service" \| "about"` |
| `<CtaPair />` | home, `/services`, service detail, `/about` | Primary "Book a call" + secondary "Request a quote"; accepts per-service overrides |
| `<ServiceCard />` | home, `/services` | Renders from one `service` object; link target per the rule in Section 2 |
| `<FaqSection />` | home, `/services`, service detail | Accordion; takes Q/A array |
| `<TrustStrip />` | home, `/services`, `/about` | First-class trust section. Today: process/credentials/service areas. Later: testimonials swap in via data without rewriting the component. |
| `<ServiceAreaList />` | home, `/services`, service detail, `/about` | Reads `siteMetadata.serviceAreas` |
| `<Process />` | home, `/about`, service detail | Takes `steps` prop |
| `<PricingBlock />` | service detail (conditional) | Renders all three `pricing.mode` cases |
| `<RelatedWork />` | service detail (conditional) | Resolves `relatedProjectSlugs` against `data/projects.ts` |
| `<InquiryForm />` | `/contact` | Project-inquiry form (see Section 5) |
| `<CalEmbed />` | `/book` | Cal.com inline embed; lazy-loaded |
| `<Navigation />`, `<Footer />` | global layout | Simplified from portfolio |

### Reused as-is from portfolio

- `ThemeProvider`, `ErrorBoundary`, Toast system, Tooltip, `AnimateOnScroll` + `useScrollAnimation` hook.
- Tailwind tokens, `cn()` utility.
- Contact API route scaffolding + Resend wiring (contents rewritten; mechanism retained).

### Dropped from portfolio

- `Skills.tsx` (dev stack list — irrelevant for small-biz audience).
- `TypewriterName.tsx` (portfolio-personality animation).
- `ResumeDetails.tsx`, `/resume` route.
- `/projects` list route stays removed; individual portfolio projects are referenced only via `relatedProjectSlugs` from service pages.
- `/test-*` and `/dev/*` routes.

### Rewritten

- `Hero.tsx` — drops the typewriter; variant-based, each with H1 + subhead + `<CtaPair />`.
- `ProofStrip.tsx` → `<TrustStrip />` — content reframed around process / service area / credibility until testimonials exist.
- `HowIBuild.tsx` → `<Process />` — parameterized via `steps` prop.
- `CallToAction.tsx` → replaced by `<CtaPair />`.
- `Navigation.tsx` — reduced to `Services · About · Book a call`.
- `Footer.tsx` — four-column structure (Services / About / Connect / Contact).

### Service detail page template

`app/services/[slug]/page.tsx` renders a single template, driven by data:

```
Hero (title, summary, CtaPair)
Problems                "Is this you?" list from service.problems
What you get            Checklist from service.whatYouGet
Process                 service.process ?? globalProcess
Who this is for         Renders service.audiences with external label "Best fit for"
Pricing                 Only if service.pricing present (PricingBlock)
[CtaPair]               Only if pricing.mode === "tiered" (substantial block)
Related work            Only if service.relatedProjectSlugs present
FAQ (FaqSection)        service.faqs + global subset, deduped
Service areas
CtaPair
```

## 5. Lead flow

### CTA placement rules (enforced by component composition)

- Every landing page (home, `/services`, service detail, `/about`) renders `<CtaPair />` in hero + at the bottom.
- Service detail pages add a mid-page `<CtaPair />` **only** when `pricing.mode === "tiered"` (enough visual mass to warrant repeating the action).
- `/book` and `/contact` do not render `<CtaPair />` — they are the destinations.
- Footer shows both actions as plain text links.

### Book a call (primary)

```
Any primary CTA → /book

  PageHeader ("Book a free 20-minute call to talk through your project.")
  <CalEmbed /> (lazy-loaded; CAL_EVENT_SLUG env var)
  "What to expect" — 3 short bullets
  Small link: "Prefer to send details first? Request a quote instead →"
```

Cal.com owns confirmation email and calendar invite. No webhook integration needed.

### Request a quote (secondary)

```
Any secondary CTA → /contact

  PageHeader ("Tell me about your project")
  <InquiryForm />
  Small link: "Prefer a quick call? Book one here →"
```

**Inquiry form fields:**

| Field | Required | Type |
|---|---|---|
| Name | Yes | text |
| Email | Yes | email |
| Service interested in | Yes | multi-select (sourced from `data/services.ts`); pre-selects from `?service=<slug>` query param when present |
| Brief description | Yes | textarea |
| Business name | No | text |
| Phone | No | tel |
| Current website | No | URL (validated if present) |
| Budget range | No | select: Under $2k / $2k–$5k / $5k–$10k / $10k–$25k / $25k+ / Not sure |
| Timeline | No | select: ASAP / 1–3 months / 3–6 months / 6+ months / Flexible |
| `[honeypot]` | — | hidden |

**Validation:** `lib/inquirySchema.ts` — single Zod schema used by React Hook Form on the client and re-parsed in the API route.

**API (`app/api/contact/route.ts`, reworked):**
- Parse request body through `inquirySchema`.
- Reject if honeypot filled.
- Rate limit: IP-keyed in-memory bucket, 5 submissions / 10 min / IP. Upgrade to Upstash if abuse materializes.
- On success, Resend sends:
  1. Notification email to Tom — HTML-formatted, all fields.
  2. Auto-reply to client — "Got your inquiry. I'll reply within 1 business day."
- Response: redirect hint → `/contact/thanks`.
- On failure: return field errors (400) or generic server error (500); client shows inline errors + toast.

**`/contact/thanks` page:**
- Headline: "Got it — your inquiry is in."
- Expected reply window: "I'll reply within 1 business day (usually faster)."
- Backup email: plain `mailto:` link to `contact@tomhorne.dev`.
- Call CTA: "Prefer to talk now? **Book a call**" → `/book`.

## 6. SEO, structured data, performance

### Metadata + canonicals

Every route exports Next.js `Metadata` including `alternates.canonical`, generated via `canonicalUrl(path)` in `lib/seo.ts` reading `siteMetadata.siteUrl`. No page ships without a canonical.

Example — Websites detail page:
- `metaTitle`: "Small business website design · Kelowna + remote · Tom Horne"
- `metaDescription`: ~150 chars summarizing the offering and service area.
- Visible H1: "Websites that bring in real business." (natural copy; location phrasing stays in meta, not forced into H1s).

### Structured data (JSON-LD)

| Schema | Where | Source |
|---|---|---|
| `ProfessionalService` | root layout (every page) | `buildProfessionalServiceJsonLd(siteMetadata)` |
| `Service` | each `/services/[slug]` | `buildServiceJsonLd(service, siteMetadata, canonicalUrl)` |
| `FAQPage` | each service detail (requires ≥3 FAQs) | `buildFaqPageJsonLd(mergedFaqs)` |
| `Person` | `/about` | `buildPersonJsonLd(siteMetadata)` |
| `BreadcrumbList` | service detail, `/contact/thanks`, `/legal/privacy` | `buildBreadcrumbJsonLd(path)` |

**Local SEO notes:**
- No street address emitted — remote/home-based. `areaServed` (from `siteMetadata.serviceAreas`) covers the local signal without publishing a home address.
- Keyword targets — metadata only, not H1s: "small business website designer kelowna" (Websites); "google maps optimization kelowna" (Maps); "online booking system" (Booking).

### Sitemap + robots

- `app/sitemap.ts` — auto-generated from the route set + `data/services.ts` detail pages; includes `/contact/thanks` and `/legal/privacy` at low priority.
- `app/robots.ts` — allow all; reference sitemap.

### Open Graph images

Single template at `app/opengraph-image.tsx` (inherits portfolio pattern). Design is brand lockup + page title on flat brand-color background. Consistency + legibility prioritized over per-page visual variation.

### Performance

- Inherit portfolio config: AVIF/WebP image pipeline, `next/font` with `display: swap`, strict security headers (CSP, HSTS, frame options).
- `<CalEmbed />` is lazy-loaded (click-to-load or IntersectionObserver — decided in Phase 3).
- All pages statically generated; `/api/contact` is the only dynamic route.
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- One-shot Lighthouse CI run pre-launch (not wired into CI for now).

### Analytics

Vercel Web Analytics (`@vercel/analytics/react`) in root layout. Free, no cookies, no PIPEDA consent work. No Google Analytics, no tag manager, no third-party analytics.

## 7. Build plan

Six phases. Each ends at a verifiable checkpoint. Total estimate: 12–17 working days.

### Phase 0 — Bootstrap (~1 day)
- Clone `business_site` repo to `C:\Users\kayla\dev\projects\business_site`.
- Copy portfolio codebase across; strip `/projects`, `/resume`, `/test-*`, `/dev`, `Skills.tsx`, `TypewriterName.tsx`, `ResumeDetails.tsx`, portfolio-specific data.
- Update `package.json` name, README, env vars for new site.
- Copy this spec to `business_site/docs/superpowers/specs/` (the original stays in `portfolio_page` as committed; the copy in `business_site` is canonical going forward).
- Initial push; verify CI green.
- **Verify:** `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint` all clean.

### Phase 1 — Content model + data (~2 days)
- `data/services.ts` (Zod schema from Section 3) with all 6 services authored: title, summary, problems, whatYouGet, FAQs (≥3 per detail page), audiences, schemaServiceType, SEO.
- `data/faqs.ts` (global), `data/process.ts` (global steps), `data/metadata.ts` extensions (serviceAreas, CTA copy).
- Curate `data/projects.ts` — keep only small-biz-relevant work.
- `lib/seo.ts`, `lib/jsonLd.ts`, `lib/faqs.ts`, `lib/inquirySchema.ts`.
- **Verify:** Zod parses all data at build time; sanity page lists every service card.

### Phase 2 — Layout primitives + core components (~2–3 days)
- Primitives: `<Section />`, `<SectionHeading />`, `<PageHeader />`.
- Sections: `<CtaPair />`, `<FaqSection />`, `<TrustStrip />`, `<ServiceAreaList />`, `<Process />`, `<ServiceCard />`, `<PricingBlock />`, `<RelatedWork />`.
- Rewritten `<Hero />`, simplified `<Navigation />`, new `<Footer />`.
- **Verify:** dev sandbox route renders each primitive in isolation for visual review.

### Phase 3 — Page composition (~3–4 days)
- Build all pages: home, `/services`, `/services/[slug]`, `/about`, `/book`, `/contact`, `/contact/thanks`, `/legal/privacy`.
- Wire Cal.com embed on `/book` (lazy-loaded, event slug from env).
- **Verify:** manual walkthrough — every CtaPair reaches the right destination, responsive on 3 breakpoints, dark mode OK.

### Phase 4 — Forms + API (~1–2 days)
- Rework `/api/contact/route.ts` around `lib/inquirySchema.ts`.
- Resend: notification + auto-reply emails.
- Honeypot + in-memory rate limiter.
- Success → `/contact/thanks`; errors → toast + inline field errors.
- **Verify:** each failure mode (required missing, honeypot, rate limited, invalid URL) + happy path; both emails arrive; thanks page loads.

### Phase 5 — SEO, JSON-LD, analytics (~1–2 days)
- Metadata + canonical on every route.
- JSON-LD: `ProfessionalService` (root), `Service` + `FAQPage` (detail), `Person` (`/about`), `BreadcrumbList` (detail + legal).
- `app/sitemap.ts`, `app/robots.ts`, single-template OG image.
- Vercel Web Analytics.
- **Verify:** Google Rich Results test passes for each schema type; sitemap includes all routes; Lighthouse SEO ≥ 95 on key pages.

### Phase 6 — Polish + launch (~2–3 days)
- Accessibility pass: keyboard nav, focus styles, form labels, aria on icon buttons (axe-dev-tools or WAVE clean).
- Copy review as skeptical small-biz owner.
- Lighthouse CI one-shot across key pages (mobile + desktop); target ≥ 90 all categories.
- Performance budget check.
- Domain + Resend DNS (user handles; README references the existing lessons-learned doc from portfolio).
- **Verify:** acceptance checks pass; site live on new domain.

## 8. Acceptance criteria

The build is done when all of the following are true:

- All routes listed in Section 2 exist and render.
- `data/services.ts` parses cleanly; all six services authored with real copy (no lorem).
- Every landing page renders `<CtaPair />` in hero + at bottom; service detail pages follow the CtaPair rules in Section 5.
- Project inquiry form: required/optional fields match Section 5; honeypot + rate limit active; both Resend emails deliver; success redirects to `/contact/thanks`; failures show inline + toast errors.
- JSON-LD: every page type emits the correct schemas listed in Section 6; Google Rich Results test passes.
- Every route exports `metadata.alternates.canonical`.
- Lighthouse ≥ 90 all categories on home, `/services`, each service detail, `/about`, `/contact`, `/book` (mobile + desktop).
- Accessibility: axe / WAVE clean on all key pages; full keyboard navigation works.
- Vercel Web Analytics script loads on every page.
- Sitemap includes all public routes; robots allows all and points to sitemap.
- Copy passes a skeptical-small-business-owner read-through.

## 9. Explicitly out of scope

Designed for but not built in this pass:

- Real testimonials (slot exists in `<TrustStrip />`, authored later).
- Blog content (`/blog` route scaffolded, unlinked; first post is a later effort).
- Before/after imagery.
- Final pricing numbers (schema supports them whenever Tom is ready to commit).
- CMS integration (data files are sufficient at this content volume).
- Captcha (honeypot-only until abuse materializes).
- E-commerce / direct checkout.
- Advanced analytics beyond Vercel Web Analytics basics.
