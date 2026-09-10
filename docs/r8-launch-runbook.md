# R8 Launch Runbook

Ordered procedure for cutting `phase-r3-correction-visual-brand` over to
production at `https://dralejandromolinaurologist.com`. This
document is the plan; `docs/r8-seo-migration.md` is the audit that
justifies it. See `docs/r8-cutover-status.md` for the current
real-world state snapshot.

**Status as of R8.1A (2026-09-10): Phases A–C complete. Application is
live in Production on Vercel's own domains. Phases D onward
(custom-domain connection and DNS cutover) are explicitly NOT executed
— stopped for owner approval per brief §11/§14, exactly as planned.**

Do not begin Phase D until the owner has explicitly approved DNS
cutover (R8.1B).

---

## PHASE A — Pre-launch — ✅ COMPLETE (R8.1A, 2026-09-10)

1. Production-scope env vars — **owner-confirmed present** in the
   Vercel dashboard directly (no tool in any session this project has
   used can enumerate Vercel env var names/scopes, so this was and
   remains an owner attestation, not an independent verification):
   - `NEXT_PUBLIC_SUPABASE_URL` — PRESENT (owner-confirmed)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — PRESENT (owner-confirmed)
   - `SUPABASE_SERVICE_ROLE_KEY` — PRESENT (owner-confirmed)
   - `ADMIN_ALLOWED_EMAILS` — PRESENT (owner-confirmed)
2. `NEXT_PUBLIC_SITE_URL` — confirmed not required (optional in the
   Zod env schema, dev-only fallback; canonical URLs derive from
   `process.env.VERCEL` in Production).
3. Supabase Auth admin user / `ADMIN_ALLOWED_EMAILS` — unchanged since
   R7.2, not independently re-verified this phase (no admin
   credentials available to this session; see Phase 8/PHASE C admin
   result below).
4. `docs/r8-seo-migration.md` re-read in full as part of R8.0.1–R8.0.3.
5. Feature branch re-verified clean immediately before merge:
   typecheck/lint/build/104 tests all pass; Preview (commit `9842d4b`)
   smoke-tested across every major route, every representative legacy
   redirect, and both intentional 404s (circumcision).

## PHASE B — Merge to `main` — ✅ COMPLETE (R8.1A, 2026-09-10)

1. No PR was opened — merged directly per this phase's explicit
   pre-authorization to merge `main` (brief §4 of R8.1A), since the
   owner had already reviewed and approved R8.0.1–R8.0.3 individually
   as they landed.
2. Full diff reviewed via `git log --graph` and file-level checks
   before merging (see `docs/r8-cutover-status.md`).
3. Merged with a normal (`--no-ff`) merge, preserving full development
   history — **not squashed**. Merge commit: `347c827`. Clean merge,
   zero conflicts.
4. Post-merge QA re-run on `main` itself: typecheck/lint/build/104
   tests all pass; `git diff --check` clean.
5. Pushed to `origin/main`.

## PHASE C — Vercel Production deployment — ✅ COMPLETE (R8.1A, 2026-09-10)

1. Vercel's GitHub integration auto-triggered the Production
   deployment from the `main` push (not a manual promotion of an
   unrelated Preview).
2. Deployment ID `dpl_ZuJ6EZezCF8T76Xd2wuKyQj2ZteJ`, commit `347c827`,
   `target: "production"`, `source: "git"` — reached `READY`.
3. Custom domain **not** attached — deployment is reachable only at
   its own Vercel-generated aliases (`dr-alejandro-molina.vercel.app`
   and others), exactly as planned.
4. Smoke-tested directly against `https://dr-alejandro-molina.vercel.app`:
   `/`, `/about`, `/mens-health`, `/mens-health/vasectomy`,
   `/erectile-dysfunction`, `/male-aesthetics/penile-girth-enhancement`,
   `/penile-implant`, `/privacy`, `/terms`, `/admin` (→ `/admin/login`,
   `noindex`), `/sitemap.xml` (44 URLs, all canonical-domain, includes
   the vasectomy page, no `/admin`), `/robots.txt` (correct). All
   passed — no 500s, no broken images, correct canonical domain on
   every page, no `AggregateRating`.
5. Booking E2E test performed with clearly fake data
   (`r8-1a-production-cutover-test@example.invalid`) — lead created
   correctly (`service_interest: general_urology`, `origin_page`
   captured correctly, `status: sent_to_nmc`, `booking_clicked_at`
   populated), redirected to exactly
   `https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina`.
   Test lead deleted immediately after; database confirmed back to a
   clean state (0 remaining test rows). No analytics events were
   created by this test (consent banner was correctly never accepted
   during the test, and `trackEvent()` correctly no-ops without
   consent) — confirms the consent gate works, not a defect.

## PHASE D — Domain connection — ⏸ NOT STARTED, awaiting owner approval

**Blocker found in R8.1A:** no tool available to this session can add
a custom domain to the Vercel project or read back the exact DNS
records (A/ALIAS, CNAME, TXT) Vercel would require — the only
domain-related tools available are for *purchasing a new domain*, not
attaching an existing one to a project. This is a manual Vercel
dashboard action only the owner (or someone with dashboard access) can
perform.

1. In Vercel → Project → Domains, add
   `dralejandromolinaurologist.com` and
   `www.dralejandromolinaurologist.com`, pointed at the Production
   deployment (`dpl_ZuJ6EZezCF8T76Xd2wuKyQj2ZteJ` or whichever is
   current Production at the time).
2. Configure `www` → apex redirect at the Vercel domain level (not in
   application code — brief §4/§2 explicitly separates this).
3. Vercel will present the exact DNS records required (A/ALIAS for
   apex, CNAME for `www`) in the dashboard at that time — copy them for
   Phase E from there, not from this document. **Do not invent or
   assume these values** — see `docs/r8-cutover-status.md` §"DNS
   changes required" for what's already known (current DNS state) vs.
   what can only come from Vercel once the domain is actually added.

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

**Domain-specific note:** since the custom domain is not attached yet
(Phase D not started as of R8.1A), "rollback" in the traditional sense
(revert to a prior Production deployment of *this* domain) is not yet
meaningful — no public traffic is being served by any Vercel
deployment of this project. If an issue is found in the current
Production deployment before Phase D, simply push a fix to `main`
(Vercel will auto-deploy) rather than rolling back.

**R8.1A rollback reference:** the Production-target deployment
immediately prior to R8.1A's merge was `dpl_EoFesVcaN4zQd93hojW6RgcLQSee`
(commit `34b6bde`, "chore: initial commit of existing site" —
main's pre-R6/R7/R8 baseline, marked `isRollbackCandidate: true` in
Vercel). This is the deployment to "Promote to Production" from if a
rollback is ever needed after Phase D attaches the domain — it
predates the entire R6–R8 body of work, so rolling back to it means
losing all of it (visual system, medical authority content, patient
acquisition, and the R8 redirect/SEO work), not a small step back.
Prefer forward-fixing on `main` over rolling back this far unless the
issue is severe and its cause isn't quickly identifiable.
