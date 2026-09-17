# R9 Phase B Batch 1 responsive QA — method note

Task 20's brief called for Playwright screenshots of the 5 English/Arabic hub
pairs (`/about`, `/mens-health`, `/sexual-medicine`, `/male-aesthetics`,
`/male-fertility`) at 390/768/1024/1440px, falling back to the structural
method from B0's Task 18 if the browser is unavailable.

**No screenshots were captured.** The shared Playwright MCP browser
(`mcp-chrome-16841cb`) was held by another live session for the entire QA
window — a `ps aux` check showed the same Chrome process tree from B0
(started Friday, PID 76645 and children) still running. Both
`browser_resize` and `browser_navigate` failed with:

```
Error: Browser is already in use for .../mcp-chrome-16841cb, use --isolated
to run multiple instances of the same browser
```

Retried both calls once each; same result. No `{width}-en.png` /
`{width}-ar.png` files exist in this directory as a result.

## Actual method used: curl-based HTML/source-code structural verification

Same fallback tier as B0's Task 18, applied per-pair rather than per
breakpoint for the same reason documented in `qa/r9-phase-b0/README.md`:
`curl` returns identical SSR HTML regardless of viewport width — only CSS
media queries change layout — so a class-by-class responsive-utility diff is
the most breakpoint-relevant evidence obtainable without a real browser to
resize.

Dev server started locally (`npm run dev`, port 3000, this worktree) for the
duration of this QA pass.

Work performed:

- **HTTP status check**: all 10 routes (`/about`, `/ar/about`,
  `/mens-health`, `/ar/mens-health`, `/sexual-medicine`,
  `/ar/sexual-medicine`, `/male-aesthetics`, `/ar/male-aesthetics`,
  `/male-fertility`, `/ar/male-fertility`) return `200`.
- **Full page.tsx read + section-by-section diff** for all 5 pairs (not just
  a grep) — confirmed every English section has a corresponding Arabic
  section in the same composition order, with no section dropped or added
  on either side.
- **Image inventory + HTTP check**: `<img>` tag counts match exactly between
  each English/Arabic pair (12/12 about, 3/3 mens-health, 2/2
  sexual-medicine, 3/3 male-aesthetics, 2/2 male-fertility). All 13 unique
  image URLs referenced across the 10 pages (after HTML-entity-decoding the
  `&amp;` in `/_next/image?...` query strings, which caused an initial
  false-positive batch of `400`s from mis-encoded curl requests — corrected
  and re-run) return `200`.
- **hreflang / canonical / html lang+dir check**: every English page carries
  reciprocal `en-AE`/`ar-AE`/`x-default` `<link rel="alternate">` tags plus
  `<link rel="canonical">` pointing at itself; every Arabic counterpart
  carries the same three alternates plus its own canonical. `<html lang="en"
  dir="ltr">` on every English page, `<html lang="ar" dir="rtl">` on every
  Arabic page — confirmed via `src/app/(ar)/layout.tsx`, which sets these at
  the true document root (not an inner wrapper).
- **JSON-LD `inLanguage` check**: every Arabic page's JSON-LD carries
  `"inLanguage":"ar"`; no English page carries an `inLanguage` field at all
  (unchanged default), confirmed via `grep` on the rendered HTML.
- **Zero-regression check for English pages**: `git show b11234e --stat`
  confirms all 5 English hub `page.tsx` files were pure renames (100%
  similarity, 0 content lines changed) from `src/app/(marketing)/<path>` to
  `src/app/(en)/(marketing)/<path>` as part of the route-group restructure —
  not edited. `git status` confirms no uncommitted local changes to any of
  the 5 English files. This is a zero-visual-change guarantee by
  construction, not just by observation.
- **RTL-specific checklist items** (read component source directly, not
  just rendered HTML):
  - `Breadcrumb`'s `ChevronRight` icon carries `rtl:rotate-180`
    (`src/components/ui/Breadcrumb.tsx:23`), and `dir="rtl"` is confirmed
    set at the true `<html>` root for every `/ar/*` route, so the Tailwind
    `rtl:` variant is live. Verified in rendered HTML for all 5 Arabic
    pages (`<html lang="ar" dir="rtl" ...>`).
  - `AuthorityBlock`'s default (non-`center`) alignment branch uses
    `lg:text-start` (`src/components/ui/AuthorityBlock.tsx:62`), a logical
    property that resolves to `left` under English `dir="ltr"` (unchanged)
    and `right` under Arabic `dir="rtl"` — confirmed on `/ar/male-aesthetics`,
    the page called out specifically in the brief, where `AuthorityBlock
    locale="ar"` is used inside the dark flagship section.
  - `section-dark` / `section-olive` (`src/styles/tokens.css:40-61`) are
    pure CSS-custom-property overrides with no locale conditioning
    whatsoever — they apply identically regardless of `dir`/`lang`, so
    Batch 1's dark section on `/about` and `/mens-health` and olive section
    on `/male-aesthetics` and `/male-fertility` render with the same colors
    in both languages by construction.
  - Grepped all 5 Arabic `page.tsx` files for physical-direction utility
    classes (`pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`) that would break
    under RTL — none found at the page level. One `tracking-widest`
    survives in `/ar/about` (line 273, the `Men's Health Spain` outlet-name
    byline, which stays Latin-script by design — not a bug).
  - `VisualSystem.module.css`'s `.heroGrid`, `.split`, and
    `.physicianIdentity` rules (used across all 5 pairs) use only
    direction-agnostic properties (`margin-top`, `padding-block`,
    `border-top`, grid) — no physical `left`/`right` properties to break
    under `dir="rtl"`.
- **Responsive-utility-class parity** (`sm:`/`md:`/`lg:`/`xl:` counts) as a
  breakpoint-relevance proxy, per pair: about 7/7, mens-health 2/2,
  sexual-medicine 4/4, male-aesthetics 9/8, male-fertility 4/4. The
  male-aesthetics 9-vs-8 delta was investigated and is a false positive: the
  English file's one extra match is inside a JSX comment (`{/* ... lg:order-first
  ... */}`, line 119) describing layout behavior in prose, not a live class —
  the actual `lg:order-first` utility appears once on each side.
- **Baseline sanity check**: `npx tsc --noEmit` — clean, no errors.

## What this does and doesn't confirm

Confirms: content completeness and section-order parity, image
availability, correct hreflang/canonical/JSON-LD locale tagging, zero
content drift on the English side, and that the three RTL-specific
mechanisms called out in the brief (Breadcrumb chevron, AuthorityBlock
alignment, dark/olive section colors) are implemented as locale-agnostic
logical-property / non-conditional CSS and wired with `locale="ar"` at every
Arabic call site.

Does **not** confirm: actual pixel layout at 390/768/1024/1440px, true
horizontal overflow at a given width, font-rendering/line-wrap behavior of
Noto Sans Arabic at each breakpoint, or genuinely broken (vs. merely
non-404) image decoding. Those require a real browser render and remain
unconfirmed pending Playwright availability. If/when the browser frees up,
re-run this task's Step 2 verbatim to backfill actual screenshots before the
consolidated pre-Production Preview pass after Batch 4.
