# R8 Cutover Status

Real-world state snapshot as of **R8.1A (2026-09-10)**. Supersedes any
"future action" framing in `docs/r8-launch-runbook.md` for the phases
marked complete below — read this file first for current state, the
runbook for the step-by-step procedure.

## What's live right now

- **`main`** contains the full validated feature-branch state (merge
  commit `347c827`, merging `phase-r3-correction-visual-brand` @
  `9842d4b`). Pushed to `origin/main`.
- **Vercel Production deployment** `dpl_ZuJ6EZezCF8T76Xd2wuKyQj2ZteJ`
  is `READY`, built from `main` @ `347c827`, reachable at:
  - `https://dr-alejandro-molina.vercel.app`
  - `https://dr-alejandro-molina-alejandros-projects-55692fea.vercel.app`
  - `https://dr-alejandro-molina-git-main-alejandros-projects-55692fea.vercel.app`
- **The public domain (`dralejandromolinaurologist.com`) is NOT
  connected to this.** It still resolves exactly as before R8.1A (see
  "Current DNS state" below). No public traffic reaches the new site
  yet — the *.vercel.app URLs above are how to reach it directly today.

## What's NOT done (explicitly, per R8.1A's scope)

- Custom domain not added to the Vercel project.
- DNS not changed at the registrar.
- Google Search Console not touched.
- Google Business Profile not touched.

## Env verification (Production scope)

No tool available in any session working on this project can
enumerate Vercel environment variable names or scopes — confirmed
again in R8.1A (checked the full MCP tool surface and for a local
Vercel CLI; neither exists here). All four are **owner-confirmed
present** directly in the Vercel dashboard (not independently
verified by this session):

| Variable | Status |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | PRESENT (owner-confirmed) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | PRESENT (owner-confirmed) |
| `SUPABASE_SERVICE_ROLE_KEY` | PRESENT (owner-confirmed) |
| `ADMIN_ALLOWED_EMAILS` | PRESENT (owner-confirmed) |

No other required production env var exists — confirmed by grepping
every `process.env.*` reference in `src/` and `next.config.ts`.
(`NEXT_PUBLIC_SITE_URL` is optional/dev-only; `NODE_ENV`/`VERCEL` are
platform-managed.)

## Production smoke test (R8.1A)

Tested directly against `https://dr-alejandro-molina.vercel.app`:
`/`, `/about`, `/mens-health`, `/mens-health/vasectomy`,
`/erectile-dysfunction`, `/male-aesthetics/penile-girth-enhancement`,
`/penile-implant`, `/privacy`, `/terms`, `/admin` (→ redirects to
`/admin/login`, `noindex`), `/sitemap.xml`, `/robots.txt`. All correct
— no 500s, no broken images, correct `<link rel="canonical">` to
`https://dralejandromolinaurologist.com/...` on every page, sitemap
lists 44 canonical-domain URLs including the new vasectomy page with
zero `/admin` entries, robots.txt correct, no `AggregateRating`
anywhere.

`X-Robots-Tag: noindex` is currently present on this Production
deployment — **expected, not a defect.** `src/proxy.ts` applies it to
any request whose Host isn't the canonical production domain, and
every URL reachable right now is a `*.vercel.app` host, since the real
domain isn't connected. It will correctly stop appearing once the real
domain serves this deployment (Phase F/G in the runbook re-verifies
this).

## Production booking E2E test (R8.1A)

Real Supabase write against the live Production database (project
`wsgudfdifdqwacnbntbr`), using `r8-1a-production-cutover-test@example.invalid`:

- Lead created: `service_interest: "general_urology"`, `origin_page`
  captured correctly from the referring page, `status: "sent_to_nmc"`,
  `booking_clicked_at` populated.
- Redirected to exactly
  `https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina`.
- No `analytics_events` rows were created by this test — the
  cookie-consent banner was correctly never accepted during the test
  run, and `trackEvent()` gates on consent before posting to
  `/api/events`. This confirms the consent gate works correctly; it is
  not a bug and nothing needed cleanup there.
