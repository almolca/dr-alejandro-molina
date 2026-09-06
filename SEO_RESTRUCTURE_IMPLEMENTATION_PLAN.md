# SEO Restructure — Implementation Plan

Built directly from `SEO_RESTRUCTURE_GAP_ANALYSIS.md`. Nothing here has
been implemented yet — **this is a plan for review, per the explicit
instruction to stop after both documents exist.** Do not begin Phase A
until the owner has reviewed both documents and, specifically,
confirmed or corrected the Authority Claims table.

---

## Cross-cutting decisions (apply to every phase)

These were resolved in the gap analysis and are restated here because
every phase depends on them:

1. **No new URL for Penile Girth Enhancement.** Upgrade
   `/male-aesthetics/penile-girth-enhancement` in place.
   `/penile-girth-enhancement-abu-dhabi` is not created, and no
   redirect is needed since no second URL is introduced.
2. **No new URL for the Male Genital Aesthetics hub.** Continue using
   `/male-aesthetics`. `/male-genital-aesthetics` is not created.
3. **Penile Filler Correction is built at `/male-aesthetics/penile-
   filler-correction`** — renaming the existing unbuilt, never-indexed
   `planned` route currently called `/male-aesthetics/revision-
   correction` in `lib/seo/routes.ts`, rather than adopting a
   `-abu-dhabi` suffix. No redirect needed (nothing has ever been built
   or indexed at the old placeholder slug).
4. **Penile Filler Complications is a section within the Filler
   Correction page, never its own route.**
5. **Authority-claims mechanism**: every unverified claim (15+ years,
   500+ procedures, since 2018, FEBU, AndroMax, Top Doctors 2020,
   Doctoralia 2022) gets a **named, empty config field** in
   `doctor.ts` (e.g. `yearsOfExperience`, `girthProcedureCount`,
   `girthEnhancementSince`, `medicalTrainerRole`, `awards`,
   `academicRoles`) plus a component that **renders nothing until that
   field is populated** — the same pattern already used for
   `isBookingConfigured` / `isPhysicianProfileConfigured` in
   `config/practice.ts`. This lets every authority component be built
   and reviewed now, while guaranteeing nothing unverified ships. Once
   the owner supplies and approves real values, populating the config
   is the only step needed to go live — no further code changes,
   no redeploy of logic.
6. **No award, credential, or number is drafted into copy anywhere in
   this plan.** Every place an authority fact would appear is marked
   `[OWNER VERIFICATION REQUIRED]` inline in the task description
   below.

---

## PHASE A — Flagship positioning

Goal: make Penile Girth Enhancement significantly more prominent
without turning the homepage into a filler landing page, and without
publishing a single unverified claim.

### A1. Homepage restructuring

**File:** `src/app/(marketing)/page.tsx`

Reorder sections to: Hero → **Authority Strip (new)** → **Featured
Procedure: Penile Girth Enhancement (new)** → Core Expertise → Male
Aesthetics → Erectile Dysfunction → Penile Implant → Testosterone →
Advanced Assessment → About → **Medical Education (new, Phase B)** →
Conditions → Insights → Booking.

Rationale: moves Male Aesthetics ahead of ED/Implant/Testosterone per
the brief's suggested hierarchy (§7), while keeping Core Expertise
(the four-pillar overview) immediately after the flagship section so
the site still reads as a full-specialty practice, not a single-
procedure page — directly addressing the brief's own warning ("must
NOT position Dr Molina merely as a penile filler doctor").

### A2. Authority Strip component

**New file:** `src/components/sections/AuthorityStripSection.tsx`

