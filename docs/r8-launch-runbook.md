# R8 Launch Runbook

Ordered procedure for cutting `phase-r3-correction-visual-brand` over to
production at `https://dralejandromolinaurologist.com`. **Every phase
below is a future action — none of it has been executed.** This
document is the plan; `docs/r8-seo-migration.md` is the audit that
justifies it.

Do not begin Phase B until the owner has reviewed
`docs/r8-seo-migration.md` and explicitly approved cutover.

---

## PHASE A — Pre-launch

Owner actions, all in Vercel's dashboard (no tool in this session can
perform these):

1. Confirm/set these four environment variables in the **Production**
   scope specifically (Preview having them does not carry over — see
   migration doc §14):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose)
   - `ADMIN_ALLOWED_EMAILS`
2. `NEXT_PUBLIC_SITE_URL` is not required post-R8 (canonical URLs now
   derive from a hardcoded production constant) — no action needed.
3. Confirm the Supabase Auth admin user still exists and its email is
   in `ADMIN_ALLOWED_EMAILS`.
4. Re-read `docs/r8-seo-migration.md` in full; confirm the redirect map
   and 410 list look correct with fresh eyes.
5. Confirm current Preview is `READY` (see this phase's final report
   for the URL/commit) and re-smoke-test `/book` end-to-end with a
   clearly fake test lead, exactly as done in R7.2.2 — this validates
   the *exact* commit about to become Production, not an earlier one.
   Delete the test lead/events afterward the same way.

## PHASE B — Merge to `main`

1. Open a PR from `phase-r3-correction-visual-brand` into `main`
   (`gh pr create`), title referencing R8, summary linking both R8
   docs.
2. Review the full diff one more time — this is the last checkpoint
   before anything touches the production branch.
3. Merge (do not squash-rewrite history unless that's this repo's norm
   — check recent `main` merge commits first).
4. Confirm `main`'s own Vercel deployment (if auto-triggered) builds
   `READY`. This deployment is still not Production traffic yet unless
   the domain is already attached to `main` — it was not, per this
   phase's constraints, so this is safe.

## PHASE C — Vercel Production deployment

1. From the Vercel dashboard, promote the `main`-branch deployment to
   Production (or trigger a new Production deployment from `main`).
2. Wait for `READY`.
3. **Do not** attach the custom domain yet — this step only makes the
   deployment reachable at its own `*.vercel.app` Production alias.
4. Smoke-test the Production `*.vercel.app` URL directly: `/`, `/book`
   (fake lead again, delete after), `/admin/login`, a couple of
   redirect sources from the map, a 410 path, `/sitemap.xml`,
   `/robots.txt`.

## PHASE D — Domain connection

1. In Vercel → Project → Domains, add
   `dralejandromolinaurologist.com` and
   `www.dralejandromolinaurologist.com`, pointed at the Production
   deployment.
2. Configure `www` → apex redirect at the Vercel domain level (not in
   application code — brief §4/§2 explicitly separates this).
3. Vercel will present the exact DNS records required (A/ALIAS for
   apex, CNAME for `www`) — copy them for Phase E. Do not change DNS
   yet in this step.

## PHASE E — DNS cutover

1. At the domain's DNS provider, update the records exactly as Vercel
   specified in Phase D.
2. DNS propagation can take minutes to (rarely) 48 hours depending on
   prior TTL — do not assume instant effect.
3. Do not delete/modify any other existing DNS records (MX/email, any
   other subdomains) unless specifically instructed — this cutover is
   scoped to the web-serving records only.

## PHASE F — HTTPS verification

1. Confirm Vercel shows a valid, auto-provisioned TLS certificate for
   both apex and `www` once DNS has propagated.
2. `curl -I https://dralejandromolinaurologist.com/` — confirm `HTTP/2
   200` (or the expected redirect for `www`) and the
   `Strict-Transport-Security` header is present.
