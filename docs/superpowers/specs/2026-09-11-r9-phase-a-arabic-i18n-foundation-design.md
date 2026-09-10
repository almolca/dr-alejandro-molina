# R9 Phase A — Arabic i18n Foundation + Homepage Pilot

Status: approved for implementation
Scope: Phase A only, per the R9 brief's five-phase plan (A: architecture/RTL/switcher/metadata foundation, B: priority-page translation, C: booking/cookie/privacy localization, D: SEO/structured-data/internal-linking, E: QA/live verification). Phases B–E are out of scope for this document and get their own brainstorm/spec cycle after Phase A ships and passes its exit criteria.

## 1. Goal

Stand up the routing, RTL rendering, content-authoring pattern, and SEO plumbing (hreflang, canonical, sitemap, analytics locale) that all future Arabic pages will build on — and prove the whole chain actually works end-to-end with one real page: the Arabic homepage at `/ar`.

Zero changes to any existing English URL, English page content, or English page behavior. Zero changes to `/admin`.

## 2. Non-goals (explicitly deferred)

- Translating any of the other 18 priority pages (Phase B).
- `/ar/book`, booking-form localization, or any lead-schema change (Phase C).
- Full cookie-consent-system localization / a second consent mechanism (Phase C owns the consent *system*; Phase A's pilot only translates the banner's visible copy — see §7).
- `/ar/privacy` (Phase C).
- A `locale` column on the `leads` table (see §9 — rejected for now, not just deferred).
- Retrofitting any existing English page onto a shared content-driven template (a possible future Phase B follow-up per page, never a Phase A/B blocker).
- True `<html>`-root-level `lang`/`dir` via multiple root layouts (considered and rejected — see §4).
- `/ar/insights` (explicitly deferred per the master brief until Arabic articles exist).

## 3. Routing architecture

Static, literal folder tree — no `[locale]` dynamic segment, no i18n routing library:

```
src/app/ar/
  layout.tsx                 → new, independent shell (fonts, RTL wrapper, JsonLd, MotionProvider, ConsentBanner)
  (marketing)/layout.tsx     → PageShell (locale="ar") + PageViewTracker, mirrors src/app/(marketing)/layout.tsx
  (marketing)/page.tsx       → /ar homepage pilot
```

This nests entirely inside the *existing* `src/app/layout.tsx` in Next.js's layout hierarchy (see §4 for why that's fine) — it is not a Next.js "root layout" in the framework sense, just a conventionally-named directory that happens to hold its own `<html>`-adjacent concerns.

`src/proxy.ts`: no changes needed in Phase A. Its matcher (`"/((?!api|admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|brand).*)"`) already covers `/ar/*`. The `pathname === "/book"` branch is untouched since `/ar/book` doesn't exist yet (Phase C). No collision with `legacyRedirects`/`legacyGonePaths` (confirmed: none start with `/ar/`).

## 4. `lang` / `dir` mechanism (decided, with trade-off accepted)

**Decision: wrapper-level, not `<html>`-level.**