A slim, premium, four-metric strip (not a "stats dashboard" — spec
§37's design-quality bar applies here as much as anywhere). Reads from
new `doctor.ts` fields:

```ts
// doctor.ts — new fields, all empty until owner-verified
yearsOfExperience: undefined as number | undefined,       // "15+ Years"
girthEnhancementSince: undefined as number | undefined,   // "Since 2018"
girthProcedureCount: undefined as string | undefined,     // "500+"
medicalTrainerRole: undefined as string | undefined,      // "Medical Trainer"
```

The component renders **only the metrics that have a value** — if all
four are `undefined` (today's actual state), the section renders
nothing at all rather than a broken/empty strip. This is a direct
continuation of the existing `isBookingConfigured` pattern, not a new
idea introduced for this plan.

**`[OWNER VERIFICATION REQUIRED]` for all four metrics before this
section displays anything.**

### A3. Featured Procedure section

**New file:** `src/components/sections/FeaturedProcedureSection.tsx`

One prominent, premium section (not a card grid) introducing Penile
Girth Enhancement by name, using only currently-verified language
already approved elsewhere on the site (anatomy-led, hyaluronic acid,
individual assessment, realistic expectations — reusing exact phrasing
already live on `/male-aesthetics/penile-girth-enhancement`, not new
copy). CTA: "Learn About Penile Girth Enhancement" →
`/male-aesthetics/penile-girth-enhancement`.

The brief's suggested copy ("500+ procedures performed," "since 2018")
is **not** included in this section's initial build — it has its own
conditional sub-block reading the same `doctor.ts` fields as A2, hidden
until verified, exactly like the Authority Strip.

### A4. Penile Girth Enhancement page upgrade (in place)

**File:** `src/app/(marketing)/male-aesthetics/penile-girth-
enhancement/page.tsx` (existing file, upgraded — not replaced)

- Add an authority block near the top per the brief's §10 ordering
  (procedure-specific experience before generic years), built as a
  smaller variant of the same conditional component from A2 — reusing
  one component, not building a second one.
- Expand content sections toward the brief's §11 structure where they
  don't already exist: "Why Hyaluronic Acid?", "How the Procedure Is
  Performed" (medically appropriate level of detail, no injection
  technique instructions — matches spec §14's existing restraint),
  "What Does the Result Feel Like?", "When Can Sexual Activity
  Resume?", "How Long Do Results Last?", "Can Penile Filler Be
  Corrected or Dissolved?" (linking to the new Filler Correction page
  from A7/B1), "Why Specialist Urological Assessment Matters." Several
  of these already exist in substance (Expected Variability, Risks,
  Aftercare, Revision) and only need reorganizing under the brief's
  section names, not rewriting from scratch.
- Add a short "About Dr. Alejandro Molina" block on the page itself
  (currently the page has no author/physician block beyond the global
  header) — verified facts only (Consultant Urologist & Andrologist,
  existing credential list), with the FEBU/trainer/procedure-count
  lines conditionally rendered per A2's mechanism.
- Title/description copy update via the existing `buildMetadata()` —
  no mechanism change, just new title/description strings reflecting
  the flagship framing (e.g. title: "Penile Girth Enhancement | Dr.
  Alejandro Molina" — the brief's suggested "...Abu Dhabi" suffix can
  go in the *meta description*, where it reads naturally, without
  needing it in the URL — see gap analysis §5).

### A5. About page authority signals

**File:** `src/app/(marketing)/about/page.tsx`

Add one new narrative row ("Penile Girth Enhancement since 2018,
500+ procedures" framing) using the same conditional-rendering
mechanism — if the underlying `doctor.ts` fields are empty, this row
simply isn't in the array rendered, no visible gap. Add FEBU and
AndroMax mentions to the credentials list the same way, each
individually conditional (a specific credential/award may be verified
before another — the mechanism must not be all-or-nothing).

### A6. Male Genital Aesthetics hub reinforcement

**File:** `src/app/(marketing)/male-aesthetics/page.tsx`

Already restructured in the prior round to feature Girth Enhancement
and Scrotal Lift as the two priority services (no further structural
change needed). Add: a link to the new Filler Correction page (once
A7/B1 exists) alongside the existing "Assessment of Previous Fillers"
focus area, and tighten that focus area's copy to a teaser that points
to the full page rather than duplicating its content.

### A7. Reserve the Filler Correction route

**File:** `lib/seo/routes.ts`

Rename the existing `planned` entry from `/male-aesthetics/revision-
correction` to `/male-aesthetics/penile-filler-correction` (still
`status: "planned"` until Phase B actually builds it — this is just
correcting the reserved slug now, while it's free, rather than
juggling two placeholder names).

### A8. Internal linking pass

- Footer (`config/navigation.ts`'s `footerServiceLinks`): add a
  same-tier link for "Penile Girth Enhancement" by name (currently
  only "Male Genital Aesthetics" generically links there) — the single
  highest-leverage internal-linking change available, per the gap
  analysis §4/§13 finding.
- Homepage's new Featured Procedure section (A3) and the reordered
  Male Aesthetics section (A1) both link to the Girth Enhancement page
  — this alone roughly triples its current homepage link count (from
  one bullet-link to three distinct link placements).

### A9. Metadata / schema changes required

- No new JSON-LD types needed (gap analysis §19) — `MedicalWebPage`,
  `BreadcrumbList`, `FAQPage`, `Person`, `Physician` already cover
  everything the brief asks to "evaluate."
- `personSchema()`'s `knowsAbout` array (`lib/seo/json-ld.ts:55`) gets
  new entries ("FEBU," etc.) added the same conditional way — only
  once verified, appended to the existing array, not a new field.
- Title/description updates on the Girth page (A4) and hub (A6) flow
  through the existing `buildMetadata()` helper — no changes to the
  helper itself.

### Phase A acceptance check

- `tsc --noEmit`, `eslint`, `next build` all clean.
- With all `doctor.ts` authority fields still `undefined` (today's real
  state), the homepage and Girth page render **identically in
  substance** to today, minus the reordering and the new Featured
  Procedure section's non-numeric copy — i.e., nothing broken or
  visibly "empty" ships even before verification lands.
- Real-browser QA (the project's existing headless-Chrome harness) on
  the homepage and the Girth Enhancement page at minimum, same
  breakpoints as prior phases.
- No new indexable URL created (confirm via `sitemap.xml`).

---

## PHASE B — Topical authority

Goal: build the second high-intent page, start the article cluster,
and add the visible authorship/education/recognition signals — all
still gated on verification where applicable.

### B1. Penile Filler Correction page

**New file:** `src/app/(marketing)/male-aesthetics/penile-filler-
correction/page.tsx` — built to the same template every other
treatment page uses (breadcrumb `Home → Male Genital Aesthetics →
Penile Filler Correction`, `MedicalProcedure` JSON-LD, FAQ, CTA).
Content per the brief's §13: irregularities, asymmetry, nodules,
migration, unsatisfactory contour, persistent swelling, dissolution/
correction where appropriate — written the way this site already
writes risk content (hedged, non-alarmist, no criticism of other
providers, matching `UAE_COMPLIANCE_REVIEW.md`'s existing standard).
Flip `lib/seo/routes.ts`'s reserved slug (A7) from `planned` to
`live`.

### B2. First high-value Insight articles (4–6)

Per the brief's §14 cluster list, prioritizing the topics least likely
to need clinical sign-off nuance and most clearly educational (matching
this site's existing "genuine specialist experience, not thin SEO
content" bar, already met by the 5 existing articles):

1. How Much Girth Can Penile Filler Actually Add? (realistic-
   expectations framing, consistent with the existing page's "no
   numbers promised" restraint)
2. How Long Does Penile Filler Last?
3. Can Penile Filler Be Dissolved?
4. Penile Filler Migration: What Patients Should Know
5. Is Penile Girth Enhancement Safe?
6. Penile Filler Correction: When Is It Necessary? (directly links to
   B1)

Each gets `relatedHref` pointing at `/male-aesthetics/penile-girth-
enhancement` and/or the new Filler Correction page, following the
existing `InsightArticle` shape in `content/insights/articles.ts` —
no new content architecture needed, just new entries.
`clinicalReviewRequired: true` on all of them, same as every existing
article — no exceptions invented for this cluster.

**`[OWNER VERIFICATION REQUIRED]`** if any draft leans on the "What I
Have Learned From 500+ Procedures" framing (brief's item 14) — that
specific article should not be written until the procedure count is
verified; it's the one article on the proposed list that's *inherently*
a claim, not just topically adjacent to one.

### B3. Physician authorship (visible)

**File:** `src/app/(marketing)/insights/[slug]/page.tsx`
**New file:** `src/components/sections/ArticleAuthorBlock.tsx`

A small, visible author block under the article hero: "Dr. Alejandro
Molina, Consultant Urologist & Andrologist" with a link to `/about`.
Uses only already-verified facts (name, title) — no new claims. This
closes the gap analysis §14/§20 finding (schema-only authorship today).
`dateModified` starts equal to `datePublished` as it does now; the
field is used correctly the first time any article is genuinely
revised.

### B4. AndroMax / medical education section

**New file:** `src/components/sections/MedicalEducationSection.tsx`
(homepage) + a corresponding block on `/about`.

Entirely gated on a new `doctor.ts` field:

```ts
medicalEducation: undefined as { role: string; program: string; url?: string } | undefined,
```

Renders nothing until populated. **`[OWNER VERIFICATION REQUIRED]`** —
this section is not built with placeholder copy in the meantime; it
simply doesn't exist in the render tree until the field has a value,
same discipline as A2.

### B5. Awards / professional recognition

**New file:** `src/components/sections/RecognitionSection.tsx` (About
page only — per the brief's §19, kept below the Girth page's
procedure-count evidence, not above it).

Gated on:

```ts
awards: [] as { title: string; year: number; issuer: string }[], // doctor.ts, already exists as empty array
```

Renders nothing while empty (today's actual state). Each award entry,
once supplied, must use the **exact official title/category** per the
task instructions — this component does not synthesize or shorten
award names.

### B6. Related internal links

Add the new Filler Correction page and each new B2 article to
`RelatedTreatments` bands on: the Girth Enhancement page, the Male
Aesthetics hub, and each other's articles — following the existing
`RelatedTreatments`/`relatedHref` patterns exactly, no new component.

### Phase B acceptance check

Same as Phase A (typecheck/lint/build/QA clean), plus: confirm via
`sitemap.xml` that exactly one new page (`penile-filler-correction`)
and the new article routes were added — no duplicate-intent URLs.
Confirm the Medical Education and Recognition sections render nothing
when their config fields are empty (this is the actual pre-verification
state and must not look broken).

---

## PHASE C — Content cluster expansion

Goal: complete the article cluster and prepare for data-driven
iteration. Nothing in this phase is gated on authority-claim
verification except where an individual article topic requires it.

### C1. Remaining Insights articles

The rest of the brief's §14 list not covered in B2: How Much Hyaluronic
Acid Is Used, What Happens to Penile Filler Over Time, Why Can Penile
Filler Take Several Weeks to Settle, Penile Filler Nodules and
Irregularities, Penile Filler vs Fat Transfer, Why Can Penile Filler
Feel Different Between Patients. Same process as B2 — no new
architecture.

### C2. Video-ready article architecture

**File:** `content/insights/articles.ts` (type extension) +
`insights/[slug]/page.tsx`

Add an optional `videoEmbed?: { provider: "youtube" | "vimeo"; id:
string; title: string }` field to `InsightArticle`, rendered only when
present — no video exists yet, this only prepares the slot (consistent
with how `MEDIA_REQUIREMENTS.md` already treats missing photography:
document the slot, don't fabricate the asset). Embeds must respect the
existing CSP (`next.config.ts`) — verify the chosen provider's embed
doesn't require loosening `script-src`/`frame-src` beyond what's
already permitted, before wiring this in for real.

### C3. Further educational resources

Only build additional pages here if a concrete gap is identified via
C4 (Search Console data) — matching this project's standing
instruction (carried over from Phase 5) not to expand the product
speculatively.

### C4. Search Console-driven iteration

Requires `NEXT_PUBLIC_SITE_URL` to be set and the site actually
deployed (`LAUNCH_CHECKLIST.md` "Must complete before launch" — still
outstanding as of this plan). Once live: connect Search Console,
observe real query data for the keyword list in the brief's §28 and
the master spec's §23, and let *that* data — not assumption — decide
which further articles, if any, get built. This is the point where a
URL-change reconsideration for the Girth Enhancement page (gap analysis
§5) would be legitimately revisited, if the data supported it.

---

## What this plan explicitly does not do

- Does not create `/penile-girth-enhancement-abu-dhabi` or
  `/male-genital-aesthetics`.
- Does not create a separate "Penile Filler Complications" page.
- Does not write any authority number, award name, FEBU claim, or
  AndroMax description into any file — every such fact is a named,
  currently-empty config field with a conditionally-rendering
  component, per the mechanism in "Cross-cutting decisions" item 5.
- Does not touch `features.prpPage` (remains `false`).
- Does not change the confirmed `bookingUrl` / `physicianProfileUrl`.
- Does not redesign the visual system — every new component (Authority
  Strip, Featured Procedure, Medical Education, Recognition, Author
  Block) is built from the existing design tokens, motion primitives
  (`Reveal`, `MaskedReveal`, `StaggerGroup`), and section rhythm
  (alternating dark/olive/surface backgrounds) already established
  sitewide — no new visual language introduced.
- Does not deploy or set `NEXT_PUBLIC_SITE_URL`.
- Does not begin implementation. Awaiting review of this plan and the
  gap analysis, and specifically the Authority Claims Verification
  Status table, before Phase A starts.
