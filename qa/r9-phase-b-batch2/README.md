# R9 Phase B Batch 2 responsive QA — method note

Task 11's brief called for a Playwright visual pass at 390/768/1024/1440px
on the batch's seven new pages plus the three files Task 9 modified,
falling back to the structural method from B0's Task 18 / Batch 1's
Task 20 if the browser is unavailable. Mid-execution, the owner instructed
expanding this task's scope to a whole-Arabic-site regression pass: also
check the previously-shipped Arabic pages that could have been touched by
this batch's shared-component change (`DopplerWaveformPanel`'s new
`locale` prop, Task 1) or by Task 9's link edits to already-live pages.

**Playwright was unavailable.** `browser_navigate` failed immediately with:

```
Error: Browser is already in use for
/Users/alejandro/Library/Caches/ms-playwright-mcp/mcp-chrome-16841cb,
use --isolated to run multiple instances of the same browser
```

Same shared-browser-lock failure mode as B0's Task 18 and Batch 1's
Task 20 — a different live session is holding the browser. Not retried
further; proceeded straight to the structural fallback per the brief.
No screenshots exist in this directory as a result. **A real visual pass
at all four breakpoints is still owed** before the consolidated
pre-Production Preview after Batch 4.

## Method used: structural/source-based fallback + a real `npm run build` + a live local dev-server HTTP pass

Unlike a pure source-reading fallback, this pass also started the local
dev server (`npm run dev`, port 3000, this worktree) and ran a full
production build, so several checks below are against live rendered
HTML/JSON, not just source text.

### Part 1 — the seven new pages

For each of `/ar/erectile-dysfunction`, `/ar/erectile-dysfunction/penile-doppler`,
`/ar/sexual-medicine/premature-ejaculation`, `/ar/mens-health/testosterone`,
`/ar/penile-implant`, `/ar/peyronies-disease`, `/ar/male-fertility/varicocele`:

- **Section-count parity**: `grep -c "<section"` against the English
  source for every pair — all seven match exactly (7/7, 11/11, 6/6, 8/8,
  8/8, 4/4, 4/4).
- **FAQ-item parity**: counted `question:` entries in each pair's FAQ data
  — all seven match exactly (5/5, 12/12, 6/6, 10/10, 9/9, 5/5, 4/4).
- **CTA parity**: `<Link>`/`<Button>` counts match exactly on every pair
  (no CTA silently dropped).
- **Image-slot correctness**: read `EditorialFrame`'s and `PhotoFrame`'s
  slot-resolution logic directly
  (`src/components/editorial/EditorialFrame.tsx`,
  `src/components/editorial/PhotoFrame.tsx`) — both take `slot: keyof
  typeof <config>` and do a plain object lookup (`editorialMedia[slot]` /
  `photography[slot]`) with no runtime fallback for an unknown key; an
  invalid/misspelled slot name is a **TypeScript compile error**, not a
  silent wrong-image bug, confirmed by `npm run build`'s clean typecheck.
  Beyond that compile-time guarantee, slot *names actually used* were
  diffed against the English source per page — identical on all six pages
  that use an image slot (`edHero`, `peHero`, `testosteroneHero`,
  `peyroniesHero`, `implantDevice`, `implantPhysician`,
  `implantSurgical`); `penile-doppler` and `varicocele` use no
  `EditorialFrame`/`PhotoFrame`. Every referenced `src` path resolved to a
  real file under `public/images/` (confirmed by reading the config and
  checking the filesystem directly, not assumed).
- **`locale="ar"` coverage**: `grep -Ln 'locale="ar"'` across the seven
  files returned nothing (i.e. every file has at least one hit). Verified
  by direct read (not just a narrow-window grep) that every
  `SectionHeading` (6/6/etc. depending on page), every `Faq`, every
  `RelatedTreatments`, and all four `DopplerWaveformPanel` call sites in
  `penile-doppler/page.tsx` carry `locale="ar"` — an initial narrow
  `grep -A2`/`-A3` window under-counted several multi-line JSX calls where
  `locale="ar"` sits past line +3; re-checked by reading the full call
  site, all confirmed correct.
- **No leaked `tracking-widest`/`tracking-[0.2em]`**: `grep` across all
  seven files — zero hits.
- **RTL physical-direction-class check**: grepped all seven files for
  `pl-`/`pr-`/`ml-`/`mr-`/`left-`/`right-` utilities. Two hits, both in a
  horizontal "not first child gets a divider" pattern
  (`penile-implant/page.tsx:318`, `peyronies-disease/page.tsx:136`, both
  using `pr-`/`border-r`). Checked the English source for the same
  pattern: it uses `pl-`/`border-l`. This is correct, intentional
  mirroring, not a bug — `flex-direction: row` reverses visual order under
  `dir="rtl"`, so a "divider on the side facing the previous item" flips
  from left (English) to right (Arabic) by design.
