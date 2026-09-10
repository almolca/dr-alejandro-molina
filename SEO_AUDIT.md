# SEO Audit

All findings below are from actually crawling the running production
build (`next build && next start`) with a headless-Chrome script — not
from reading source and assuming. Raw data source:
`/private/tmp/.../scratchpad/qa/seo-audit.log` (25 pages: every live
route including all 5 Insights articles). Two real issues were found
and fixed as part of this audit (see "Issues found and fixed" below)
before writing up the rest of this document.

## 1. Titles, descriptions, canonicals — audit result: clean

Every one of the 25 live pages has a unique `<title>` and unique meta
description, checked programmatically (string-equality comparison
across all 25, not spot-checked) — **zero duplicates found.** Every
page's canonical matches its own path exactly (`http://localhost:3000
<path>` in this local build; becomes the real domain once
`NEXT_PUBLIC_SITE_URL` is set — see §4 below). Title format is
consistent site-wide: `<Page Title> | Dr. Alejandro Molina` via the
root layout's title template, except the homepage which uses the full
`site.defaultTitle` string directly (correct — the template doesn't
apply to the page that *is* the default).

## 2. H1 uniqueness and heading hierarchy — audit result: clean

Every page has exactly one `<h1>` (already continuously verified since
Phase 2's QA harness). **New this audit:** a heading-level-skip check
(H*n* immediately followed by H*n+2*, e.g. H2 straight to H4) was run
across all 25 pages' full heading sequences — **zero skips found.**
Every page nests H1 → H2 → H3 correctly with no level jumped.

## 3. Internal links, orphan pages — 1 issue found and fixed

Built a full internal-link graph from every `<a href>` on every live
page and checked which live paths never appear as a link target
anywhere. **Found:** `/book` was reachable *only* from inside the
mobile-nav drawer (`MobileNav.tsx`) — the desktop header/footer had no
link to it at all, since `BookingCta` correctly points at the
*external* NMC URL everywhere, and nothing pointed at the *internal*
`/book` page except that one closed-by-default drawer link. **Fixed:**
added "Book a Consultation" to the footer's Site nav column
(`Footer.tsx`), which appears on every page — `/book` now has a real,
persistent internal-link source site-wide, not just a sitemap entry.
Verified after the fix: `curl` confirms the footer link renders with
the correct `href="/book"` on the homepage.

No other orphans found. Every treatment page is linked from: primary
nav or a hub page, its `RelatedTreatments` band, the homepage, and (for
the 5 topics with an article) its Insights article's closing CTA.

## 4. Sitemap / robots — 2 issues found and fixed

**Issue 1 — noindex pages listed in sitemap.xml.** `/privacy`,
`/terms` and `/medical-disclaimer` all set `index: false` in their page
metadata (rendering `<meta name="robots" content="noindex, ...">`) but
were still being emitted into `sitemap.xml`, which sends a
contradictory signal to crawlers. **Fixed:** added an `index?: boolean`
field to the route registry (`lib/seo/routes.ts`), set `false` on the
three legal pages, and added a `sitemapRoutes` export (live **and**
not-explicitly-noindex) that `sitemap.ts` now reads instead of the
broader `liveRoutes`. `InternalLink`'s prefetch logic still reads
`liveRoutes` unchanged — indexability and prefetch-eligibility are
different concerns and shouldn't share one flag. Verified: `curl
.../sitemap.xml | grep "privacy\|terms\|medical-disclaimer"` now
returns nothing.

**Issue 2 — `noindex, nofollow` instead of `noindex, follow`.** The
`buildMetadata()` helper (`lib/seo/metadata.ts`) coupled `index: false`
to `follow: false`. For a utility page you don't want *indexed* but
that still contains genuine links (Terms links to the Medical
Disclaimer, etc.), the standard recommendation is `noindex, follow` —
`nofollow` needlessly tells crawlers not to pass link equity through
those links at all. **Fixed:** `index: false` now always pairs with
`follow: true`. Verified: `curl .../privacy | grep robots` now shows
`content="noindex, follow"`.

`robots.txt` itself is minimal and correct: `Allow: /` plus a `Sitemap:`
directive, no accidental blanket disallow, no accidental blocking of
`/insights` or any treatment path.

## 5. JSON-LD — audit result: clean, consistent by page type

Crawled and parsed every JSON-LD block on all 25 pages (not just
counted them). Every page's structured-data set matches its page type
exactly, with no exceptions:

| Page type | Schema types present | Count |
|---|---|---|
| Home | Person, Physician | 2 |
| Full treatment pages (10) | Person, Physician, BreadcrumbList, MedicalWebPage, FAQPage | 5 |
| Hub pages (Men's Health, Sexual Medicine, Penile Surgery, About, Book, Insights index) | Person, Physician, BreadcrumbList | 3 |
| Insight articles (5) | Person, Physician, BreadcrumbList, Article | 4 |
| Legal pages (3) | Person, Physician, BreadcrumbList | 3 |

No `aggregateRating`, no review schema, no fabricated `LocalBusiness`
— consistent with spec §25's explicit prohibitions and the Phase 1/3
architecture decision to model the physician as *affiliated with* NMC.
`FAQPage` schema is only emitted where a real, visible FAQ accordion
exists on the page (verified: every page showing `FAQPage` in the crawl
also has a "Frequently Asked Questions" H2 in its heading list).
`Article` schema is only emitted for the 5 real, statically-generated
article routes — structurally impossible for it to appear on a
non-existent slug, since `generateStaticParams` and the schema call
both read the same `insightArticles` array.

## 6. Breadcrumb consistency — audit result: clean

Every non-home page's `BreadcrumbList` JSON-LD matches its visible
breadcrumb trail exactly (same component renders both from the same
data array — see `Breadcrumb.tsx` / `breadcrumbSchema()`). Depth is now
correct throughout after a fix made during this audit (see below): 2
levels for pages that genuinely are top-level (Male Aesthetics, Male
Fertility — both primary nav items with no separate parent hub), 3
levels wherever a real parent hub exists (ED: Home › Sexual Medicine ›
Erectile Dysfunction; Penile Implant and Peyronie's: Home › Penile
Surgery › [page]; Testosterone: Home › Men's Health › Testosterone;
Girth Enhancement: Home › Male Genital Aesthetics › Girth Enhancement;
Insight articles: Home › Insights › [Article]).

## 7. Target keyword cluster per page (spec §23)

| Page | Primary cluster (spec §23) |
|---|---|
| `/erectile-dysfunction` | erectile dysfunction doctor/specialist Abu Dhabi, ED treatment UAE |
| `/erectile-dysfunction/penile-doppler` | (supporting — no dedicated cluster in spec §23; long-tail "penile doppler Abu Dhabi") |
| `/erectile-dysfunction/shockwave-therapy` | (supporting — long-tail "shockwave therapy ED Abu Dhabi") |
| `/penile-implant` | penile implant/prosthesis Abu Dhabi, penile implant surgeon UAE |
| `/mens-health/testosterone` | low testosterone Abu Dhabi, testosterone specialist Abu Dhabi, hypogonadism treatment Abu Dhabi |
| `/male-aesthetics` | male genital aesthetics Abu Dhabi, penile enhancement Abu Dhabi |
| `/male-aesthetics/penile-girth-enhancement` | penile girth enhancement Abu Dhabi, penile filler Abu Dhabi, hyaluronic acid penile augmentation Abu Dhabi |
| `/male-aesthetics/scrotal-lift` | scrotal lift Abu Dhabi, scrotal aesthetic surgery Abu Dhabi (new page, 2026-09-04 — see §9a) |
| `/peyronies-disease` | Peyronie's disease specialist Abu Dhabi, penile curvature treatment Abu Dhabi |
| `/male-fertility` | male fertility specialist Abu Dhabi, male infertility doctor Abu Dhabi |
| `/male-fertility/varicocele` | varicocele specialist Abu Dhabi |
| `/about` | andrologist Abu Dhabi, andrology Abu Dhabi (brand/authority intent, not commercial) |
| `/mens-health`, `/sexual-medicine`, `/penile-surgery` | men's health doctor Abu Dhabi (category/navigational intent — these hubs are not built to compete for a specific commercial cluster) |

## 8. Cannibalization risks

**Real risk, already resolved by design, not just by luck:** ED-related
content is split across 3 pages (`/erectile-dysfunction`,
`/penile-doppler`, `/shockwave-therapy`) that could theoretically
compete for the same "erectile dysfunction Abu Dhabi" query. Checked
the actual title/description of each — they're differentiated enough
to avoid direct cannibalization: the main ED page targets the broad
commercial cluster, Doppler and Shockwave both use their own specific
procedure-name long-tail terms ("Penile Doppler," "Li-SWT") in title
and H1, not the broad "erectile dysfunction" phrase as their primary
target. Low residual risk.

**Real risk, requires a decision — see §9 below:** whether to build
`/erectile-dysfunction/assessment` as a separate page from
`/erectile-dysfunction/penile-doppler`.

**No risk found** between `/male-aesthetics` (hub-ish overview) and
`/male-aesthetics/penile-girth-enhancement` (specific procedure) — this
is a standard, SEO-healthy parent/child pattern (broad term on the
parent, specific high-intent term on the child), same shape as
`/erectile-dysfunction` → `/penile-implant`. The new
`/male-aesthetics/scrotal-lift` page (§9a) sits in the same parent/child
relationship and targets a keyword cluster ("scrotal lift," "scrotal
aesthetic surgery") with no term overlap against girth enhancement's
cluster — no cannibalization risk between the two sibling pages either.

## 9. `/erectile-dysfunction/assessment` — explicit evaluation

**Decision: do not create it.** Spec §5 lists it as a separate route
from `/erectile-dysfunction/penile-doppler`, but evaluated against what
those two pages would actually contain:

- `/erectile-dysfunction` (built) already owns the "assessment comes
  before treatment" framing as one of its core sections ("A Diagnosis
  Before a Prescription"), plus the full cause matrix and treatment
  ladder — i.e., the *general* ED assessment story.
- `/erectile-dysfunction/penile-doppler` (built, Phase 4) owns the
  *advanced/specific* assessment story — what Penile Doppler
  specifically evaluates, when it's indicated, how findings feed into
  treatment planning.

A third `/erectile-dysfunction/assessment` page would necessarily
either (a) restate the general-assessment content already on the main
ED page — thin, duplicate content — or (b) restate the Doppler-specific
content already on that page — direct cannibalization of a page
targeting a similar cluster. Neither adds unique searcher value or a
unique keyword target spec §23 doesn't already cover. **This
confirms the Phase 4 routing decision was correct, not just convenient**
— it was evaluated here on SEO grounds specifically (thin content +
cannibalization risk), not just re-stated. If a genuinely distinct
angle for this URL is identified later (e.g. a dedicated "what to
expect at your first ED consultation" page, which is a different
searcher intent than either existing page), that would be a new,
deliberate content decision — not a resurrection of the spec's
original two-separate-pages assumption.

## 9a. `/male-aesthetics/scrotal-lift` — new route decision (2026-09-04)

**Decision: build it as a standalone route**, not a section of
`/male-aesthetics`. Owner confirmation named Scrotal Lift as one of two
current priority Male Genital Aesthetics services (alongside Penile
Girth Enhancement, which already has its own page). Evaluated against
this document's own thin-content bar before building:

- **Distinct search intent**: "scrotal lift" / "scrotal aesthetic
  surgery" / "excess scrotal skin" is a different query cluster from
  "penile girth enhancement" / "hyaluronic acid penile augmentation" —
  no keyword overlap, so no cannibalization risk against the sibling
  page (§8 above).
- **Enough unique medically useful content to avoid thinness**: the
  procedure has its own distinct causes (skin laxity, asymmetry,
  discomfort), its own process/consultation framing, and — per the
  owner's explicit brief — its own realistic discussion of scar
  placement, recovery and limitations that doesn't overlap with girth
  enhancement's risk profile. This matches the bar the
  `/erectile-dysfunction/assessment` decision (§9) used to justify
  *not* building a page — here the same test points the other way.
- Built at `/male-aesthetics/scrotal-lift` with full metadata,
  breadcrumb (`Home → Male Genital Aesthetics → Scrotal Lift`),
  `MedicalProcedure`-typed `MedicalWebPage` JSON-LD, its own FAQ set,
  and cross-links to and from `/male-aesthetics` and
  `/male-aesthetics/penile-girth-enhancement`.

**Related decision — the previously-planned
`/male-aesthetics/hyaluronic-acid` route was removed from the route
registry** (it was `status: "planned"`, never built) rather than kept
alongside the new Scrotal Lift page. Reasoning: hyaluronic acid
penile augmentation is not a separate service from penile girth
enhancement — it is that page's own primary (non-surgical) modality,
already covered there in detail. Building a separate HA page later
would have recreated exactly the thin-content/cannibalization pattern
this section exists to avoid. `/male-aesthetics/revision-correction`
remains `planned` — revision/correction content is currently folded
into both `/male-aesthetics` and the Girth Enhancement page, and would
only warrant its own route if a future content gap specifically
justified it, same standard applied throughout this document.

## 10. Thin-content risk

**The three new hub pages** (`/mens-health`, `/sexual-medicine`,
`/penile-surgery`) are, by design, the thinnest pages on the site — one
intro paragraph plus a short link list, no FAQ, no MedicalWebPage
schema (correctly — they're not treatment content). This was a
deliberate tradeoff (this phase's own brief: "avoid duplicating full
child-page content"), but it is a real thin-content profile worth
naming rather than treating as a non-issue. Mitigations already in
place: each has a unique title/description targeting a real (if
broader) keyword, each links onward to substantive child pages, and
none makes any medical claim of its own that would need to carry more
weight. **Recommendation, not required:** if search performance data
later shows these hubs aren't earning any organic visibility, consider
adding 2-3 sentences of genuine category-level context to each rather
than leaving them as pure link lists — but that's a Phase 6+ data-driven
decision, not something to speculatively pad now.

## 11. Internal-link opportunities

- `/insights` articles all close with a link to their one most-related
  treatment page — confirmed present on all 5. None currently link
  *sideways* to a second related treatment (e.g., the Testosterone
  article could also reference the ED page, since low testosterone and
  ED overlap clinically). Minor opportunity, not a defect — the
  articles are deliberately short and focused.
- `/male-fertility` and `/male-fertility/varicocele` don't currently
  link to any Insights article, since none of the 5 initial articles
  covers fertility. This is accurate (there's genuinely nothing to
  link to yet), not a bug — worth revisiting once/if a fertility
  article is written.

## 12. Production domain configuration

**Single source of truth:** `NEXT_PUBLIC_SITE_URL` (validated as a URL
by `src/lib/env.ts`, consumed by `src/config/site.ts` as `siteUrl`) is
the only place the production domain is configured. No file hard-codes
a domain string — confirmed by grep: the only literal
`http://localhost:3000` in the codebase is the fallback default in
`site.ts` itself.