Investigated true multi-root layouts (Next.js's documented pattern for per-branch `<html>`). Rejected for Phase A because it requires:
- Removing `src/app/layout.tsx`, forcing `admin/layout.tsx` (today a thin `<>{children}</>` pass-through) to become a full root layout — an out-of-scope, production-admin-touching change.
- Enabling the experimental `next.config.ts` flag `experimental.globalNotFound` plus a new `app/global-not-found.tsx`, because Next.js's docs confirm the normal sitewide `not-found.tsx` composition breaks once there are multiple root layouts.
- Full-page-reload navigation between `(marketing)` and `(legal)`, which is client-side today and would silently regress.

None of that is worth it for an attribute. Instead:

- `src/app/layout.tsx` is untouched: always `<html lang="en">`, no `dir` (browser default `ltr`).
- `src/app/ar/layout.tsx` renders a wrapper element immediately inside `<body>` — e.g. `<div lang="ar" dir="rtl" className="contents">` — that sets both attributes for everything inside the `/ar` tree. `dir`/`lang` are valid on any element and correctly cascade for RTL layout, bidi text, form controls, and assistive tech reading nested content.
- Accepted imperfection: the outermost `<html>` tag literally still says `lang="en"` on Arabic pages. This does not affect hreflang, indexing, or actual RTL rendering (Google's language targeting relies on hreflang + content-language detection, not `html lang`); it's a document-root cosmetic gap, not a functional one.

## 5. Content architecture — Approach C (typed content + new templates, English untouched)

For the homepage pilot:

- `src/content/ar/home.ts` exports a typed `homeContentAr: HomePageContent` object (hero copy, section copy, FAQ items, CTA labels — all Arabic strings, no JSX, no layout decisions).
- `HomePageContent` is a strict TypeScript interface defined in `src/content/types.ts` (shared location for future page-family content types in Phase B) — no `any`, no untyped blobs, no layout/JSX embedded in content.
- `src/components/templates/HomePageTemplate.tsx` is a new presentational component: takes `content: HomePageContent` and renders it using the *existing* shared primitives (`Container`, `SectionHeading`, `HeroAtmosphere`, `Faq`, `Breadcrumb`, etc.) — the same building blocks the English homepage already uses.
- `src/app/ar/(marketing)/page.tsx` imports `homeContentAr` and renders `<HomePageTemplate content={homeContentAr} locale="ar" />`.
- `src/app/(marketing)/page.tsx` (English homepage) is **not modified** — it keeps its current inline-JSX rendering exactly as today. Migrating it onto `HomePageTemplate` later (so both locales share one renderer) is a legitimate, low-risk future follow-up, done page-by-page with visual diffing — never a dependency of Phase A or B.

This pattern (typed content module + page-family template + reused primitives) is the convention Phase B will repeat for the other 18 pages, one template per page family as needed (a "treatment page" template will likely differ from the homepage template — that generalization happens in Phase B, not designed in the abstract here).

## 6. RTL implementation scope

Because English pages are never rendered with `dir="rtl"`, this is *not* a site-wide audit of all 19 English pages. Scope is limited to what actually renders inside the `/ar` wrapper or is shared across both locales:

- **Global chrome**: `Header`, `Footer`, mobile nav, `ConsentBanner`, the new language switcher — these render on both locales and need RTL-safe layout (logical properties or `rtl:` Tailwind variants), gated so English rendering is pixel-unchanged.
- **Shared primitives used by the homepage pilot**: `Breadcrumb` (chevron must flip — `rtl:rotate-180` scoped to the `dir` ancestor), `Faq` accordion, buttons/CTA layout.
- Everything is additive: existing components gain an optional locale-aware code path (e.g., a Tailwind `rtl:` variant that only activates under a `dir="rtl"` ancestor) with no change to default (English) output. Existing tests plus a visual check confirm English pages are unaffected.

**Fonts**: `Noto Sans Arabic` via `next/font/google` (Arabic subset), loaded in `src/app/ar/layout.tsx`, swapped in for `--font-sans`/`--font-display` scoped to the `/ar` wrapper only (English `Fraunces`/`Inter` untouched).

**Chrome copy localization (in scope for the pilot, distinct from Phase C)**: the nav labels, footer, and `ConsentBanner`/`CookieSettingsLink` visible strings get an Arabic copy variant so the pilot page doesn't look broken — this is a presentational string swap only. The underlying consent *mechanism* (cookie names, gating logic, `hasAnalyticsConsent()`, the `cookie_consent` mirror cookie) is untouched and shared unchanged across locales, per the master brief's "do not create a second cookie system." Full cookie-banner localization infrastructure (if more is needed beyond the pilot's strings) remains Phase C's.

**Nav links from the Arabic homepage**: since no other `/ar` pages exist yet, the pilot's header/footer nav links point to the existing English content pages (e.g. "Men's Health" → `/mens-health`, not a nonexistent `/ar/mens-health`). This is intentional and temporary — as Phase B adds each Arabic page, its nav entry point flips to the Arabic route automatically once the shared route registry (§8) has an `arPath` for it. No hardcoded English-link list to maintain by hand.

## 7. Language switcher — final behavior (per explicit instruction)

Single source of truth: the route registry (§8). Behavior, no exceptions:

- If the current route has a confirmed `arPath`/`path` pair in the registry → render a real, crawlable `<Link>` to the equivalent route in the other language.
- If it does not → **omit** the other-language control entirely for that page. No disabled/greyed-out placeholder, no link to the locale homepage, no client-side-only toggle. Nothing is rendered that could be clicked, focused, or mistaken for a working translation.
- The current language is indicated as plain (non-link) text, so the control never disappears entirely — only the *other*-language option is conditional on a real pair existing.
- Implemented as ordinary server-rendered `<Link href>` elements (crawlable), never a client-side-only JS toggle, never a query-param-based translate mechanism.
- Keyboard accessible, proper `aria-current`/`aria-label` on the active language.

During Phase A, this means every page except `/` and `/ar` shows no other-language option — expected and correct until Phase B populates more `arPath` entries.

## 8. Route registry as single source of truth

Extend `src/lib/seo/routes.ts`:

```ts
export type RouteEntry = {
  path: string;
  status: "live" | "planned";
  priority: number;
  index?: boolean;
  /** Arabic equivalent path (e.g. "/ar"), when a real translated page exists. Omit — do not set to a guessed/future path — until the page is actually live. */
  arPath?: string;
};
```

Only `{ path: "/", ..., arPath: "/ar" }` gets `arPath` set in Phase A. Every other entry stays without it until Phase B ships that page.

This same field, read from this same file, drives all four consumers — no parallel/duplicated pairing logic anywhere else:
- Language switcher (§7)
- `buildMetadata()`'s `alternates.languages` (§9)
- `sitemap.ts`'s Arabic entries + hreflang alternates (§9)
- Any future "does an Arabic version of this exist" check (internal linking in Phase D, etc.)

## 9. Metadata, hreflang, canonical, sitemap

- Extend `buildMetadata()` to accept `locale: "en" | "ar"` and an optional `arPath`/`enPath` counterpart. Canonical is always self-referencing (`/ar` canonicals to `/ar`, never back to `/`). `alternates.languages` (`en-AE`, `ar-AE`, `x-default` → the English URL) is emitted **only** when the registry confirms both sides of the pair exist — never a one-sided or guessed hreflang entry.
- Existing `metadata.test.ts` keeps passing (English callers don't pass `locale`, defaulting behavior unchanged); new tests cover the `ar` + hreflang path.
- `sitemap.ts`: add Arabic entries only for routes with `arPath` set (so in Phase A, exactly one new entry: `/ar`), each carrying its reciprocal hreflang alternate. `robots.ts` needs no change (no `/ar` blocking exists to remove).
- OG: the Arabic homepage reuses the existing branded fallback social image per the master brief (no new asset needed for Phase A).

## 10. JSON-LD

`personSchema()`/`physicianSchema()` stay a single, non-duplicated physician identity (rendered from `src/app/ar/layout.tsx` the same as the English root does — same entity, not a parallel Arabic one). Add `inLanguage` where appropriate to page-specific schema (`medicalWebPageSchema`, `breadcrumbSchema`) for the `/ar` homepage, using Arabic visible text for anything user-facing (breadcrumb labels). No `AggregateRating`/fake review schema (unchanged rule).

## 11. Analytics locale

- **`analyticsEventSchema`**: add `locale: z.enum(["en", "ar"])`. Justified — this is new-event-schema surface with no existing production rows to migrate, and gives direct language-split reporting without string-parsing `path` on every query. Extend `event-schema.test.ts` and `route.test.ts` (`api/events/route.ts`) accordingly. Requires a Supabase migration adding the column to `analytics_events` (nullable or defaulted, so it's additive/non-breaking).
- **Leads schema — rejected for Phase A.** Investigated per instruction: lead locale is reliably derivable downstream from `origin_page` (already captures the full referring path, e.g. `/ar/erectile-dysfunction`, once `/ar` content pages exist) and, once Phase C builds `/ar/book`, from which booking route a lead was submitted through. Neither requires a new column — both are string-prefix checks (`startsWith("/ar")`) performed at reporting/query time. No concrete product requirement surfaced that needs an indexed/queryable `locale` column on `leads` itself. Not adding one now; if a real reason to add it emerges in Phase C (e.g. a hard requirement to query leads by language at the DB level), it gets proposed there with that justification, not carried over from this assumption.

## 12. Definition of done / exit criteria (gate before Phase B)

Phase B does not start until all of the following hold on Preview:

1. `/ar` returns 200, renders with `dir="rtl"`/`lang="ar"` on its wrapper, Arabic font loads, no hydration errors, no console errors.
2. Global chrome (header, footer, mobile nav, cookie banner, language switcher) renders correctly in RTL on the pilot page at 390/768/1024/1440px.
3. Language switcher: `/` ↔ `/ar` both show a real, working link to each other; every other route shows no Arabic option (verified, not assumed).
4. `/` self-canonicals to the English URL, `/ar` self-canonicals to the Arabic URL; reciprocal `hreflang` (`en-AE`/`ar-AE`/`x-default`) present on both and validated against the actual URLs (no broken hreflang targets).
5. `/ar` appears in `sitemap.xml`; no other `/ar/*` URL does.
6. All 19 existing English routes verified unchanged (visual spot-check + full test suite green) — zero regression.
7. `npm run typecheck`, `npm run lint`, `npm run build`, `npm test` all pass; `git diff --check` clean.

## 13. Testing plan

Extend rather than duplicate:
- `src/lib/seo/metadata.test.ts` — `locale`/`alternates.languages` cases (present for a real pair, absent for a one-sided route).
- `src/lib/seo/routes.ts` — new test file asserting `arPath` values, when set, point to routes that actually exist as pages (a lightweight structural check, not a live HTTP check).
- New `src/app/sitemap.test.ts` (none exists today) — asserts `/ar` inclusion, asserts no unfinished `/ar/*` route is included, asserts hreflang alternates on the pair.
- `src/lib/analytics/event-schema.test.ts` + `src/app/api/events/route.test.ts` — `locale` field, valid enum values, schema still `.strict()`.
- New test for the language-switcher component — renders link when pair exists, renders nothing (not disabled, not a fallback link) when it doesn't.
- Existing `legacy-redirects.test.ts`, `canonical-site-url.test.ts`, `lead-schema.test.ts`, `book/actions.test.ts` — confirmed unaffected, re-run as regression check, no changes expected.

## 14. Open items flagged for owner/physician review (not blockers for Phase A merge)

- The homepage pilot's Arabic chrome copy (nav labels, footer, cookie banner strings) should get a second-pass native-MSA review before Phase B scales the pattern, per the master brief's translation-QA requirement.
- Confirm whether NMC's external booking system (destination of the eventual `/ar/book` → NMC redirect, Phase C) supports Arabic at all — affects Phase C design, not Phase A.
- `<html lang="en">` remaining literally true on Arabic pages (§4) is a deliberate, documented trade-off — flagging again here so it's not mistaken for an oversight during future SEO review.

## 15. Git

Branch: `feat/arabic-localization-r9`, off current `main`. Work committed logically (routing/layout scaffold; route registry + metadata/hreflang; sitemap; analytics schema + migration; RTL primitives; homepage pilot content + template; tests). Push branch, deploy Preview, run the §12 exit criteria on Preview before considering Phase A mergeable. Do not merge to `main` until every §12 item passes.
