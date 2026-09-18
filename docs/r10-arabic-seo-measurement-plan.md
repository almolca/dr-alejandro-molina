# R10 — Arabic SEO Measurement Plan

Status: planning deliverable. This document defines what to measure, where to get it, and what counts as improvement — it does not contain live numbers. Wherever a metric requires Google Search Console (or another live data source) this session doesn't have access to, it is explicitly marked **BASELINE PENDING GSC DATA** rather than estimated or invented.

## 1. Why a baseline matters here specifically

R10 shipped real, measurable changes to indexable Arabic content: 4 title-tag changes, 2 new FAQ items, 1 breadcrumb fix on 2 pages, 1 terminology fix, a new 6-article Insights section (7 new indexable URLs — 6 articles + 1 hub), and several internal-link changes. A baseline captured *before* these changes went live (or as close to it as possible — see §6) is the only way to later tell whether they worked, as opposed to attributing normal month-to-month fluctuation to R10.

## 2. Metrics to track

All of these are Arabic-segment-only unless noted — i.e., filtered to pages under `/ar` (Search Console's page-path filter, or the "Pages" dimension filtered to `/ar`).

| Metric | Source | Definition for this site | Baseline |
|---|---|---|---|
| Arabic impressions | GSC Performance report, Pages filter `/ar/*` | Sum of impressions across all `/ar/*` URLs over the comparison window | **BASELINE PENDING GSC DATA** |
| Arabic clicks | GSC Performance report | Sum of clicks across all `/ar/*` URLs | **BASELINE PENDING GSC DATA** |
| Arabic CTR | GSC Performance report | Clicks ÷ impressions, Arabic segment | **BASELINE PENDING GSC DATA** |
| Arabic average position | GSC Performance report | Average position, Arabic segment | **BASELINE PENDING GSC DATA** |
| Top Arabic queries | GSC Performance report, Queries tab, filtered to `/ar/*` pages | Top 25 by impressions, then top 25 by clicks (two separate lists — a query can rank high on one and low on the other) | **BASELINE PENDING GSC DATA** |
| Top Arabic landing pages | GSC Performance report, Pages tab, filtered to `/ar/*` | Top 15 by clicks | **BASELINE PENDING GSC DATA** |
| Arabic `/book` visits | Analytics event log (`book_page_view` with `locale: "ar"` — see `src/lib/analytics/event-schema.ts`) | Count of `book_page_view` events where `locale === "ar"` | **BASELINE PENDING analytics export** (this one doesn't need GSC — it's already instrumented in this codebase; see §4) |
| Arabic NMC booking clicks | Analytics event log (`nmc_booking_click` with `locale: "ar"`) | Count of `nmc_booking_click` events where `locale === "ar"` | **BASELINE PENDING analytics export** |
| Arabic booking CTR | Derived | Arabic NMC booking clicks ÷ Arabic `/book` visits | **BASELINE PENDING analytics export** |

### On indexed-page count (a supporting metric, not in the brief's list but relevant to interpreting the above)

Track via GSC's Coverage/Indexing report, filtered to `/ar/*`: how many of the (now) 26 live Arabic URLs (19 pre-R10 pages + 1 hub + 6 articles) are actually indexed. A jump in impressions with no change in indexed-page count means existing pages are performing differently; a jump alongside a jump in indexed-page count means the new content itself is the driver — an important distinction when interpreting the after-window numbers.

## 3. Top Arabic queries and landing pages — what to watch for specifically

Beyond the raw top-25 lists, check post-launch data against the specific predictions this research made, since confirming or disproving them is more useful than the raw numbers alone:

- Does `/ar/erectile-dysfunction/penile-doppler` start appearing for `دوبلر القضيب أبوظبي` or similar — the cluster the research flagged as having the least direct local competition?
- Do any of the 4 pages with new `"...في أبوظبي"` titles (ED, Doppler, PE, Girth Enhancement) show impression or position movement on queries containing أبوظبي specifically, versus the bare procedure term?
- Do the 6 new Insights articles pick up impressions on their target long-tail queries (e.g., "الفرق بين الدعامة القابلة للنفخ والدعامة المرنة" for article #3), or mainly on the branded/navigational query for the article title itself? The former validates the content-gap thesis; the latter suggests the articles aren't yet earning independent search visibility.
- Does `/ar/insights` (the hub) or any individual article appear as a landing page at all, or is all Arabic Insights traffic currently arriving via internal links only (visible as zero organic landing-page traffic to `/ar/insights/*` despite nonzero pageviews)? This distinguishes "content exists and is being read via internal links" from "content is winning search visibility on its own," which are different signals requiring different next steps.

## 4. Where the non-GSC metrics actually come from in this codebase

`Arabic /book visits`, `Arabic NMC booking clicks`, and `Arabic booking CTR` don't require GSC — they're already instrumented:

- `src/lib/analytics/events.ts` and `event-schema.ts` define `book_page_view` and `nmc_booking_click` events, both of which carry a `locale` field (confirmed in the R9 booking-funnel-correction work — see `docs/superpowers/plans/2026-09-14-r9-booking-funnel-correction.md`).
- These events are sent to `/api/events` (`src/app/api/events/route.ts`) and, per the R9 work, on to whatever downstream analytics store the owner uses.
- **This document does not have access to that downstream store**, so these three metrics are marked pending an export from wherever that data actually lands (the owner's analytics dashboard/warehouse) — not pending GSC.

## 5. Comparison windows

- **Baseline window:** the 28 days immediately before this branch is merged to `main` and deployed to Production (not before this Preview — Preview deployments aren't indexed by Google and generate no real GSC data). Use a 28-day window, not a shorter one, to average out day-of-week variation, consistent with how GSC itself defaults its comparison tool.
- **Post-launch measurement windows:** check at three points, not just once — search/indexing changes don't land immediately:
  - **Day 14 post-deploy:** sanity check only — confirm new/changed URLs are indexed at all (via the Coverage report), not a performance judgment. Three of the R10 changes are entirely new URLs (`/ar/insights` + 6 articles) which need to be crawled and indexed before they can show impressions.
  - **Day 30 post-deploy:** first real comparison point — compare this 28-day window against the pre-deploy baseline window.
  - **Day 60–90 post-deploy:** confirmation point — title-tag and content changes on already-indexed pages can take longer than 30 days to fully reflect in average position, per Google's own guidance on re-crawl/re-rank latency.
- Compare like-for-like: 28-day window against 28-day window, same day-of-week alignment where possible (GSC's built-in "Compare" feature handles this automatically if used directly in the UI).

## 6. A note on baseline timing given work already happened on this branch

Because R10's on-page changes are already implemented on `feat/r10-arabic-seo-growth` (not yet merged or deployed to Production as of this document), the *true* pre-R10 baseline is: **Arabic performance data as it exists in GSC right now, before this branch merges** — i.e., capture it before merge, not before this document was written. If GSC data is pulled after Production deploy, the "baseline" window should be set to end on the actual Production deploy date, using GSC's historical data (GSC retains ~16 months), not an after-the-fact approximation.

## 7. What constitutes improvement

Given the realistic competitive picture this research established (§2 of `docs/r10-arabic-seo-research.md` — large hospital groups with high authority but shallow per-procedure content, aggressive multi-branch chains dominating generic terms, generic health portals owning bare informational queries), define improvement conservatively and specifically, not as "traffic went up":

- **Primary success signal:** Arabic clicks increase in the 30-day window vs. baseline, **driven by an increase in impressions for the specific long-tail/local query patterns this research targeted** (procedure + أبوظبي combinations, the FAQ-phrased informational queries, the 6 article topics) — not merely aggregate movement that could be seasonal or attributable to unrelated site changes.
- **Secondary success signal:** Arabic average position improves specifically on the P1 cluster queries (Cluster 2–3, 5–6, 10 in the keyword map) where this phase concentrated its on-page work, even before click volume moves — position improvement typically precedes click-volume improvement.
- **Funnel-level success signal:** Arabic booking CTR (NMC clicks ÷ `/book` visits) holds steady or improves alongside any traffic increase — a traffic increase with a falling booking CTR would suggest the new/changed pages are attracting a less-qualified audience than before, which is a warning sign, not a win, given the brief's stated goal is *qualified* organic visibility, not raw volume.
- **Content-specific success signal:** at least some of the 6 new Insights articles show nonzero organic impressions by day 30, and nonzero organic clicks by day 60 — distinguishing "the content exists and is technically indexed" from "the content is actually being found by the searches it targets."
- **What would NOT count as improvement on its own:** an increase in impressions/clicks for the homepage or brand-name queries alone, with no movement on the specific procedure/local clusters — that would suggest general brand growth unrelated to this specific SEO work, not validation of the R10 thesis.

## 8. Reporting cadence

Recommend a single consolidated check at each of the three post-launch windows in §5, not continuous monitoring — GSC data is inherently noisy at a daily grain for a site this size, and reacting to day-to-day fluctuation risks chasing noise rather than the 30/60/90-day trend this plan is built around.