- **`npm run build`**: ran clean — `next build` compiled successfully,
  `Running TypeScript` passed with no errors, and all seven pages
  statically generated (`○` in the route table) alongside every other
  Arabic and English route.
- **Live dev-server HTTP pass**: started `npm run dev`, confirmed all
  seven routes return `200`, and confirmed on the rendered HTML for each:
  `<html lang="ar" dir="rtl">`, reciprocal `hrefLang="en-AE"` /
  `hrefLang="ar-AE"` / `hrefLang="x-default"` alternates, a
  `<link rel="canonical">`, and JSON-LD `"inLanguage":"ar"`.

No issues found among the seven new pages.

## Regression check: previously-shipped Arabic pages (owner-requested scope expansion)

This section covers the pages **outside** this batch's own file changes,
checked because the owner asked to keep a whole-site regression pass at
the end of Batch 2: `/ar` (homepage), the four untouched Batch 1 hubs
(`/ar/about`, `/ar/sexual-medicine`, `/ar/male-aesthetics`,
`/ar/male-fertility`), and `/ar/mens-health` (the one Batch 1 hub Task 9
did touch).

- **`git diff` file inventory for the whole batch** (`8c0a8be~1..HEAD`,
  i.e. every commit from Task 1 through Task 10): confirms the *complete*
  file list touched by Batch 2 is the seven new `page.tsx` files, the
  Batch 2 plan/glossary docs, `DopplerWaveformPanel.tsx`,
  `AdvancedPenileSurgerySectionAr.tsx`, `SexualHormonalHealthSectionAr.tsx`,
  `mens-health/page.tsx` (one line), and `routes.ts`. None of the four
  untouched Batch 1 hub pages appear in that diff at all — zero direct
  edit exposure.
- **`DopplerWaveformPanel`'s new `locale` prop (Task 1)**: confirmed via
  `git show 8c0a8be` that the change added `locale?: "ar"` as an optional
  prop with `isAr = locale === "ar"` gating a ternary between an EN and
  AR label config; when `locale` is omitted, behavior is identical to
  before the change. Confirmed via `grep -rl "DopplerWaveformPanel"
  src/app` that the component has exactly two call sites in the whole
  app: the pre-existing English `penile-doppler/page.tsx` (which passes
  no `locale` prop at all) and the new Arabic `penile-doppler/page.tsx`
  added by this batch. As the brief anticipated, there were no
  pre-existing call sites before this batch introduced the first one, so
  this specific regression risk is zero — confirmed, not just assumed.
- **The two Task 9-edited section files**
  (`AdvancedPenileSurgerySectionAr.tsx`, `SexualHormonalHealthSectionAr.tsx`)
  and the one Task 9-edited hub line (`mens-health/page.tsx`): read the
  full `git show f70f244` diff — every hunk changes only an `href` string
  value (four `href` edits total across the three files, all from a
  temporary English destination to the matching `/ar/...` path now that a
  real Arabic page exists); no surrounding JSX structure, props, or
  imports changed. Confirmed live in the rebuilt static HTML for
  `/ar/mens-health` (testosterone link now points to
  `/ar/mens-health/testosterone`) and for `/ar` (both sections' four
  flipped links present, zero leftover bare-English matches for those
  four specific hrefs).
- **The four untouched Batch 1 hubs** (`/ar/about`, `/ar/sexual-medicine`,
  `/ar/male-aesthetics`, `/ar/male-fertility`): confirmed zero file
  changes in this batch's diff (see above). `npm run build` statically
  generated all four with no errors. Live dev-server HTTP check: all four
  return `200`. Checked each file's internal `href="/...\"` links for any
  now-stale English path that this batch made resolvable — `/ar/about`,
  `/ar/sexual-medicine`, and `/ar/male-fertility` have zero internal path
  links at all; `/ar/male-aesthetics` links only to
  `/male-aesthetics/penile-girth-enhancement` (correctly still English —
  no Arabic page exists for that sub-page) and `/ar/about` (already
  correct). No regression found.
- **`/ar/mens-health`**: the one line Task 9 changed
  (`/mens-health/testosterone` → `/ar/mens-health/testosterone`) verified
  correct above. Read the rest of the file's internal links: `/ar/sexual-medicine`,
  `/ar/male-fertility` (both correct, pre-existing), and `/book` (no
  Arabic page exists for `/book`, correctly stays English). Nothing else
  in the file changed structurally (single-line diff, confirmed by
  `git show f70f244`).
