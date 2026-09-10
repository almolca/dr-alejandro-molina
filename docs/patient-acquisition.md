# Patient Acquisition, Attribution & Analytics (R7.2)

This document describes the owned lead-capture layer built in R7.2: the
funnel from a marketing page to the official NMC booking system, how
traffic sources are attributed, how behavioral analytics works, and
the private admin dashboard that reads all of it.

## 1. Architecture

```
Traffic source (Google, Instagram, Men's Health, Doctoralia, ...)
        │
        ▼
Marketing page  ──(page_view)──▶  analytics_events (Supabase)
        │
        ▼  BookingCta click
   book_cta_click ──▶  analytics_events
        │
        ▼
      /book  ──(book_page_view)──▶  analytics_events
        │
        ▼  "Continue to NMC Booking" click — ONE user action, ONE server action
   Server Action `createLead`:
     1. Zod-validate
     2. insert into leads (status=lead_created)
     3. immediately attempt: leads.status='sent_to_nmc', booking_clicked_at=now()
        (best-effort — never blocks the response, see §5/§6)
        │
        ▼  client fires lead_submit_success + nmc_booking_click, then redirects
   https://booking.nmc.ae/... (official NMC booking system)
```

**UX simplification (post-launch revision):** `/book` was originally a
two-step flow (submit → separate "Continue to NMC Booking" button). It
is now single-step: one click both creates the lead and attempts the
`sent_to_nmc` transition, server-side, before the client redirects. The
`lead_created`/`sent_to_nmc` **business states remain distinct** (§7);
only the *user-facing* step count changed. See §3 for why analytics
still counts two separate events despite the one click.

Two Postgres tables in one Supabase project (`dr-alejandro-molina`,
`wsgudfdifdqwacnbntbr`, `ap-south-1`) hold everything server-side data
this phase needs:

- **`leads`** — identified enquiries (name, email, optional discussion
  topic, attribution, status). Never readable/writable from the
  browser.
- **`analytics_events`** — anonymous behavioral events (page views, CTA
  clicks). Also never readable/writable from the browser.

The browser never talks to Supabase directly for either table. All
writes go **Browser → Server Action / Route Handler → Zod → service-role
Supabase client → DB**.

## 2. Analytics platform decision

**Decision: first-party Supabase `analytics_events` table**, not
PostHog, not Vercel Web Analytics, not GA4.

The brief's decision order was: (1) PostHog if justified, (2) Vercel
Web Analytics if sufficient, (3) a minimal first-party Supabase model
if clearly simpler and privacy-safe.

- PostHog would add a second external system whose funnel/journey data
  would then need to be cross-referenced against `leads` (which must
  live in Supabase regardless) to build the page-performance and
  source tables the dashboard requires — exactly the "unsafe joining
  of anonymous analytics identities to PII" the brief says to avoid.
- Vercel Web Analytics has no custom-event/funnel API suitable for this
  specific funnel, and no way to join against `leads`.
- A first-party Supabase table is already required for `leads`. Reusing
  the same Postgres database means the entire dashboard (KPIs, funnel,
  page/source/service breakdowns) is one set of SQL queries against one
  database — no second vendor, no extra script to consent-gate beyond
  what already existed (`ConsentBanner` / `hasAnalyticsConsent()`), and
  zero new runtime dependency beyond `@supabase/supabase-js` (already
  needed for leads).

This keeps exactly one behavioral-analytics system, as required.

## 3. Event names & payload shape

Defined in `src/lib/analytics/event-schema.ts` (server-validated,
`.strict()` — any extra/unlisted field is rejected outright, not just
avoided by convention) and `src/lib/analytics/events.ts` (client
contract):

| Event | Fires when |
|---|---|
| `page_view` | A marketing page mounts (once per pathname change) |
| `book_cta_click` | A `BookingCta` is clicked, before navigating to `/book` |
| `book_page_view` | `/book` mounts |
| `lead_submit_success` | `createLead` returns `{ ok: true }` |
| `lead_submit_error` | `createLead` returns `{ ok: false }` |
| `nmc_booking_click` | Fired by the client immediately after `lead_submit_success`, before the redirect |
| `physician_profile_click` | Pre-existing event, unchanged |

