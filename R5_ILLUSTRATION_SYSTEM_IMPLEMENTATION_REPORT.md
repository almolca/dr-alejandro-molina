# R5 — SVG Illustration System + Premature Ejaculation Content

Implements the owner's "SVG ILLUSTRATION SYSTEM + PREMATURE EJACULATION
CONTENT INTEGRATION" brief (2026-09-08) on the existing
`phase-r3-correction-visual-brand` branch. Repository state at the start
of this task already included an extensive, uncommitted "R4 / R4.2 / R4.3"
visual and photography correction pass (see `R4_IMPLEMENTATION_REPORT.md`,
`R4_2_IMPLEMENTATION_REPORT.md`, `R4_3_IMPLEMENTATION_REPORT.md` and the
matching `CODEX_R4_*.md` briefs) — that work was verified and committed as
its own checkpoint first (see the commit immediately before this phase's
commits), so this report only covers what changed for illustrations and
Premature Ejaculation on top of it.

Every commit in this phase was verified clean with `tsc --noEmit`,
`eslint` and `next build` before landing.

## 1. Illustration system

**Location:** `src/components/illustrations/`

- `illustration-base.tsx` — shared foundation. `illustrationBaseProps`
  sets `fill="none"`, `stroke="currentColor"`, `strokeWidth={1.25}`,
  rounded caps/joins on the root `<svg>`; SVG presentation attributes
  inherit to children, so every illustration gets the same stroke
  language without repeating it. `accessibilityProps(title?)` returns
  either `aria-hidden` (decorative — the default) or `role="img"` +
  `aria-label` (informative), so accessibility is enforced by the shared
  helper rather than left to each component to remember.
- Color comes entirely from Tailwind text-color classes
  (`text-muted-foreground`, `text-foreground`, with one accent element
  per illustration in `text-accent-strong`) via `currentColor` — no
  hardcoded hex anywhere, so every illustration automatically matches
  whichever section tone it's placed in (light, `.section-dark`, the R4
  `visual.scope`/`.flagshipHero` overrides) without per-page overrides.
- Every illustration is inline React SVG (no image assets, no new
  dependencies) — lightweight and infinitely sharp at any size or DPI.

**The nine components, one per inventory item in the brief:**

| Component | Concept | Used on |
|---|---|---|
| `VascularFlowDiagram` | Abstract circulation/signal convergence; one line shows a deliberate assessed gap | Home (Sexual & Hormonal Health), Erectile Dysfunction hero |
| `ResponseThresholdDiagram` | A response curve crossing a marked threshold — a gauge, not anatomy | Premature Ejaculation hero |
| `HormoneBalanceDiagram` | Central node with orbiting satellite nodes — a regulatory network | Testosterone hero |
| `ImplantDeviceDiagram` | Three-piece cylinder/pump/reservoir schematic, engineering-diagram style | Penile Implant (device options) |
| `CurvatureAssessmentDiagram` | Dashed baseline vs. curved line with deviation ticks — a tolerance drawing | Peyronie's Disease |
| `ContourPlanningDiagram` | Layered topographic contour arcs | Male Aesthetics hub (flagship section) |
| `ContourReviewDiagram` | Dashed "original" vs. solid "current" contour, one divergence marker | Penile Filler Correction |
| `ConsultationPathwayDiagram` | Linear node pathway (consultation → diagnosis → plan) | Sexual Medicine hub, Men's Health hub |
| `MedicalEducationDiagram` | Mentor/trainee connection + ultrasound-style arcs, no patient figure | About (Medical Education & Training / AndroMax) |

Girth Enhancement and About's hero were deliberately **not** given an
additional illustration — Girth Enhancement already has its own
dedicated `ProcedureFramework` contour SVG, `VariabilityFactors` icon
grid and `CareStages` sequence from the prior R4 pass, and About was
kept to the brief's explicit "light use only" with exactly one
illustration total.