- **Cleanup confirmed:** test lead deleted
  (`DELETE FROM public.leads WHERE email = '...@example.invalid'`),
  re-queried — 0 matching rows remain. Database is back to its prior
  clean state.

## Admin auth (R8.1A)

`/admin` correctly redirects unauthenticated visitors to
`/admin/login` on the Production deployment (verified live). The login
form renders correctly and is `noindex, nofollow, nocache`. This
session has no admin credentials and did not request or use any —
**OWNER LOGIN REQUIRED FOR FINAL VISUAL AUTH CHECK** (confirming a real
sign-in reaches `/admin` and its dashboard renders correctly is a step
only the owner, or someone with the allow-listed email, can perform).

## Current DNS state (read-only lookup, 2026-09-10)

```
dralejandromolinaurologist.com.      A      185.127.128.75
www.dralejandromolinaurologist.com.  CNAME  dralejandromolinaurologist.com.
Nameservers: ns1-4.sagajean.com
Registrar: DonDominio (Soluciones Corporativas IP, SL)
```

`185.127.128.75` is the same LiteSpeed host documented in
`docs/r8-seo-migration.md` §1 as returning a server-level 404 for
every path — i.e., the domain currently points at dead/unconfigured
hosting, not anywhere that needs careful migration. This matches what
R8 already found; nothing has changed here since.

## DNS changes required — what's known vs. not yet knowable

**Not yet knowable from this session:** the *exact* A/ALIAS and CNAME
target values Vercel will require. No tool available here can add a
custom domain to a Vercel project or read back its verification
records — the only domain tools available are for purchasing a *new*
domain, not attaching an existing one. Vercel generates these values
per-project/per-domain in the dashboard at the moment the domain is
added (Phase D) — they must be read from there, not assumed. Do not
treat any value elsewhere in this repo's docs as confirmed for this
specific project until Phase D has actually been performed.

**What can be said in general** (Vercel's typical pattern for this
kind of setup, for planning purposes only — **verify against the
dashboard, do not act on this table directly**):

| Record | Typical Vercel requirement | Confirmed for this project? |
|---|---|---|
| Apex (`@`) | An `A` record to Vercel's anycast IP, or `ALIAS`/`ANAME` if the DNS provider supports it | NO — read from dashboard in Phase D |
| `www` | `CNAME` to a Vercel-provided target | NO — read from dashboard in Phase D |
| Verification | Vercel may request a `TXT` record if the domain needs ownership verification | NO — read from dashboard in Phase D |

**TTL recommendation:** lower the TTL on the apex/`www` records at the
DNS provider *before* cutover (e.g., to 300s) if the current TTL is
high, so a rollback (reverting DNS) would also propagate quickly. Raise
it back to a normal value (e.g., 3600s+) once the cutover has been
stable for a few days.

**Expected propagation:** minutes typically, up to 48 hours in rare
cases depending on resolver caching and the prior TTL — matches the
runbook's Phase E note.

**Rollback method:** see `docs/r8-launch-runbook.md`'s Rollback
section — reverting DNS is the correct rollback path *only* if the
decision is to move the domain away from Vercel entirely; rolling back
a bad deploy while staying on Vercel never requires touching DNS again
(promote a prior deployment instead).

## Next action awaiting owner approval

**R8.1B: DNS cutover.** Specifically:

1. Owner (or someone with registrar access at DonDominio) adds
   `dralejandromolinaurologist.com` and `www.dralejandromolinaurologist.com`
   to the Vercel project via the dashboard (Phase D) — this alone does
   not change public routing.
2. Vercel then displays the exact DNS records required.
3. Those records get applied at the DNS provider (Phase E) — **this is
   the step that actually redirects public traffic**, and is the step
   nothing in this session has performed or will perform without
   explicit owner sign-off.

Everything up to and including the current Production deployment is
done and verified. Nothing further proceeds without that sign-off.
