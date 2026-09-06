# Search Console Monitoring Plan

**Status:** Not yet actionable — `NEXT_PUBLIC_SITE_URL` is unset and the site has not been deployed to a production domain (see `LAUNCH_CHECKLIST.md`). This document defines the monitoring plan to execute once the site is live and verified in Google Search Console; it contains no ranking forecasts, since none exist yet for a site with zero deployment history.

## Purpose

Track real query performance after launch to validate (or correct) the SEO restructure's targeting decisions — particularly whether the Penile Girth Enhancement flagship page, the Penile Filler Correction page, and the Insights cluster are being matched to the queries they were built for, without cannibalizing each other.

## Setup (post-launch, one-time)

1. Verify the production domain in Google Search Console (domain property, not just URL-prefix, to capture all subpaths).
2. Submit `sitemap.xml` (already generated at `/sitemap.xml` via `src/app/sitemap.ts`).
3. Confirm crawl coverage shows no unexpected `noindex` or `Excluded` pages beyond the 3 legal pages (which are deliberately `index: false`).

## Query groups to track

Pull Search Console's Performance report filtered to each group below. Group by query, then by page, on at least a rolling 28-day and 3-month view once enough data exists (Search Console data is sparse and noisy in the first few weeks post-launch — avoid drawing conclusions before ~4-6 weeks of data).

### Brand
- Alejandro Molina
- Dr Alejandro Molina
- Alejandro Molina urologist
- Alejandro Molina Abu Dhabi

### Penile Girth
- penile girth enhancement Abu Dhabi
- penile filler Abu Dhabi
- penis filler Abu Dhabi
- penile thickening Abu Dhabi
- penile augmentation Abu Dhabi

### Correction
- penile filler correction Abu Dhabi
- penile filler migration
- penile filler nodules
- penile filler complications

### Andrology
- andrologist Abu Dhabi
- men's health doctor Abu Dhabi
- sexual medicine Abu Dhabi

## Metrics per query group

For each group above, record monthly:
- Impressions
- Clicks
- CTR
- Average position
- Which page(s) each query maps to (Search Console's query→page breakdown)

## Cannibalization checks

Specifically watch for:
- The same query appearing against both `/male-aesthetics/penile-girth-enhancement` and `/male-aesthetics/penile-filler-correction` with split impressions — would indicate the two pages are competing rather than serving distinct intents.
- Any Insights article outranking its own linked treatment page for a clearly commercial query (e.g. an article outranking the Girth page for "penile girth enhancement Abu Dhabi") — would suggest the treatment page's on-page targeting needs strengthening, not that the article should be removed.
- Queries in the "Correction" group landing on the Girth page instead of the Correction page, or vice versa — would indicate the FAQ/read-more linking added in the Phase C content cluster (see `docs/superpowers/plans/2026-09-06-phase-c-content-cluster.md`) needs adjustment.

## Pages to improve based on real query data

This section is intentionally left as a template — do not pre-fill it with guesses. Once real Search Console data exists, populate it with: page, underperforming query, current position/CTR, and the specific on-page change being tested (e.g. FAQ wording, title tag, added internal link) — one row per finding, dated.

| Date | Page | Query | Position | CTR | Change made |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Review cadence

Monthly for the first 6 months post-launch, then quarterly — consistent with how slowly a newly-launched site's index coverage and rankings typically stabilize. Do not react to week-to-week fluctuations in a domain with no ranking history yet.