**Accessibility:** every illustration defaults to `aria-hidden="true"`
because every current placement sits next to a heading/paragraph that
already states the same information in words — the SVG is a visual
reinforcement, not the sole carrier of information (WCAG guidance is to
hide purely decorative/redundant images from assistive tech). The one
exception is `ImplantDeviceDiagram` on the Penile Implant page, which
carries a `title` prop ("Schematic of a three-piece inflatable
prosthesis: cylinder, pump and reservoir") — verified in the live DOM to
render `role="img"`, `aria-label`, and a `<title>` element, while every
other illustration on that same page renders `aria-hidden="true"` with
no `role`.

**Content/style discipline:** no illustration is anatomically literal —
every one is line/silhouette/abstract-flow/diagram, per the brief's
"avoid explicit genital drawing" instruction for every single inventory
item. None use gold/bronze as more than a single restrained accent
element (one node, one marker, one line) per illustration; the rest of
each drawing is muted stone/charcoal via inherited `currentColor`.

## 2. Premature Ejaculation — new route

**Route:** `/sexual-medicine/premature-ejaculation` — nested directly
under the Sexual Medicine hub (not under Erectile Dysfunction), since PE
and ED are sibling conditions under the same hub, not one a sub-procedure
of the other. This is the first route to live directly under
`/sexual-medicine/*` — its existing children (`penile-doppler`,
`shockwave-therapy`) are nested under `/erectile-dysfunction/*` instead.

**File:**
`src/app/(marketing)/sexual-medicine/premature-ejaculation/page.tsx`

Structure follows the established condition-page convention (matching
Erectile Dysfunction and Peyronie's Disease, not the newer R4
`visual.scope` system, since PE is a direct sibling of those two
plain-style pages under the same hub):

1. **Hero** — H1, positioning copy, `ResponseThresholdDiagram` (hidden
   below `lg`, per the same restrained-motion pattern used elsewhere).
2. **What it is** — explicitly reframes PE away from "a single timed
   threshold" toward frequency / degree of control / distress, per the
   brief's content-scope requirement.
3. **Why assessment matters** — a 6-item cause grid (psychological,
   relationship, sensitivity/threshold, ED, hormonal/medical, previous
   experience), matching the site's existing cause-matrix pattern from
   the ED page.
4. **Treatment approach** (dark section, this page's one dark moment) —
   4 categories (behavioural, psychosexual, medical, procedural-in-
   selected-cases) in the same numbered-ladder visual language as the ED
   treatment ladder, with the same "not every patient starts at step
   one" framing so it reads as options, not a mandatory sequence.
5. **Selected procedural option — hyaluronic acid at the glans.** See §3
   below; this section deliberately carries **no illustration**.
6. **Why specialist care** — plain physician-identity paragraph
   (matching Filler Correction's "About" section style), noting PE is
   assessed alongside erectile and hormonal health, not in isolation.
7. **Related treatments, FAQ (6 items), closing CTA** — standard
   `RelatedTreatments` / `Faq` / `TreatmentCtaSection` components, no new
   patterns introduced.

**Structured data:** `medicalWebPageSchema` with `aboutType:
"MedicalCondition"`, `aboutName: "Premature Ejaculation"` — same pattern
as every other condition page, no new schema type needed.

## 3. Hyaluronic acid at the glans — how it was framed

Per the owner's explicit instruction, the wording follows the brief's
own suggested framing almost verbatim: *"In selected cases, hyaluronic
acid treatment at the glans may be considered as part of a broader
management strategy for premature ejaculation. This is not the first or
only option, is not suitable for every patient, and is only considered
after assessment has clarified the pattern involved and the approaches
above have been discussed."* Four supporting bullets restate, in
different words each time, that suitability is individually assessed,
goals/limitations are discussed before any procedure, it's one part of a
broader strategy rather than a guaranteed solution, and it's only ever
discussed alongside the behavioural/psychosexual/medical options — never
as a default.

**Deliberate design decision:** unlike every other clinically-gated
subsection on the page, this one carries no illustration, no accent
color beyond the existing bullet markers, and sits in a plain light
section with no visual distinction from the paragraph sections around
it — specifically so it does not read as a promoted or highlighted
procedure. The brief was explicit ("Do NOT make the page read like an
advert") and the surest way to honor that was to under-style this
section relative to the rest of the page, not to add restraint-signaling
visual flourish around it.

## 4. Information architecture updates

- `src/lib/seo/routes.ts` — added
  `{ path: "/sexual-medicine/premature-ejaculation", status: "live", priority: 0.8 }`,
  so it's included in `sitemap.xml` through the existing single-source-of-truth registry (no separate sitemap edit needed).
- `src/components/sections/CoreExpertiseSection.tsx` — the homepage's
  existing "Premature Ejaculation" secondary link previously pointed at
  `/sexual-medicine` (the hub, no dedicated page — this was the exact gap
  flagged in `IMPLEMENTATION_REPORT.md`'s Phase 2 audit). Now points at
  the new dedicated route.
- `src/config/navigation.ts` — added Premature Ejaculation to
  `footerServiceLinks`, alongside the site's other named conditions.
- `src/app/(marketing)/sexual-medicine/page.tsx` — added Premature
  Ejaculation as the hub's second `areas` entry (after Erectile
  Dysfunction, before the two ED sub-assessments), updated the H1
  subhead and metadata description to mention it, added one new FAQ
  entry with a `readMoreHref` into the new page, and added
  `ConsultationPathwayDiagram` beneath the hero CTA.
- Not touched: `content/insights` — no new Insights article was created
  for Premature Ejaculation; out of scope for this task and avoids
  duplicating intent with the new condition page itself.

## 5. QA

`tsc --noEmit`, `eslint`, `next build` all clean on the full combined
working tree (R4/R4.2/R4.3 plus this phase). Real-browser QA via
Playwright against a local `next start` (production) server:

- **Zero horizontal overflow** at 390px on: Home, About, Sexual
  Medicine, Premature Ejaculation, Erectile Dysfunction, Testosterone,
  Penile Implant, Peyronie's Disease, Male Aesthetics, Penile Filler
  Correction, Men's Health.
- **Zero horizontal overflow** at 768px on: About, Premature
  Ejaculation, Erectile Dysfunction, Male Aesthetics, Men's Health.
- **Zero horizontal overflow** at 1440px on all of the above, verified
  via full-page and targeted-section screenshots.
- **One `<h1>`** confirmed on the Premature Ejaculation page.
- **Zero console errors** across every page checked; the only warnings
  are the two pre-existing, unrelated ones (`NEXT_PUBLIC_SITE_URL` not
  set locally, and a logo `priority`-preload timing hint).
- **No blurry rendering** — every illustration is inline vector SVG, so
  there is no raster/DPI concern; confirmed sharp at both 390px and
  1440px screenshots.
- **Illustration placement discipline verified visually**: each
  component was screenshotted in situ (ED hero, Testosterone hero,
  Implant device-options section, Peyronie's assessment section, Male
  Aesthetics flagship section, Filler Correction presentations section,
  Men's Health "connected areas" section, About's Medical Education
  section, Sexual Medicine and PE heroes) — none read as generic stock
  icons, cartoon graphics, or explicit anatomy; each pairs cleanly with
  its section's existing heading/copy rhythm.
- **Accessibility spot-check**: queried the live DOM on the Penile
  Implant page — the one illustration with a `title` prop renders
  `role="img"` + `aria-label` + `<title>`; every other illustration on
  that page renders `aria-hidden="true"` with no `role`, confirming the
  shared helper's decorative-by-default behavior works as designed.

## 6. Housekeeping found during this pass

While reconciling repository state at the start of this task, found that
the 7 explicitly-unused AI-generated/marketing images (which this same
project had previously untracked from git and placed in `public/brand/`)
had been moved into `public/images/doctor/` — the exact directory the
site's real photography system (`src/config/photography.ts`, `PhotoFrame`)
is designed to read approved assets from. None of the 7 files were
actually referenced by `photography.ts` (every slot remains `src: null,
approved: false`), so nothing was rendered — but sitting inside the
"approved photography" directory risked a future accidental activation
and cut against the explicit "déjalas, pero no las uses" instruction in
spirit. Moved all 7 back to `public/brand/` (already covered by the
existing `.gitignore` rule) before starting this task's own work; this
was a five-minute file-location fix, not a rewrite of anyone else's work.

## 7. What this phase explicitly did not do

Did not deploy. Did not merge. Did not create a new Insights article.
Did not enable PRP. Did not invent any award, review, or media
appearance. Did not create any explicit or anatomically literal imagery
— every illustration is abstract line/silhouette work. Did not add an
illustration to every single page in the sitemap — Girth Enhancement was
deliberately left as-is (already well served by prior work) and About
was deliberately limited to one illustration, per the brief's own "a few
well-placed illustrations are better than many weak ones" and "light use
only" instructions.
