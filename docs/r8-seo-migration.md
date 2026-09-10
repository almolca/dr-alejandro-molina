# R8 — Production Migration, SEO Preservation & Launch Preparation

Pre-launch audit for moving `phase-r3-correction-visual-brand` onto
`https://dralejandromolinaurologist.com`. This document is the audit +
redirect map (brief §1–§18); the ordered cutover procedure lives in
`docs/r8-launch-runbook.md`.

**This is preparation only.** Nothing in this phase merges to `main`,
deploys to Production, or touches DNS/the public domain — see the
runbook for the actual cutover, which requires explicit owner approval.

## 1. Legacy site audit — critical finding

**The legacy site currently returns a server-level 404 for every known
URL, including its own homepage.**

```
$ curl -I https://dralejandromolinaurologist.com/
HTTP/2 404
server: LiteSpeed
```

DNS resolves (`185.127.128.75`) and the LiteSpeed web server is live —
hosting itself is active — but no application/site is currently
configured to answer requests for this hostname. This is LiteSpeed's
own generic 404 page ("Proudly powered by LiteSpeed Web Server"), not
a WordPress 404, confirming nothing is deployed at the domain root
right now. Every path discovered below (all ~40 of them) was
individually re-tested against the live domain and **all returned
404**, so this is a site-wide outage, not a few broken pages.

**Implication:** there is no live content to "not modify" (nothing
reachable to modify), but there is very likely still residual Google/
Bing index entries and external backlinks pointing at these URLs from
whenever the site last worked — visitors clicking those links today
hit a dead end. Implementing the redirect map (§2) is still valuable
and arguably more urgent than in a normal migration, since it fixes an
already-broken experience rather than only preserving one.

### How the legacy URL inventory was built

Since the live site is unreachable, discovery used the **Wayback
Machine** (web.archive.org), the standard technique for this exact
situation:

- Wayback's CDX API (`web.archive.org/cdx/search/cdx?url=dralejandromolinaurologist.com&matchType=domain`) — returned every URL Wayback's own crawler ever independently visited on this domain. This was a short list: only the homepage (both language variants) and its static assets were ever crawled directly — the site is young (WordPress uploads folder dated `2024/11`; some image assets date to `2021/12`) and was lightly archived.
- The two archived **homepage snapshots themselves** (English `/en/home`, 20250710; Spanish apex `/`, 20250409) were fetched in full and their real `<a href>` navigation/content links extracted — this is where the ~40-URL inventory below actually comes from. This is legitimate, first-party evidence: real hrefs from a real page as it existed at a specific point in time, not a guess.
- Every discovered path was then **re-tested against the live domain** (confirming the site-wide 404 above) and **cross-checked against Wayback's CDX index individually** — none had independent captures beyond the homepage's own links, so page-level content (beyond the URL and its link-text context) could not be independently verified. Classification below is based on URL-slug semantics and link text, which is the standard, defensible approach when original content isn't retrievable.

### Key metadata found on the archived homepage

- `<html lang="es-ES">` at the apex (`/`) — the **root domain served Spanish**, not English.
- `hreflang="es"` → `/`, `hreflang="en"` → `/en/home` — a genuine bilingual WordPress/Polylang setup, not a `/es/` or `/en/` prefix pattern on both sides (Spanish had no path prefix at all).
- `generator`: WordPress 6.8.1, Elementor 3.28.4.
- `og:site_name`: "Penis Enlargement. Erectile Dysfunction. Premature Eyaculation." — aggressive/keyword-stuffed, associated with a Spain-based "Valclinic" brand (Doctoralia Valencia/Torrent links, a girth-enhancement-training domain, Instagram `@clinicadrmolina_`) — the same physician's earlier Spain practice, distinct from the current NMC/Abu Dhabi affiliation this site now represents.
- No sitemap.xml or robots.txt were ever archived or are currently reachable for the legacy site.

## 2. Redirect map