3. Confirm `http://` (plain) requests redirect to `https://` (Vercel
   default behavior — verify, don't assume).

## PHASE G — Post-launch smoke test

Repeat the smoke test from Phase C, now against the real domain:

- `/`, `/about`, a few treatment pages, `/book` (fake lead, delete
  after), `/admin/login`, `/sitemap.xml`, `/robots.txt`.
- A representative sample of the redirect map (§2 of the migration
  doc) — confirm 308 + correct destination on the *real* domain.
- Both 410 paths.
- View source / inspect `<link rel="canonical">` on a few pages —
  confirm it now reads `https://dralejandromolinaurologist.com/...`
  (not a `*.vercel.app` URL).
- Confirm `X-Robots-Tag: noindex` is **absent** on the production
  domain (it should only ever appear on non-production hosts).

## PHASE H — Search Console

Follow `docs/r8-seo-migration.md` §13 in order: verify the domain
property, inspect key URLs, submit the sitemap, then begin monitoring.
This phase is ongoing (see Phase J), not a one-time action.

## PHASE I — Google Business update

Owner applies the configuration documented in
`docs/r8-seo-migration.md` §12 (Website URL, Appointment URL with
`utm_source=google_business`) directly in the Google Business Profile
dashboard. Not performed by this session, and not automatable — Google
Business has no API access configured for this project.

## PHASE J — Monitoring (24h / 72h / 7-day)

**24 hours:**
- Vercel deployment logs/runtime errors — any 500s?
- Spot-check 5–10 redirect sources and both 410s again — DNS/CDN edge
  caches sometimes serve a stale response briefly after cutover.
- Confirm at least one real (non-test) lead flows through correctly if
  organic traffic has already arrived, by checking `/admin/leads`.

**72 hours:**
- Google Search Console: confirm the sitemap was fetched successfully
  and crawl stats show activity.
- Check the **Pages** report for any unexpected "Not indexed" or
  "Redirect error" entries.
- Confirm no redirect loops surfaced in real traffic that weren't
  caught by `legacy-redirects.test.ts`'s synthetic checks.

**7 days:**
- Compare Search Console impressions for the legacy URLs (if any
  historical data remains from before the outage) against the new
  destination URLs — confirm ranking signal is transferring, not
  resetting.
- Review `/admin` dashboard funnel numbers for a first real read on
  production conversion.
- Decide, with the owner, whether HSTS `preload` submission (currently
  deliberately not enabled — migration doc §16) is warranted yet.

---

## Rollback

**Restoring the prior Vercel Production deployment:** Vercel keeps
every previous Production deployment; from the dashboard, select the
last-known-good deployment (the one live before this cutover, if any
was previously attached to this domain — see note below) and
"Promote to Production." This re-points the domain's traffic within
seconds, no DNS change required, since the domain alias moves to
whichever deployment is currently promoted.

**What happens to DNS:** Nothing — DNS was pointed at Vercel's
edge network in Phase E, not at a specific deployment. Rolling back a
Vercel deployment never requires touching DNS again. Only revert DNS
if the decision is to move the domain away from Vercel entirely
(not expected, and out of scope of a normal rollback).

**What NOT to roll back if the Supabase schema is already
compatible:** The `leads`/`analytics_events` schema and its migrations
(`supabase/migrations/0001`–`0005`) are additive/backward-compatible
by design (documented in `docs/patient-acquisition.md`) — rolling back
the *application* deployment does not require rolling back the
database. A previous app version reading/writing the current schema
will simply ignore columns it doesn't know about (e.g. `origin_page`)
rather than break. Only roll back the schema itself if a specific
migration is identified as the actual cause of an incident — not
reflexively alongside every app rollback.

**How to avoid redirect chaos during rollback:** If rolling back to a
deployment that predates this phase's redirect map, legacy URLs will
simply 404 again (their pre-R8 state) rather than error — this is a
regression, not a new failure mode, and is safe. Do not manually
re-add redirects on top of an old deployment; roll the deployment
forward again once the underlying issue is fixed instead of patching
an old version.

**Domain-specific note:** since this is the *first* production
cutover for this domain from this Vercel project (the domain was not
previously attached to any deployment of this project), "rollback" in
the traditional sense (revert to a prior Production deployment of
*this* domain) only becomes meaningful after Phase C's first
promotion. Before that point, "rollback" is simply: don't proceed to
Phase D/E.