- **Canonical URLs** — every page's `alternates.canonical`
  (`buildMetadata()`, `lib/seo/metadata.ts`) is built from `siteUrl +
  path`. Changing `NEXT_PUBLIC_SITE_URL` changes every canonical on the
  site in one place.
- **Open Graph URLs** — same mechanism; `openGraph.url` on every page
  and the root layout's `rootMetadata` both derive from `siteUrl`.
- **Sitemap absolute URLs** — `sitemap.ts` builds every `<loc>` from
  `new URL(path, siteUrl)` — confirmed in this audit's own sitemap.xml
  dump above, currently showing `localhost:3000` in this local build
  exactly because the env var isn't set here, which is the correct,
  expected behavior, not a bug.
- **Robots production behavior** — `robots.ts` allows `/` for all user
  agents and points `Sitemap:` at `siteUrl + /sitemap.xml`; nothing
  environment-specific needs to change between dev and production
  beyond the domain itself. No accidental `Disallow: /` risk — the rule
  is a static `Allow: /`, not conditioned on `NODE_ENV`.
- **Fail-safe behavior, hardened this phase:** `siteUrl` already fell
  back to `http://localhost:3000` rather than throwing when the env var
  is missing (Phase 1). This phase added a **production-only console
  warning** (`config/site.ts`) when `NODE_ENV === "production"` and the
  var is still unset — loud in the environment that matters, silent
  (as before) in local dev where localhost is the *correct* value, not
  a misconfiguration.

