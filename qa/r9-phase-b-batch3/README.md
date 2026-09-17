# R9 Phase B Batch 3 QA — multi-shape link audit + structural QA + clinical-tone check

Task 7's brief called for a Playwright visual pass at 390/768/1024/1440px
on the batch's three new pages, falling back to the structural method
from B0's Task 18 / Batch 1's Task 20 / Batch 2's Task 11 if the browser
is unavailable, plus (new for this batch) a repo-wide multi-shape link
re-audit independent of Task 5's own check, a whole-site regression check
on the files Task 5 touched, and a clinical-tone fidelity re-read.

**Playwright was unavailable.** `browser_navigate` failed immediately with:

```
Error: Browser is already in use for
/Users/alejandro/Library/Caches/ms-playwright-mcp/mcp-chrome-16841cb,
use --isolated to run multiple instances of the same browser
```

Same shared-browser-lock failure mode as B0's Task 18, Batch 1's Task 20,
and Batch 2's Task 11 — a different live session is holding the browser.
Not retried further; proceeded straight to the structural fallback per
the brief. No screenshots exist in this directory as a result. **A real
visual pass at all four breakpoints is still owed** before the
consolidated pre-Production Preview after Batch 4 — see "Accumulated
visual-QA debt" at the end of this document.

## Method used: structural/source-based fallback + `npm run build` + a live local dev-server HTTP pass

Started the local dev server (`npm run dev`, port 3000, this worktree)
and ran a full production build, so several checks below are against
live rendered HTML/JSON, not just source text.

## Step 2 — structural fallback on the three new pages

For each of `/ar/male-aesthetics/penile-girth-enhancement`,
`/ar/male-aesthetics/penile-filler-correction`,
`/ar/male-aesthetics/scrotal-lift`, diffed against its English source:

| Page | Sections (EN/AR) | FAQ items (EN/AR) | Content-array parity |
|---|---|---|---|
| penile-girth-enhancement | 8/8 | 11/11 | `options` 2/2, `approachPillars` 7/7, `afterConsiderations` 3/3 |
| penile-filler-correction | 6/6 | 7/7 | `presentations` 6/6, `correctionOptions` 3/3, `afterConsiderations` 3/3 |
| scrotal-lift | 4/4 | 6/6 | `causes` 2/2, `process` 3/3 |

No section, FAQ item, image slot, or CTA dropped on any of the three
pages.

- **Image slots**: the flagship page's two `EditorialFrame`/`PhotoFrame`
  slots (`girthFlagship`, `girthConsultation`) match the English source
  exactly, confirmed by direct read of both files side by side. The
  other two pages use no image slot in either language — consistent.
- **`locale="ar"` coverage**: confirmed by direct read (not narrow-window
  grep) that every `SectionHeading`, `Faq`, `RelatedTreatments`,
  `PhysicianAuthority`, `ClinicalPathway`, `ProcedureFramework`,
  `VariabilityFactors`, and `CareStages` call site across all three pages
  carries `locale="ar"`. `TreatmentCtaSection` and `BookingCta` take no
  `locale` prop by design — all three pages instead pass explicit Arabic
  text at every call site, per the Global Constraints' "explicit-text
  rule." Confirmed compliant on all three pages.