**`lead_submit_success` and `nmc_booking_click` now fire within the
same user action** (the single "Continue to NMC Booking" click) —
this is intentional, not a double-count bug. They represent two
distinct backend states (`lead_created` and the immediate best-effort
`sent_to_nmc` attempt, §7) that happen to both complete inside one
`createLead` call after the UX simplification (§1). Each event is
still emitted exactly once per click (no loop, no retry firing a
duplicate), so funnel counts (§4) stay accurate: a click that
successfully creates a lead always contributes exactly one
`lead_submit_success` and one `nmc_booking_click`, never two of either.

Allowed properties: `path`, `service_interest`, `source`, `utm_source`,
`utm_medium`, `utm_campaign`, `referrer_category`, plus an anonymous
`anonymous_session_id`. `service_interest` here is the *page-context*
value from `BookingCta`'s `?service=` link (fine-grained, e.g.
`erectile_dysfunction`) for `page_view`/`book_cta_click`/
`book_page_view`, or the patient's freely-chosen broad discussion
topic (e.g. `mens_sexual_health`, or absent) for
`lead_submit_success`/`nmc_booking_click` — see §6 for why these are
deliberately different enums. **No name, email, phone, or medical/
health field exists anywhere in this contract** — it is structurally
impossible to pass PII through it, not just a documented rule.

`trackEvent()` is consent-gated (`hasAnalyticsConsent()`, from the
existing `ConsentBanner`) and posts to `POST /api/events` with
`keepalive: true` so the request can outlive a page navigation (e.g.
the NMC redirect). It never throws into caller code.

## 4. Metric definitions

- **Page view**: one `page_view` event.
- **Book CTA click**: one `book_cta_click` event.
- **Lead**: one successful row in `leads` (`status` starts at
  `lead_created`).
- **NMC booking click**: one lead transitioning to `status =
  'sent_to_nmc'` (via `markSentToNmc`, timestamped in
  `booking_clicked_at`).
- **Conversion**: numerator / denominator for the selected time range
  (e.g. Book → Lead = `leads_created / book_cta_clicks` for the same
  window). Never computed across mismatched ranges.
- **Visitors** (Overview KPI): distinct `anonymous_session_id` values
  among `page_view` events in the range — a session-level proxy for
  unique visitors, not a persistent cross-session identity.

`sent_to_nmc` is **not** "booked." It only means the visitor clicked
through to NMC's own booking system; NMC's own system is the source of
truth for whether an appointment was actually made.

## 5. First-touch / last-touch attribution

Implemented in `src/proxy.ts` (Next.js 16's renamed `middleware.js`
convention) + `src/lib/attribution/{cookies,normalize-source}.ts`.

Two first-party cookies, `attr_first` and `attr_last`, each JSON:
`{ source, page, at }`. 180-day expiry, `httpOnly`, `sameSite=lax`, no
PII. Next.js's `NextResponse.cookies.set()`/`NextRequest.cookies.get()`
already URI-encode/decode the value once automatically — the cookie
helpers only handle JSON, not URI encoding, to avoid a redundant second
encoding layer (verified empirically against this Next 16 build).