**www vs. non-www strategy:** not decided by this build, and
deliberately not defaulted to a guess. Whichever the owner picks
(`www.example.com` vs. `example.com`), the only change required is the
single `NEXT_PUBLIC_SITE_URL` value — nothing else in the codebase
encodes an assumption either way. Recommendation for the owner to
decide, not prescribe: **non-www** is the simpler default for a single
personal-brand site with no subdomain plans, but either is fine
technically as long as the DNS/hosting redirect (whichever variant
isn't canonical → redirects to the one that is) is configured at the
hosting/DNS layer, which is outside this codebase's scope entirely —
that's a hosting-provider setting, not something `next.config.ts` or
any app code controls.

## Issue found and fixed — stale breadcrumb depth after the 3 hubs went live

Four pages' breadcrumbs still showed 2 levels (Home › Page) even though
their real spec §5 parent hub went live in the same Phase 4 batch that
built them: ED's parent `/sexual-medicine`, Penile Implant's and
Peyronie's Disease's parent `/penile-surgery`, and Testosterone's
parent `/mens-health`. Every page's breadcrumb was checked against its
*current* live parent rather than assumed correct from when it was
written. **Fixed** — all four now include the correct middle crumb
(e.g. Home › Sexual Medicine › Erectile Dysfunction), matching the
pattern already used correctly by Penile Doppler, Shockwave (parent:
Erectile Dysfunction), Varicocele (parent: Male Fertility) and Penile
Girth Enhancement (parent: Male Genital Aesthetics), none of which
needed a change. Both the visible breadcrumb and its `BreadcrumbList`
JSON-LD update together, since both read from the same array.

---

## Phase A — Flagship positioning restructure (2026-09-05)

Per `SEO_RESTRUCTURE_GAP_ANALYSIS.md` and
`SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md`, verified against the real
production build (`next build && next start`), not assumed from source.

### No new URL, no cannibalization introduced

`sitemap.xml` still lists the same set of live, non-noindex routes as
before this phase — confirmed by `curl`'ing the real sitemap and
grepping for `abu-dhabi`, `male-genital-aesthetics`, and
`filler-correction`: **zero matches**. `/penile-girth-enhancement-abu-
dhabi` and `/male-genital-aesthetics` were not created, per the
decision documented in the gap analysis (§5, §6) — `/male-aesthetics/
penile-girth-enhancement` and `/male-aesthetics` were upgraded in
place instead. No duplicate-intent page exists.

### Metadata changes

- `/male-aesthetics/penile-girth-enhancement`: title unchanged
  ("Penile Girth Enhancement"); description rewritten to lead with the
  physician and the now-verified authority facts ("...with Dr.
  Alejandro Molina, Consultant Urologist & Andrologist — 500+
  procedures performed, experience since 2018...") while keeping the
  existing clinical framing intact.
- `/male-aesthetics`: description gained one clause ("Flagship
  procedure: penile girth enhancement with hyaluronic acid.") — title
  unchanged.
- Both still flow through the existing `buildMetadata()` helper; no
  mechanism change, confirmed unique/non-duplicate against the other
  23 pages by the same method used in §1 above.

### Structured data changes

`personSchema()` (`lib/seo/json-ld.ts`, emitted globally in
`layout.tsx`) gained two new properties:

- `hasCredential`: one `EducationalOccupationalCredential` entry for
  FEBU — a genuinely valid schema.org use of that property, not a
  repurposed field.
- `award`: built from `doctor.awards`, filtered to `publishReady`
  entries only. **Verified via the real rendered JSON-LD that this key
  is entirely absent from the output today** — `prune()` drops the
  empty array, so neither `"award":[]` nor, critically, the
  `EXACT OFFICIAL TITLE REQUIRED` placeholder string reaches any page's
  structured data. Re-verify this specific check after Top Doctors/
  Doctoralia are ever flipped to `publishReady: true`.

### Internal linking

`footerServiceLinks` (`config/navigation.ts`) now leads with "Penile
Girth Enhancement" (linking directly to the treatment page) ahead of
the generic "Male Genital Aesthetics" hub link — previously the
flagship procedure had no named footer link at all. Combined with the
new homepage Featured Procedure section and Authority Strip, the Girth
Enhancement page's homepage-level inbound link count went from 1
(a bullet inside the Male Aesthetics teaser) to 3 (footer, Featured
Procedure section CTA, Male Aesthetics section still). No new orphans
introduced — re-ran the same link-graph logic from §3 above against
the updated build.

### No keyword cannibalization introduced

The only page-level copy changes were to two *existing* pages'
metadata (above); no new indexable page targets the "penile girth
enhancement Abu Dhabi" cluster. §8's cannibalization analysis is
unaffected.

---

## Phase B — Topical authority: Penile Filler Correction + Insights cluster (2026-09-06)

Per `SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md` Phase B. Verified against
the real production build, not assumed.

### New indexable content

One new page, `/male-aesthetics/penile-filler-correction` (replacing
the never-built `revision-correction` placeholder — no redirect
needed, nothing was ever live at the old slug), plus six new Insights
articles. `next build` now generates **40 static pages** (was 33);
`sitemap.xml` now lists **30 entries** (was 23) — exactly +7, matching
the one new page plus six new articles, confirmed by diffing the raw
sitemap output, not just eyeballing the count.

### Keyword cluster targeting — no cannibalization

- `/male-aesthetics/penile-filler-correction` targets "penile filler
  correction / complications / migration / nodules Abu Dhabi" —
  zero term overlap with Girth Enhancement's "girth enhancement /
  hyaluronic acid augmentation" cluster (§8's original hub/child
  analysis extends cleanly to this new sibling page).
- All six new articles target distinct long-tail question intents
  (volume, duration, timing, settling, migration-adjacent "what
  happens over time") — checked against each other and against the
  one pre-existing Girth Enhancement article
  (`penile-girth-enhancement-assessment`, a general assessment-framing
  piece) for topic overlap: **none found**. Each article owns a
  distinct searcher question.
- Per the explicit "do not create multiple pages for these variants"
  instruction: "Penile Filler Complications" was **not** built as a
  separate page — complications are a section (`presentations`) within
  the Filler Correction page itself, avoiding exactly the
  split-intent pattern this document's methodology has consistently
  flagged (§9, §9a).

### Metadata

New page: unique title ("Penile Filler Correction"), unique
description naming Abu Dhabi + the specific presentations (asymmetry,
irregular contour, nodules, migration) without stuffing, canonical via
the existing `buildMetadata()` helper. Six new articles: title/
description pulled from each article's own `title`/`excerpt` via the
existing `generateMetadata()` in `insights/[slug]/page.tsx` — same
mechanism as the 5 pre-existing articles, no changes needed there.
Confirmed no duplicate title/description against the other 39 pages.

### Structured data

New page emits `BreadcrumbList` + `MedicalWebPage` (`aboutType:
"MedicalProcedure"`) + `FAQPage` (6 questions) — same pattern as every
other treatment page, verified via the real rendered JSON-LD
(`"about":{"@type":"MedicalProcedure","name":"Penile Filler
Correction"}`). Six new articles emit `BreadcrumbList` + `Article` —
automatic, since `generateStaticParams` and `articleSchema()` both
read from the same `insightArticles` array a new entry was added to.
No schema architecture change was needed for either.

### Physician authorship — now visible, not just schema

`ArticleAuthorBlock` (new component) is now rendered on **every**
Insights article — the 5 pre-existing ones included, not just the 6
new ones — showing name, title, and a config-driven credential summary
("15+ years in Urology · FEBU · Penile Girth Enhancement since 2018"),
plus a link to `/about`. Previously, authorship existed only in
invisible `Article` JSON-LD. Verified via the real rendered HTML.

### Internal linking

- Each new article links to `/male-aesthetics/penile-girth-
  enhancement` (all six) and, where contextually relevant, to
  `/male-aesthetics/penile-filler-correction` (three of six — "how
  much girth," "how long it lasts," and "what happens over time" all
  naturally raise the "this doesn't look/feel right" question the
  correction page answers; the HA-volume, sex-timing, and settling-
  period articles don't concern a post-treatment problem, so no
  secondary link was forced onto them).
- The Male Genital Aesthetics hub's former "Assessment of Previous
  Fillers" focus area now links directly to the new page.
- The Girth Enhancement page's "Revision / correction" aftercare item
  now links to the new page (previously text-only, no link).
- The new page links back to Girth Enhancement, the hub, Peyronie's,
  ED, and About — five contextual links, matching the brief exactly.
- The About page's "Male genital aesthetics" narrative row now links
  to the Girth Enhancement page (previously text-only) — closing the
  loop, since the Girth page has linked to About since Phase A.
- Anchor text checked across all of the above: uses natural variants
  ("Explore Penile Girth Enhancement," "Explore Penile Filler
  Correction," "About Dr. Alejandro Molina") — no repeated exact-match
  "penile girth enhancement Abu Dhabi" anchor anywhere, per the
  explicit instruction against anchor-text spam.

### No keyword cannibalization introduced (Phase B)

Confirmed via the same method as Phase A: no new page or article
targets an existing page's primary cluster. The relationship between
the new Filler Correction page and the Girth Enhancement page mirrors
the already-audited, SEO-healthy Scrotal Lift / Girth Enhancement
sibling relationship (§9a).

---

## Phase C — Topical authority expansion: 5 new articles + linking hardening (2026-09-06)

Per the owner's Phase C prompt and
`docs/superpowers/plans/2026-09-06-phase-c-content-cluster.md`. No new
routes were created this phase — verified against the real production
build, not assumed.

### New indexable content

Five new Insights articles, no new pages. `next build` now generates
**45 static pages** (was 40); `sitemap.xml` now lists **35 entries**
(was 30) — exactly +5, confirmed by diffing the raw sitemap output.

### Keyword cluster targeting — cannibalization decisions made explicit

Three of the eight owner-proposed candidate articles were deliberately
**not** built, specifically to avoid cannibalization:

- "Is Penile Girth Enhancement Safe?" would have targeted the same
  query intent as the flagship page's own Risks/Aftercare/Revision
  section and FAQ. Addressed instead via a new direct-answer FAQ item
  on the flagship page itself — one page owns the "is it safe" intent,
  not two competing ones.
- "Penile Filler Correction: When Is It Necessary?" would have
  duplicated the Filler Correction page's own thesis and FAQ verbatim.
- "Penile Filler vs Fat Transfer" was excluded on clinical-accuracy
  grounds (fat transfer isn't offered here), not a cannibalization
  concern, but is noted here since it's one of the three omissions.

The five articles built each own a distinct long-tail intent
(migration, nodules/irregularities, dissolution, inter-patient feel
variability, physician reflective/experience piece) checked against
each other and against the existing 12-article girth cluster: **no
overlap found**.

### Metadata

Five new articles: title/description pulled from each article's own
`title`/`excerpt` via the existing `generateMetadata()` — same
mechanism as all 16 other articles, no changes needed. Confirmed no
duplicate title/description against the other 44 pages.

### Structured data

Five new articles emit `BreadcrumbList` + `Article` — automatic, same
mechanism as Phase B. New optional `VideoObject` schema (`lib/seo/
json-ld.ts`) exists but is not emitted anywhere in this phase, since no
article has a populated `video` field yet — confirmed via the real
rendered JSON-LD on all five new article pages (no `VideoObject` block
present). No `aggregateRating` or award data introduced.

### Internal linking — Related Insights + FAQ read-more links

- New `RelatedInsights` component renders 2-4 cross-linked articles at
  the bottom of an article page; applied to all 12 girth-cluster
  articles (7 pre-existing + 5 new), thematically grouped (e.g.
  migration ↔ nodules ↔ settling-time; the 500+ procedures article ↔
  assessment, feel-variability, and settling-time articles).
- New optional `readMoreHref`/`readMoreLabel` on `FaqItem`: wired on
  the Girth Enhancement page (size-increase and permanence FAQs → their
  matching articles) and the Filler Correction page (migration FAQ →
  new migration article; dissolution FAQ → new dissolution article).
- Anchor text checked across all new links: natural variants only
  ("Read more: How Much Girth Can Penile Filler Actually Add?," etc.)
  — no repeated exact-match anchor spam.

### No keyword cannibalization introduced (Phase C)

Confirmed via the same method as Phases A and B: no new article
targets an existing page's or article's primary intent. The one
borderline case — "Is Penile Girth Enhancement Safe?" — was resolved
by folding the intent into the flagship page's existing FAQ rather
than creating a competing page, which is the same resolution pattern
already validated for the Filler Correction / Girth Enhancement
relationship in Phase B.

---

## Phase R1-R2 — Positioning/UX implementation (2026-09-07)

No routes were added, removed, or renamed this phase — sitemap entry
count is unchanged from Phase C's 35. Two metadata/entity changes
worth recording here:

- **Homepage H1** changed from "Advanced Andrology & Men's Health" (a
  generic specialty label, present in no other page's H1 either, so no
  duplicate-H1 risk existed or exists) to "Dr. Alejandro Molina" — a
  stronger, more specific entity signal on the site's highest-traffic
  page, matching the physician-entity-first approach already used in
  the site's `<title>` template and `personSchema()`.
- **About page `<title>`** fixed from a duplicated
  "About Dr. Alejandro Molina | Dr. Alejandro Molina" to
  "About | Dr. Alejandro Molina" (the sitewide title template already
  appends the doctor's name, so the page-level title only needed to
  say "About").

Person/Physician JSON-LD (emitted globally via `layout.tsx`) is
unaffected by any change this phase. `medicalWebPageSchema` and
`faqPageSchema` on the Male Aesthetics hub, Men's Health hub, Sexual
Medicine hub, and Penile Surgery hub were re-verified to still parse
correctly after each page's content changes (new FAQ items on 3 of the
4 automatically feed the existing `faqPageSchema()` mechanism — no
schema-layer code change was needed for that).
