# Implementation Report — Dr. Alejandro Molina UAE Website

**Spec:** `DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md` (read in full before any work started)
**Status:** Phase 0 (Audit), Phase 1 (Foundation), Phase 2 (Full Homepage), Phase 3 (six high-value inner pages) and Phase 4 (supporting MVP routes, global booking integration, Insights, legal pages) complete. Phase 5 not started.

---

## Phase 0 — Audit

`/Users/alejandro/Projects/andrologist` contained no existing repository or
codebase — only the master spec markdown file, no git history, no
`package.json`. Per spec §38 ("If repository is empty: initialize latest
stable Next.js architecture"), this was treated as a greenfield build
rather than a migration.

Note for the record: this machine also has an unrelated project ("web
eiap", a Spanish-language clinical-training academy site for a different
subject) mounted as an additional working directory in this session. It
was not touched, audited, or reused for this build — it belongs to a
different product entirely.

Before writing any code, the Next.js 16 docs bundled at
`node_modules/next/dist/docs/` were read (per the project's own
`AGENTS.md`, which `next dev` regenerates and which warns that this
version has breaking changes vs. older training data). Confirmed and
applied: Turbopack-by-default, fully-async `params`/`searchParams`
(via the generated `LayoutProps<'/'>` helper), ESLint flat config
default, Tailwind v4's CSS-first `@theme` configuration (no
`tailwind.config.ts`), and the current `next/image` defaults
(`qualities: [75]`, `minimumCacheTTL: 4h`, etc.).