All entries are **permanent (308)**, implemented in
`src/lib/seo/legacy-redirects.ts` (single source of truth, consumed by
`next.config.ts`'s `redirects()`). Classification per brief §1:

- **A** — direct equivalent exists
- **B** — closest relevant equivalent
- **C** — redirect to a hub/category (no closer page exists)
- **D** — deliberate 410 Gone
- **E** — remain unavailable (normal 404), no migration

| Legacy URL | New URL | Type | Confidence | Notes |
|---|---|---|---|---|
| `/en/home`, `/en/`, `/en` | `/` | A | High | Homepage |
| `/` (Spanish apex homepage) | *(already `/`)* | A | High | No redirect rule needed — the new site's own homepage already lives at `/`; not a legacy-vs-new URL conflict |
| `/en/dr-molina-2` | `/about` | A | High | Physician bio page |
| `/dr-molina` | `/about` | A | High | Spanish equivalent |
| `/en/treatments` | `/` | C | Medium | No single "all treatments" page on the new site; homepage's care-areas section serves this role |
| `/tratamientos` | `/` | C | Medium | Spanish equivalent |
| `/en/erectile-dysfunction` | `/erectile-dysfunction` | A | High | Exact slug match |
| `/disfuncion-erectil` | `/erectile-dysfunction` | B | High | Spanish equivalent |
| `/en/causes-of-erectile-dysfunction-impotence` | `/erectile-dysfunction` | B | Medium | Blog post; causes are now covered directly on the main ED page |
| `/en/premature-ejaculation` | `/sexual-medicine/premature-ejaculation` | B | High | Path restructured under the sexual-medicine section |
| `/eyaculacion-precoz` | `/sexual-medicine/premature-ejaculation` | B | High | Spanish equivalent |
| `/en/penis-enlargement` | `/male-aesthetics/penile-girth-enhancement` | B | High | "Penis enlargement" (colloquial) → this practice's flagship girth-enhancement service |
| `/aumento-de-pene` | `/male-aesthetics/penile-girth-enhancement` | B | High | Spanish equivalent |
| `/en/penis-prosthesis` | `/penile-implant` | B | High | Prosthesis = implant |
| `/protesis-de-pene` | `/penile-implant` | B | High | Spanish equivalent |
| `/en/curved-penis` | `/peyronies-disease` | B | High | Curved penis is the lay term for Peyronie's |
| `/incurvacion-de-pene` | `/peyronies-disease` | B | High | Spanish equivalent |
| `/en/no-scalpel-vasectomy` | `/mens-health/vasectomy` | A | High | R8.0.2: dedicated page added. The R8.0.1 review found `/male-fertility` a genuine intent-inversion (fertility assessment helps patients conceive; vasectomy is elective sterilization) rather than merely an imperfect match, so a real page was built instead of redirecting around the gap |
| `/vasectomia-sin-bisturi` | `/mens-health/vasectomy` | A | High | Spanish equivalent |
| `/en/vasovasostomy` | `/male-fertility` | C | Medium | Vasectomy *reversal* is a fertility-restoration procedure — unlike plain vasectomy, this destination's intent alignment is real (the page discusses surgical sperm retrieval and reproductive-team coordination). No dedicated reversal page; closest genuine hub |
| `/vasovasostomia` | `/male-fertility` | C | Medium | Spanish equivalent |
| `/en/scrotoplasty` | `/male-aesthetics/scrotal-lift` | B | High | Scrotoplasty ≈ scrotal lift |
| `/escrotoplastia` | `/male-aesthetics/scrotal-lift` | B | High | Spanish equivalent |
| `/en/blog-2` | `/insights` | A | High | Blog → Insights |
| `/blog` | `/insights` | A | High | Spanish equivalent |
| `/deficit-testosterona` | `/mens-health/testosterone` | B | High | Testosterone deficiency article |
| `/caida-testosterona-a-partir-de-los-50` | `/mens-health/testosterone` | B | High | "Testosterone decline after 50" article |
| `/en/i-have-a-sexual-health-problem-where-do-i-go` | `/sexual-medicine` | B | Medium | General triage article → relevant hub |
| `/en/privacy-policy`, `/politica-de-privacidad` | `/privacy` | A | High | |
| `/en/cookies-policy`, `/politica-de-cookies` | `/privacy` | B | High | New site's privacy policy already covers cookies (R7.2) — no separate cookies page |
| `/en/legal-warning`, `/aviso-legal` | `/terms` | B | Medium | Best content match without the original text to verify exactly |
| `/en/contact`, `/contacto` | `/book` | B | High | The new site's "contact" *is* the booking gateway — no separate contact form |

### 410 Gone (deliberate, documented per entry — brief §20)

| Legacy URL | Reason |
|---|---|
| `/en/3-most-common-sex-fantasies-among-women` | Off-topic lifestyle/SEO-bait content, unrelated to Dr. Molina's andrology/urology practice. Redirecting it to any clinical page would be misleading; it is deliberately not being continued. |
| `/labioplastia-vaginal` | Vaginal labiaplasty is outside the current practice's scope entirely (a male-urology/andrology practice) — likely a leftover from the earlier multi-specialty "Valclinic" site. Redirecting to any current page would misrepresent what this practice offers. |

Implemented in `src/proxy.ts` (`legacyGonePaths`) as a genuine HTTP 410
response, not a redirect.

### Left unavailable — E, no migration (brief §1.E)

| Legacy URL | Reason |
|---|---|
| `/faq` | No centralized FAQ page exists on the new site by design — FAQs are embedded contextually on each treatment page instead. No single equivalent to redirect to without being misleading about content depth. |
| `/financiacion` | No financing/payment-plan feature exists on the new site. Redirecting to an unrelated page would set a false expectation. |
| `/programa-sexologia` | No current equivalent — this was a patient-facing "sexology program," distinct from the new site's AndroMax content (which is doctor-to-doctor training, not a patient program). |
| `/el-mejor-urologo-de-espana-2022`, `/medicos-valencianos-mas-brillantes` | Unverified press/award claims not part of the current owner-approved awards list (`src/config/doctor.ts` — only Top Doctors Spain 2020 and Doctoralia Awards Spain 2022 are approved). Not redirected to `/about`, to avoid implicitly re-asserting an unverified claim there. |
| `/en/circumcision`, `/circuncision` | R8.0.3: previously redirected to `/penile-surgery` (C, Medium confidence), but the R8.0.1 review found that page narrowly scoped to penile implant surgery and Peyronie's disease — it never mentions circumcision, so the redirect served no genuine user intent. Owner confirmed Dr. Molina does not currently perform circumcision and does not want it represented as a service. No semantically valid destination exists on the current site, so both legacy URLs are intentionally left unavailable rather than force-redirected. Not a 410 either — there is no migration-specific reason to assert "permanently gone" for a service that was never really represented on the new site in the first place; a normal 404 is the more accurate and flexible behavior, consistent with the other entries in this table. |

These simply return the site's normal 404 page if visited — the
correct behavior for "no meaningful current equivalent," per brief §1.

### Redirect chain note (trailing slashes)

This project uses Next's default `trailingSlash: false`. Verified
empirically: a trailing-slash legacy URL (e.g.
`/en/curved-penis/`) gets a 308 from **Next's own built-in**
trailing-slash normalization first (to `/en/curved-penis`), then a
second 308 from this project's redirect rule to the real destination —
a 2-hop result for the slash-suffixed form only. Adding explicit
`/…/ ` entries to the redirect map would be dead code (verified they
never match, since Next's own normalization always intercepts first),
so none are listed. This is an accepted, documented tradeoff of Next's
default trailing-slash behavior, not a chain this map itself
introduces.

### Redirect map integrity (automated, `legacy-redirects.test.ts`)

- No duplicate source paths.
- No redirect where a destination is itself a source elsewhere in the
  map (no multi-hop chains within the map).
- No source equals its own destination (no loops).
- Every 410 path is absent from the redirect map (no path is both
  redirected and 410'd).
- Every destination is a relative, internal path.

### R8.0.2 addendum — dedicated vasectomy page

The R8.0.1 final redirect-quality review flagged `/en/no-scalpel-vasectomy`
→ `/male-fertility` as a genuine intent-inversion, not merely an
imperfect match: `/male-fertility` helps patients conceive, while a
vasectomy is elective sterilization for patients who have finished
having children. No adequate existing destination was found. The owner
approved building a dedicated page rather than redirecting around the
gap — `/mens-health/vasectomy`, a secondary (non-flagship) service page
following the same premium editorial system as every other treatment
page, reclassifying both legacy sources from C (hub fallback) to A
(direct equivalent). `/en/vasovasostomy` (vasectomy *reversal*) was
left unchanged — reversal is itself a fertility-restoration procedure,
so `/male-fertility` remains a genuinely relevant destination for it.
Circumcision (`/en/circumcision` → `/penile-surgery`, also flagged as
weak in R8.0.1) was out of scope for this addendum, pending a separate
owner decision — resolved in R8.0.3 below.

### R8.0.3 addendum — circumcision redirect removed

Owner decision: Dr. Molina does not currently perform circumcision and
does not want it represented as a service on the site. The
`/en/circumcision` → `/penile-surgery` and `/circuncision` →
`/penile-surgery` redirects (flagged WEAK in R8.0.1 — `/penile-surgery`
is narrowly scoped to penile implant surgery and Peyronie's disease and
never mentions circumcision) have been **removed** from
`legacy-redirects.ts` entirely. No new page was created. Both legacy
URLs now fall through to the site's normal 404, moved to the "Left
unavailable — E" table above rather than being force-redirected
somewhere misleading or asserted as a deliberate 410 (no
migration-specific reason exists for a hard "permanently gone" claim
here — see that table entry for the full reasoning).

## 3. New site route inventory

Generated from `src/app` (excluding `/admin/**` and
`/api/**`, which are handled separately in §15):

**Public indexable pages** (in `src/lib/seo/routes.ts`, emitted to
sitemap.xml): `/`, `/about`, `/book`, `/mens-health`,
`/mens-health/testosterone`, `/mens-health/vasectomy`, `/sexual-medicine`,
`/sexual-medicine/premature-ejaculation`, `/erectile-dysfunction`,
`/erectile-dysfunction/penile-doppler`,
`/erectile-dysfunction/shockwave-therapy`, `/penile-surgery`,
`/penile-implant`, `/peyronies-disease`, `/male-aesthetics`,
`/male-aesthetics/penile-girth-enhancement`,
`/male-aesthetics/scrotal-lift`,
`/male-aesthetics/penile-filler-correction`, `/male-fertility`,
`/male-fertility/varicocele`, `/insights`, plus every
`/insights/[slug]` article (sourced from
`content/insights/articles.ts`, so the sitemap can never list a slug
without a real page).

**Public noindex pages** (real, crawlable, deliberately excluded from
the sitemap and marked `robots: {index:false, follow:true}` via
`buildMetadata({index:false})`): `/privacy`, `/terms`,
`/medical-disclaimer`.

**Admin pages** (all noindex, all auth-gated, none in sitemap):
`/admin`, `/admin/pages`, `/admin/sources`, `/admin/services`,
`/admin/leads`, `/admin/leads/[id]`, `/admin/login`.

**Booking page:** `/book` (public, indexable, priority 0.8).

**API/internal routes** (not pages, never indexed, excluded from the
proxy's attribution logic via its matcher): `/api/events`.

**Legacy redirect-only routes:** none of the legacy paths correspond
to a real route in this app — they only exist as entries in
`next.config.ts`'s `redirects()` / `proxy.ts`'s 410 list.

**Duplicate-route check:** no route is reachable at two different
paths — each `page.tsx` maps to exactly one URL, and `routes.ts` (the
sitemap's source of truth) has no duplicate `path` entries.

## 4. Canonical domain strategy

**Decision: apex domain (`https://dralejandromolinaurologist.com`) is
canonical.** `https://www.dralejandromolinaurologist.com` will
permanent-redirect to the apex — configured at the DNS/domain level
during actual cutover (runbook Phase D), not in application code.

**Centralization:** `siteUrl` (`src/config/site.ts`) was already the
single source every canonical URL, Open Graph URL, JSON-LD `url`, and
sitemap entry derives from — confirmed by inspecting
`lib/seo/metadata.ts`, `lib/seo/json-ld.ts`, and `app/sitemap.ts`, all
of which already import `siteUrl` rather than hardcoding a domain
anywhere. The only actual defect was `siteUrl`'s own computation,
which fell back to `NEXT_PUBLIC_SITE_URL` (an env var that was never
set for Preview) or `localhost` otherwise.

**Fix:** `siteUrl` now resolves via a small pure function
(`resolveSiteUrl`, `src/lib/seo/canonical-site-url.ts`, unit tested):
any Vercel deployment — Preview **or** Production, detected via
`process.env.VERCEL`, which Vercel sets on every build it runs — emits
the real production canonical URL. Local dev keeps using
`NEXT_PUBLIC_SITE_URL` (falling back to `localhost`). This satisfies
brief §4 exactly: "Preview should still emit production canonical URLs
... while Preview itself remains protected from indexing" — indexing
protection is a separate concern, handled in §5.

Verified empirically against a local production build: `/sitemap.xml`,
`<link rel="canonical">`, and `robots.txt`'s `Sitemap:` line all use
the resolved `siteUrl` consistently (currently `localhost` in that
local test, as designed — will resolve to
`https://dralejandromolinaurologist.com` automatically once running on
any Vercel deployment).

## 5. Preview indexing safety

Two independent layers, so a misconfiguration in one doesn't silently
expose Preview to indexing:

1. **Vercel deployment protection (primary).** Confirmed live: fetching
   the Preview URL without an access token redirects to
   `vercel.com/login` (Vercel Authentication/SSO wall). This alone
   already prevents search engine crawlers from ever reaching Preview
   content.
2. **`X-Robots-Tag: noindex, nofollow` response header (defense in
   depth, new this phase).** `src/proxy.ts` now sets this header on
   every response whose request Host isn't the canonical production
   domain (apex or `www`) — verified empirically (`curl -I
   http://localhost:3000/` shows `x-robots-tag: noindex, nofollow`,
   since `localhost` isn't the production host). This means even if
   deployment protection were ever disabled on a Preview deployment
   without realizing the SEO implication, that deployment would still
   tell crawlers not to index it.

**How Preview and Production differ**, precisely:

| | Preview | Production |
|---|---|---|
| Canonical/OG/sitemap URLs | Production domain (same as Production — for launch validation) | Production domain |
| `X-Robots-Tag` | `noindex, nofollow` (host ≠ production) | Not set (host = production) |
| Vercel deployment protection | Enabled (SSO wall) | Not applicable (public) |
| Reachable by search crawlers | No (blocked by deployment protection) | Yes |

## 6. robots.txt

Current (`src/app/robots.ts`), unchanged this phase — already correct:

```
User-Agent: *
Allow: /
Disallow: /admin

Sitemap: <siteUrl>/sitemap.xml
```

- Allows indexing of all legitimate public content.
- Disallows `/admin` (all sub-routes match via the prefix rule).
- **Not** relied upon as an authentication mechanism — `/admin` is
  independently protected by Supabase Auth + the `ADMIN_ALLOWED_EMAILS`
  allowlist (§15), which is the actual access control; robots.txt is
  only an indexing signal.
- Does not block the whole site (verified: `Allow: /` at the top level).
- `Sitemap:` reference now correctly resolves to the production domain
  on any Vercel deployment, per §4's fix.

## 7. Sitemap

`src/app/sitemap.ts`, unchanged in logic this phase (already correct,
only benefits from the `siteUrl` fix):

- Canonical production URLs only (post-fix).
- Every route in `sitemapRoutes` (live, non-noindex) plus every real
  Insights article — no admin routes, no login page, no legacy
  redirect-only paths, no drafts (unpublished articles simply aren't
  in `content/insights/articles.ts` yet).
- No duplicate URLs (one entry per route/article).
- `lastModified` is only set for Insights articles, sourced directly
  from each article's real `datePublished` field — never fabricated.
  Static marketing pages don't claim a `lastModified` since no
  reliable per-page modification date is tracked.

## 8–9. Metadata & structured-data audit

Spot-checked representative routes (`/`, `/erectile-dysfunction`,
`/book`, `/insights`, an `/insights/[slug]` article, `/privacy`) plus
every `buildMetadata()`/schema call site by reading the shared
builders directly (`lib/seo/metadata.ts`, `lib/seo/json-ld.ts`) — since
every page routes through these two files, auditing the builders
covers every consumer at once:

- **Unique title/description per page** — enforced structurally:
  every route passes its own `title`/`description` to `buildMetadata()`;
  none share the sitewide default except the root layout's fallback.
- **Canonical** — set on every page via `buildMetadata()`'s
  `alternates.canonical`; now resolves correctly per §4.
- **Open Graph / Twitter** — present on every page via the same
  builder (`type: website`, `summary_large_image` card).
- **H1 / heading hierarchy / internal linking / breadcrumbs** — not
  re-audited page-by-page this phase (brief §8: "do not perform broad
  copy rewrites unless a real defect is identified"); no defect was
  found in the pages spot-checked, and this was already covered by
  prior phases' own QA (R7.1's accessibility/heading-hierarchy fixes).
- **Image alt text** — physician portrait alt text is already
  data-driven (`doctor.profileImage.alt`), not hardcoded per usage.
- **Schema types in use:** `Person`, `Physician`,
  `BreadcrumbList`, `MedicalWebPage`, `FAQPage`, `Article`,
  `VideoObject` (unreachable until real video content exists — guarded
  in code, not currently emitted).
- **No `AggregateRating`** anywhere in `json-ld.ts` — confirmed by
  reading the full file; review/rating data (`config/reputation.ts`)
  is rendered as plain trust-signal UI, never as schema, matching the
  brief's "do not invent review schema."
- **No unsupported award/category claims** — `awardEntries()` only
  emits awards flagged `publishReady: true` in `doctor.ts` (currently
  2, both owner-confirmed).
- **Physician identity** — `Person`/`Physician` schema both use
  `doctor.displayName`/`doctor.title` from the single `doctor.ts`
  config; current Abu Dhabi/NMC affiliation is accurate
  (`practice.ts`, unchanged, still NMC Royal Hospital Khalifa City).
- **Article author** — `articleSchema()` hardcodes
  `author: { "@type": "Person", name: doctor.displayName }` — always
  Dr. Alejandro Molina, never a placeholder.
- **Breadcrumbs** — `breadcrumbSchema()` resolves every `item` URL via
  `siteUrl`, so breadcrumb JSON-LD now also correctly points at the
  production domain once deployed.
- **No duplicate/conflicting entities** — `Person` and `Physician`
  schema both reference the same `worksFor`/`hospitalAffiliation`
  (`medicalOrganizationRef()`, a single shared builder), so there's
  exactly one representation of the NMC affiliation, not two
  potentially-diverging ones.

## 10. Language/locale strategy

The legacy site was genuinely bilingual (Spanish at the apex, English
under `/en/`, real `hreflang` tags, a Polylang language switcher). The
new site is English-only.

**Decision: no hreflang added to the new site.** Per brief §10, "if
hreflang is not justified in the new site, do not add it merely
because the old site had it" — there is no current Spanish content to
alternate with, so an `hreflang` tag would either point at nothing or
at the same English page under a false `es` label, which is worse than
having none. Every discovered Spanish legacy URL was individually
mapped to its closest *current* (English) equivalent in the redirect
map (§2) rather than collectively dumped on the homepage — e.g.
`/disfuncion-erectil` → `/erectile-dysfunction`, not `/`. The only
Spanish URLs sent to a shared hub (`/`, `/male-fertility`) are ones
with no closer topic-specific page on *either* language track
(`/tratamientos`, vasectomy reversal) — the same C-classification
English equivalents get, not a language-specific downgrade.
(`/circuncision`, like its English counterpart, is intentionally left
unavailable rather than redirected at all — see the "Left unavailable"
table above.)

If the owner wants a Spanish version of the new site in the future,
that's a separate content project, not something to retrofit via
hreflang on English-only pages now.

## 11. Booking & attribution production readiness

Re-verified live (not just re-read) after this phase's `proxy.ts`
changes (both additive — the new 410 check and `X-Robots-Tag` check
are placed *before* the existing attribution logic, which is otherwise
untouched):

- `/book` renders correctly, form submits, lead is created, the
  immediate `sent_to_nmc` attempt fires, redirect lands on exactly
  `https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina`
  — this URL is a plain string constant in `src/config/practice.ts`,
  untouched by any R8 change.
- `origin_page` capture (referer-at-`/book`'s-initial-load, via the
  `book_origin` cookie) — re-verified locally: a request to `/book`
  with a simulated `/erectile-dysfunction` referer correctly sets
  `book_origin=/erectile-dysfunction`. This mechanism reads the
  request's own Host/Referer dynamically, not a hardcoded domain, so
  it is unaffected by which domain actually serves the request —
  works identically on `localhost`, Preview, or the eventual
  production domain.
- First-touch/last-touch attribution cookies — re-verified locally: a
  fresh `?utm_source=google_business&utm_medium=organic` request
  correctly sets both `attr_first` and `attr_last`. Same
  domain-agnostic design as `origin_page`.
- UTM parameters — captured via the same cookie mechanism plus passed
  through the booking form's hidden fields; unaffected by this phase.
- Discussion topic remains optional; "Prefer not to say" remains a
  valid, non-erroring choice; `origin_page` and the patient's chosen
  topic remain fully decoupled (no diagnostic inference) — all
  unchanged from R7.2.2, no code in this phase touches
  `discussion-topic.ts`, `lead-schema.ts`, or `actions.ts`.
- No PII in `analytics_events` — unchanged; the event schema's
  `.strict()` Zod validation (R7.2) still structurally forbids it.
- **No real patient records were created during this phase's QA** — no
  form submissions were made this session; verification relied on
  reading code, the existing (still-passing) automated test suite, and
  direct HTTP/cookie inspection via `curl`, none of which touch
  Supabase.

## 12. Google Business launch plan (not executed — plan only)

**Not modified this phase.** Recommended post-launch configuration,
for the owner to apply directly in Google Business Profile:

- **Website URL:** `https://dralejandromolinaurologist.com`
- **Appointment URL:**
  `https://dralejandromolinaurologist.com/book?utm_source=google_business&utm_medium=organic&utm_campaign=appointment`

**Validated against the current attribution implementation:**
`normalizeSource()` (`src/lib/attribution/normalize-source.ts`) already
maps `utm_source=google_business` directly to the `google_business`
source — this is the exact value the brief's suggested URL uses, no
encoding or mapping-table change needed. The URL is plain ASCII
(letters, digits, `&`, `=`, `?`, `/`), so no percent-encoding is
required beyond what any browser/Google Business form already handles
automatically for query strings.

## 13. Search Console plan (not executed — plan only)

**No owner account changes made or attempted this phase.**
Post-launch checklist, in order, once DNS cutover (runbook Phase E) is
live:

1. Verify domain property for `dralejandromolinaurologist.com` in
   Google Search Console (DNS TXT record or existing verification
   method — apex/domain-property verification is recommended over a
   URL-prefix property, so it automatically covers both `https://` and
   `https://www.`).
2. Inspect a handful of key URLs with the URL Inspection tool
   (`/`, `/erectile-dysfunction`, `/book`) to confirm Google sees the
   correct canonical and that the page is indexable.
3. Submit `https://dralejandromolinaurologist.com/sitemap.xml`.
4. Spot-check indexing status for the highest-priority pages (`/`,
   `/erectile-dysfunction`, `/male-aesthetics/penile-girth-enhancement`,
   `/book`).
5. Monitor the **Pages** report for unexpected "Not indexed" reasons,
   and the **redirect** count specifically for the legacy URLs in §2 —
   confirm they're being crawled and followed, not reported as errors.
6. Monitor **Search performance** week over week for the first month,
   watching specifically for legacy-URL queries transferring their
   ranking to the new destination rather than dropping.
7. Compare legacy vs. new URL impressions/clicks in the Search
   Performance report (filter by page) once enough data has
   accumulated (~2–4 weeks) to see whether redirected queries are
   landing correctly.

**Bing Webmaster Tools — optional, not mandatory.** Same steps (domain
verification, sitemap submission) can be repeated there at the owner's
discretion; Bing's search share for this market is small enough that
it's a "nice to have," not a launch blocker.

## 14. Production environment audit

No tool available in this session can enumerate Vercel's actual
configured environment variable **names** or their per-environment
scope (Development/Preview/Production are separate scopes in Vercel;
a variable configured for Preview does not automatically apply to
Production). No secret values were requested, printed, or guessed —
per **"do not silently create fake defaults,"** status below reflects
only what could actually be verified this session, not an assumption:

| Variable | Preview | Production |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **CONFIRMED WORKING** — live R7.2.2 E2E test successfully read/wrote real Supabase data | **UNVERIFIABLE from this session** — owner must confirm |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **CONFIRMED WORKING** — admin-auth client functioned (redirected unauthenticated users correctly, implying the anon-key client initialized) | **UNVERIFIABLE** — owner must confirm |
| `SUPABASE_SERVICE_ROLE_KEY` | **CONFIRMED WORKING** — real lead inserts/updates succeeded against Preview in R7.2.2 | **UNVERIFIABLE** — owner must confirm |
| `ADMIN_ALLOWED_EMAILS` | **PRESENT per owner's own statement** ("created the authorized admin user"); mechanism verified to exist and gate access correctly, but this session was never given admin credentials to independently confirm the value itself | **UNVERIFIABLE** — owner must confirm |
| `NEXT_PUBLIC_SITE_URL` | **NOT REQUIRED** as of this phase's fix (§4) — every Vercel deployment (Preview and Production alike) now derives its canonical URL from the hardcoded `PRODUCTION_SITE_URL` constant instead, regardless of this variable | **NOT REQUIRED**, same reasoning |

**This is a required Phase A pre-launch action** (see runbook): the
owner must explicitly confirm (or configure) the four Supabase/admin
variables in Vercel's **Production** environment scope specifically —
their presence in Preview does not carry over automatically.

## 15. Admin production safety

Re-verified this phase (all pre-existing from R7.2, unaffected by any
R8 change except a stronger `robots.txt` disallow which was already in
place):

- `/admin` is `noindex` — confirmed via `(protected)/layout.tsx`'s
  `force-dynamic` + per-page `robots: {index:false, follow:false}`
  metadata, **and** now additionally covered by the same
  `X-Robots-Tag` proxy header as any other non-production-host request
  when Preview is used, and will simply never match `sitemapRoutes`
  (admin isn't in `routes.ts`) once on Production either.
- `/admin` is excluded from the sitemap — structurally guaranteed
  (`sitemap.ts` only ever reads from `routes.ts` + Insights articles;
  no admin path exists in either source).
- Unauthenticated access redirects to `/admin/login` — reconfirmed
  live this phase (`curl`/Playwright against the local build; also
  previously reconfirmed against real Preview in R7.2.2).
- Authorization still depends on `ADMIN_ALLOWED_EMAILS`
  (`src/lib/auth/admin.ts`, unchanged this phase).
- Service role remains server-only — reconfirmed: grepped the fresh
  production build's `.next/static/` output for the service-role key
  string, none found.
- No admin data is statically exposed — every `/admin/**` route is
  server-rendered `force-dynamic` (confirmed in the build's route
  table: all admin routes marked `ƒ`, none `○`/`●` static).
- No caching leaks protected data — `force-dynamic` + the layout's own
  no-cache metadata prevent this; unchanged this phase.

## 16. Security headers / web baseline

Audited the existing CSP and added two low-risk headers (§ next.config.ts):

| Header | Before | After | Risk |
|---|---|---|---|
| `Content-Security-Policy` | Present, already tested safe for Next.js/Supabase/NMC navigation | **Unchanged** — brief §16 explicitly warns against introducing a stronger CSP without more testing; the existing one is already conservative and proven, so it was left alone | None (no change) |
| `X-Content-Type-Options` | Present | Unchanged | — |
| `Referrer-Policy` | Present (`strict-origin-when-cross-origin`) | Unchanged | — |
| `Permissions-Policy` | Present | Unchanged | — |
| `frame-ancestors 'none'` (in CSP) | Present | Unchanged | — |
| `X-Frame-Options` | **Missing** | Added: `DENY` | None — purely additive legacy-browser equivalent of the existing `frame-ancestors 'none'` |
| `Strict-Transport-Security` | **Missing** | Added: `max-age=15552000; includeSubDomains` (6 months, **no `preload`**) | Low — HSTS only activates after the first HTTPS visit, and Vercel serves HTTPS-only by default. `preload` submission is deliberately excluded here: it's a separate, hard-to-reverse decision (browser preload-list removal can take months to propagate) that belongs to the owner post-launch once the domain has run reliably on HTTPS for a while — not something to opt into silently in this phase |

No CSP changes were made — verified via a real production build that
Supabase-backed flows (`/book` submission, `/admin` auth) continue to
work exactly as before under the unchanged CSP.

## 17. Performance / Core Web Vitals readiness

Ran a full production build and inspected the output for obvious
regressions — no speculative optimization work was added, per brief
§17:

- No oversized/unoptimized images introduced this phase (no image
  assets were added or changed).
- No new client-side JavaScript of consequence — this phase's
  additions (`legacy-redirects.ts`, `canonical-site-url.ts`,
  `production-host.ts`) are server-only (consumed by `next.config.ts`,
  `proxy.ts`, and `config/site.ts`, none of which ship to the client
  bundle) or pure data/logic with no UI.
- Route table (build output) shows the same static/dynamic split as
  before this phase — no previously-static page became dynamic, and
  vice versa, as a side effect of the `siteUrl` change (verified: all
  marketing pages that were `○` static remain `○` static after the
  fix, since `resolveSiteUrl` only depends on `process.env.VERCEL`, a
  build-time-constant value, not a per-request one).
- No new third-party scripts, fonts, or blocking resources were added.
- One pre-existing, unrelated dev-console warning was observed
  (`/book`'s preloaded logo image not used within a few seconds of
  load) — present before this phase, not a regression, not addressed
  here per "fix only clear regressions" (brief §17).

## 18. Accessibility spot-check

Representative sample tested at 390px and 1440px against a local
production build (identical code to what will deploy) — full
9-page × 4-breakpoint (36-combination) exhaustive coverage was judged
disproportionate for this audit phase; the sample below covers every
page family named in the brief using this project's actual current
route paths (the brief's list used a few paths that don't match the
live route structure — e.g. `/sexual-medicine/erectile-dysfunction` →
actually `/erectile-dysfunction`; `/penile-surgery/penile-implant` →
actually `/penile-implant`; `/testosterone` → actually
`/mens-health/testosterone` — tested at their real, correct URLs):

Pages checked: `/`, `/about`, `/mens-health`, `/erectile-dysfunction`,
`/erectile-dysfunction/penile-doppler`,
`/male-aesthetics/penile-girth-enhancement`, `/penile-implant`,
`/mens-health/testosterone`, `/book`, `/admin/login`.

Results, every page: **zero console errors, zero horizontal overflow**
at both breakpoints (`document.documentElement.scrollWidth` never
exceeded `window.innerWidth`). On `/book` specifically: keyboard Tab
navigation reaches a real interactive element first (the skip link)
with a visible focus indicator (`outline: 2px solid`, confirmed via
computed style, not assumed). Form labels, error states, and full
interaction testing (typing, selecting, submitting, "Prefer not to
say") were already thoroughly verified live against real Preview data
in the R7.2/R7.2.2 phases and were not repeated here since no code
touched by R8 affects that flow (§11).