- **No leaked `tracking-widest`/`tracking-[0.2em]`**: swept all three
  files in one command —
  `grep -n 'tracking-widest\|tracking-\[0.2em\]'` against all three
  page files — zero hits. (The English sources use both classes on their
  eyebrow/strapline text; the Arabic pages correctly drop them, per the
  Global Constraints' letter-spacing discipline.)
- **`npm run typecheck`**: clean, no errors.
- **`npm run test`**: 149/149 passed (18 test files), including
  `routes.test.ts` (11 tests) and `sitemap.test.ts` (5 tests).
- **`npm run build`**: `next build` compiled successfully, TypeScript
  passed with no errors, and all three new routes statically generated
  (`○ /ar/male-aesthetics/penile-girth-enhancement`,
  `○ /ar/male-aesthetics/penile-filler-correction`,
  `○ /ar/male-aesthetics/scrotal-lift`) alongside every other Arabic and
  English route — 72/72 pages generated, no errors (the pre-existing
  `metadataBase` warning is unrelated to this batch and appears on every
  build).
- **Live dev-server HTTP pass**: all three routes return `200`.
  Confirmed on the rendered HTML for each: `<html lang="ar" dir="rtl">`,
  reciprocal `hrefLang="en-AE"` / `hrefLang="ar-AE"` / `hrefLang="x-default"`
  alternates, and JSON-LD `"inLanguage":"ar"`.
- **Rendered-HTML link sweep**: swept each new page's live rendered HTML
  for `href="/male-aesthetics/..."` (bare English form). Each page shows
  exactly one hit — the language switcher's "English" link, which
  correctly points to the English counterpart page. This is the intended
  reciprocal switcher wired up by Step 1's `arPath` registration
  (Task 5), not a stale internal link.

No issues found among the three new pages.

## Step 3 — repo-wide multi-shape link re-audit (independent of Task 5)

Command (exact, as specified in the brief):

```bash
grep -rn '"/male-aesthetics/penile-girth-enhancement"\|"/male-aesthetics/scrotal-lift"\|"/male-aesthetics/penile-filler-correction"' src/
```

Full output (59 matching lines across the categories below):

```
src/app/(en)/(marketing)/mens-health/page.tsx:162
src/app/(en)/(marketing)/sexual-medicine/page.tsx:111
src/app/(en)/(marketing)/about/page.tsx:78
src/app/(en)/(marketing)/penile-surgery/page.tsx:89
src/app/(en)/(marketing)/male-aesthetics/page.tsx:62,68,140,172,279,280,281,294
src/app/(en)/(marketing)/male-aesthetics/scrotal-lift/page.tsx:15,212
src/app/(en)/(marketing)/male-aesthetics/penile-filler-correction/page.tsx:17,321
src/app/(en)/(marketing)/male-aesthetics/penile-girth-enhancement/page.tsx:27,92,112,139,423
src/config/navigation.ts:21,51,87,114
src/content/insights/articles.ts: 20 occurrences (relatedHref/secondaryRelatedHref fields)
src/components/sections/FeaturedProcedureSection.tsx:17
src/components/sections/HeroSection.tsx:66
src/components/sections/CoreExpertiseSection.tsx:64
src/components/editorial/FlagshipAuthorityFeature.tsx:16
src/lib/seo/routes.test.ts:63,64,65
src/lib/seo/legacy-redirects.ts:54,55,74,75
src/lib/seo/routes.ts:67,68,73
```

(the `articles.ts` block is condensed to a count for brevity here; the
raw output was reviewed line-by-line, no line skipped)

### Manual classification of every hit

- **`src/app/(en)/...` (all files)** — English-side marketing pages.
  Canonical English hrefs are correct as-is; unaffected by this batch.
- **`src/config/navigation.ts`** (4 hits) — 2 English-array hits
  (`primaryNav`, `footerServiceLinks`, lines 21/51) + 2 Arabic-array hits
  (`primaryNavAr`, `footerServiceLinksAr`, lines 87/114) still in
  canonical-English form by design — these self-heal via
  `localizeHref`/`getLocalizedPathPair` now that `arPath` is registered
  (Task 5, Step 1/11). Confirmed unchanged and correct — do not edit.
- **`src/content/insights/articles.ts`** (20 hits) — checked whether this
  content is ever rendered on an Arabic page before accepting it as
  expected: confirmed via `grep -rln "@/content/insights/articles" src/`
  that its only consumers are `src/app/sitemap.ts`,
  `src/app/(en)/(marketing)/insights/page.tsx`,
  `src/app/(en)/(marketing)/insights/[slug]/page.tsx`,
  `src/components/sections/RelatedInsights.tsx`, and
  `src/components/sections/ArticleVideoBlock.tsx`; confirmed via
  `find "src/app/(ar)" -iname "*insight*"` that no Arabic insights route
  exists at all; and confirmed `RelatedInsights`/`ArticleVideoBlock` are
  never imported anywhere under `src/app/(ar)` or
  `src/components/sections/ar/`. English-only content with no Arabic
  mirror yet — genuinely unaffected, not a missed flip. Matches the
  Global Constraints' explicit carve-out (`/insights/...` links stay
  English this batch).
- **`src/components/sections/FeaturedProcedureSection.tsx`,
  `HeroSection.tsx`, `CoreExpertiseSection.tsx`** — the English
  (non-`Ar`-suffixed) counterparts of the three Arabic section
  components already fixed in Task 5. English-side, correct as-is.
- **`src/components/editorial/FlagshipAuthorityFeature.tsx`** — the file
  fixed in Task 5's post-review fix-round (commit `91c69e2`); its CTA
  `href` now branches on `isAr` (`href={isAr ? "/ar/male-aesthetics/penile-girth-enhancement" : "/male-aesthetics/penile-girth-enhancement"}`),
  so the bare-substring grep necessarily still shows one hit — the
  English-locale branch of a correct locale ternary, not a hardcoded
  regardless-of-locale link. Confirmed by reading the file directly:
  branching is present and correct.
