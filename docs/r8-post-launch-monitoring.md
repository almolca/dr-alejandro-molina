# R8.2 — Post-Launch Monitoring Plan

Created **R8.2 (2026-09-11)**, after the real-domain SEO/monitoring audit
against production commit `5683f645269a3a162d89ca9afbdcd3dfd5daa17a`
(`dpl_Eg4U4QqqmGzphMigiEva2fBVzscJ`). Read `docs/r8-cutover-status.md` for
the DNS-cutover-day state this supersedes and `docs/r8-seo-migration.md`
for the full legacy-redirect classification.

## How to check each item

- **Uptime / 5xx / runtime errors** — Vercel MCP `get_runtime_errors` and
  `get_runtime_logs` (`group_by: statusCode`) against project
  `prj_1gaYeuNCfwUdgwOhvY2vtwIqpJmH`, `environment: production`. Scope to
  `target: production` deployments only — this project also has preview
  deployments (e.g. feature branches) that legitimately lack the
  `SUPABASE_SERVICE_ROLE_KEY` env var and will show unrelated Supabase
  errors; do not treat those as production incidents.
- **DNS / HTTPS** — `dig @8.8.8.8 dralejandromolinaurologist.com A` should
  return `216.198.79.1`; `www` CNAME should resolve to
  `a6417a76ee0ba0fd.vercel-dns-017.com`; `mail` A and MX should stay on
  `185.127.128.75` / `mail.dralejandromolinaurologist.com`, unchanged.
  **Use a public resolver (8.8.8.8 / 1.1.1.1), not whatever resolver the
  checking machine defaults to** — this audit hit a local/ISP resolver on
  Alejandro's machine that returned a stale `185.127.128.75` for the apex
  while public resolvers already had the correct `216.198.79.1`; it's a
  local caching quirk, not a production DNS problem, but it will produce
  false "site is down" alarms if not accounted for.
- **Booking errors** — Vercel runtime logs filtered to `route: /book`
  and `source: serverless`; Supabase `public.leads` for `status` stuck
  at anything other than `sent_to_nmc` for longer than a session.
- **Admin errors** — Vercel runtime logs filtered to `route: /admin*`.
- **Sitemap / robots accessible** — `curl -I https://dralejandromolinaurologist.com/sitemap.xml`
  and `/robots.txt`, expect `200`.

## FIRST 24 HOURS

- [ ] Uptime — no sustained gap in `200` responses on `/`, `/book`.
- [ ] 5xx errors — `get_runtime_errors` since `24h`, production target only.
- [ ] DNS/HTTPS — apex `216.198.79.1`, www CNAME, cert valid, no chain warnings.
- [ ] Booking errors — no leads stuck pre-`sent_to_nmc`; no `/book` 5xx.
- [ ] Admin errors — `/admin` still redirects unauthenticated to `/admin/login`.
- [ ] Redirect failures — spot-check 3–4 legacy URLs from
      `src/lib/seo/legacy-redirects.ts` still 308 correctly.
- [ ] Email routing — `mail` A record and MX unchanged from
      `185.127.128.75` / `mail.dralejandromolinaurologist.com`.
- [ ] Sitemap accessible — `200`, `application/xml`.
- [ ] Robots accessible — `200`, no accidental `Disallow: /`.

## 72 HOURS

- [ ] Search Console — sitemap processing status (needs domain property
      verified first; see "Owner actions" below if not yet done).
- [ ] Indexing coverage — any new "Excluded" or "Error" pages reported.
- [ ] Top redirected legacy URLs — which `/en/...` / Spanish legacy paths
      Google is actually still crawling (Search Console → Links or
      Crawl stats), confirming the 308 map is being discovered.
- [ ] New 404s — Search Console coverage report or Vercel logs
      (`group_by: requestPath`, `statusCode: 404`).
- [ ] Page indexing anomalies — canonical selection mismatches, if any.
- [ ] Analytics funnel sanity — spot-check `public.analytics_events` for
      plausible volume (consent-gated, so low volume is expected and
      not itself a bug).
- [ ] Leads by source/page — `public.leads.first_touch_source` /
      `last_touch_source` distribution looks sane (no single unexplained
      spike in `"other"`).

## 7 DAYS

- [ ] Impressions/clicks — Search Console Performance report, first read.
- [ ] Indexed-page count — compare against the 44-URL sitemap baseline
      recorded in this audit (§3 of the R8.2 report).
- [ ] Legacy redirect discovery — growing count of legacy URLs Google
      has recrawled and updated in the index to the new destination.
- [ ] Top landing pages — which service pages are actually receiving
      organic entries.
- [ ] Google Business referral traffic — `last_touch_source =
      'google_business'` volume once the GBP website/appointment links
      are updated (see "Owner actions").
- [ ] Booking conversion — leads created vs. `sent_to_nmc` transitions.
- [ ] 404 trends — any recurring, non-legacy 404 worth a redirect.
- [ ] Unexpected crawl/indexing issues — Search Console coverage report.

## 30 DAYS

- [ ] SEO performance comparison — organic trend since launch.
- [ ] Highest-performing services/pages — by impressions/clicks and by
      lead volume; check flagship (Penile Girth Enhancement) is
      performing as expected for its authority-page role.
- [ ] Source performance — `leads` grouped by `first_touch_source`.
- [ ] Conversion rates — leads → `sent_to_nmc` by source and by page.
- [ ] Content gaps — search queries with impressions but no matching
      page (Search Console Performance → Queries).
- [ ] Next SEO priorities — informed by the above, not guessed upfront.

## Automated monitoring recommendation (§19)

No dedicated uptime/error vendor is currently wired in, and none is
needed yet. Vercel-native tooling already covers the real gaps:

- `get_runtime_errors` / `get_runtime_logs` (used throughout this audit)
  give error clustering and status-code breakdowns without adding
  infrastructure or another vendor script — consistent with the
  no-third-party-tracker constraint.
- Vercel's own platform already alerts on build failures and (on paid
  plans) can alert on elevated error rates; this project is on the
  Hobby plan, so if proactive (push, not pull) alerting is wanted,
  Vercel's paid-plan alerting or a lightweight external uptime check
  against `/` and `/api/events` would be the next step — evaluate only
  if a real incident is missed by manual checks, not preemptively.

**Recommendation: rely on the Vercel-native tools above for manual
checks at the cadence in this doc. Do not add a monitoring vendor
unless a real gap shows up.**
