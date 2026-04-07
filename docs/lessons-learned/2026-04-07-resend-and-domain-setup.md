# Lessons Learned: Resend Email and Custom Domain Setup

**Date:** 2026-04-07
**Goal:** Wire up a functional contact form with auto-reply using Resend and a custom domain
**Outcome:** Working contact form sending from `contact@tomhorne.dev` with owner notification and auto-reply to sender

---

## Overview

Replaced a fake contact form (`console.log` + `setTimeout`) with a real Resend-backed API route. Set up `tomhorne.dev` as a custom domain through Cloudflare to enable sending to any email address and receive mail via Cloudflare Email Routing.

---

## What Was Done

### 1. Resend Setup
- Created a Resend account and generated an API key
- Stored the key as `RESEND_API_KEY` in `.env` (already gitignored) and in Vercel environment variables
- Installed the `resend` npm package via `pnpm add resend`
- Created `app/api/contact/route.ts` — a Next.js App Router POST handler that sends two emails in parallel: an owner notification and an auto-reply to the sender

### 2. Domain Registration (Cloudflare)
- Registered `tomhorne.dev` through Cloudflare's domain registrar (wholesale pricing, no markup)
- Cloudflare is the recommended registrar: best DNS management UI, transparent pricing, no renewal hikes

### 3. Resend Domain Verification
- Added `tomhorne.dev` in the Resend dashboard under Domains
- Resend provided DNS TXT records (DKIM) to add in Cloudflare
- Cloudflare DNS verified within minutes
- After verification, can send from any `@tomhorne.dev` address to anyone — not just the Resend account email

### 4. Cloudflare Email Routing (Receiving Mail)
- Enabled Email Routing in Cloudflare dashboard for `tomhorne.dev`
- Created a forwarding rule: `contact@tomhorne.dev` → personal Gmail address
- Cloudflare adds MX records automatically on enable
- Verified the Gmail destination address via a confirmation email from Cloudflare
- Gmail works as the destination — does not have to be the same provider as the "from" domain

### 5. Contact Form Update
- Replaced the `handleSubmit` mock with a `fetch('/api/contact', { method: 'POST' })` call
- Added proper error handling for network failures and API errors
- Auto-reply uses the sender's email as `to` and sets the owner's address as `replyTo` on the notification, so both sides can reply naturally

---

## Pitfalls and Fixes

### Resend free tier limitation
**Problem:** On Resend's free plan without a verified domain, you can only send from `onboarding@resend.dev` and only to the email address on your Resend account. The auto-reply to any external sender will fail.

**Fix:** Verify a custom domain. This unlocks sending to any address on the free tier.

### ProtonMail is irrelevant to domain verification
**Confusion:** Assumed that using ProtonMail as an email client would complicate Resend domain verification or Cloudflare Email Routing.

**Reality:** ProtonMail (or Gmail, or any inbox) is just where you *receive* email. Resend domain verification is purely DNS records at the registrar. Email Routing forwarding destination can be any email address regardless of provider.

### Emails going to spam on a new domain
**Problem:** First test emails from `contact@tomhorne.dev` landed in spam.

**Cause:** New domain with no sending history — spam filters are conservative about unknown senders.

**Partial fix:** Add a DMARC TXT record in Cloudflare DNS:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contact@tomhorne.dev
```
`p=none` is monitor-only and signals to mail servers that DMARC is configured. Deliverability improves naturally over weeks as the domain builds a sending reputation.

### Resend client initialized at module scope
**Problem:** `const resend = new Resend(process.env.RESEND_API_KEY)` at the top of the route file caused the Next.js build to fail with "Missing API key" because Next.js evaluates route modules at build time when collecting page data, and `RESEND_API_KEY` is not set in CI.

**Fix:** Move the `new Resend(...)` call inside the `POST` handler function so it only runs at request time, not at build time.

```ts
// Bad — throws at build time in CI
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) { ... }

// Good — only runs at request time
export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  ...
}
```

### Stale `package-lock.json` conflicting with pnpm
**Problem:** An old `package-lock.json` was committed to the repo from before the pnpm migration. CI used `npm ci` which picked up this file, but it didn't include `resend`, causing install to fail.

**Fix:** Delete `package-lock.json` from the repo (`git rm package-lock.json`) and update the CI workflow to use pnpm instead of npm.

### CI Node version too old
**Problem:** `resend@6.x` requires Node >=20. CI was configured with Node 18.

**Fix:** Update `.github/workflows/ci.yml` to use `node-version: 20` and switch from `npm ci` to `pnpm install --frozen-lockfile`.

### HTML injection in email templates
**Problem:** User-supplied values (`name`, `email`, `message`) were interpolated directly into HTML email templates, allowing HTML injection.

**Fix:** Escape all user input before inserting into HTML:
```ts
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
```

### Request body not validated before use
**Problem:** The API route typed the request body as `Record<string, string>` and destructured it without validation, trusting the client to send the right shape.

**Fix:** Use Zod (already a project dependency) to validate the body before use:
```ts
const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  message: z.string(),
  honeypot: z.string().optional(),
});

const parsed = contactSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
```

---

## Checklist for Future Resend Integrations

- [ ] Store `RESEND_API_KEY` in `.env` (gitignored) and in deployment platform env vars (Vercel)
- [ ] Verify a custom domain in Resend before going live (required to send auto-replies to external addresses)
- [ ] Initialize `new Resend(...)` inside the handler, not at module scope
- [ ] Escape all user input before HTML interpolation in email templates
- [ ] Validate request body with Zod before destructuring
- [ ] Add DMARC record in DNS to improve deliverability
- [ ] Set `replyTo` on notification emails to the sender's address so you can reply directly
- [ ] Set up Cloudflare Email Routing to receive mail at the custom domain address
- [ ] Add `RESEND_API_KEY` to `.env.example` (without the value) so future devs know it's required