**Stack initialized:** Next.js 16.3.4 (App Router, Turbopack), React
19.2.8, TypeScript (strict), Tailwind CSS v4, ESLint 9 (flat config).
Added: `motion` (Framer Motion's successor package), `zod`,
`clsx` + `tailwind-merge` + `class-variance-authority` (styling
utilities), `@radix-ui/react-dialog` + `@radix-ui/react-slot`
(accessible primitives), `lucide-react` (icons) — all per spec §19's
preferred stack ("shadcn/ui where useful" interpreted as: hand-built
primitives using the same underlying conventions — Slot, cva, Radix —
rather than pulling the full shadcn CLI scaffold for a two-component
Phase 1). No Supabase, no auth, no database — per spec §19/§35.

---

## Phase 1 — Foundation

### Config layer (`src/config/`)
Single source of truth so no component hard-codes NMC or doctor facts
(spec §1.D, §21, §22):
- `practice.ts` — facility name/location/booking URLs. Booking and
  physician-profile URLs are **intentionally empty** (see Unresolved
  Placeholders below) rather than guessed.
- `doctor.ts` — name, title, expertise areas (§0), credentials
  (verbatim from §8's "verified professional background"), and
  explicitly-empty fields (biography, languages, awards, academic
  roles, social links) for anything the spec doesn't state.
- `site.ts` — title template, description, locale, `siteUrl` (env-driven
  with a safe localhost fallback, no fabricated domain).
- `features.ts` — `prpPage: false`, the compliance gate from spec §12.
- `navigation.ts` — primary nav (§6), footer service links ordered by
  the commercial priority matrix (§3), legal nav.

### Design tokens (`src/styles/tokens.css`, `src/app/globals.css`)
Tailwind v4 CSS-first theme. Palette direction from spec §16 (warm
off-white / stone-taupe / deep graphite / muted bronze / optional dark
olive) is built almost entirely from Tailwind v4's own default palette,
which already ships `stone`, `taupe` and `olive` scales matching that
brief — only a custom low-chroma `bronze` scale was hand-added, since
Tailwind has no equivalent (amber/orange read as too saturated).
Semantic tokens (`--background`, `--foreground`, `--accent`, etc.) live
on `:root` with two local overrides — `.section-dark` and
`.section-olive` — implementing spec §7 Section 4's "premium dark
section" and §16's "optional dark olive" as section-scoped theme swaps
rather than a second design system.

Typography: `Fraunces` (variable, optical-size axis) for display/serif
headings, `Inter` for UI/body — both self-hosted via `next/font/google`
— plus a fluid, oversized `text-display-*` scale (`clamp()`-based,
tuned across the §33 responsive QA viewports) and an `eyebrow` text
style.

Motion tokens: `--ease-soft`, restrained duration scale — consumed by
the JS motion layer below, not just CSS.

**Deliberate deviation from the `create-next-app` default:** removed
the scaffold's `prefers-color-scheme` site-wide dark mode. The spec's
"dark" treatment is a specific section-level art-direction choice, not
a light/dark toggle the visitor controls — implemented instead as the
`.section-dark` / `.section-olive` local overrides above.

### Global shell (`src/components/layout/`, `src/components/navigation/`)
- `Header` — sticky-after-scroll (spec §6), desktop nav, discreet
  header CTA, mobile trigger.
- `MobileNav` — accessible drawer built on Radix Dialog (focus trap,
  Escape-to-close, correct `aria-*` wiring) — "accessible drawer, no
  overloaded mega-menu" per spec §6.
- `Footer` — care-area quick links (Tier 1 first, per §3), site nav,
  legal nav, practice location line, conditional "View NMC Profile"
  link.
- `PageShell` / `SkipLink` — global shell + WCAG skip-to-content link
  (§30).

### Motion primitives (`src/components/motion/`)
- `MotionProvider` — wraps the app in `MotionConfig
  reducedMotion="user"` so every transform-based animation resolves
  instantly under the OS reduced-motion preference, in one place,
  rather than every component re-checking it (spec §17).
- `Reveal` — soft fade/lift on scroll-into-view, once.
- `StaggerGroup` / `StaggerItem` — staggered card reveals.
- `MaskedReveal` — panel-wipe image reveal (spec §17 "masked image
  reveal").
All intentionally subtle — no parallax, no scroll-hijacking, no 3D,
matching spec §17's explicit "no" list.

### SEO utilities (`src/lib/seo/`)
- `metadata.ts` — `buildMetadata()` for per-page metadata (canonical,
  OG, Twitter) and `rootMetadata` for the root layout.
- `routes.ts` — a single registry mirroring the full §5 MVP site map,
  each entry tagged `status: "live" | "planned"`. `sitemap.ts` only
  emits `"live"` entries (today, just `/`) — this is what keeps
  `sitemap.xml` honest as pages ship phase by phase instead of listing
  routes that don't exist yet.
- `json-ld.ts` — builders for `Person`, `Physician`, `BreadcrumbList`,
  `MedicalWebPage`, `FAQPage`, `Article` (spec §25). The physician
  entity is modeled as **affiliated with** NMC (`hospitalAffiliation`),
  never as an owned `LocalBusiness` — spec §25's explicit prohibition.
  No `aggregateRating`, no reviews, no unverified awards are emitted.
  `Person`/`Physician` JSON-LD render site-wide from the root layout;
  `BreadcrumbList`/`MedicalWebPage`/`FAQPage`/`Article` are ready for
  Phase 3+ pages to call.
- `components/seo/JsonLd.tsx` — renders the `<script type="application/
  ld+json">` tags with the `<` → `<` escaping Next's own JSON-LD
  guide recommends.

### Analytics contract (`src/lib/analytics/events.ts`)
Typed `nmc_booking_click` / `physician_profile_click` event shapes per
spec §26. **No provider is wired up** — `trackEvent()` is a dev-only
console no-op by design, since spec §27 requires GA4 only after
cookie/privacy implementation (not yet built). This gives every future
CTA a single, already-correct call site to use once a provider lands.

### Env validation & security (`src/lib/env.ts`, `next.config.ts`)
- Zod schema validating `NEXT_PUBLIC_SITE_URL`, extensible for future
  env vars (spec §32 "strict env validation").
- `next.config.ts` sets a baseline CSP, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` (spec §32). CSP has no
  allowance for third-party script origins yet — revisit
  `script-src`/`connect-src` when GA4/Vercel Analytics are added.

### UI primitives (`src/components/ui/`)
- `Container` — editorial max-width + fluid gutter (spec §16 "large
  margins").
- `Button` — `cva` variants (primary/secondary/ghost), Radix `Slot`
  for `asChild` composition.
- `BookingCta` — wraps the external NMC link with `rel="noopener
  noreferrer"` (spec §32), fires `nmc_booking_click`, and **renders as
  a disabled button with an explanatory `title`** rather than a broken
  or fabricated link while `practice.bookingUrl` is unset.

### Homepage foundation preview (superseded by Phase 2, see below)
Phase 1 shipped spec §7 **Section 1 (Hero) only**, as a proof point for
typography/motion/layout before mass-building the rest. Phase 2 (below)
replaces that placeholder page with the complete 11-section homepage.

### Other
- `not-found.tsx` — global 404, wrapped in `PageShell` directly (the
  root-level 404 doesn't inherit the `(marketing)` nested layout),
  satisfying the §34 smoke-test list.
- `robots.ts` / `sitemap.ts` — generated from the routes registry.
- `public/images/{doctor,treatments,editorial}/`, `public/icons/`,
  `src/content/insights/` — scaffolded per spec §20's suggested
  architecture, each with a `README.md` documenting what belongs there
  and linking back to the relevant spec section.

---

## Phase 2 — Full Homepage

All 11 sections of spec §7 are now implemented in
`src/app/(marketing)/page.tsx`, composed from one component per section
in `src/components/sections/`. Priority was design quality and
compositional variety over reusing one card pattern — no two sections
share the same layout shape, and only two use a literal grid.

| # | Component | Composition | Tone |
|---|---|---|---|
| 1 | `HeroSection` | Split hero, masked portrait placeholder, trust strip | light |
| 2 | `CoreExpertiseSection` | Numbered editorial index (magazine contents page, not cards), secondary link row | light |
| 3 | `ErectileDysfunctionSection` | Editorial split: copy left, vertical "contributor" timeline right | light |
| 4 | `PenileImplantSection` | Bordered spec-sheet grid, no shadows/rounded cards | **dark** (`.section-dark`) |
| 5 | `TestosteroneSection` | Centered heading, oversized pull-quote + flowing pill list | light |
| 6 | `MaleAestheticsSection` | Asymmetric image+list split (image right), masked reveal | light |
| 7 | `AdvancedAssessmentSection` | Horizontal 4-step flow with connecting lines + featured callout | surface |
| 8 | `AboutSection` | Asymmetric image+narrative split (image left — mirrors §6 for rhythm) | light |
| 9 | `ConditionsSection` | Bordered 4-column directory/index grid, deliberately unadorned | light |
| 10 | `InsightsSection` | Asymmetric editorial spread: one featured + two smaller, category tags instead of dates | light |
| 11 | `BookingSection` | Centered closing CTA | **olive** (`.section-olive`) |

**Tonal rhythm:** light → light → light → **dark** (implant) → light →
light → surface → light → light → light → **olive** (booking) → dark
(footer). Two distinct non-default tones are used deliberately once
each in the body, rather than repeating one dark treatment — spec §16
calls the dark olive/ink secondary "optional," and overusing it would
have worked against "restrained dark sections" in this brief.

**Shared additions supporting the sections:**
- `components/ui/SectionHeading.tsx` — the eyebrow/H2/support-copy
  rhythm reused by most (not all) sections; composition intentionally
  varies around it rather than every section becoming "heading +
  identical body."
- `components/ui/ImagePlaceholder.tsx` — one consistent art-directed
  placeholder motif (fine diagonal hairline pattern, index label,
  caption) reused everywhere a real photograph is still needed (spec
  §18), instead of the ad hoc placeholder Phase 1's hero used. The
  Hero was refactored onto this shared component too.
- `components/ui/AmpersandText.tsx` and `components/ui/InternalLink.tsx`
  — added during real-browser QA (see below) to fix a font-legibility
  issue and eliminate wasted/noisy link prefetching, respectively.

**Content sourcing:** every heading, pull-quote, diagnostic-pillar
label, cause-matrix item, and CTA label is verbatim from spec §7.
Short supporting sentences that aren't verbatim (e.g. the one-line
descriptions under the four Core Expertise items) were composed only
from vocabulary and concepts the spec itself already uses elsewhere
(PDE5 inhibitors, penile prosthesis, semen analysis, varicocele,
hormonal/metabolic assessment) — nothing new was asserted about
efficacy, safety, or availability.

**Commercial hierarchy:** Tier 1 (ED, Penile Implant, Testosterone,
Male Aesthetics) each get a full dedicated homepage section (3–6).
Tier 2 (Peyronie's, Penile Doppler, Shockwave, Male Fertility) surface
only as secondary links, the Advanced ED Assessment feature/caveat, and
directory entries — present for authority and internal linking, never
visually competing with Tier 1.

**Internal linking / Phase 3 readiness:** every section links to its
real spec §5 route (e.g. `/erectile-dysfunction`, `/penile-implant`,
`/mens-health/testosterone`). Two labels with no dedicated route in the
spec's site map — "Premature Ejaculation" (Core Expertise secondary
link, Conditions index) — link to `/sexual-medicine` (their real parent
hub) rather than a fabricated slug. The three Insights teasers use
spec-verbatim titles with slugs invented for internal Phase 4 routing
only (e.g. `/insights/penile-implant-when-considered`) — an
implementation detail, not a claim; no dates or bylines are shown.
None of these routes exist yet, so they currently resolve to the
custom 404, identical to the pattern already established for the main
nav in Phase 1 — this is expected during incremental build-out, not a
QA failure.

**Booking:** unchanged from Phase 1 — `BookingCta` still renders
disabled with an explanatory `title` everywhere (header, hero, closing
section) because `practice.bookingUrl` is still an empty placeholder.
No URL was invented for this phase either.

**Accessibility/motion:** every new section builds exclusively on the
Phase 1 `Reveal` / `StaggerGroup` / `StaggerItem` / `MaskedReveal`
primitives — no section imports `motion/react` directly — so
`prefers-reduced-motion` handling (via the site-wide `MotionConfig
reducedMotion="user"`) applies automatically without needing to be
re-verified per section. Decorative connective elements (arrows, dots,
divider lines) are `aria-hidden`; no information is conveyed by motion
or icon alone. Focus visibility relies on the existing global
`:focus-visible` rule, which is section-tone-aware because
`--color-focus-ring` is one of the tokens `.section-dark`/`.section-
olive` override.

---

## Phase 3 — Six High-Value Inner Pages

Built in spec §38's stated order, each at its real spec §5 URL:

| # | Page | Route | Spec basis |
|---|---|---|---|
| 1 | Erectile Dysfunction | `/erectile-dysfunction` | §10 |
| 2 | Penile Implant Surgery | `/penile-implant` | §8 |
| 3 | Testosterone & Male Hormonal Health | `/mens-health/testosterone` | §9 |
| 4 | Male Genital Aesthetics | `/male-aesthetics` | §13 |
| 5 | Penile Girth Enhancement | `/male-aesthetics/penile-girth-enhancement` | §14 |
| 6 | Peyronie's Disease | `/peyronies-disease` | Funnel D (§4) + §29 (no dedicated page spec exists for this one — see note below) |

Each page is a single `page.tsx` (not split into reusable section
components like the homepage) — content is page-specific and used
exactly once, so extra indirection wasn't worth it. What *is* shared
are genuinely structural, content-agnostic primitives, used identically
across all six pages but filled with entirely different data:

- `components/ui/Breadcrumb.tsx` — visual trail, links only to routes
  that actually exist (see note below).
- `components/ui/Faq.tsx` — Radix Accordion-based FAQ, renders its
  matching `FAQPage` JSON-LD from the same data so they can't drift
  apart. Verified interactively (a real click via the QA harness) —
  opens correctly, `aria-expanded` toggles, `+` rotates to `×`.
- `components/ui/RelatedTreatments.tsx` — the "strong internal linking
  between related treatments" band required on every inner page.
- `components/sections/TreatmentCtaSection.tsx` — closing consultation
  CTA. Deliberately kept light/surface-toned on every page — each page
  gets its own *one* distinctive dark or olive moment elsewhere instead
  (see the tonal-rhythm table below), so the closing CTA doesn't turn
  into a repeated dark band that would undercut "restrained" (spec
  §16).

**Composition varies deliberately, page to page** — this was checked
explicitly against the instruction "if any page looks like a
duplicated template with swapped text, redesign it":

| Page | Hero shape | Distinctive body composition | Its one dark/olive moment |
|---|---|---|---|
| Erectile Dysfunction | Left-aligned, text-only | Vertical numbered "treatment ladder" (7 steps) | **dark** — the ladder |
| Penile Implant | Asymmetric split, image right | Side-by-side inflatable/malleable comparison; 3-phase pathway | **dark** — assessment→surgery→recovery |
| Testosterone | Centered, text-only | Oversized pull-quote as its own full-bleed band; numbered monitoring list | **olive** — the pull-quote |
| Male Genital Aesthetics | Asymmetric split, image **left** (mirrors Implant's image-right for rhythm) | Alternating left/right editorial rows (not a grid) | **olive** — risks/why-assessment-matters |
| Penile Girth Enhancement | Centered, with a 3-word strapline row | Escalating 2-item "non-surgical first, surgical only if approved" list | **dark** — "results vary," given weight rather than buried |
| Peyronie's Disease | Left-aligned, text-only | Two-state active/stable phase split; 3-tier horizontal pathway | **olive** — the pathways |

Tonal tally across the six pages: dark ×3, olive ×3 — deliberately
balanced so neither treatment becomes the site's "default," matching
how the homepage itself used dark once and olive once rather than
repeating either.

**Content sourcing:** headings, hero statements and process labels
follow spec wording directly where spec gives it (§8/§9/§10/§13/§14).
Supporting sentences not verbatim in the spec were written only from
concepts spec already establishes elsewhere, or from standard,
generic, non-statistical patient-education framing (e.g., listing
infection/bleeding/mechanical wear as *possible* risk categories for
implant surgery — well-established general medical knowledge, not a
claim about this practice's outcomes). Every one of the "never say"
lists in spec §8/§13/§14 (no guaranteed erection, no 100% satisfaction,
no permanent cure, no "bigger penis"/"instant enlargement", no exact
size gains) was checked against the actual copy, not just aimed for —
see the Peyronie's note and the Penile Girth Enhancement page's
"Expected variability" section, which explicitly tells the reader
*why* no numbers are quoted rather than silently omitting them.

**Peyronie's Disease has no dedicated page-structure section in the
master spec** (unlike §8/§9/§10/§13/§14 for the other five pages) — the
spec's only structured guidance for it is Funnel D (§4: phase →
curvature/erectile function → assessment → ultrasound where appropriate
→ conservative/procedural/surgical → consultation). This page's
structure was built from that funnel plus §29's universal per-treatment
checklist (who it's for, assessment, alternatives, limitations, risks,
realistic outcomes, CTA) and the user's own explicit emphasis list for
this phase — not invented from nothing, but flagged here since it
didn't have the same direct spec section to follow as the other five.

**Breadcrumbs reflect only routes that actually exist**, not the full
aspirational site map — e.g. Testosterone's real parent hub
(`/mens-health`) and ED's (`/sexual-medicine`) aren't built yet, so
those breadcrumbs are "Home › Page" rather than including a middle
crumb that would link to a 404. Penile Girth Enhancement's breadcrumb
*is* three levels ("Home › Male Genital Aesthetics › Penile Girth
Enhancement") since its real parent was also built this phase.

**Internal linking:** every page links to its spec-required related
treatments (ED → Testosterone/Doppler/Shockwave/Implant/Peyronie's per
§10; Implant → ED/Testosterone/Peyronie's; etc.) via the
`RelatedTreatments` band, plus contextual in-body links (e.g. the
Implant page's hero "Who may be a candidate" anchor, the Male
Aesthetics hub linking into Penile Girth Enhancement). Links to routes
outside this phase's six (Penile Doppler, Shockwave, Male Fertility,
Low Libido, About) resolve to the custom 404 — expected, matching the
pattern already established in Phase 1/2, not a defect.

**`InternalLink` upgraded from Phase 2:** it previously defaulted every
internal link to `prefetch={false}` because almost nothing was live
yet. It now checks the same `lib/seo/routes.ts` registry `sitemap.ts`
reads, and prefetches only routes marked `status: "live"` — so it
self-corrected the moment these six routes went live, with no need to
touch the 40+ call sites from Phase 1/2. `routes.ts` itself was updated
to flip all six to `"live"`, so `sitemap.xml` now lists all 7 real
pages.

**Booking:** unchanged — every `BookingCta` on every new page (18
instances: header/hero/closing-CTA × 6 pages, reusing the global
header) still renders disabled with the explanatory title, because
`practice.bookingUrl` is still an empty placeholder. No URL was
invented for this phase either.

**PRP:** not touched. `features.prpPage` is still `false`; no route,
page, nav entry, or metadata was added for it, per spec §12 and this
phase's explicit instruction not to create or enable it.

---

## Phase 4 — Supporting MVP Routes, Global Booking, Insights, Legal

### Official NMC URLs — now live, integrated centrally

`src/config/practice.ts` now holds the confirmed URLs:

```ts
bookingUrl: "https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina"
physicianProfileUrl: "https://nmc.ae/en/doctors/dr-alejandro-molina"
```

Because every booking CTA and "View NMC Profile" link across the site
was already reading from this config (`BookingCta` component, `Phase
1/2/3 §21`), **this single two-line edit enabled every booking CTA
site-wide with zero component changes** — confirmed by curl before
touching any other file: 0 `disabled` buttons and the correct URL on
every page, immediately after the config edit and before any new Phase
4 page existed. This is the config-driven architecture from Phase 1
paying off exactly as designed. `bookingUrl` is used only for "Book a
Consultation" CTAs; `physicianProfileUrl` only for secondary "View NMC
Profile" actions — never swapped, confirmed by grep across the whole
site (see Verification below).

### Routes built (11 requested + 3 parent hubs)

| # | Page | Route | Spec basis |
|---|---|---|---|
| 1 | Penile Doppler / Advanced ED Assessment | `/erectile-dysfunction/penile-doppler` | §5, this phase's brief |
| 2 | Shockwave Therapy | `/erectile-dysfunction/shockwave-therapy` | §11 |
| 3 | Male Fertility | `/male-fertility` | §5, this phase's brief |
| 4 | Varicocele | `/male-fertility/varicocele` | §5, this phase's brief |
| 5 | About Dr. Alejandro Molina | `/about` | §15 |
| 6 | Book / Practice Location | `/book` | §5, this phase's brief |
| 7 | Insights index | `/insights` | §7 Section 10 |
| 8 | 5 Insights articles | `/insights/[slug]` | §7 Section 10 topic list |
| 9 | Privacy Policy | `/privacy` | §5 |
| 10 | Terms of Use | `/terms` | §5 |
| 11 | Medical Disclaimer | `/medical-disclaimer` | §5, §29 |
| — | Men's Health hub | `/mens-health` | this phase's §11 (parent routes) |
| — | Sexual Medicine hub | `/sexual-medicine` | this phase's §11 |
| — | Penile Surgery hub | `/penile-surgery` | this phase's §11 |

**Every primary nav item now resolves to a real page.** `Male
Aesthetics`/`Male Fertility`/`About` were already live or went live
this phase; `Men's Health`, `Sexual Medicine` and `Penile Surgery` hubs
close out the remaining three. The three hubs are deliberately short
(orient + link to children, per this phase's own instruction not to
duplicate child content) but not visually identical to each other —
`/mens-health` is a plain stacked list, `/sexual-medicine` a numbered
index, `/penile-surgery` a two-column grid — so three genuinely minor
utility pages don't read as one cloned template stretched across three
URLs.

**One routing decision worth flagging explicitly:** spec §5 lists
`/erectile-dysfunction/assessment` and `/erectile-dysfunction/
penile-doppler` as two separate routes, but this phase's brief framed
"Penile Doppler / Advanced ED Assessment" as a single deliverable. One
page was built, at `/erectile-dysfunction/penile-doppler` (the more
specific, search-relevant slug); `/erectile-dysfunction/assessment`
stays unbuilt (`status: "planned"` in the routes registry, with a
comment explaining why) rather than being built as a near-duplicate
page. If a distinct "general ED assessment" page (separate from the
Doppler-specific one) turns out to be wanted later, that's a Phase 5+
decision, not an oversight here.

**`doctor.ts` credentials expanded:** this phase's About-page brief
named two verified background themes — uro-oncology and functional
urology — that weren't in the original spec-sourced list from Phase 1
(spec §8's own list doesn't include them). These were added directly
to `doctor.credentials` as explicit owner-supplied content (spec §22/
§41 treat that as a valid source, same standing as the spec text
itself), not invented. Doing this **shifted array indices**, which
broke a pre-existing bug risk: the homepage's `AboutSection` referenced
`doctor.credentials` by numeric index (`[1]`, `[2]`, `[4]`, `[9]`) —
after the insert, index `9` silently pointed at the wrong credential.
Caught before it shipped and fixed by switching to a stable
string-match filter instead of fragile positional indices — the kind
of bug that's easy to introduce silently when a "just append two items"
change is made to a list something else indexes into by position.

### Global booking CTA — verified everywhere

Checked with curl across all 17 top-level pages plus a sample of
sub-pages (not just spot-checked on one): every `BookingCta` instance
renders **not disabled**, every one resolves to the exact confirmed
`bookingUrl`, every external link carries `target="_blank" rel="noopener
noreferrer"`, and every "View NMC Profile" link resolves to the exact
`physicianProfileUrl` — never the booking URL, and never the reverse.
`nmc_booking_click` (component: `BookingCta`) continues to fire on
click with `source_page`/`service`/`cta_position`, unchanged from
Phase 1 — still a dev-only console no-op until an analytics provider is
wired up (spec §27, still gated on cookie/privacy implementation, which
remains outside this phase's scope even though the legal pages now
exist — see Unresolved Items).

### Insights architecture

- `src/content/insights/articles.ts` — structured TypeScript content
  (spec §19's "MDX or structured local content" — structured data was
  chosen over MDX to avoid adding a new build-tooling dependency for
  five initial articles). Exports `insightArticles` and a
  `getInsightArticle(slug)` lookup.
- `/insights` — editorial index, categories shown for orientation (not
  an interactive filter — spec's own "avoid clutter" instruction), each
  article listed with category, real publish date, title and excerpt,
  no card-grid.
- `/insights/[slug]` — `generateStaticParams` from the same article
  data (all 5 statically generated, confirmed in the build output:
  `● /insights/<slug>`), `generateMetadata` per article, `Article` +
  `BreadcrumbList` JSON-LD, and a visible **"Clinical review
  pending"** badge on every article (`clinicalReviewRequired: true` on
  all 5, uniformly — see the reasoning below).

**Why every article is marked `clinicalReviewRequired: true`, not just
some:** the brief allows drafting "high-quality drafts" where content
can be written safely from the existing spec, and flagging others for
stronger sourcing. All 5 topics could be written entirely from
concepts already established on this site's own treatment pages,
without needing external citations — but no medical content anywhere
on this site has had actual clinical or compliance sign-off yet (this
has been true, and stated, since the Phase 3 report). Marking some
articles "reviewed" and others not, when neither category has actually
been reviewed by anyone, would be the exact kind of false signal spec
§41 and this phase's own instruction ("do not pretend draft content is
clinically signed off") warn against. So the flag is applied uniformly
and honestly, and shown to visitors, not just noted in code.

**`datePublished`** on every article is `2026-09-03` — the real date
this content was added to the site, not an invented historical
publication date, study date, or citation date. This is stated
explicitly because the instruction to "not invent... publication
dates" could otherwise be read as "don't show any date" — showing the
actual, true creation date is not the same thing as inventing one.

**Article schema is only emitted for the 5 real, built article
routes** — there is no mechanism in this codebase that could emit it
for a route that doesn't exist, since `generateStaticParams` and the
JSON-LD call both read from the same `insightArticles` array.

### Legal pages

`/privacy`, `/terms`, `/medical-disclaimer` — each a single
professional-draft-quality page, `noindex` (a deliberate choice for
this MVP's boilerplate legal content, not a spec requirement either
way — easy to reverse later), and each carries a prominent code
comment:

```ts
/**
 * DRAFT — pending final UAE legal/compliance review (spec §28, Phase 4
 * instruction §10). This is professional-draft-quality placeholder
 * content, not a legally reviewed policy. Do not treat as approved for
 * launch without owner/legal sign-off. See IMPLEMENTATION_REPORT.md.
 */
```

Content decisions worth noting: the Privacy Policy is honest that this
site collects no personal/health data itself (no forms exist) and that
booking happens entirely on NMC's own platform under NMC's own privacy
practices; it references "applicable data protection law in the United
Arab Emirates" generically rather than citing a specific statute
(getting a citation wrong would be worse than a general reference — a
real lawyer should cite it precisely). The Medical Disclaimer follows
the brief's exact required points (informational only, not a
substitute for individual assessment, consultation required for
diagnosis/treatment, contact local emergency services for emergencies)
without inventing a specific emergency phone number — "your local
emergency services" is correct regardless of the reader's location,
where a specific number could be wrong for some visitors.

### Design rhythm across Phase 4

Each new treatment-style page (Penile Doppler, Shockwave, Male
Fertility, Varicocele) continues the one-dark-or-olive-moment-per-page
pattern from Phase 3, and a secondary pattern became visible across
this batch: **the dark/olive section is consistently where the
restraint message lives** — "context, not a verdict" (Doppler,
olive), "evolving evidence, individual response" (Shockwave, dark),
"fertility preservation and collaborative care" (Fertility, olive),
"findings, not decisions in isolation" (Varicocele, dark). This wasn't
planned as a rule in advance; it emerged because the honest
limitation/restraint content is naturally the moment worth giving
visual weight to on a medical page, and it's noted here because it's
now a recognizable through-line worth keeping deliberately in Phase 5+
rather than breaking by accident.

---

## Verification

| Check | Result |
|---|---|
| `npm run typecheck` (`tsc --noEmit`) | ✅ Pass, 0 errors |
| `npm run lint` (ESLint flat config) | ✅ Pass, 0 errors, 0 warnings |
| `npm run build` (`next build`, Turbopack) | ✅ Pass — routes unchanged: `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`, all static |
| Real headless-Chrome QA at all 6 required breakpoints (375/430/768/1024/1440/1728) | ✅ 0/6 viewports with any console error, network failure, or JS exception; `scrollWidth === clientWidth` at every breakpoint (no horizontal overflow); exactly one `<h1>` at every breakpoint |
| Reduced-motion | ✅ `prefers-reduced-motion: reduce` emulated — hero H1 opacity resolves to `1` (not stuck mid-transition) |
| Sticky header / mobile nav | ✅ Header carries the sticky class at scroll; mobile drawer opens on tap and the close button becomes focusable/visible (confirmed via a real click, not just a source read) |
| Visual design review | ✅ Full-resolution per-section screenshots reviewed at desktop (1440) and mobile (390) widths — see findings below |

This environment has no connected browser-automation tool (no
Playwright/CDP MCP server), so a working QA harness was built for this
phase instead of skipping the manual-test steps: `puppeteer-core`
driving the system's actual installed Chrome (no bundled-browser
download needed), against a real `next build && next start` server.
This is what surfaced the three real issues below — none of which a
static/source-level review had caught.

### Issues found by real-browser testing, and fixes

1. **CSP blocked Next's own inline hydration script and this site's
   JSON-LD `<script>` tags, crashing hydration.** Phase 1's
   `next.config.ts` set `script-src 'self'` with no `'unsafe-inline'`.
   Contrary to the assumption written in Phase 1 (that
   `type="application/ld+json"` scripts are exempt from `script-src`),
   Chrome enforces CSP against them regardless of type — confirmed by
   the actual console errors. This also blocked Next's own inline
   bootstrap script, which threw a React hydration error (#412) on
   every load and made the page **fully non-interactive** — the mobile
   nav drawer didn't open at all. **Fix:** `script-src 'self'
   'unsafe-inline'`, matching Next's own documented "Without Nonces"
   baseline CSP (`node_modules/next/dist/docs/01-app/02-guides/
   content-security-policy.md`). The stricter nonce-based alternative
   was deliberately rejected — it requires forcing every page into
   dynamic rendering, which would disable static generation/ISR/CDN
   caching site-wide against spec §31's performance targets, for a
   site spec §32 already confirms handles no sensitive data or forms.
   Re-verified: 0 console errors, hydration succeeds, mobile nav
   works.
2. **Fraunces' default ampersand is easy to misread at normal reading
   size.** Caught only by looking at an actual screenshot, not by
   reading the HTML: Fraunces' ornate calligraphic "&" can read as
   "&)" in body text at natural size (a zoomed crop confirmed it *is*
   a single glyph, just an unusually shaped one). This is a real
   legibility risk on the single most prominent text on the page (the
   H1) for a brief that explicitly wants "precise" and "medically
   authoritative" (spec §2). **Fix:** added
   `components/ui/AmpersandText.tsx`, which renders any `&` in the
   sans body face instead of Fraunces — a standard editorial-design
   technique for exactly this failure mode, applied to the 4 places an
   `&` appears inside `font-display` text (Hero H1, two Core Expertise
   card titles, Insights H2, one Penile Implant fact title). Every
   other `&` on the page already renders in the sans face by default
   and needed no change. Re-verified with a zoomed screenshot: clean,
   unambiguous glyph.
3. **Next's automatic Link prefetching 404s in the console for every
   visible nav link**, since virtually every route it points at
   doesn't exist until Phase 3+. Harmless to visitors (a background
   fetch, not a navigation), but real console noise and wasted
   requests once a visitor actually scrolls the page. **Fix:** added
   `components/ui/InternalLink.tsx`, a `next/link` wrapper defaulting
   `prefetch={false}`, swapped in via a single import-line change
   across the 11 files with internal links (nav, footer, all in-body
   section links). `not-found.tsx` and the logo link — both of which
   only ever point at the one live route, `/` — were deliberately left
   on plain `next/link` so that legitimate route stays prefetched.
   Re-verified: 0 console/network issues at any breakpoint.

A first attempt at re-testing after the CSP fix produced confusing,
apparently-unchanged results — traced to three leftover `next-server`
processes from earlier in this session that `pkill -f "next start -p
<port>"` had failed to kill (the pattern doesn't match the detached
`next-server` process Next actually spawns), so a "new" server on a
reused port silently failed to bind and the old, pre-fix server kept
answering requests. Fixed by killing the exact PIDs (confirmed via
`lsof`/`ps` against their working directory) and using a fresh port
for the real re-test.

**Not run (Phase 5 per spec §38, and not meaningful before Phase 3
inner pages exist to link to):** Playwright E2E suite, full
cross-browser QA (only Chrome was available), Lighthouse, a broken-link
audit beyond the homepage.

### Phase 3 QA (all six inner pages)

Same `puppeteer-core` + real Chrome harness, extended to cover all 7
live pages (home + the six new ones) at all 6 required breakpoints —
42 page/viewport combinations in one pass:

| Check | Result |
|---|---|
| `npm run typecheck` / `npm run lint` / `npm run build` | ✅ All pass, 0 errors — all 7 pages listed as static (`○`) routes in the build output |
| Console errors / network failures / JS exceptions | ✅ **0 across all 42 page × viewport combinations** |
| Horizontal overflow (`scrollWidth === clientWidth`) | ✅ **0 across all 42 combinations** |
| Single `<h1>` per page | ✅ Confirmed on all 7 pages at all 6 breakpoints |
| Unique title / meta description / canonical per page | ✅ Read back from the live DOM for all 7 pages — no duplicates, each canonical matches its own path |
| JSON-LD script count per page | ✅ Home: 2 (Person + Physician, site-wide). Each of the 6 inner pages: 5 (Person + Physician + BreadcrumbList + MedicalWebPage + FAQPage) — matches what each page actually renders, verified by count, not assumed |
| JSON-LD validity | ✅ Spot-checked on the ED page: all 5 blocks parse as valid JSON with the expected `@type` (`Person`, `Physician`, `BreadcrumbList`, `MedicalWebPage`, `FAQPage`) |
| Reduced-motion | ✅ Re-confirmed on an inner page (`/erectile-dysfunction`) — H1 opacity resolves to `1` |
| New routes resolve correctly | ✅ All 6 return HTTP 200; not-yet-built sub-routes they intentionally link to (e.g. `/erectile-dysfunction/penile-doppler`) still correctly return 404 |
| `sitemap.xml` | ✅ Now lists all 7 live routes with their configured priorities |
| Booking CTAs | ✅ Spot-checked on the ED page: all 3 instances (header/hero/closing) render `disabled` with the explanatory title — placeholder architecture preserved, no URL invented |
| Internal links (spot-check) | ✅ ED page's rendered HTML includes correct `href`s to every spec §10-required related page (Testosterone, Penile Doppler, Shockwave, Penile Implant, Peyronie's) plus global nav/footer links — no malformed paths |
| FAQ accordion interactivity | ✅ Tested with an actual click (not just a source read): `aria-expanded` flips to `true`, `data-state` to `open`, the answer text becomes present in the DOM, confirmed visually via screenshot |
| Visual design review | ✅ 1440px screenshots of all 6 inner pages reviewed — each reads as genuinely distinct (different hero shape, different body composition, different one-dark-or-olive-moment placement per the table above), none reads as a reskinned duplicate |

No new issues were found in this pass — the fixes from Phase 2 QA
(CSP, ampersand, prefetch) held up correctly across six pages of new
content and cross-linking between them.

### Phase 4 QA (all 22 new routes + 5 articles)

Same real-Chrome harness, extended to 24 pages (every Phase 1–4 page,
including one representative Phase 3 page for comparison, all 5
Insights articles, and all 3 new hub pages) × the full 6 required
breakpoints — **144 page/viewport combinations in one pass, plus 6
extra targeted checks:**

| Check | Result |
|---|---|
| `npm run typecheck` / `npm run lint` / `npm run build` | ✅ All pass, 0 errors — 30 total routes, all static (`○`) except the 5 statically-generated (`●`) article pages |
| Console errors / network failures / JS exceptions | ✅ **0 across all 144 combinations** |
| Horizontal overflow | ✅ **0 across all 144 combinations** |
| Single `<h1>` per page | ✅ All 24 pages, all 6 breakpoints |
| Duplicate `<title>` across the site | ✅ **None** — checked programmatically across all 24 pages' live DOM `document.title`, not assumed |
| Duplicate canonical URLs | ✅ **None** |
| JSON-LD count matches page type | ✅ Home: 2. Hub pages (Men's Health/Sexual Medicine/Penile Surgery/About/Book/Insights/legal): 3 (Person + Physician + BreadcrumbList). Full treatment pages: 5 (+ MedicalWebPage + FAQPage). Insight articles: 4 (Person + Physician + BreadcrumbList + Article, no FAQ) — every count matches what each page actually renders |
| Reduced-motion | ✅ Re-confirmed on a new Phase 4 page (`/male-fertility`) — H1 opacity resolves to `1` |
| FAQ accordion interactivity | ✅ Re-confirmed with a real click on a new Phase 4 page (`/erectile-dysfunction/penile-doppler`) — `data-state` flips to `open` |
| Booking URL correctness | ✅ Curl-verified on all 17 top-level pages: 0 disabled buttons, every `BookingCta` resolves to the exact confirmed `bookingUrl`, `target="_blank" rel="noopener noreferrer"` present on every instance |
| Profile URL correctness | ✅ Verified every "View NMC Profile" link resolves to the exact `physicianProfileUrl` — grepped for cross-contamination (a booking CTA accidentally pointing at the profile URL, or vice versa) and found none |
| All 22 new routes resolve | ✅ HTTP 200 on every one |
| `sitemap.xml` | ✅ Lists all live top-level routes plus all 5 article URLs, derived programmatically from the same content array that generates the article pages (see Phase 4 section above) |
| Screenshots | ✅ Saved to `qa/screenshots/phase-4/` — About, Male Fertility, Penile Doppler, Shockwave, Book and Insights, each at 430px and 1440px (12 files) |

**A real bug in the QA methodology itself, caught and fixed before
trusting the deliverable screenshots:** the first screenshot pass used
Puppeteer's `fullPage: true`, which resizes to the full document height
and captures instantly. Framer Motion's `whileInView` reveals — the
same `Reveal`/`StaggerGroup` primitives used everywhere since Phase 2
— trigger via `IntersectionObserver` at that resize, but hadn't
finished animating to `opacity: 1` before the instant capture, making
genuinely-rendered content (the About page's 5-paragraph narrative, its
12-item credentials grid) look blank in the screenshot. Verified via
curl that the content was actually present in the real HTML before
concluding it was a screenshot artifact, not a site bug — then fixed
the capture script to scroll through the page in steps with real settle
time (up to ~900ms on the heaviest, 12-item stagger group) before
screenshotting, rather than trusting the first result. The site code
itself needed no changes; only the QA tooling did. Worth remembering
for Phase 5: any future screenshot-based QA on this site needs the same
scroll-through approach, not a naive `fullPage` capture.

---

## Design decisions worth flagging

1. Nav links point at spec's full §5 site map even though most of
   those routes aren't built yet. This is expected during incremental
   phase-by-phase build-out (they resolve to the custom 404, not a raw
   error) and is **not** the same thing as the "no broken links" Phase
   5 QA gate, which applies once those pages are supposed to exist.
2. `/book` is treated as an internal page (per the §5 site map) that
   will itself link out to the real NMC booking flow; the `BookingCta`
   component used in the header/footer/hero links directly to the
   external NMC URL for the immediate conversion path, per §7 Section
   11 and §26.
3. Tailwind v4's built-in `stone`/`taupe`/`olive` palettes were reused
   rather than hand-rolled, since they already match the brief closely
   — only the `bronze` accent needed a custom scale.
4. (Phase 2) The closing Booking section uses `.section-olive`, not
   `.section-dark` — using ink-dark for both the Penile Implant section
   and the Booking section would have put two visually identical dark
   bands only a few sections apart, right before the also-dark footer,
   reading as one long dark block rather than "restrained" (spec §16)
   use of the treatment. Olive gives Booking its own distinct closing
   tone while still bookending the page with weight.
5. (Phase 2) "Premature Ejaculation" has no dedicated route anywhere in
   spec §5's site map. Rather than invent a slug, both places it's
   referenced (Core Expertise secondary links, Conditions index) link
   to `/sexual-medicine`, its real parent hub in the site map.
6. (Phase 2) The three Insights teasers use spec-verbatim article
   titles but slugs that don't correspond to any spec-defined URL
   (Insights slugs aren't specified anywhere in §5 beyond the
   `/insights/[slug]` pattern). These are an internal routing detail
   invented for Phase 4, not a claim about content that exists — no
   dates, authors, or "read more" excerpts are shown alongside them.
7. (Phase 2 QA) `script-src` now includes `'unsafe-inline'` (see
   Verification above for the full reasoning) — this is a deliberate,
   documented tradeoff, not an oversight. Revisit only if the site ever
   needs a nonce-based CSP badly enough to justify losing static
   generation everywhere.
8. (Phase 2 QA, superseded in Phase 3) Internal links originally
   defaulted to `prefetch={false}` unconditionally. Phase 3 upgraded
   `InternalLink` to check the `lib/seo/routes.ts` registry instead, so
   it now prefetches exactly the routes marked `"live"` — this is the
   "reconsider it once more routes exist" resolution flagged in Phase
   2, done via a registry lookup rather than a manual revisit.
9. (Phase 3) Each inner page gets exactly one dark or olive section,
   never both and never zero — chosen deliberately per page (see the
   tonal-rhythm table above) so the treatment stays a considered
   accent rather than becoming a template default that shows up
   identically on every page.
10. (Phase 3) Breadcrumbs only link through routes that are actually
    live. Where a page's true spec §5 parent isn't built yet
    (Testosterone's `/mens-health`, ED's `/sexual-medicine`), the
    breadcrumb is shorter rather than including a crumb that would
    404 — the same "don't link to what doesn't exist in a way a user
    would click into a dead end" reasoning as Phase 1's nav decisions,
    applied to breadcrumbs specifically.
11. (Phase 3) Peyronie's Disease was built from Funnel D (§4) and
    §29's universal treatment-page checklist rather than a dedicated
    spec page-structure section, since the master spec doesn't have
    one for this page (unlike the other five). Flagged explicitly
    rather than silently treated as equivalent to a page with direct
    spec structure to follow.

---

## Unresolved placeholders, compliance items, and owner decisions

These block production readiness; none were invented (per spec §41):

1. ~~**`practice.bookingUrl`**~~ — **Resolved in Phase 4.** Confirmed
   by the owner and integrated centrally; every `BookingCta` site-wide
   now resolves to it, verified by curl across all top-level pages
   (see Phase 4 Verification).
2. ~~**`practice.physicianProfileUrl`**~~ — **Resolved in Phase 4.**
   Confirmed by the owner; every "View NMC Profile" link and the
   `Person` schema's `sameAs` now resolve to it.
3. **`practice.facilityUrl`, `.phone`, `.mapsUrl`** — still empty,
   optional, only
   populate once approved for publication (§21).
4. **Production domain** (`NEXT_PUBLIC_SITE_URL`) — not specified;
   currently falls back to `localhost`, so canonical/OG URLs will be
   wrong in any deployment until this is set.
5. **`doctor.languages`** — plausibly Spanish/English given training
   and practice history, but not explicitly stated in the spec; left
   empty rather than assumed.
6. ~~**`doctor.biography`**~~ — **Superseded in Phase 4, field
   removed.** The About page was built from a structured narrative
   (5 themed sections) written directly from explicit owner-supplied
   themes in the Phase 4 prompt, not from this single-string field —
   which made it genuinely dead code (confirmed unused anywhere in the
   codebase before removing it, not just unpopulated). If a short
   single-paragraph bio blurb is needed elsewhere later (e.g. a press
   kit), that's a new, deliberate addition, not a resurrection of this
   field.
7. **`doctor.awards`, `.academicRoles`, `.socialLinks`** — none stated
   in the spec or the Phase 4 prompt; left empty. The About page's
   "Academic activity" section deliberately stays generic ("maintained
   academic and teaching involvement") rather than naming specific
   roles, institutions or dates that were never confirmed.
8. **All photography** (spec §18) — hero portrait, environmental
   portrait, consultation/office image, professional close-up,
   optional hospital-context/arms-crossed portrait. Still a styled
   placeholder panel everywhere, not a broken image. Phase 3 added a
   clinical device-placement diagram (Penile Implant) and editorial
   material/texture imagery (Male Aesthetics); Phase 4 added one more —
   the About page's portrait placeholder is now the site's most
   prominent still-missing image, since About is the page most likely
   to be viewed specifically to see the doctor.
9. **Favicon / app icons** — still the Next.js scaffold default.
10. **Compliance checklist** (spec §28) — still not started; this
    remains a real gate before launch, not just a Phase 0/1 note:
    - **PRP** — `features.prpPage` stays `false`; no route, nav,
      sitemap entry, or metadata exists anywhere, including on the new
      Male Aesthetics / Penile Girth Enhancement pages. Do not enable
      without explicit NMC/DoH compliance approval (§12).
    - The Male Aesthetics and Penile Girth Enhancement pages (Phase 3)
      are now written — restrained, no exact size gains, no
      guarantees, no forbidden phrases per spec §14 (checked against
      the actual copy, not just aimed for) — but **the HA/
      penile-enhancement wording, before/after policy, testimonials
      policy and aesthetic imagery still need formal compliance
      review before this content is treated as launch-ready.** Writing
      it restrained is not the same as it being approved.
11. **Analytics** — still no GA4/Vercel Analytics wired up
    (intentional, per §27: only after cookie/privacy implementation).
    `trackEvent()` is still a dev-only console no-op. The three legal
    pages now exist (Phase 4), which removes one blocker, but a
    **cookie-consent banner does not exist yet** and is the remaining
    gate before analytics can be turned on — building the legal pages
    is necessary but not sufficient for that gate to be considered
    closed.
12. ~~**Legal pages not built**~~ — **Resolved in Phase 4.**
    `/privacy`, `/terms`, `/medical-disclaimer` are built as
    professional-draft-quality placeholders — see the Phase 4 section
    above for what they say and what's still owner/legal-review-only.
    Not a substitute for a lawyer's review, and each page's code
    comment says so explicitly.
13. **Palette exact values** — the bronze/stone/olive tokens are a
    strong first pass, assembled from Tailwind's built-in scales plus a
    hand-picked bronze scale. Now visually reviewed in a real browser
    against a full page of real content (Phase 2 QA — screenshots at
    desktop and mobile widths, both light and dark/olive sections) and
    it reads as intended: premium, warm, restrained. Still not
    contrast-ratio-audited with Lighthouse/axe — the oklch lightness
    deltas between foreground/background tokens are large in every
    tone, which is a good sign but not a substitute for a measured
    ratio.
14. **Lighthouse has not been run** (Performance/Accessibility/Best
    Practices/SEO targets, spec §31) — that's Phase 5 per spec §38, and
    the homepage now has real content to measure, but the tool wasn't
    available in this environment. First candidate to run once this
    reaches a machine with it.
15. ~~**Insights slugs**~~ — **Resolved in Phase 4.** The three slugs
    invented in Phase 2 as placeholders were kept deliberately (not
    silently carried over) as the real slugs for `/insights` — each
    now has a full article behind it. Two more articles were added at
    new slugs for the remaining spec §7 Section 10 topics (Shockwave,
    Peyronie's). All 5 are listed in the Phase 4 section above.
16. **Peyronie's Disease content basis** (Phase 3) — built from Funnel
    D and the general §29 checklist rather than a dedicated spec page
    structure, since the master spec doesn't have one for this page.
    Worth an owner read-through specifically for this page before
    launch, since it had less direct spec text to anchor to than the
    other five.
17. **Medical content has not been reviewed by the owner or a
    medical/compliance professional** (Phase 3) — every claim was
    checked against spec's restraint rules (§2, §29, §36, and the
    specific "never say" lists in §8/§13/§14) during writing, but that
    is not the same thing as clinical or compliance sign-off. This
    applies to all six new pages, and is separate from — and in
    addition to — the PRP-specific gate in item 10.
18. **All 5 Insights articles are marked `clinicalReviewRequired: true`
    and show a visible "Clinical review pending" badge** (Phase 4) —
    the same underlying gate as item 17, now extended to the Insights
    section and made visible to site visitors, not just noted in the
    report. Do not remove the badge from an article without an actual
    review having happened for that specific article.
19. **Legal pages are drafts, not legal advice** (Phase 4) — `/privacy`,
    `/terms`, `/medical-disclaimer` are professional-draft-quality
    placeholders written to be internally consistent with how this
    site actually behaves (no forms, no analytics yet, booking handled
    entirely by NMC), not reviewed by a lawyer. The Medical Disclaimer
    in particular should get an actual clinician/compliance read before
    launch, not just a legal one, given its content overlaps with the
    NMC/DoH compliance checklist in item 10.
20. **Cookie-consent banner does not exist** (Phase 4) — the last
    concrete blocker on enabling analytics per spec §27, now that the
    legal pages it would reference exist. Not built this phase (out of
    scope — Phase 4's brief was the routes and legal-page drafts, not
    the consent mechanism itself).
21. **`/erectile-dysfunction/assessment`** (spec §5) was deliberately
    left unbuilt — its content was folded into `/erectile-dysfunction/
    penile-doppler` per this phase's brief. If the owner wants a
    distinct general-assessment page separate from the Doppler-specific
    one after all, that's a scoping decision for Phase 5, not something
    this report resolves unilaterally.
22. **Legal pages are set to `noindex`** (Phase 4) — a defensible
    default for MVP boilerplate legal content, not a spec requirement
    either way. Easy to flip if the owner wants them indexed.

---

## Next steps

**Phase 5** — per spec §38: final medical content sign-off (clinical
and compliance review of all 6 treatment pages, 5 Insights articles,
and the 3 legal pages — items 10, 17, 18, 19 above), Lighthouse and a
real cross-browser pass (item 14), the cookie-consent banner and then
GA4/Vercel Analytics (items 20 and 11), production domain and hosting
setup (item 4), real photography (item 8), and a genuine broken-link
audit now that the site map is essentially complete. The explicit
instruction for this phase was to stop before any of: final sign-off,
regulatory submission, production launch, Arabic localization, external
CMS, patient forms, payment flows, or a custom booking system — none of
those were started, and the booking/appointment flow remains entirely
NMC's, by design (spec §19: "This minimizes security/privacy/regulatory
burden").

The site's design system and internal-linking architecture (breadcrumb,
FAQ accordion, related-treatments band, one-dark-or-olive-moment-per-
page rhythm) has now been used across 24 pages of genuinely different
content — homepage, six treatment pages, six supporting/hub pages, five
Insights articles, three legal pages — and holds up throughout. Every
primary nav destination resolves to a real page. Phase 5 is about
closing the remaining compliance, content-verification and
production-readiness gaps listed above, not about building more pages.

---

## Phase 5 — Production readiness, review support, SEO hardening, analytics/privacy, final QA

Phase 5 did not add clinical content or new routes. It audited what
exists, fixed what real testing found broken, and built the
infrastructure launch requires (consent, temporary brand assets,
domain configuration) without pretending any of it substitutes for
human review.

### Review documents produced

Four standalone audit documents were written this phase, each doing
one job:

- **`CLINICAL_CONTENT_REVIEW.md`** — every medical claim on every
  clinical page and Insights article, classified LOW RISK / CLINICAL
  REVIEW REQUIRED / COMPLIANCE REVIEW REQUIRED / REMOVE-REWRITE.
  Nothing is self-certified as approved — that isn't this process's
  authority to grant. Three specific owner-input questions came out of
  it: whether surgical sperm retrieval is actually offered, whether a
  named fertility-clinic collaboration exists to reference, and
  whether the HA/aesthetic-injectable services described on
  `/male-aesthetics` are currently available as described.
- **`UAE_COMPLIANCE_REVIEW.md`** — regulatory/advertising audit against
  spec §28's checklist, topic-by-topic (implant, ED, testosterone,
  shockwave, the aesthetics/girth/HA cluster, before/after imagery
  [none exists], testimonials [none exist], outcome claims,
  promotional wording, and a re-verified PRP-disabled check with real
  `grep` output, not paraphrased). Ends with an explicit list of items
  that must not go live without compliance sign-off.
- **`SEO_AUDIT.md`** — full technical pass: titles/descriptions,
  H1/heading hierarchy, internal links and orphans, sitemap/robots,
  JSON-LD, breadcrumb consistency, keyword clusters per page,
  cannibalization and thin-content risk, internal-link opportunities,
  and an explicit build-vs-don't-build evaluation of
  `/erectile-dysfunction/assessment` (decision: don't build it — its
  content already lives on `/erectile-dysfunction` and
  `/erectile-dysfunction/penile-doppler`; a third page would
  cannibalize both without adding a distinct search intent). Also
  documents the production-domain/canonical/OG/sitemap strategy (§12).
- **`MEDIA_REQUIREMENTS.md`** — asset-by-asset manifest (filename,
  page/section, aspect ratio, minimum dimensions, crop guidance,
  alt-text intent, desktop/mobile behavior) for every photo spec §18
  calls for, plus the two anatomical/medical illustration needs. No
  photos were generated or faked; every current image slot is
  explicitly labelled as a placeholder in this document.
- **`ANALYTICS_PRIVACY_PLAN.md`** — documents the consent architecture
  built this phase (below), a requirement-by-requirement verification
  table, an explicit list of what was deliberately *not* built (Meta
  Pixel, any health/symptom data field, multi-category consent), and
  the exact steps to follow before a real analytics provider is wired
  in.

### Bugs found and fixed (via real browser + real command testing)

All of the following were found through actual execution — a
headless-Chrome QA harness driving a real `next build && next start`
server, real `grep`, or manual keyboard-navigation testing — not
inferred from reading source:

1. **`/book` was an orphan page** — reachable only by direct URL, not
   linked from any nav. Added a "Book a Consultation" entry to the
   footer's Site column (`src/components/layout/Footer.tsx`).
2. **`noindex` pages were also being told `nofollow`** —
   `buildMetadata()`'s robots logic coupled the two
   (`lib/seo/metadata.ts`), so `/privacy`, `/terms`, and
   `/medical-disclaimer` were telling crawlers not to follow their
   outbound links either, for no reason related to why they're
   noindexed. Fixed to `index ? {index:true,follow:true} :
   {index:false,follow:true}`.
3. **Sitemap included pages explicitly marked `noindex`** — added an
   `index?: boolean` field to `RouteEntry` (`lib/seo/routes.ts`), set
   it `false` on the three legal pages, and derived a `sitemapRoutes`
   filter so the sitemap and the noindex directive agree with each
   other instead of contradicting.
4. **Four pages had stale breadcrumb depth** — `/erectile-dysfunction`,
   `/mens-health/testosterone`, `/penile-implant`, and
   `/peyronies-disease` were still using a 2-level breadcrumb
   (Home → Page) left over from before their parent hub pages existed
   in Phase 4. Added the correct middle crumb to each (Sexual
   Medicine, Men's Health, Penile Surgery, Penile Surgery
   respectively).
5. **Mobile image-ordering bug, 4 instances** — `about/page.tsx`,
   `AboutSection.tsx` (homepage teaser), `male-aesthetics/page.tsx`,
   and `MaleAestheticsSection.tsx` (homepage teaser) each placed the
   portrait image as the first child of a desktop image-left grid
   without a mobile-specific order override, so on mobile the image
   rendered above the H1 and CTA instead of below them — pushing the
   page's identifying content below the fold. Found via a mobile
   (390px) fold screenshot during the UX audit, confirmed via source
   grep across all image/text grid pairs sitewide (the equivalent
   pattern on `/penile-implant` was checked and found *not* affected,
   since its source order already matched intent on both breakpoints).
   Fixed with `order-last ... lg:order-first` on the image in all four
   places; verified with fresh screenshots showing H1 and CTA now
   above the fold on mobile.
6. **Title typo** — `/insights` page title read "Insights in Andrology
   & Male Health" against "Men's Health" used as the term everywhere
   else on the site. Fixed; grepped for other instances (none found).
7. **Skip link didn't move keyboard focus (WCAG 2.4.1)** — a
   keyboard-navigation test script showed that activating the skip
   link scrolled the viewport but left `document.activeElement` as
   `document.body` — an empty `id` — rather than moving focus to
   `#main-content`. Root cause: `<main>` had no `tabIndex`, so it
   wasn't a valid fragment-navigation focus target even though it was
   a valid scroll target. Fixed by adding `tabIndex={-1}` (with
   `focus:outline-none` to suppress the resulting full-content-area
   outline box) in `PageShell.tsx`. Re-verified: activating the skip
   link now sets `activeId: "main-content"`.

### Consent and analytics architecture

Built, but deliberately not connected to a live analytics provider:

- `src/lib/analytics/consent.ts` — `getConsent()` /
  `setConsent()` / `hasAnalyticsConsent()` against a single
  `localStorage` key (`consent:analytics:v1`), SSR-safe (returns
  `"unset"` server-side rather than throwing).
- `src/components/ui/ConsentBanner.tsx` — accessible
  (`role="region" aria-label="Cookie preferences"`), two equal-weight
  buttons (Accept / Decline — no dark pattern favoring one), mounted
  once in `layout.tsx`. Starts hidden on both server and first client
  render to avoid a hydration mismatch, then reveals itself post-mount
  if consent is still unset.
- `src/lib/analytics/events.ts`'s `trackEvent()` now checks
  `hasAnalyticsConsent()` before doing anything beyond its existing
  dev-only console log — so no event of any kind reaches a real
  provider today, and none will until both a provider is wired in
  *and* the user has actively granted consent.
- No health, symptom, or condition-specific data is captured in any
  event shape — verified by inspecting the `AnalyticsEvent` type
  directly, not just by claim. Booking-click events carry only
  `source_page`, `service`, and `cta_position`.
- Meta Pixel was not implemented, per instruction.

### Temporary brand assets

`src/app/icon.tsx`, `apple-icon.tsx`, and `opengraph-image.tsx` replace
the default Next.js favicon with a code-generated typographic monogram
built from the site's own existing design tokens (ink, bronze, paper),
rendered via `next/og`'s `ImageResponse`. These are explicitly
temporary — commented as such in the source — not a designed brand
identity. They fill every required slot (browser tab, iOS home screen,
social share preview) so nothing is missing at launch if real brand
assets aren't ready in time, and are trivial to replace with real files
later since the slots (not the generation logic) are what matters.

### Production domain handling

`NEXT_PUBLIC_SITE_URL` remains the single source of truth for
canonical URLs, Open Graph URLs, and the sitemap (`src/config/site.ts`,
unchanged in mechanism from Phase 4). What changed this phase: a
production build (`NODE_ENV === "production"`) now logs a visible
`console.warn` if the variable is missing, rather than silently
falling back to `http://localhost:3000` in a way that could ship
unnoticed. Local dev is unaffected — no warning, silent fallback, as
before. No domain was invented or hardcoded anywhere; `SEO_AUDIT.md`
§12 documents the www/non-www recommendation for whoever configures
DNS.

### Final QA

- `tsc --noEmit` and `next lint`: clean.
- A 144-combination real-browser QA pass (headless Chrome via
  `puppeteer-core`, driving an actual `next build && next start`
  production server, not dev mode) across every live route and every
  supported breakpoint checked: console errors, network failures,
  horizontal overflow, 404 handling, sitemap/robots content, JSON-LD
  validity, external NMC link correctness, mobile nav open/close,
  FAQ accordion interactivity, and `prefers-reduced-motion` behavior.
  Final result after the fixes above: 0 problems found. (An earlier
  run of this same pass was invalidated after it was discovered to
  have run against a stale server process that predated the Insights
  title-typo fix — caught by noticing the QA log still showed the old
  title, fixed by force-restarting the server and confirming the fix
  was actually live via `curl` before re-running.)
- A dedicated keyboard-navigation script verified tab order, visible
  focus indicators, the skip-link fix above, and that the mobile nav
  dialog traps focus and closes on Escape.
- **Lighthouse** (installed locally, run against the local production
  server) on Home, ED, Penile Implant, Testosterone, Male Aesthetics,
  and Book:

  | Page | Performance | Accessibility | Best Practices | SEO |
  |---|---|---|---|---|
  | Home | ≥90 | 100 | 100 | 100 |
  | Book | ≥90 | 100 | 100 | 100 |
  | ED | ≥90 | 100 | 96 | 100 |
  | Penile Implant | ≥90 | 100 | 96 | 100 |
  | Testosterone | ≥90 | 100 | 96 | 100 |
  | Male Aesthetics | ≥90 | 100 | 96 | 100 |

  Every page clears every target threshold (Performance≥90,
  Accessibility≥95, Best Practices≥95, SEO≥95). The four pages scoring
  96 instead of 100 on Best Practices were investigated rather than
  left unexplained: Lighthouse's `inspector-issues` audit was failing
  due to a Chrome DevTools "Issue" logged only on pages containing the
  FAQ accordion (`Faq.tsx`, built on Radix UI's Accordion). A
  dedicated CDP debugging script (`Audits.enable` /
  `Audits.issueAdded`) captured the exact violation: a
  `ContentSecurityPolicyIssue`, `violatedDirective: "script-src"`,
  `contentSecurityPolicyViolationType: "kEvalViolation"`, originating
  from a shared framework/library chunk
  (`_next/static/chunks/3-*.js`). In plain terms: the site's CSP
  (`script-src 'self' 'unsafe-inline'`, deliberately without
  `'unsafe-eval'` since Phase 2) is correctly blocking an `eval()`- or
  `Function()`-style call that something in the Radix Accordion
  dependency chain makes internally. This does not break anything —
  the accordion works correctly in every functional test — and the
  page still scores above the ≥95 target. No fix was applied: adding
  `'unsafe-eval'` to the CSP would resolve the score but meaningfully
  weaken a security control for a few Lighthouse points on an already-
  passing metric, which isn't a trade this report makes unilaterally.
  Recorded as a documented, deliberate tradeoff in
  `LAUNCH_CHECKLIST.md` under "Recommended before launch" rather than
  silently left unexplained or worked around to inflate the score.

### What Phase 5 explicitly did not do

No new clinical service pages were created — the
`/erectile-dysfunction/assessment` evaluation above concluded a new
page wasn't justified, and nothing else met the "concrete SEO/UX gap"
bar this phase's brief set. PRP remains fully disabled — re-verified
this phase, not just carried over from Phase 4. No content was marked
clinically, legally, or compliance-approved — that authority isn't
this process's to exercise. No analytics provider was connected. No
production deployment was made.

### Owner inputs still required before launch

See `LAUNCH_CHECKLIST.md` for the full organized list. In short: a
production domain, real photography, completed clinical and DoH
compliance review, a lawyer's pass on the three legal pages, a
decision on cookie-consent/analytics timing, and final brand assets to
replace the temporary favicon/OG image (design execution only — the
brand direction itself is now confirmed, see the Phase 6 section
below). The three clinical-scope questions previously outstanding here
(surgical sperm retrieval, fertility-clinic collaboration naming,
current aesthetics-service availability) were answered by the owner
and the site updated — see Phase 6.

---

## Phase 6 — Confirmed owner decisions: fertility scope, aesthetics priority services, brand direction

Phase 6 resolved the three open scoping questions Phase 5 raised in
`CLINICAL_CONTENT_REVIEW.md`, plus a separate confirmed brand-identity
direction. No new phase brief was issued for broader work — this was a
narrow, owner-driven content and scope update, not a new production-
readiness pass. PRP was not touched and remains disabled.

### Male Fertility — surgical sperm retrieval no longer implied as offered

Owner-confirmed: this practice does not perform TESE, micro-TESE, or
surgical sperm retrieval as a service. `/male-fertility` previously
described surgical sperm retrieval as something that "may form part of
a coordinated fertility pathway" — cautious wording, but still readable
as an offered service. Rewritten so it appears only as educational
context about the wider reproductive-medicine pathway (the FAQ
"Will I need surgery?" and the "Beyond assessment" closing section),
never as a service this practice performs or a booking proposition.

### Fertility clinic collaboration — no institution named or implied

Owner-confirmed: no formal or informal collaboration with any specific
fertility clinic or IVF center exists. The FAQ "Do you work with
fertility clinics?" and the "Beyond assessment" section were rewritten
to neutral wording — "coordination with assisted reproduction teams
when required," "multidisciplinary fertility care where appropriate" —
with an explicit "no formal partnership with a specific clinic or
center" statement added rather than left ambiguous.

### Male Genital Aesthetics — two confirmed priority services

Owner-confirmed current priority services: **penile girth enhancement
using hyaluronic acid** (already live at
`/male-aesthetics/penile-girth-enhancement`) and **scrotal lift /
scrotal aesthetic surgery** (new).

- `/male-aesthetics`'s focus-areas list was restructured to feature
  both by name, replacing the previous generic "Hyaluronic Acid
  Procedures" and "Surgical Options" entries (which are now redundant
  with, or subsumed by, the two named services).
- The homepage Male Genital Aesthetics teaser
  (`components/sections/MaleAestheticsSection.tsx`) service list was
  updated the same way.
- A new page, **`/male-aesthetics/scrotal-lift`**, was built to the
  same structure and restraint standard as every other treatment page:
  full metadata, three-level breadcrumb, `MedicalProcedure`-typed
  `MedicalWebPage` + `BreadcrumbList` JSON-LD, a 6-item FAQ, and
  cross-links to and from `/male-aesthetics` and the Girth Enhancement
  page. Content follows the owner's brief precisely: scrotal aesthetic
  surgery, assessment of excess/lax scrotal skin, individualized
  surgical planning, and an explicit, non-euphemistic discussion of
  scar placement, recovery and limitations — no crude or sexualized
  terminology, no outcome guarantees.
- **Route decision, documented in `SEO_AUDIT.md` §9a**: Scrotal Lift
  was evaluated against the same thin-content/cannibalization bar used
  earlier for the `/erectile-dysfunction/assessment` decision, and
  found to justify its own route — distinct search intent, no keyword
  overlap with Girth Enhancement, and enough unique medically useful
  content (its own causes, its own risk/recovery profile) to avoid
  thinness. The previously-planned (never built) `/male-aesthetics/
  hyaluronic-acid` route was removed from the route registry entirely,
  since HA augmentation is Girth Enhancement's own primary modality,
  not a separate service — building it separately would have recreated
  the exact thin-content pattern this decision process exists to avoid.
- `CLINICAL_CONTENT_REVIEW.md` and `UAE_COMPLIANCE_REVIEW.md` were both
  updated: the three-item owner-input list is now resolved, a new §5a
  audit table covers the Scrotal Lift page's own claims, and the
  compliance items-needing-approval list now asks a reviewer to sign
  off on the new page's wording rather than first establish whether
  the service exists.

### Brand identity / logo — final direction confirmed, not yet built

The owner confirmed the visual direction for the **final** brand
identity (documented in full in `MEDIA_REQUIREMENTS.md`, "Brand
identity / logo — confirmed final direction"): an AM monogram + "Dr.
Alejandro Molina" + "CONSULTANT UROLOGIST & ANDROLOGIST" specialty
line, one restrained bronze/gold graphical gesture, no duplicated
decorative curves, no literal anatomical or male/fertility iconography,
and explicitly independent of NMC, Abu Dhabi, UAE, or any hospital/
geographic reference — so the mark remains valid if Dr. Molina changes
employer, emirate or country.

No code changed here. The current temporary favicon/OG system
(`src/app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`) already
satisfies the "no geographic/institutional reference in the mark"
requirement (it is a plain "AM" typographic mark with no location
text), so nothing about it contradicts the new direction. This
confirmed brief is a target for whoever executes the real logo design
later — building an elaborate logo system now remains explicitly out
of scope, per the standing instruction from Phase 5.

### Verification

`tsc --noEmit` and `eslint` both clean after all changes. A full
`next build` succeeded (33 static pages generated per the build log),
with `/male-aesthetics/scrotal-lift` appearing in the route tree
alongside the rest of the site. Smoke-tested against a
real production server (`next build && next start`): the new route
returns `200`, `sitemap.xml` lists all three live `/male-aesthetics/*`
pages with no stale `hyaluronic-acid` entry, and the rendered
`/male-fertility` HTML (including its `FAQPage` JSON-LD) reflects the
rewritten copy — confirmed by reading the actual response body, not
assumed from the source diff alone.

### What Phase 6 explicitly did not do

No clinical, legal, or compliance sign-off was granted — the Scrotal
Lift page and the rewritten Male Fertility copy still need a qualified
reviewer's pass, same as everything else on the site. PRP was not
touched. No production deployment was made. No elaborate final logo
system was built — only the direction was documented.

---

## Phase 7 — SEO restructure, Phase A: Flagship positioning (2026-09-05)

Preceded by two planning documents, produced without touching code:
`SEO_RESTRUCTURE_GAP_ANALYSIS.md` (25-point audit of the current site
against a new physician-brand/SEO positioning brief) and
`SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md` (the resulting three-phase
plan). This section covers Phase A only, as instructed — Phases B/C
are not started.

### Authority facts — owner-confirmed and gated

The owner reviewed the gap analysis's Authority Claims Verification
Status table and approved seven facts for publication, each with
specific preferred wording (recorded verbatim, not paraphrased): 15+
years in Urology, 500+ Penile Girth Enhancement procedures, experience
since 2018, "Medical Trainer in Penile Girth Enhancement" via AndroMax
Training, and FEBU (Fellow of the European Board of Urology). Two
further facts — Top Doctors Spain 2020 and Doctoralia Awards Spain
2022 — were confirmed as *real recognitions* but explicitly **not**
cleared for public display until their exact official title/category
is verified against the primary source.

**Mechanism**: every fact lives as a named field in `src/config/
doctor.ts` (`yearsOfExperience`, `girthEnhancementSince`,
`girthProcedureCount`, `medicalTrainer`, `awards`), and every component
that displays one checks for its presence before rendering anything —
the same fail-safe pattern already established by `isBookingConfigured`
in `config/practice.ts`. For the two gated awards specifically, each
entry carries `ownerConfirmed: true` (the recognition/year are real)
separately from `publishReady: false` (the exact title isn't verified
yet) — components must check `publishReady`, not `ownerConfirmed`, and
the placeholder string `"EXACT OFFICIAL TITLE REQUIRED"` stored in
`officialTitle` was verified, via the real rendered output, to never
reach any page or any structured-data payload while `publishReady` is
false. No number, award name, or credential claim was hard-coded into
any component — every one is read from `doctor.ts`.

### What was built

- **`AuthorityStripSection`** (new) — a four-metric credibility strip
  (15+ Years / 500+ / Since 2018 / Medical Trainer), placed directly
  under the hero. Renders nothing if all underlying fields are unset;
  today all four render.
- **`FeaturedProcedureSection`** (new) — a standalone homepage section
  introducing Penile Girth Enhancement by name as the flagship
  procedure, with a conditional authority line and a single prominent
  CTA to the treatment page — deliberately the strongest single
  internal link on the homepage, per the plan.
- **Homepage reordered** (`app/(marketing)/page.tsx`): Hero → Authority
  Strip → Featured Procedure → Core Expertise → **Male Aesthetics**
  (moved earlier) → ED → Implant → Testosterone → Advanced Assessment
  → About → Conditions → Insights → Booking. Core Expertise
  deliberately stays directly after the flagship section so the
  homepage still reads as a full-specialty practice, not a
  single-procedure landing page.
- **`/male-aesthetics/penile-girth-enhancement` upgraded in place**
  (no new URL — see the gap analysis's URL decision, §5): a
  procedure-specific authority block near the top (500+ Procedures
  Performed / Since 2018 / Consultant / Medical Trainer — this
  page-specific order, procedure experience before generic years, is
  what the owner's brief specifically asked for on this page), plus a
  new "About Dr. Alejandro Molina" section before the FAQ, linking to
  `/about`. Metadata description rewritten to lead with the physician
  and the verified authority facts.
- **`/male-aesthetics` hub upgraded**: metadata description and the
  Penile Girth Enhancement focus-area copy both now name it as the
  flagship procedure and include the authority line, config-driven.
- **`/about` upgraded**: the existing "Surgical background" narrative
  row now includes the 15+ years figure; "Male genital aesthetics"
  (retitled "A Flagship Focus: Penile Girth Enhancement") includes the
  since-2018/500+ figures; "Academic activity" now includes the
  owner's exact AndroMax Training supporting-copy sentence. The
  existing credentials list (already rendered from `doctor.
  credentials`) picked up the FEBU entry automatically.
- **`doctor.credentials`**: replaced the generic "European Board of
  Urology" line with the more precise, now-verified "FEBU — Fellow of
  the European Board of Urology" — not added as a duplicate second
  line, since the two describe the same underlying fact at different
  precision.
- **`footerServiceLinks`** (`config/navigation.ts`): now leads with
  "Penile Girth Enhancement" (direct link to the treatment page) ahead
  of the generic "Male Genital Aesthetics" hub link — previously the
  flagship procedure had no named footer link at all.
- **`personSchema()`** (`lib/seo/json-ld.ts`): gained `hasCredential`
  (one `EducationalOccupationalCredential` entry for FEBU — a
  correct, non-repurposed use of that schema.org property) and
  `award` (built from `doctor.awards`, filtered to `publishReady`
  only — currently always empty, by design).

### What was deliberately not built

Per the owner's explicit "Do NOT" list: no
`/penile-girth-enhancement-abu-dhabi`, no `/male-genital-aesthetics`,
no standalone Penile Filler Complications page, PRP untouched
(`features.prpPage` still `false`), no award published pending exact
title verification, no visual redesign — every new component reuses
existing design tokens, motion primitives (`Reveal`, `StaggerGroup`),
and the established section-rhythm/tonal pattern (the new sections use
`bg-background`/`bg-surface` bands; the site's one dark moment on the
homepage stays with Penile Implant, one olive moment stays with the
closing Booking section — nothing new was given a competing tonal
treatment).

### Verification

`tsc --noEmit` and `eslint` both clean. `next build` succeeded — still
**33 static pages generated**, confirming no route was added or
removed. Real production server (`next build && next start`),
verified via `curl` against the actual rendered output, not assumed:

- All four changed pages return `200`.
- Homepage HTML contains all four authority metrics, the Featured
  Procedure section's copy, and its CTA text.
- Girth Enhancement page HTML contains the new authority block and the
  About Dr. Molina section, including the AndroMax sentence.
- `personSchema()`'s `hasCredential` correctly includes FEBU; grepping
  the full rendered HTML of all four changed pages for `"EXACT
  OFFICIAL TITLE REQUIRED"`, `"Top Doctors"`, and `"Doctoralia"`
  returned **zero matches** — the gated awards do not leak anywhere.
- `sitemap.xml` unchanged in size/shape; no `abu-dhabi`,
  `male-genital-aesthetics`, or `filler-correction` slug present.
- Footer's "Penile Girth Enhancement" link confirmed present.

Real-browser QA (headless Chrome, `puppeteer-core`) across `/`,
`/male-aesthetics`, `/male-aesthetics/penile-girth-enhancement`, and
`/about`, at 390px and 1440px: **0 problems** — no horizontal overflow,
exactly one `<h1>` per page, the booking CTA's `href` correctly points
at `booking.nmc.ae` on every page, zero console errors, zero page
errors. Full-page and cropped screenshots were reviewed visually to
confirm the new sections read as premium and restrained, not as a
stats dashboard or a cosmetic-clinic banner.

### What Phase A explicitly did not do

Did not start Phase B (Penile Filler Correction page, new Insight
articles, visible article authorship, Medical Education section,
Recognition section) or Phase C. Did not deploy or set
`NEXT_PUBLIC_SITE_URL`. Did not mark anything as clinically,
legally, or compliance-approved.

---

## Phase 8 — SEO restructure, Phase B: Topical authority (2026-09-06)

Builds directly on Phase A (Phase 7). Per the owner's explicit
instructions: no redesign, no duplicate keyword pages, PRP untouched,
no unverified award published. Phase C not started.

### 1. Routes created

**`/male-aesthetics/penile-filler-correction`** — new treatment page,
replacing the never-built `revision-correction` placeholder in the
route registry (`lib/seo/routes.ts`; renamed and flipped to `live`, no
redirect needed since nothing was ever indexed at the old slug). Full
template: breadcrumb (Home → Male Genital Aesthetics → Penile Filler
Correction), `MedicalWebPage` (`MedicalProcedure`) + `BreadcrumbList` +
`FAQPage` JSON-LD, hero, a "Common Presentations" section covering
asymmetry/irregular contour/nodules/migration/uneven distribution/
persistent swelling as a substantial section (complications were
explicitly **not** split into a separate page, per instruction), an
assessment section (when it helps / what it involves, including
ultrasound "where it helps clarify a finding... not a routine step"),
a three-option "Observation / Dissolution / Revision" section, a dark
"realistic expectations" section that explicitly states results are
"assessed on its own merits — not through criticism of any prior
provider or treatment," risks/follow-up/limitations, a 5-item
`RelatedTreatments` band (Girth Enhancement, Male Genital Aesthetics,
Peyronie's, ED, About), a 6-item FAQ, and a closing CTA. Both the hero
and closing CTA use "Book a Confidential Consultation" specifically on
this page (via a new optional `bookingLabel` prop added to
`TreatmentCtaSection` and a `children` override on the hero's
`BookingCta` — every other page's CTA wording is unchanged).

### 2. Articles created

Six new Insights articles (`src/content/insights/articles.ts`),
category "Male Aesthetics," all `clinicalReviewRequired: true`:

1. How Much Girth Can Penile Filler Actually Add?
2. How Much Hyaluronic Acid Is Used for Penile Girth Enhancement?
3. How Long Does Penile Filler Last?
4. What Happens to Penile Filler Over Time?
5. When Can You Have Sex After Penile Girth Enhancement?
6. Why Can Penile Filler Take Several Weeks to Settle?

Each has 4 sections written to demonstrate genuine clinical reasoning
rather than restating the same paragraph six ways: every article
distinguishes individual variability from general clinical patterns,
states limitations explicitly, and — checked specifically against the
"do not fabricate" list — contains no citations, studies, guideline
references, percentages, invented publication dates, or promised
outcomes. Where the topic itself implies a number (HA volume, exact
recovery days), the article explains *why* that number isn't quoted
rather than inventing one. All six link to Penile Girth Enhancement;
three (girth-amount, duration, over-time) also link to Penile Filler
Correction via a new optional `secondaryRelatedHref`/`secondaryRelatedLabel`
field on `InsightArticle` — additive, so the 5 pre-existing
single-link articles needed no changes.

### 3. Authorship implementation

New `ArticleAuthorBlock` component, added to the shared article
template (`insights/[slug]/page.tsx`) — applies to **all 11**
articles, not just the 6 new ones. Shows the physician's name, title,
a config-driven credential summary (only facts that are actually set:
currently "15+ years in Urology · FEBU · Penile Girth Enhancement
since 2018"), and a link to `/about`. This is the first *visible*
authorship signal on article pages — previously authorship existed
only inside invisible `Article` JSON-LD. No fake "reviewed by" or
"updated" date was added; `dateModified` still defaults to
`datePublished` since none of these articles has actually been revised.

### 4. Internal linking changes

- Male Genital Aesthetics hub: "Assessment of Previous Fillers" focus
  area retitled "Penile Filler Correction" and now links to the new
  page; hub's `RelatedTreatments` band gained the new page.
- Girth Enhancement page: "Revision / correction" aftercare item now
  links to the new page (previously text-only); its
  `RelatedTreatments` band gained the new page.
- About page: the "Male genital aesthetics" narrative row now links to
  the Girth Enhancement page (previously text-only) — closes the loop
  with the Girth page's existing link to About from Phase A.
- New Filler Correction page links to Girth Enhancement, the hub,
  Peyronie's, ED, and About (5 links, matching the brief exactly).
- Verified no repeated exact-match "penile girth enhancement Abu
  Dhabi" anchor text anywhere in any of the above — natural variants
  used throughout ("Explore Penile Girth Enhancement," "Explore Penile
  Filler Correction," etc.).

### 5. Medical Education & Recognition (About page)

- New dedicated "Medical Education & Training" section — the owner's
  exact supporting-copy sentence about AndroMax Training, and
  deliberately **no CTA of any kind** (no `BookingCta`, no link unless
  `doctor.medicalTrainer.programUrl` is ever set — it isn't yet, so
  nothing renders there today) — keeping the B2B training proposition
  fully separate from clinical booking, per explicit instruction.
- New `RecognitionSection` component, added to the About page —
  renders only `doctor.awards` entries where `publishReady` is `true`.
  Verified via the real rendered HTML that it currently renders
  **nothing** (both Top Doctors Spain 2020 and Doctoralia Awards Spain
  2022 remain `publishReady: false`), and that the
  `"EXACT OFFICIAL TITLE REQUIRED"` placeholder does not appear
  anywhere on the rendered page.

### 6. SEO / metadata / schema hardening

Covered in full in `SEO_AUDIT.md`'s new Phase B section: unique title/
description/canonical for the new page and all six articles (same
`buildMetadata()` mechanism, no changes needed to it), sitemap now 30
entries (was 23, exactly +7), no cannibalization against the Girth
Enhancement cluster or between the six new articles themselves, and no
"Penile Filler Complications" page was built — complications live as
a section of the Correction page instead.

### Verification

`tsc --noEmit` and `eslint` clean. `next build` succeeded — **40
static pages** (was 33: +1 new page, +6 new articles). Real production
server, verified via `curl` against actual rendered output: all
changed/new pages return `200`; the Confidential-Consultation wording
appears only on the new page (confirmed the global header CTA and
every other page's CTA still read "Book a Consultation," unchanged);
`hasCredential`/`award` gating still correct (re-verified: no leak);
sitemap has no stale `revision-correction` entry and no duplicate
`penile-filler-correction` entry.

Real-browser QA (headless Chrome) across all 11 changed/new pages at
390px and 1440px: **0 problems** — no horizontal overflow, exactly one
`<h1>` per page, correct booking-CTA text and `href` on every page
(including the confirmed "Book a Confidential Consultation" /
"Book a Consultation" split), zero console errors, zero page errors.
Screenshots of the new Correction page, one new article, and the
About page's new Medical Education section were reviewed visually —
all read as a specialist medical publication, consistent with the
existing premium editorial system; no new visual language was
introduced.

### What Phase B explicitly did not do

Did not build a separate "Penile Filler Complications" page. Did not
publish either gated award. Did not touch PRP. Did not start Phase C
(remaining Insights articles, video-ready architecture, Search
Console-driven iteration). Did not mark any new or existing content as
clinically, legally, or compliance-approved — see the Phase B
addendum in `CLINICAL_CONTENT_REVIEW.md` for the specific new items
awaiting review.
