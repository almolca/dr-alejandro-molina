# R9 Phase B0 responsive QA — method note

Task 18's brief called for Playwright screenshots of `/` and `/ar` at 390/768/1024/1440px,
saved as `{width}-en.png` / `{width}-ar.png` in this directory.

**No screenshots were captured.** The shared Playwright MCP browser
(`mcp-chrome-16841cb`) was exclusively held by another live session for the
entire QA window — confirmed by a running (non-stale) Chrome process tree
started at 4:22 PM the same day, still active during this task. Every
Playwright browser tool call failed with:

```
Error: Browser is already in use for .../mcp-chrome-16841cb, use --isolated
to run multiple instances of the same browser
```

This included `browser_resize` and `browser_navigate` — not just
`browser_take_screenshot` — so the brief's own fallback tier
("`browser_navigate` + `browser_snapshot`") was also unavailable, since both
depend on the same locked browser instance. Retried twice; same result both
times.

**Actual fallback used: curl-based HTML/source-code structural verification**
(the brief's second fallback tier), applied uniformly rather than per
breakpoint, for reasons below, and substantially deeper than a single
`curl` fetch:

- Fetched full SSR HTML for `/` and `/ar` via `curl` and diffed section
  counts, image inventories (`src`, `alt`), hreflang/canonical tags, and
  JSON-LD `inLanguage`.
- HTTP-checked every unique image URL referenced by either page for a `200`
  (no broken media).
- Diffed `page.tsx` composition order for both routes against the English
  section inventory in spec §1.
- Read the actual component source (not just rendered HTML) for the two
  §5 CSS fixes, the contributor-dot / divider RTL mirroring, the
  arrow-glyph decision, the Insights bilingual notice, and the
  `PhysicianAuthority`/`ClinicalDecisionFlow` `locale="ar"` additions —
  confirming both the AR-specific behavior and (via `git diff b11234e`)
  that the underlying change is a value-for-value additive/logical-property
  refactor that resolves identically under `dir="ltr"`, i.e. zero visual
  change for English by construction, not just by observation.
- Compared the count and exact values of responsive Tailwind
  breakpoint utilities (`sm:`/`md:`/`lg:`/`xl:`) between every English
  section and its Arabic counterpart, as the best available proxy for
  "will these render comparably at 390/768/1024/1440" without a real
  browser to resize.
- Ran `npx tsc --noEmit` (clean) as a baseline sanity check.

**Why this doesn't vary by breakpoint:** `curl` returns the same
server-rendered HTML regardless of viewport (there is no
viewport-conditional SSR in this app); only CSS media queries change the
rendered layout. So a single fetch per route, combined with a
class-by-class responsive-utility diff, is the most breakpoint-relevant
evidence obtainable without a browser. It cannot confirm actual pixel
layout, true horizontal-overflow at a given width, or genuinely broken
(vs. merely 404) image rendering (e.g. a decode failure) — those require a
real render and remain unconfirmed. See task-18-report.md for the full
breakdown and the resulting exit-criteria sign-off, including the residual
risk this leaves.

No `{width}-en.png` / `{width}-ar.png` files exist in this directory as a
result. If/when the browser frees up, re-run Task 18's Step 2 verbatim to
backfill actual screenshots.