- **`npm run build`**: the same clean build covering the seven new pages
  (above) also statically generated all five of these previously-shipped
  pages (`/ar`, `/ar/about`, `/ar/sexual-medicine`, `/ar/male-aesthetics`,
  `/ar/male-fertility`, `/ar/mens-health` — six total counting the hub) with
  no errors, alongside every English route. A successful whole-app
  production build is itself evidence against a regression having broken
  any of these pages.
- **Live dev-server HTTP + HTML pass**: all of `/ar`, `/ar/about`,
  `/ar/sexual-medicine`, `/ar/male-aesthetics`, `/ar/male-fertility`,
  `/ar/mens-health` return `200` and render with `dir="rtl"`.

### Issue found and fixed: a third homepage section was still un-flipped

While sweeping the rebuilt `/ar` homepage's HTML for leftover bare-English
links (as a belt-and-suspenders check beyond what Task 9's own diff
covered), a **third** homepage section component —
`src/components/sections/ar/CoreExpertiseSectionAr.tsx` — was found still
pointing at English destinations for six links, four of which now have
real Arabic pages from this very batch:

- `/erectile-dysfunction` → should be `/ar/erectile-dysfunction`
- `/mens-health/testosterone` → should be `/ar/mens-health/testosterone`
- `/peyronies-disease` → should be `/ar/peyronies-disease`
- `/erectile-dysfunction/penile-doppler` → should be `/ar/erectile-dysfunction/penile-doppler`
- `/sexual-medicine/premature-ejaculation` → should be `/ar/sexual-medicine/premature-ejaculation`
- `/male-fertility/varicocele` → should be `/ar/male-fertility/varicocele`

This component was **not** in Task 9's declared edit scope (it only
touched `AdvancedPenileSurgerySectionAr.tsx`,
`SexualHormonalHealthSectionAr.tsx`, and the `mens-health` hub), and it
was not named in the owner's expanded regression-scope instruction either
— it surfaced only because this task swept the actual rendered homepage
HTML for stale links rather than limiting the check to the three files
named in Task 9's scope. Two of its links
(`/male-aesthetics/penile-girth-enhancement`, `/mens-health/vasectomy`)
correctly stay on temporary English destinations, since neither has an
Arabic page yet (confirmed against `src/lib/seo/routes.ts` — neither has
an `arPath`).

**Fixed** in a dedicated commit (`8a6925e`, kept separate from this QA
doc's commit, matching this project's own precedent of not bundling
source fixes into a QA-doc commit — see `a572153`,
`fix(r9-b): drop tracking-[0.2em]...`, and `d8e0995`, which reverted an
earlier QA task's accidental non-QA-doc file change). Rebuilt and
re-verified via the live dev server: the `/ar` homepage's rendered HTML
now has zero bare-English matches for any of the six hrefs above, and the
six flipped `/ar/...` hrefs are present.

No other stale links were found: a repo-wide sweep of `src/app/(ar)` and
`src/components` for `href="<batch-2-destination>"` without the `/ar`
prefix turned up only the two *English* section components
(`SexualHormonalHealthSection.tsx`, `AdvancedPenileSurgerySection.tsx`),
which correctly stay pointed at English destinations since they're used
on the English homepage.

## What this does and doesn't confirm

Confirms: content completeness (sections/FAQs/CTAs) and image-slot
correctness on all seven new pages; `locale="ar"` wired everywhere
required; no RTL physical-direction-class regressions (the two `pr-`
hits are intentional, verified mirroring); a clean whole-app production
build; correct hreflang/canonical/JSON-LD locale tagging and `200`
responses on all thirteen live Arabic routes; zero direct file-level
regression exposure on the four untouched Batch 1 hubs; `Task 9`'s three
edited files changed only the intended `href` strings; and
`DopplerWaveformPanel`'s new `locale` prop carries zero regression risk
for the English page (confirmed, not assumed, since it's an optional
prop with an unchanged default and there were no pre-existing call sites
before this batch). Also caught and fixed one real, previously-unknown
gap: a third homepage section left un-flipped by Task 9.

Does **not** confirm: actual pixel layout at 390/768/1024/1440px, true
horizontal overflow at a given width, font-rendering/line-wrap behavior
of Noto Sans Arabic at each breakpoint, or genuinely broken (vs.
merely non-404/non-crashing) image decoding in a real browser. Those
require a real browser render and remain unconfirmed pending Playwright
availability. If/when the browser frees up, re-run this task's Step 1
verbatim — across both the seven new pages and the regression list above
— to backfill actual screenshots before the consolidated pre-Production
Preview pass after Batch 4.