**"Fresh entry" detection**: a request counts as a fresh marketing
touch when it carries a `utm_source`, or its `Referer` header points to
a different host than this site, or no `attr_first` cookie exists yet
(the visitor's very first request). On a fresh entry:

- `attr_first` is set **once**, only if it doesn't already exist —
  first-touch is permanent for the life of the cookie.
- `attr_last` is **always overwritten** on a fresh entry.

Pure internal navigation (clicking from the homepage to a treatment
page, no UTM, same-origin referer) does **not** update either cookie —
`attr_last` intentionally represents the most recent *marketing* touch,
not literally "the previous page visited." This is the standard
last-touch attribution model (matches how GA4/HubSpot-style tools
define it) and avoids "building a complex attribution engine," per the
brief's own constraint.

**`origin_page` — the actual "page before booking" signal.** The
`leads.referrer` field (raw `Referer` header, captured when the lead
form *POSTs*) turned out to always resolve to `/book` itself — that's
the page the POST request originates from, not the marketing page that
linked here. It's kept for backward compatibility/debugging but is not
a reliable origin signal. `origin_page` (added in the R7.2 UX/privacy
addendum) fixes this properly: `src/proxy.ts` captures the `Referer`
header at `/book`'s *initial GET* (when it's still the real previous
page, e.g. `/erectile-dysfunction`) into a short-lived, plain-path
cookie (`book_origin`, 30-minute expiry — just long enough to fill out
the form), which `createLead` reads at submission time. `origin_page`
is purely an attribution/analytics field — see §6 for why it is never
translated into a stored health topic.

### Source normalization (`normalize-source.ts`)

`utm_source` (when present) always wins over referrer-based inference.
Known mappings: `google_business`/`gbp`/`google-business` →
`google_business`; `google` with a campaign containing `gbp` →
`google_business`; bare `google` → `google_organic`; `instagram`/`ig` →
`instagram`; `mens_health`/`menshealth` → `mens_health`; `doctoralia` →
`doctoralia`; `top_doctors`/`topdoctors` → `top_doctors`; `nmc` → `nmc`;
`referral` → `referral`; anything else → `other`. Without a
`utm_source`: no referer or same-origin referer → `direct`; a
`google.*` referer → `google_organic`; `instagram.com` → `instagram`;
`doctoralia`/`topdoctors` domains → their platform; any other external
referer → `referral`.

## 6. Two separate "service" enums, deliberately

**`src/lib/domain/service-interest.ts` (fine-grained, page context).**
The original R7.2 enum (brief §6's canonical list, e.g.
`erectile_dysfunction`, `penile_girth`). Used only for `BookingCta`'s
`?service=` link/prefill context and page-level analytics properties
(`page_view`, `book_cta_click`, `book_page_view`). **Never written to
`leads`.**

**`src/lib/domain/discussion-topic.ts` (broad, patient-facing,
optional).** Added in the R7.2 UX/privacy addendum. `/book` is a
low-friction attribution gateway, not a diagnostic intake form — a
visitor must never be recorded as having a specific condition merely
because of which marketing page linked them to `/book`. The public
form's "What would you like to discuss? (optional)" field uses this
broader, 8-value set (e.g. `mens_sexual_health`, not
`erectile_dysfunction`) plus a UI-only "Prefer not to say" sentinel
that is **never sent to the server as a value** — the client deletes
the field from the submission entirely when it's chosen
(`BookingLeadForm.tsx`), so "declined" and "didn't answer" are both
represented the same way: absence, stored as `null`.
`mapServiceToDiscussionTopic()` maps the fine-grained page-context
value to the closest broad topic purely to *suggest* a convenience
default on the select — the visitor can always clear or change it
before submitting, and un-mapped values (e.g. `other`) intentionally
leave the field unprefilled rather than guessing.

This is stored in `leads.service_interest` (same DB column as before,
narrower value domain — `supabase/migrations/0004_optional_discussion_
topic_and_origin_page.sql`), nullable, DB-constrained via a `check`
constraint to the 8 broad values only. Treat it as potentially
sensitive health-adjacent information: it's patient-volunteered, never
inferred.

## 7. Lead schema & status flow

`public.leads` (see `supabase/migrations/0001_leads_and_analytics.sql`
for the base DDL, plus `0003`/`0004` for the UX-simplification
changes). Status values: `lead_created` → `sent_to_nmc` →
`{booked | attended | cancelled | not_booked}`. **Only the first two
transitions are automated**, and — since the UX simplification — both
happen inside the *same* `createLead` server action, in the same user
click: it inserts the lead at `lead_created`, then immediately
attempts the `sent_to_nmc` transition before returning. The remaining
statuses exist in the schema/check-constraint for forward compatibility
but nothing currently writes them — see §11 below.