- **`src/lib/seo/routes.ts`, `routes.test.ts`** — the English `path` key
  of the route registry and its test expectations. `arPath` is the
  separate field carrying the Arabic destination and is already
  registered correctly for all three routes (Task 5, Step 1). Correct
  as-is.
- **`src/lib/seo/legacy-redirects.ts`** — old/foreign-language legacy URL
  redirect *destinations* (`/en/penis-enlargement`, `/aumento-de-pene`,
  `/en/scrotoplasty`, `/escrotoplastia`), unrelated to the Arabic-locale
  link-flip concern. English-only redirect targets, correct as-is.
- **The three new Arabic pages' own self-references** — not present in
  this grep's output at all. Their `PATH` constants and internal
  cross-links already use the `/ar/male-aesthetics/...` form (a distinct
  quoted string from the bare English path this search targets), so they
  correctly don't match. Confirmed by direct read of all three files
  (Step 2 above).

**Result: no live finding.** Every hit classifies as expected — either
genuinely English-side content, a self-healing nav entry, the
already-fixed `FlagshipAuthorityFeature.tsx`, or unrelated
route-registry/legacy-redirect bookkeeping. This independent sweep
reaches the identical classification Task 5's own post-review fix-round
sweep reached (commit `91c69e2`'s report); the only commit between that
sweep and this one (`6706b99`) touched only
`docs/arabic-medical-glossary.md`, so no drift was possible. No fix
required in this task.

## Step 4 — whole-site regression: files touched by Task 5

Diffed each of the 7 files Task 5 edited plus the 1 file its post-review
fix-round edited, from the commit immediately before Task 5
(`1d68591`, the last commit before Task 5's `6b27e28`) to current `HEAD`:

```bash
git diff 1d68591 HEAD -- \
  "src/app/(ar)/ar/(marketing)/sexual-medicine/page.tsx" \
  "src/app/(ar)/ar/(marketing)/mens-health/page.tsx" \
  "src/app/(ar)/ar/(marketing)/male-aesthetics/page.tsx" \
  "src/app/(ar)/ar/(marketing)/about/page.tsx" \
  src/components/sections/ar/HeroSectionAr.tsx \
  src/components/sections/ar/FeaturedProcedureSectionAr.tsx \
  src/components/sections/ar/CoreExpertiseSectionAr.tsx \
  src/components/editorial/FlagshipAuthorityFeature.tsx
```

Every hunk in the resulting diff changes only:
- an `href` string value (English path → matching `/ar/...` path), or
- the explanatory code comment directly above the changed href (updating
  stale "temporary EN destination" language to reflect that the Arabic
  page now exists).

No surrounding JSX structure, props, imports, or unrelated text changed
in any of the 8 files. `sexual-medicine/page.tsx` and
`mens-health/page.tsx` each show exactly 1 changed line;
`about/page.tsx` shows 1; `HeroSectionAr.tsx` and
`FeaturedProcedureSectionAr.tsx` each show 1 href line plus removal of
their now-stale comment; `CoreExpertiseSectionAr.tsx` shows 1 href line
plus the block-comment update; `male-aesthetics/page.tsx` shows 8 href
changes plus 1 comment update; `FlagshipAuthorityFeature.tsx` shows the
comment removal plus the `isAr`-ternary href fix. This exactly matches
what Task 5's own brief and report declared — no unintended change
anywhere.

Playwright being unavailable, could not visually confirm `/ar`,
`/ar/sexual-medicine`, `/ar/mens-health`, `/ar/male-aesthetics`, and
`/ar/about` in a real browser. Instead: `npm run build` statically
generated all five pages (plus every other route) with zero errors, and
a live dev-server HTTP pass confirmed all five return `200`. A clean
whole-app production build plus a minimal, surgical diff against the
pre-Task-5 baseline is strong evidence against a regression, but does
not substitute for an actual rendered-pixel check — carried forward into
the visual-QA debt note below.

## Step 5 — clinical-tone fidelity check

Re-read all three new Arabic pages against the plan's Global Constraints
(premium tone; proportion over maximum size; anatomy-led; staged
treatment; realistic expectations; no exaggerated enlargement claims; no
proprietary technique disclosure) and against their English sources side
by side. This was already checked task-by-task during Tasks 2–4's
reviews and found clean; this pass re-reads the specific highest-risk
spots directly rather than trusting the prior reviews to still hold.

- **(a) No numeric outcome/size claim added anywhere the English source
  omits one.** Checked the two highest-risk spots directly:
  - FAQ "How much size increase can I expect?" (`penile-girth-enhancement`,
    Arabic line 129): "لا تُنشر قياسات نتائج محددة هنا — بل تُناقش
    بالتفصيل، وفي سياق تشريحك الخاص، أثناء الاستشارة" — preserves the
    English source's "specific outcome measurements aren't published
    here — they're discussed in detail... at consultation" exactly, with
    no number introduced.
  - "Expected variability" dark section (Arabic lines 370–373): "لا
    تُذكَر قياسات نتائج محددة هنا — بل تُناقش بشكل فردي، وفي سياقها،
    أثناء الاستشارة، لا أن تُوعَد بها مسبقًا" — preserves "Specific
    outcome measurements are not quoted here... rather than promised in
    advance" exactly, no number introduced.
- **(b) The "Dr. Molina's Approach" section describes principles, not
  technique.** Re-read all 7 `approachPillars` entries in Arabic
  (Anatomy First, Proportion Over Maximum Volume, Individual Treatment
  Planning, Staged Treatment When Appropriate, Andrology-Led Assessment,
  Structured Follow-Up, Correction Expertise) — none discloses a
  procedural/technique step (no injection volume, product brand, needle
  gauge, or method detail); all describe clinical philosophy, matching
  the English source's own stated intent ("without exposing procedural
  technique"). Confirmed clean.
- **(c) `penile-filler-correction`'s hedges present, not softened.**
  FAQ "Can all penile filler problems be corrected?": "قد تتحسن حالات
  أخرى... جزئيًا فقط" preserves "may only partially improve" exactly.
  "Realistic expectations" dark section: "ولا يمكن ضمان نتيجة محددة —
  بما في ذلك الحل الكامل لكل حالة عدم انتظام" preserves "no specific
  outcome — including complete resolution of every irregularity — can be
  guaranteed" exactly. Both hedges present, not softened into a promise.
- **(d) `scrotal-lift`'s hedge present.** "A realistic discussion" dark
  section: "تختلف النتائج بين الأفراد ولا يمكن ضمان نتائج محددة"
  preserves "results vary between individuals and specific outcomes
  cannot be guaranteed" exactly.

**Result: no new finding.** All four highest-risk spots preserve their
English source's hedges/caveats/declined claims verbatim in meaning, add
no number or technique detail the English source omits, and match the
established Arabic terminology from the Global Constraints
(`زيادة سماكة القضيب`, `تصحيح حشو القضيب`, `شد الصفن`, `التجميل الذكوري`).
Confirms, rather than overturns, Tasks 2–4's own reviews.

## What this does and doesn't confirm

Confirms: content completeness (sections/FAQs/CTAs/image slots) on all
three new pages with exact parity against their English sources;
`locale="ar"` wired everywhere required; no leaked
`tracking-widest`/`tracking-[0.2em]`; a clean whole-app production build
(72/72 pages, zero errors) and passing typecheck/test suite (149/149);
correct hreflang/canonical/`lang`/`dir`/JSON-LD locale tagging and `200`
responses on all eight relevant Arabic routes; an independent whole-`src/`-tree
multi-shape link sweep reaching the same "no live finding" conclusion as
Task 5's own post-review sweep, with every one of the 59 matching lines
manually classified; a minimal, surgical diff on all 8 files Task 5 (and
its fix-round) touched, with nothing beyond the declared href/comment
changes; and that all four of this batch's highest-risk clinical-tone
spots preserve their English source's hedges verbatim.

Does **not** confirm: actual pixel layout at 390/768/1024/1440px, true
horizontal overflow at a given width, font-rendering/line-wrap behavior
of Noto Sans Arabic at each breakpoint, or genuinely broken (vs. merely
non-404/non-crashing) image decoding in a real browser. Those require a
real browser render and remain unconfirmed pending Playwright
availability.

## Accumulated visual-QA debt

This is now the **fourth consecutive batch** — B0, Batch 1, Batch 2, and
now Batch 3 — whose QA task has hit the identical Playwright
shared-browser-lock failure and fallen back to the structural method.
No genuine rendered-pixel check has been performed on any R9 Phase B
Arabic page at any breakpoint since this workstream began. This is worth
the owner's explicit attention before Batch 4's Preview: when the
browser tool frees up (or `--isolated` is used to force a second
instance), a real visual pass across all Arabic routes shipped so far —
not just this batch's three — at 390/768/1024/1440px should be run once,
before the consolidated pre-Production Preview after Batch 4, to
backfill actual screenshots and catch anything a structural/source-based
fallback cannot (real overflow, real line-wrap, real image decoding).
