# Analytics & Privacy Plan

## Current state: no analytics provider is active

`trackEvent()` (`src/lib/analytics/events.ts`) remains exactly what it
was in Phase 1: a dev-only `console.info` call, nothing is sent
anywhere. **This phase did not enable GA4, Vercel Analytics, or any
other provider** — per the explicit instruction not to, and per spec
§27's requirement that analytics only go live after cookie/privacy
handling exists. What this phase built is the handling that requirement
was waiting on, plus the exact point in the code where a real provider
call must be added later.

## What was built this phase

### 1. Consent state (`src/lib/analytics/consent.ts`)
`getConsent()` / `setConsent()` / `hasAnalyticsConsent()`, backed by
`localStorage` under the key `consent:analytics:v1`. Fails safe to
`"unset"` if storage is unavailable (private browsing, storage
disabled) rather than throwing.

### 2. Consent banner (`src/components/ui/ConsentBanner.tsx`)
Mounted site-wide in the root layout, shown once per visitor until they
choose. Built to the phase's explicit requirements, each verified with
a real browser test (`consent-test.js`), not assumed:

| Requirement | How it's met | Verified |
|---|---|---|
| Accessible | `role="region"` + `aria-label="Cookie preferences"`; reachable by keyboard after only 3 Tab presses from page load (skip link → nav → banner) | ✅ Puppeteer keyboard-navigation test |
| Minimal | Single-line copy, bottom bar, no modal overlay, no scrim blocking the rest of the page | ✅ Visual review |
| No dark patterns | Both actions use the identical `Button` variant/size — neither is styled to nudge toward "Accept"; no pre-ticked options; no forced choice | ✅ Source review |
| Reject as easy as accept | "Decline" renders first (reading order), same size and style as "Accept" | ✅ Screenshot + DOM order check |
| Preferences persist correctly | Choosing either option hides the banner immediately and it does not reappear on reload | ✅ Puppeteer test: click Decline → reload → banner still hidden, `localStorage` value confirmed `"denied"` |

**Copy is deliberately forward-looking, not a claim about current
behavior:** "This site **may** use analytics cookies... You can accept
or decline" — not "this site uses cookies," since nothing is tracked
today. This avoids the site claiming something false about its own
current behavior while still capturing a real, respected preference
for the moment a provider is actually added.

### 3. `trackEvent()` is now consent-gated
The dev-only console log still fires unconditionally in development
(it sends data nowhere, so gating it would only make local debugging
harder for no privacy benefit). Immediately below it, `trackEvent()`
returns early if `hasAnalyticsConsent()` is false, with a comment
marking exactly where a real provider call belongs — inside that
consent check, so it's structurally impossible to wire up a provider
call that bypasses consent by mistake.

## What was NOT built, deliberately

- **No GA4, no Vercel Analytics, no Meta Pixel** — explicitly out of
  scope this phase, and Meta Pixel is explicitly prohibited by the
  brief regardless of consent status.
- **No cookie *category* granularity** (analytics vs. marketing vs.
  functional, etc.) — this site has exactly one thing that would ever
  need consent (future analytics), so a single accept/decline choice
  is proportionate. Building a multi-category preference center for
  zero currently-existing categories would be speculative complexity
  ahead of need.
- **No consent-management platform (Cookiebot, OneTrust, etc.)** — the
  hand-built banner is sufficient for the site's current single-purpose
  need; revisit only if/when a genuinely complex consent matrix exists.

## What no analytics event ever contains, by design

Confirmed against the actual `AnalyticsEvent` type
(`lib/analytics/events.ts`) — the only two event shapes that exist are:

```ts
{ name: "nmc_booking_click", properties: { source_page, service?, cta_position } }
{ name: "physician_profile_click", properties: { source_page } }
```

No field for symptoms, diagnosis, treatment interest, form input, or
any other health-adjacent free text exists anywhere in the type — it
is structurally impossible to accidentally pass health data through
this contract, not just a policy saying not to.

## Before GA4/Vercel Analytics is actually added (future work, not this phase)

1. Confirm the consent banner's copy and mechanism satisfy whatever
   specific UAE data-protection requirements apply (this plan
   documents the *architecture*, not a legal sign-off — same caveat as
   every other compliance document from this phase).
2. Add the real provider script (e.g. `next/third-parties`'
   `GoogleAnalytics`, or a manual `gtag` snippet), loaded only when
   `hasAnalyticsConsent()` is true — not loaded unconditionally and
   then merely not called, since an unconditionally-loaded script is
   itself a cookie/tracking action some regulations count as requiring
   prior consent.
3. Update `next.config.ts`'s CSP `script-src`/`connect-src` to allow
   the provider's domain (flagged as a known future need since Phase
   2's CSP work).
4. Fill in the `trackEvent()` call site marked in the code.
5. Update `/privacy` to describe the live provider once it exists — the
   current draft's "no analytics tools are currently used" language
   would become inaccurate the moment step 2 ships.