Public form fields (final, post-simplification): full name, email,
optional discussion topic, required privacy consent. Phone, preferred
contact method, and marketing consent were removed from the public
form; their DB columns remain (nullable) for backward compatibility
with any pre-simplification leads rather than a destructive migration.

## 8. Security model

- RLS enabled on both `leads` and `analytics_events`, **zero policies**
  on either — default-deny for `anon`/`authenticated`. Only the
  service-role key (server-only, bypasses RLS) can read or write.
- `SUPABASE_SERVICE_ROLE_KEY` is a server-only env var, never
  `NEXT_PUBLIC_*`. Verified after every build that the string never
  appears in `.next/static/`.
- Five `SECURITY DEFINER` Postgres functions power the admin dashboard
  aggregates (`admin_overview_kpis`, `admin_funnel`,
  `admin_page_performance`, `admin_source_performance`,
  `admin_service_performance`), each `REVOKE`d from `public`/`anon`/
  `authenticated` and `GRANT`ed to `service_role` only.
- `leads` queries in `src/lib/admin/queries.ts` use an explicit column
  list, never `select("*")`, so the set of PII fields ever returned to
  a page stays auditable in one place.
- Anti-spam on `createLead`: a honeypot field (`company`, visually
  hidden, `tabIndex={-1}`) and a server-side timing guard (rejects
  submissions received less than 2 seconds after the form's `renderedAt`
  timestamp, which is captured client-side via a React lazy `useState`
  initializer — the sanctioned pattern for one-time non-deterministic
  render-time values under this repo's React Compiler lint rules).
- `markSentToNmc` never throws — on any DB failure it resolves
  `{ ok: false }`, and the client always redirects to the real NMC URL
  from a `finally` block regardless. Booking UX takes priority over
  analytics completeness (brief §21).

## 9. Admin authentication & authorization

- Supabase Auth (email/password), via `@supabase/ssr`'s cookie-bound
  server client (`src/lib/supabase/admin-auth-client.ts`).
- Authorization is a simple server-side email allowlist
  (`ADMIN_ALLOWED_EMAILS`, comma-separated, case-insensitive) checked
  in `src/lib/auth/admin.ts` — proportionate for a single-owner MVP,
  not a roles table.
- The guard lives in `src/app/admin/(protected)/layout.tsx` (a Next.js
  route group), not the outer `src/app/admin/layout.tsx` — this keeps
  `/admin/login` itself outside the guard, avoiding a redirect loop,
  while every other `/admin/*` route is covered.
- `/admin` is `disallow`ed in `robots.ts`; every admin page sets
  `robots: { index: false, follow: false, nocache: true }`; the
  protected layout is `force-dynamic` (never statically cached).

**Owner setup**: create a Supabase Auth user (Supabase dashboard →
Authentication → Users → Add user) with your email/password, then set
`ADMIN_ALLOWED_EMAILS` to that email in Vercel's environment variables.

## 10. Dashboard routes & metrics

| Route | Shows |
|---|---|
| `/admin` | Overview KPIs (visitors, page views, Book CTA clicks, leads, NMC clicks) + funnel |
| `/admin/pages` | Views/Book-clicks per page (leads/NMC-clicks not derivable per page — see limitation below) |
| `/admin/sources` | Sessions/Book-clicks/Leads/NMC-clicks per normalized source, with conversion % |
| `/admin/services` | Leads/NMC-clicks per discussion topic, with conversion % |
| `/admin/leads` | Paginated, filterable (status, service, date range) read-only leads table |
| `/admin/leads/[id]` | Full lead detail: contact, attribution, consent, status timestamps |

All support `?range=7d|30d|90d` (default `30d`) or `?from=&to=`, driven
entirely by the URL (no client-side state) so a dashboard link is
shareable/reloadable. No fabricated data — an empty range renders "No
data yet for this range," never placeholder numbers.

### Known limitation: page-level lead/NMC-click counts

`admin_page_performance` cannot attribute a lead or NMC click to a
specific marketing page. `leads.origin_page` (§5) now captures the
actual referring page reliably, but `admin_page_performance` aggregates
`analytics_events.path` (anonymous, pre-identification) — joining an
identified lead's `origin_page` into that anonymous aggregate would be
exactly the "unsafe joining of anonymous analytics identities to PII"
the brief tells us to avoid (§45). Faking the join instead was rejected
as inconsistent with "do not show fake data" (§27). Use
`/admin/sources` and `/admin/services` for lead-level breakdowns
instead, or open individual leads (`/admin/leads/[id]`) to see each
one's `origin_page`.

## 11. Future booked/attended workflow

Not automated this phase, per brief §42/§43. Options for later:

- **Manual admin status update**: extend `/admin/leads/[id]` with a
  server-action-backed status dropdown (`booked`/`attended`/`cancelled`/
  `not_booked`), authenticated + audited the same way the `sent_to_nmc`
  transition is today. Deliberately deferred to keep this phase's
  admin surface read-only, per brief §33/§43.
- **CSV reconciliation**: the practice periodically exports a booked-
  patient list from NMC (or receives one) and an admin script/route
  matches by email/phone to update `leads.status`.
- **Hospital report import**: if NMC ever offers a structured export/
  API, ingest it the same way.

Explicitly **not** planned: scraping NMC's booking confirmation pages,
or any unofficial NMC API integration (brief §42/§56).

## 12. Source of truth per metric

| Data | Owned by |
|---|---|
| Traffic / page views / CTA clicks | `analytics_events` (Supabase) |
| Lead identity (name, email, phone, service) | `leads` (Supabase) |
| "Sent to NMC" | `leads.status`/`booking_clicked_at` (authoritative) + a matching `nmc_booking_click` analytics event (best-effort, may under-count if the browser tab closes before the event posts) |
| Actual appointment booked/attended | NMC's own system — not tracked here yet, see §11 |

## 13. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://wsgudfdifdqwacnbntbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable/anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role secret — server-only, never commit>
ADMIN_ALLOWED_EMAILS=<comma-separated admin emails>
```

Set in Vercel per environment (development/preview/production) — the
service-role key and admin allowlist are **not** committed anywhere in
this repo (`.env.local` is gitignored).

## 14. Supabase project & migrations

Project: `dr-alejandro-molina` (`wsgudfdifdqwacnbntbr`, `ap-south-1`,
free tier), created this phase under the same Supabase organization as
the account's other projects.

Migrations live in `supabase/migrations/`, applied via the Supabase
MCP `apply_migration` tool (no local Supabase CLI/Docker in this
environment). To apply them elsewhere (e.g. a future staging project),
either replay the same MCP call or, with the Supabase CLI installed,
`supabase db push` against the target project after `supabase link`.

- `0001_leads_and_analytics.sql` — both tables, RLS, indexes, the five
  admin RPCs.
- `0002_fix_set_updated_at_search_path.sql` — pins `search_path` on the
  `updated_at` trigger function (flagged by Supabase's security
  advisor as a mutable-search-path function; fixed same session).
- `0003_make_phone_optional.sql` — UX simplification: `phone` relaxed
  to nullable (public form no longer collects it; non-destructive,
  table had 0 rows).
- `0004_optional_discussion_topic_and_origin_page.sql` — UX/privacy
  addendum: `service_interest` relaxed to nullable with its check
  constraint swapped to the new broad 8-value discussion-topic enum
  (§6); new nullable `origin_page` column + index (§5).
- `0005_fix_null_service_interest_join.sql` — bug fix (R7.2.2):
  `admin_service_performance`'s `full outer join ... using
  (service_interest)` never merged two NULL groups (standard SQL never
  matches NULL = NULL, including in a `USING` join), so leads with no
  discussion topic showed as two separate "Not specified" rows in
  `/admin/services` instead of one. Fixed by coalescing NULL to a
  sentinel before the join and converting back via `nullif` after —
  the same pattern `admin_source_performance` already used correctly.
  `admin_page_performance` was never affected (joins on the NOT NULL
  `path` column).
