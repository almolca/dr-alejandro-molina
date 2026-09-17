# R9 Booking Funnel Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current mandatory-lead-form booking flow (`/book` → name/email/topic form → lead insert → NMC redirect) with a low-friction direct handoff (`/book` → single CTA → NMC), in both English and a newly-built Arabic (`/ar/book`), while preserving all first-party analytics/attribution measurement, preserving 100% of historical lead data, and fixing a real pre-existing bug this change would otherwise make worse: the `nmc_booking_clicks` KPI/funnel/source-breakdown metrics currently read from `leads.status = 'sent_to_nmc'`, which will read as permanently zero the moment the public flow stops creating leads.

**Architecture:** Three layers change together: (1) a new, additive Supabase migration adds an `origin_page` column to `analytics_events` and fixes four admin RPC functions to compute `nmc_booking_clicks` from `analytics_events` (the event that will keep firing) instead of `leads` (which will stop being written); (2) `/api/events` becomes attribution-aware, reading the existing `attr_last`/`book_origin` httpOnly cookies server-side (the client cannot read httpOnly cookies, so this cannot move client-side) to enrich every event with `origin_page`/`source` without any new client-supplied field; (3) both `/book` (rebuilt) and `/ar/book` (new) render a single direct-handoff CTA — a real anchor to the existing `practice.bookingUrl`, so navigation works even if JavaScript or analytics consent fails, exactly matching the existing `BookingCta` component's own progressive-enhancement pattern. `BookingCta` itself (the site-wide "Book a Consultation" button used on ~50+ pages) needs no behavior change beyond becoming locale-aware (routing Arabic pages to `/ar/book` instead of `/book`) — it already always pointed at `/book`, never at the form directly.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Supabase (Postgres, SECURITY DEFINER RPCs), Zod, Vitest.

**Spec:** The owner's "R9 BOOKING FUNNEL CORRECTION" message (2026-09-14) — reproduced in relevant part inline in each task below; no separate spec file exists for this correction, so this plan itself is the authoritative record of what was requested and why.

## Global Constraints

- Work happens in the existing worktree `.worktrees/feat-arabic-localization-r9-phase-b`, branch `feat/arabic-localization-r9-phase-b`. No new worktree, no new branch. All of R9 Phase B Batches 1–3 plus the post-Batch-2 terminology fix are already committed on this branch; `npm run typecheck`/`lint`/`test`/`build` all pass clean at the start of this plan — verified directly before writing it.
- **No merge to `main`. No Production deploy. No Preview deploy.** Explicit owner instruction, carried forward unchanged.
- **Do not begin Batch 4's Arabic localization work (`/ar/book` as a *translation* target, booking-related privacy localization) until this correction is complete** — this plan's Task 8 IS the real `/ar/book`, built directly to the new low-friction spec; there is no old-form version to translate.
- **Database safety (binding, from the owner's exact list):** do NOT drop the `leads` table, delete existing rows, reset Supabase, remove admin lead history, modify production data, weaken RLS, expose service-role keys, or add third-party analytics. Every migration in this plan is additive only (`alter table ... add column`, `create or replace function` with an unchanged return signature) — never a `drop table`, `drop column`, or `truncate`.
- **This plan creates a new Supabase migration file but does NOT apply it to any live database.** Applying a migration to a Supabase project this session cannot fully characterize as staging-vs-production is exactly the kind of hard-to-reverse, shared-system action that needs the owner's own hand on it (via `supabase db push`, the Supabase dashboard's SQL editor, or their existing CI/CD migration step) — Task 1 delivers a correct, reviewed migration file; it is not run here.
- **No PII added to `analytics_events`, ever.** The new `origin_page` column stores a page *path* (e.g. `/erectile-dysfunction`), never a name/email/free-text field — same non-PII-by-construction guarantee the existing schema already has for every other column.
- **Booking must never depend on analytics consent.** The final CTA to NMC on both `/book` and `/ar/book` is a real `<a>`/`<Link>` with `href` set to the actual NMC URL — clicking it navigates via native browser behavior regardless of whether `trackEvent()`'s consent check passes, fails, or never runs at all (JS disabled, script error, etc.). Every task touching this CTA must preserve this property and a reviewer must be able to verify it by reading the JSX, not by trusting a comment.
- **No lead creation from the public flow, but no deletion of historical lead-handling code where it's still needed.** `discussion-topic.ts`'s `discussionTopicLabel`/`DISCUSSION_TOPICS` exports stay (three admin pages display historical leads' stored topics); `service-interest.ts` stays in full (still used by the rebuilt `/book` page's `?service=` handling and by `BookPageViewTracker`). Only code whose *sole* purpose was the public lead-capture form itself is removed (Task 6).
- **EN/AR parity, established-pattern conventions.** `/ar/book` follows every convention already established in Batches 1–3 of this branch: `buildMetadata` with self-canonical + automatic reciprocal hreflang (via `arPath` in `routes.ts`), `AR_IDENTITY`/`AR_REPUTATION` reuse for any shared identity/reputation string, no `AmpersandText` (Arabic has no `&`), no `tracking-widest`/`tracking-[0.2em]` on Arabic text, explicit Arabic text at every CTA (never relying on an English default).
- No new unit tests for pure presentational structure (matches the established convention) — but this correction is behavior-changing, safety-relevant code (a booking funnel, PII removal, analytics), so every task below that touches logic (not just markup) specifies real tests, per the owner's explicit 15-point test list. Verification is `npm run typecheck` + `npm run lint` + `npm run test` + `npm run build` + `git diff --check`, run in full at the end (Task 12) and incrementally per task.

---

### Task 1: Additive Supabase migration — `origin_page` column + fix `nmc_booking_clicks` to read from `analytics_events`

**The bug this fixes, found during pre-plan investigation (not something the owner's spec described directly, but a direct and severe consequence of it):** `admin_overview_kpis` and `admin_funnel` (in `supabase/migrations/0001_leads_and_analytics.sql`) currently compute `nmc_booking_clicks` as `select count(*) from leads where status = 'sent_to_nmc' and booking_clicked_at >= start_at and booking_clicked_at < end_at` — i.e., from the **leads table**, not from the `nmc_booking_click` **analytics event** that also already exists and will keep firing after this correction. The moment the public flow stops creating leads (Task 5), this KPI silently reads as zero forever, for all new traffic, even though the event that's supposed to represent exactly this metric keeps firing correctly. `admin_source_performance` and `admin_service_performance` have the same `leads`-table dependency for their `nmc_clicks` columns. This task fixes all four functions to read from `analytics_events` instead, and adds the column needed to make page-level attribution (the owner's "Booking clicks by origin page" suggested metric) actually meaningful, which the existing `admin_page_performance` function currently cannot do at all (it hardcodes `0::bigint as leads, 0::bigint as nmc_clicks` with a code comment explaining leads can't be page-attributed under the current schema — this task removes that limitation for the metric that matters most going forward, `nmc_clicks`).

**Files:**
- Create: `supabase/migrations/0007_booking_funnel_origin_page_and_nmc_click_fix.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 0007_booking_funnel_origin_page_and_nmc_click_fix.sql
-- R9 booking funnel correction — additive only, no drops, no data changes.
--
-- Context: /book is being rebuilt as a direct low-friction handoff to
-- NMC (no lead-capture form). The public flow will stop inserting into
-- `leads` entirely (see book/actions.ts removal in the same overall
-- change). `nmc_booking_click` and `book_page_view` analytics events
-- already exist and will keep firing from the rebuilt page — this
-- migration re-points the four admin RPCs that currently read
-- NMC-click data from `leads.status = 'sent_to_nmc'` (which will go to
-- zero for all new traffic once leads stop being created) to read from
-- `analytics_events` instead, and adds `origin_page` so page-level
-- attribution of booking clicks (previously impossible — see the old
-- admin_page_performance comment this replaces) becomes real.
--
-- `leads`/`leads_created`-derived metrics are left untouched everywhere
-- they appear (they remain accurate for describing HISTORICAL lead
-- volume) — only the columns that specifically purport to measure "an
-- NMC booking click happened" move to their correct source.

-- ============================================================
-- New column: origin_page on analytics_events
-- ============================================================
-- Nullable, additive. Populated server-side (see the /api/events route
-- change in the same overall correction) from the existing `book_origin`
-- httpOnly cookie — never client-supplied, never PII (a page path only,
-- e.g. "/erectile-dysfunction", the same shape already stored on
-- `leads.origin_page` today).
alter table public.analytics_events
  add column if not exists origin_page text;

create index if not exists analytics_events_origin_page_idx
  on public.analytics_events (origin_page);

-- ============================================================
-- admin_overview_kpis — nmc_booking_clicks now from analytics_events
-- ============================================================
-- Return signature is UNCHANGED (visitors, page_views, book_cta_clicks,
-- leads_created, nmc_booking_clicks) — CREATE OR REPLACE is safe here
-- because the column list/types are identical to 0001's definition.
create or replace function public.admin_overview_kpis(start_at timestamptz, end_at timestamptz)
returns table (
  visitors bigint,
  page_views bigint,
  book_cta_clicks bigint,
  leads_created bigint,
  nmc_booking_clicks bigint
)
language sql security definer set search_path = public as $$
  select
    (select count(distinct anonymous_session_id) from analytics_events
       where event_name = 'page_view' and created_at >= start_at and created_at < end_at),
    (select count(*) from analytics_events
       where event_name = 'page_view' and created_at >= start_at and created_at < end_at),
    (select count(*) from analytics_events
       where event_name = 'book_cta_click' and created_at >= start_at and created_at < end_at),
    (select count(*) from leads
       where created_at >= start_at and created_at < end_at),
    (select count(*) from analytics_events
       where event_name = 'nmc_booking_click' and created_at >= start_at and created_at < end_at);
$$;

-- ============================================================
-- admin_funnel — same nmc_booking_clicks fix
-- ============================================================
create or replace function public.admin_funnel(start_at timestamptz, end_at timestamptz)
returns table (
  visits bigint,
  book_cta_clicks bigint,
  book_page_views bigint,
  leads_created bigint,
  nmc_booking_clicks bigint
)
language sql security definer set search_path = public as $$
  select
    (select count(*) from analytics_events where event_name = 'page_view' and created_at >= start_at and created_at < end_at),
    (select count(*) from analytics_events where event_name = 'book_cta_click' and created_at >= start_at and created_at < end_at),
    (select count(*) from analytics_events where event_name = 'book_page_view' and created_at >= start_at and created_at < end_at),
    (select count(*) from leads where created_at >= start_at and created_at < end_at),
    (select count(*) from analytics_events where event_name = 'nmc_booking_click' and created_at >= start_at and created_at < end_at);
$$;

-- ============================================================
-- admin_page_performance — nmc_clicks now real, via origin_page
-- ============================================================
-- `leads` stays 0::bigint (still not page-attributable — a lead's
-- origin_page reflects the referer at /book's GET, same limitation as
-- before, and no new leads exist to attribute going forward anyway).
-- `nmc_clicks` becomes real: grouped by the analytics event's
-- origin_page, which is the actual marketing page a booking click is
-- attributable to.
create or replace function public.admin_page_performance(start_at timestamptz, end_at timestamptz)
returns table (
  path text,
  views bigint,
  book_clicks bigint,
  leads bigint,
  nmc_clicks bigint
)
language sql security definer set search_path = public as $$
  with page_views as (
    select path, count(*) c from analytics_events
    where event_name = 'page_view' and created_at >= start_at and created_at < end_at
    group by path
  ),
  clicks as (
    select path, count(*) c from analytics_events
    where event_name = 'book_cta_click' and created_at >= start_at and created_at < end_at
    group by path
  ),
  nmc_by_origin as (
    select origin_page as path, count(*) c from analytics_events
    where event_name = 'nmc_booking_click'
      and origin_page is not null
      and created_at >= start_at and created_at < end_at
    group by origin_page
  )
  select
    coalesce(v.path, c.path, n.path) as path,
    coalesce(v.c, 0) as views,
    coalesce(c.c, 0) as book_clicks,
    0::bigint as leads,
    coalesce(n.c, 0) as nmc_clicks
  from page_views v
  full outer join clicks c on c.path = v.path
  full outer join nmc_by_origin n on n.path = coalesce(v.path, c.path)
  order by coalesce(v.c, 0) desc;
$$;

-- ============================================================
-- admin_source_performance — nmc_clicks now from analytics_events
-- ============================================================
-- `leads` column stays sourced from `leads.last_touch_source` (still
-- accurate for describing historical lead volume by source). `nmc_clicks`
-- now comes from analytics_events' `source` column (populated server-side
-- from the attr_last cookie — see the /api/events route change), so it
-- keeps working once leads stop being created.
create or replace function public.admin_source_performance(start_at timestamptz, end_at timestamptz)
returns table (
  source text,
  sessions bigint,
  book_clicks bigint,
  leads bigint,
  nmc_clicks bigint
)
language sql security definer set search_path = public as $$
  with sessions as (
    select coalesce(source, 'other') as source, count(distinct anonymous_session_id) c
    from analytics_events
    where event_name = 'page_view' and created_at >= start_at and created_at < end_at
    group by 1
  ),
  clicks as (
    select coalesce(source, 'other') as source, count(*) c
    from analytics_events
    where event_name = 'book_cta_click' and created_at >= start_at and created_at < end_at
    group by 1
  ),
  lead_rows as (
    select coalesce(last_touch_source, 'other') as source, count(*) c
    from leads
    where created_at >= start_at and created_at < end_at
    group by 1
  ),
  nmc_rows as (
    select coalesce(source, 'other') as source, count(*) c
    from analytics_events
    where event_name = 'nmc_booking_click' and created_at >= start_at and created_at < end_at
    group by 1
  )
  select
    coalesce(s.source, c.source, l.source, n.source) as source,
    coalesce(s.c, 0), coalesce(c.c, 0), coalesce(l.c, 0), coalesce(n.c, 0)
  from sessions s
  full outer join clicks c using (source)
  full outer join lead_rows l using (source)
  full outer join nmc_rows n using (source)
  order by coalesce(n.c, 0) desc;
$$;

-- admin_service_performance is intentionally left unchanged: both its
-- columns are lead-derived by design (service_interest is a
-- lead-only/historical concept — the rebuilt /book page has no
-- discussion-topic field), so this function now describes purely
-- historical data, which is accurate, not broken.

revoke execute on function public.admin_overview_kpis(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_funnel(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_page_performance(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_source_performance(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.admin_overview_kpis(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_funnel(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_page_performance(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_source_performance(timestamptz, timestamptz) to service_role;
```

- [ ] **Step 2: Verify**

This is a SQL file with no live database to run it against in this session (see Global Constraints — it is deliberately not applied here). Verify by careful re-reading against `0001_leads_and_analytics.sql`: confirm every function's `returns table (...)` column list/types are byte-identical to the original (a changed signature would make `CREATE OR REPLACE FUNCTION` fail outright, which is the real safety check here — if the shapes don't match, Postgres itself will reject it at apply-time), confirm no `drop`/`truncate`/`delete` statement appears anywhere in the file, confirm the new column is `add column if not exists` (idempotent, safe to re-run).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0007_booking_funnel_origin_page_and_nmc_click_fix.sql
git commit -m "$(cat <<'EOF'
feat(booking): add analytics_events.origin_page; fix nmc_booking_clicks to read from analytics_events

Found during the booking-funnel correction: admin_overview_kpis and
admin_funnel compute nmc_booking_clicks from leads.status =
'sent_to_nmc', which goes to zero forever once the public /book flow
stops creating leads (this same change). Re-points all four affected
RPCs at the nmc_booking_click analytics event instead, which will keep
firing from the rebuilt page. Adds origin_page (nullable, non-PII) so
admin_page_performance's nmc_clicks — previously hardcoded to 0 with a
comment explaining leads couldn't be page-attributed — becomes real.

Purely additive: no dropped columns, no changed function signatures,
no deleted data. Not applied to any live database in this change —
the migration file is the deliverable; applying it is the owner's own
deploy step.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Test utility — React element-tree walker

**Why this exists:** `vitest.config.ts` restricts test collection to `src/**/*.test.ts` (not `.tsx`) and runs with `environment: "node"` — there is no jsdom/`@testing-library/react` in this repo, and every existing test (`actions.test.ts`, `events.test.ts`, `routes.test.ts`) is a pure-logic `.test.ts` file. Several tasks below need to assert structural facts about JSX ("this page renders no `<form>`", "this button's `href` is the real NMC URL") without a render pipeline. Calling a Server Component (or any hooks-free function component) directly as a plain function returns the same plain-object element tree JSX always compiles to (`{ type, props }`); this utility walks that tree. It only works for components that don't call React hooks (Server Components, and any plain client component written without `useState`/`useEffect`/`usePathname`/etc.) — later tasks are written with this constraint in mind.

**Files:**
- Create: `src/lib/test-utils/react-element.ts`
- Test: `src/lib/test-utils/react-element.test.ts`

**Interfaces:**
- Produces: `findAll(node: ReactNode, predicate: (el: ReactElement) => boolean): ReactElement[]` — used by every task below that inspects a page or component's returned tree.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/test-utils/react-element.test.ts
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { findAll } from "./react-element";

function Leaf({ label }: { label: string }) {
  return createElement("span", { "data-label": label });
}

describe("findAll", () => {
  it("finds a host element by string type at the top level", () => {
    const tree = createElement("form", null, createElement("input", { name: "x" }));
    expect(findAll(tree, (el) => el.type === "form")).toHaveLength(1);
    expect(findAll(tree, (el) => el.type === "input")).toHaveLength(1);
  });

  it("recurses into an array of children", () => {
    const tree = createElement(
      "div",
      null,
      createElement("a", { href: "/one" }),
      createElement("a", { href: "/two" }),
    );
    const anchors = findAll(tree, (el) => el.type === "a");
    expect(anchors.map((a) => a.props.href)).toEqual(["/one", "/two"]);
  });

  it("matches by component function reference, not just host element strings", () => {
    const tree = createElement("div", null, createElement(Leaf, { label: "hi" }));
    const leaves = findAll(tree, (el) => el.type === Leaf);
    expect(leaves).toHaveLength(1);
    expect(leaves[0].props.label).toBe("hi");
  });

  it("does not descend into an unrendered component's own children (it has none until called)", () => {
    const tree = createElement(Leaf, { label: "hi" });
    expect(findAll(tree, (el) => el.type === "span")).toHaveLength(0);
  });

  it("returns an empty array for a tree with no matches, and ignores plain string children", () => {
    const tree = createElement("p", null, "just text");
    expect(findAll(tree, (el) => el.type === "form")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/test-utils/react-element.test.ts`
Expected: FAIL — `Cannot find module './react-element'`

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/test-utils/react-element.ts
import type { ReactElement, ReactNode } from "react";

/**
 * Structural test helper for this repo's node-only, non-jsdom vitest
 * setup (see vitest.config.ts — `*.test.ts` only, `environment: "node"`).
 * Calling a hooks-free component function directly (a Server Component,
 * or a plain client component) returns the same `{ type, props }` tree
 * JSX always compiles to, with zero rendering pipeline involved. This
 * walks that tree looking for elements matching `predicate` — it never
 * calls into a nested component (that would require re-invoking it,
 * which is unsafe for anything using hooks), so a match must already
 * exist as a literal element in the tree being walked.
 */
function isReactElement(node: ReactNode): node is ReactElement {
  return typeof node === "object" && node !== null && "type" in node && "props" in node;
}

export function findAll(
  node: ReactNode,
  predicate: (el: ReactElement) => boolean,
  found: ReactElement[] = [],
): ReactElement[] {
  if (Array.isArray(node)) {
    for (const child of node) findAll(child, predicate, found);
    return found;
  }
  if (!isReactElement(node)) return found;
  if (predicate(node)) found.push(node);
  const children = (node.props as { children?: ReactNode }).children;
  if (children !== undefined) findAll(children, predicate, found);
  return found;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/test-utils/react-element.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/test-utils/react-element.ts src/lib/test-utils/react-element.test.ts
git commit -m "$(cat <<'EOF'
test: add React element-tree walker for structural JSX assertions

This repo's vitest setup collects only *.test.ts (no jsdom, no
@testing-library/react — see vitest.config.ts). The booking funnel
correction needs to assert structural facts about the rebuilt /book
pages (no form, correct CTA href) without a render pipeline; this
walks the plain-object element tree a hooks-free component function
already returns when called directly.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `/api/events` — server-side attribution enrichment (`origin_page`, `source` fallback)

**Context:** `trackEvent()` (`src/lib/analytics/events.ts`) never sends a `source` for `nmc_booking_click`/`book_cta_click`/`physician_profile_click` — `BookingClickProperties` has no `source` field, only `FunnelEventProperties` does. And no event ever sends `origin_page` — the client cannot read the httpOnly `attr_last`/`book_origin` cookies at all (that's the point of `httpOnly`). Both signals already exist server-side, in the same cookies `src/proxy.ts` sets. This task backfills both from those cookies inside the route handler, which already receives the `NextRequest` those cookies arrive on — no client-side change, no new client-supplied field, so this can't be spoofed and needs no schema change to `analyticsEventSchema`.

**Files:**
- Modify: `src/app/api/events/route.ts`
- Test: `src/app/api/events/route.test.ts` (new)

**Interfaces:**
- Consumes: `ATTRIBUTION_COOKIE.last`, `BOOK_ORIGIN_COOKIE`, `parseAttributionCookie`, `parseBookOrigin` from `src/lib/attribution/cookies.ts` (all pre-existing, Task 1's migration's summary).
- Produces: the `analytics_events` insert now includes `origin_page`, matching Task 1's new column.

- [ ] **Step 1: Write the failing test**

```ts
// src/app/api/events/route.test.ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const insertMock = vi.fn().mockResolvedValue({ error: null });
const fromMock = vi.fn(() => ({ insert: insertMock }));
vi.mock("@/lib/supabase/service-client", () => ({
  getServiceSupabase: () => ({ from: fromMock }),
}));

import { POST } from "./route";

function makeRequest(body: unknown, cookies: Record<string, string> = {}): NextRequest {
  return {
    json: async () => body,
    cookies: {
      get: (name: string) => (name in cookies ? { name, value: cookies[name] } : undefined),
    },
  } as unknown as NextRequest;
}

const validBody = {
  name: "nmc_booking_click",
  anonymousSessionId: "sess-1",
  path: "/book",
  locale: "en",
};

describe("POST /api/events — attribution enrichment", () => {
  beforeEach(() => {
    insertMock.mockClear();
    fromMock.mockClear();
  });

  it("inserts with source/origin_page null when no attribution cookies are present", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: null, origin_page: null }));
  });

  it("backfills source from the httpOnly attr_last cookie for an event with no client-supplied source (e.g. nmc_booking_click)", async () => {
    const attrLast = JSON.stringify({ source: "google_business", page: "/erectile-dysfunction", at: "2026-01-01T00:00:00.000Z" });
    const res = await POST(makeRequest(validBody, { attr_last: attrLast }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: "google_business" }));
  });

  it("prefers a client-supplied source over the attr_last cookie fallback", async () => {
    const attrLast = JSON.stringify({ source: "google_business", page: "/x", at: "2026-01-01T00:00:00.000Z" });
    const res = await POST(makeRequest({ ...validBody, source: "direct" }, { attr_last: attrLast }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: "direct" }));
  });

  it("backfills origin_page from the httpOnly book_origin cookie", async () => {
    const res = await POST(makeRequest(validBody, { book_origin: "/erectile-dysfunction" }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ origin_page: "/erectile-dysfunction" }));
  });

  it("ignores a malformed attr_last cookie rather than failing the request", async () => {
    const res = await POST(makeRequest(validBody, { attr_last: "not-json" }));
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ source: null }));
  });

  it("still returns ok:true with no consent check anywhere in this route — booking analytics never gates on consent server-side", async () => {
    const res = await POST(makeRequest(validBody));
    await expect(res.json()).resolves.toEqual({ ok: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/events/route.test.ts`
Expected: FAIL — `origin_page`/cookie-derived `source` assertions fail (route doesn't read cookies yet)

- [ ] **Step 3: Implement**

```ts
// src/app/api/events/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { analyticsEventSchema } from "@/lib/analytics/event-schema";
import { getServiceSupabase } from "@/lib/supabase/service-client";
import {
  ATTRIBUTION_COOKIE,
  BOOK_ORIGIN_COOKIE,
  parseAttributionCookie,
  parseBookOrigin,
} from "@/lib/attribution/cookies";

/**
 * First-party analytics ingestion — R7.2 brief §11/§16. Validates and
 * allow-lists every field before insert; never echoes DB errors to the
 * client, and never fails loudly for a dropped analytics event (losing
 * one event is acceptable, breaking the page/booking flow is not).
 *
 * R9 booking funnel correction: `source` and `origin_page` are also
 * backfilled here, server-side, from the same httpOnly attribution
 * cookies `src/proxy.ts` already sets (`attr_last`, `book_origin`). The
 * client can never read an httpOnly cookie, so this is the only place
 * these signals can reach `analytics_events` — and because they're
 * derived from a cookie the browser can't touch, they can't be spoofed
 * by a crafted request body either. A client-supplied `source` (only
 * ever sent today for `page_view`/`book_page_view`/`lead_submit_*`, via
 * `FunnelEventProperties`) still wins when present.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const lastTouch = parseAttributionCookie(request.cookies.get(ATTRIBUTION_COOKIE.last)?.value);
  const originPage = parseBookOrigin(request.cookies.get(BOOK_ORIGIN_COOKIE)?.value);

  try {
    const supabase = getServiceSupabase();
    await supabase.from("analytics_events").insert({
      anonymous_session_id: parsed.data.anonymousSessionId,
      event_name: parsed.data.name,
      path: parsed.data.path,
      locale: parsed.data.locale ?? null,
      service_interest: parsed.data.serviceInterest ?? null,
      source: parsed.data.source ?? lastTouch?.source ?? null,
      origin_page: originPage ?? null,
      utm_source: parsed.data.utmSource ?? null,
      utm_medium: parsed.data.utmMedium ?? null,
      utm_campaign: parsed.data.utmCampaign ?? null,
      referrer_category: parsed.data.referrerCategory ?? null,
    });
  } catch (err) {
    console.error("[analytics_events insert failed]", err);
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/events/route.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/app/api/events/route.ts src/app/api/events/route.test.ts
git commit -m "$(cat <<'EOF'
feat(booking): backfill analytics source/origin_page from httpOnly attribution cookies

nmc_booking_click and book_cta_click never carried a `source` (only
FunnelEventProperties has that field client-side), and no event could
ever carry origin_page (the client can't read httpOnly cookies). Both
now come from the server, reading the same attr_last/book_origin
cookies src/proxy.ts already sets — non-spoofable, no client schema
change, and this is what makes admin_source_performance's nmc_clicks
(fixed in the prior migration commit) actually populate once /book
stops creating leads.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `proxy.ts` — extend `book_origin` cookie capture to `/ar/book`

**Bug:** `src/proxy.ts` only sets the `book_origin` cookie when `pathname === "/book"`. Once `/ar/book` exists (Task 9), a visitor landing there from an Arabic marketing page would never get an origin-page attribution cookie at all — `admin_page_performance`'s new `nmc_clicks`-by-`origin_page` (Task 1) would silently be blind to every Arabic booking click.

**Files:**
- Modify: `src/proxy.ts`
- Test: `src/proxy.test.ts` (new)

- [ ] **Step 1: Write the failing test**

```ts
// src/proxy.test.ts
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { PRODUCTION_SITE_URL } from "@/config/site";
import { CONSENT_COOKIE_NAME } from "@/lib/analytics/consent-cookie";
import { BOOK_ORIGIN_COOKIE } from "@/lib/attribution/cookies";
import { proxy } from "./proxy";

function requestTo(pathname: string, opts: { referer?: string; consent?: boolean } = {}): NextRequest {
  const url = new URL(pathname, PRODUCTION_SITE_URL);
  const headers = new Headers();
  if (opts.referer) headers.set("referer", opts.referer);
  if (opts.consent) headers.set("cookie", `${CONSENT_COOKIE_NAME}=granted`);
  return new NextRequest(url, { headers });
}

describe("proxy — book_origin cookie scope", () => {
  it("sets book_origin when landing on /book from an internal marketing page (with consent) — unchanged prior behavior", () => {
    const request = requestTo("/book", { referer: `${PRODUCTION_SITE_URL}/erectile-dysfunction`, consent: true });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)?.value).toBe("/erectile-dysfunction");
  });

  it("also sets book_origin when landing on /ar/book from an internal Arabic marketing page (with consent) — the fix", () => {
    const request = requestTo("/ar/book", { referer: `${PRODUCTION_SITE_URL}/ar/erectile-dysfunction`, consent: true });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)?.value).toBe("/ar/erectile-dysfunction");
  });

  it("does not set book_origin without analytics consent — non-essential enrichment only, never required for booking to work", () => {
    const request = requestTo("/ar/book", { referer: `${PRODUCTION_SITE_URL}/ar/erectile-dysfunction`, consent: false });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)).toBeUndefined();
  });

  it("does not overwrite book_origin on a same-page reload of /ar/book", () => {
    const request = requestTo("/ar/book", { referer: `${PRODUCTION_SITE_URL}/ar/book`, consent: true });
    const response = proxy(request);
    expect(response.cookies.get(BOOK_ORIGIN_COOKIE)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/proxy.test.ts`
Expected: FAIL on the `/ar/book` test — `book_origin` stays unset because `pathname === "/book"` excludes it.

- [ ] **Step 3: Fix**

In `src/proxy.ts`, replace:

```ts
  if (
    hasAnalyticsConsent &&
    pathname === "/book" &&
    refererPath &&
    refererHost === request.nextUrl.host &&
    !refererPath.startsWith("/book")
  ) {
```

with:

```ts
  const isBookPagePath = pathname === "/book" || pathname === "/ar/book";
  if (
    hasAnalyticsConsent &&
    isBookPagePath &&
    refererPath &&
    refererHost === request.nextUrl.host &&
    !refererPath.startsWith("/book") &&
    !refererPath.startsWith("/ar/book")
  ) {
```

Also update the comment immediately above that block (currently reads "so this runs on every /book load") to say "/book or /ar/book load".

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/proxy.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/proxy.ts src/proxy.test.ts
git commit -m "$(cat <<'EOF'
fix(booking): capture book_origin attribution cookie on /ar/book too

src/proxy.ts only ever matched pathname === "/book" — a visitor
landing on the new /ar/book (Task 9) from an Arabic marketing page
would get no origin-page attribution at all, leaving
admin_page_performance's Arabic nmc_clicks permanently blind.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: `NmcBookingButton` — the shared direct-handoff CTA component

**Context:** Both the rebuilt `/book` and the new `/ar/book` need one real, consent-independent link to `practice.bookingUrl`. It must be a plain `<a href>` (not Next's `<Link>`, which is for internal client-side navigation — the existing "View NMC Profile" link in `book/page.tsx` already uses a plain `<a>` for the same external-NMC-URL reason), with an `onClick` that fires `nmc_booking_click` and never calls `preventDefault()`, so the click navigates natively even if `trackEvent()`'s internal consent check no-ops, JS never loads, or the fetch to `/api/events` fails.

**Files:**
- Create: `src/components/booking/NmcBookingButton.tsx`
- Test: `src/components/booking/NmcBookingButton.test.ts`

**Interfaces:**
- Produces: `NmcBookingButton({ sourcePage: string; label: string; className?: string })` — consumed by Task 7 (English `/book`) and Task 9 (Arabic `/ar/book`).
- Consumes: `practice`, `isBookingConfigured` (`@/config/practice`), `trackEvent` (`@/lib/analytics/events`), `Button` (`@/components/ui/Button`).

- [ ] **Step 1: Write the failing test**

```ts
// src/components/booking/NmcBookingButton.test.ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import { practice } from "@/config/practice";
import { findAll } from "@/lib/test-utils/react-element";

vi.mock("@/lib/analytics/events", () => ({ trackEvent: vi.fn() }));

import { trackEvent } from "@/lib/analytics/events";
import { NmcBookingButton } from "./NmcBookingButton";

describe("NmcBookingButton", () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it("renders a real anchor pointing at the official NMC booking URL — navigation must work with zero JS", () => {
    const tree = NmcBookingButton({ sourcePage: "/book", label: "Continue to NMC Booking" });
    const anchors = findAll(tree, (el) => el.type === "a");
    expect(anchors).toHaveLength(1);
    expect(anchors[0].props.href).toBe(practice.bookingUrl);
    expect(anchors[0].props.children).toBe("Continue to NMC Booking");
  });

  it("never calls preventDefault in its click handler — booking must never depend on consent or JS succeeding", () => {
    const tree = NmcBookingButton({ sourcePage: "/book", label: "Continue to NMC Booking" });
    const anchor = findAll(tree, (el) => el.type === "a")[0];
    const event = { preventDefault: vi.fn() };
    anchor.props.onClick(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("fires nmc_booking_click with the given source_page on click", () => {
    const tree = NmcBookingButton({ sourcePage: "/ar/book", label: "المتابعة إلى حجز الموعد عبر NMC" });
    const anchor = findAll(tree, (el) => el.type === "a")[0];
    anchor.props.onClick({ preventDefault: vi.fn() });
    expect(trackEvent).toHaveBeenCalledWith({
      name: "nmc_booking_click",
      properties: { source_page: "/ar/book", cta_position: "book-page-primary" },
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/booking/NmcBookingButton.test.ts`
Expected: FAIL — `Cannot find module './NmcBookingButton'`

- [ ] **Step 3: Implement**

```tsx
// src/components/booking/NmcBookingButton.tsx
import { isBookingConfigured, practice } from "@/config/practice";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

/**
 * The single primary CTA on /book and /ar/book (R9 booking funnel
 * correction) — a direct, low-friction handoff to NMC's own booking
 * system. Always a real `<a href={practice.bookingUrl}>`, never a
 * button-only onClick handler: clicking it must navigate natively even
 * if `trackEvent()` no-ops (no analytics consent), the JS bundle never
 * loads, or the `/api/events` beacon fails — booking must never depend
 * on any of that. Mirrors `components/ui/BookingCta.tsx`'s own
 * graceful-degradation pattern while `practice.bookingUrl` is unset.
 */
export function NmcBookingButton({
  sourcePage,
  label,
  className,
}: {
  sourcePage: string;
  label: string;
  className?: string;
}) {
  if (!isBookingConfigured) {
    return (
      <Button
        size="lg"
        disabled
        title="Booking link pending owner confirmation"
        className={cn(className)}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className={className}>
      <a
        href={practice.bookingUrl}
        onClick={() =>
          trackEvent({
            name: "nmc_booking_click",
            properties: { source_page: sourcePage, cta_position: "book-page-primary" },
          })
        }
      >
        {label}
      </a>
    </Button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/booking/NmcBookingButton.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/booking/NmcBookingButton.tsx src/components/booking/NmcBookingButton.test.ts
git commit -m "$(cat <<'EOF'
feat(booking): add NmcBookingButton — the direct low-friction NMC handoff CTA

Shared by the rebuilt /book and the new /ar/book (both in later
commits). A plain <a href> to practice.bookingUrl whose onClick only
fires analytics and never calls preventDefault, so clicking it
navigates natively regardless of consent state or JS/network failure.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: `BookPageViewTracker` — accept a `path` prop

**Why:** The component hardcodes `path: "/book"`. Once `/ar/book` exists (Task 9) it needs to report its own path, not the English one — otherwise every Arabic `book_page_view` would misreport as an English page view.

**Files:**
- Modify: `src/components/analytics/BookPageViewTracker.tsx`

**Interfaces:**
- Produces: `BookPageViewTracker({ path: string; service?: ServiceInterest })` — `path` is now required. Consumed by Task 7 (`path="/book"`) and Task 9 (`path="/ar/book"`).

**Note on test coverage:** this component calls `useEffect`/`useRef`/`useSearchParams` — it cannot be invoked directly as a plain function the way Task 2's `findAll` technique requires (React hooks throw outside an active render), and no jsdom/testing-library exists in this repo to render it properly either. It was untested before this change too. Coverage for "the right path reaches the tracker" comes from Task 7 and Task 9's page-level tests, which assert the `<BookPageViewTracker path={...} .../>` element in the page's own returned tree carries the correct `path` prop — sufficient given this is a one-line prop-threading change to an otherwise-unmodified component.

- [ ] **Step 1: Modify**

In `src/components/analytics/BookPageViewTracker.tsx`, change the function signature and the `trackEvent` call:

```tsx
export function BookPageViewTracker({ path, service }: { path: string; service?: ServiceInterest }) {
  const searchParams = useSearchParams();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackEvent({
      name: "book_page_view",
      properties: {
        path,
        service,
        utm_source: searchParams.get("utm_source") ?? undefined,
        utm_medium: searchParams.get("utm_medium") ?? undefined,
        utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      },
    });
    // Fire once on mount only — see the ref guard above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
```

(Only the destructured parameter — `{ service }` → `{ path, service }` with `path: string` added to the inline type — and the properties object's `path: "/book"` → `path` change; everything else in the file is unchanged.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: fails at this point only if a call site still doesn't pass `path` — Tasks 7 and 9 supply it. If run in isolation before those tasks, this file alone introduces no error (an unused-import or missing-prop error would only surface once a call site exists).

- [ ] **Step 3: Commit**

```bash
git add src/components/analytics/BookPageViewTracker.tsx
git commit -m "$(cat <<'EOF'
refactor(booking): BookPageViewTracker takes an explicit path prop

Previously hardcoded to "/book". The new /ar/book page (Task 9) needs
to report its own path, not the English one.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Rebuild `/book` — remove the form, add the direct NMC handoff

**Spec (verbatim, owner's suggested structure):** H1 "Book a Consultation"; supporting copy "Appointments with Dr. Alejandro Molina are managed through NMC Royal Hospital, Khalifa City."; primary CTA "Continue to NMC Booking"; supporting line "You will be redirected to the official NMC booking system." No form. No name/email/discussion-topic fields. No privacy-consent checkbox. No "How Booking Works" explanatory section (it described the now-removed form mechanics). The Physician/Practice-location identity block is kept — it's static factual context, not an explanation of removed form mechanics, and reinforces the "reassuring" quality the spec asks for; the "View NMC Profile" secondary link is kept too (informational, not an enquiry/contact channel).

**Files:**
- Modify: `src/app/(en)/(marketing)/book/page.tsx`
- Test: `src/app/(en)/(marketing)/book/page.test.ts` (new)

**Interfaces:**
- Consumes: `NmcBookingButton` (Task 5), `BookPageViewTracker` with `path` prop (Task 6).

- [ ] **Step 1: Write the failing test**

```ts
// src/app/(en)/(marketing)/book/page.test.ts
import { describe, expect, it } from "vitest";
import { practice } from "@/config/practice";
import { findAll } from "@/lib/test-utils/react-element";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import BookPage from "./page";

describe("BookPage (English)", () => {
  it("renders no form and no name/email/discussion-topic/privacy-consent inputs", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    expect(findAll(tree, (el) => el.type === "form")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "input")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "select")).toHaveLength(0);
  });

  it("renders the H1 'Book a Consultation'", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const h1s = findAll(tree, (el) => el.type === "h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].props.children).toBe("Book a Consultation");
  });

  it("renders exactly one NmcBookingButton wired to the official NMC handoff from /book", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const ctas = findAll(tree, (el) => el.type === NmcBookingButton);
    expect(ctas).toHaveLength(1);
    expect(ctas[0].props.label).toBe("Continue to NMC Booking");
    expect(ctas[0].props.sourcePage).toBe("/book");
  });

  it("passes path=\"/book\" to BookPageViewTracker so book_page_view still fires with the right path", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers).toHaveLength(1);
    expect(trackers[0].props.path).toBe("/book");
  });

  it("carries service context from ?service= through to both the tracker and (for now) does not add a form for it", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({ service: "penile_girth" }) });
    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers[0].props.service).toBe("penile_girth");
  });

  it("still links to the NMC physician profile as a secondary, non-form action", async () => {
    const tree = await BookPage({ searchParams: Promise.resolve({}) });
    const profileLinks = findAll(tree, (el) => el.type === "a" && el.props.href === practice.physicianProfileUrl);
    expect(profileLinks).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/(en)/(marketing)/book/page.test.ts"`
Expected: FAIL — current page still imports `BookingLeadForm`, has no `NmcBookingButton`, `BookPageViewTracker` still takes no `path`.

- [ ] **Step 3: Rewrite the page**

Replace the full contents of `src/app/(en)/(marketing)/book/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { isServiceInterest, type ServiceInterest } from "@/lib/domain/service-interest";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/book";

export const metadata: Metadata = buildMetadata({
  title: "Book a Consultation",
  description:
    "Book a consultation with Dr. Alejandro Molina, Consultant Urologist & Andrologist, at NMC Royal Hospital Khalifa City, Abu Dhabi.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Book a Consultation", href: PATH },
];

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  const defaultService: ServiceInterest | undefined =
    params.service && isServiceInterest(params.service) ? params.service : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Suspense fallback={null}>
        <BookPageViewTracker path={PATH} service={defaultService} />
      </Suspense>

      <Breadcrumb items={breadcrumbItems} />

      {/* Direct NMC handoff — R9 booking funnel correction: no form. */}
      <section className="py-section-y">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Consultation
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Book a Consultation</h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              Appointments with {doctor.displayName} are managed through {practice.facilityName}.
            </p>

            <div className="mt-10">
              <NmcBookingButton sourcePage={PATH} label="Continue to NMC Booking" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              You will be redirected to the official {practice.facilityShortName} booking system.
            </p>

            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-11 items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                View NMC Profile
              </a>
            )}
          </Reveal>
        </Container>
      </section>

      {/* Practice details */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Physician
            </p>
            <p className="mt-4 font-display text-2xl text-foreground">{doctor.displayName}</p>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Practice location
            </p>
            <p className="mt-4 font-display text-2xl text-foreground">{practice.facilityName}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {practice.city}, {practice.country}
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/(en)/(marketing)/book/page.test.ts"`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add "src/app/(en)/(marketing)/book/page.tsx" "src/app/(en)/(marketing)/book/page.test.ts"
git commit -m "$(cat <<'EOF'
feat(booking): rebuild /book as a direct low-friction NMC handoff

Removes the mandatory lead-capture form (name/email/discussion-topic/
privacy-consent) and the "How Booking Works" section that described
it. /book is now: H1, one line of context, the NmcBookingButton
primary CTA, a redirect notice, and the existing physician/practice
identity block — per the owner's R9 booking funnel correction spec.
BookingLeadForm/createLead are no longer referenced from this page
(removed as dead code in the next commit).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Remove orphaned public-form code

**Scope discipline (Global Constraints):** remove only code whose sole purpose was the now-deleted public lead-capture form. Do not touch `discussion-topic.ts`'s `DISCUSSION_TOPICS`/`DiscussionTopic`/`discussionTopicLabel` (admin lead-history pages still use them) or `service-interest.ts` at all (still used by the rebuilt `/book` page's `?service=` handling and `BookPageViewTracker`). Do not touch `Checkbox`/`Select`/`Input` UI primitives even if they become unused by this change — they're reusable primitives, kept conservatively.

**Files:**
- Delete: `src/components/forms/BookingLeadForm.tsx`
- Delete: `src/app/(en)/(marketing)/book/actions.ts`
- Delete: `src/app/(en)/(marketing)/book/actions.test.ts`
- Delete: `src/lib/domain/lead-schema.ts`
- Delete: `src/lib/domain/lead-schema.test.ts`
- Modify (conditionally, per Step 2): `src/lib/domain/discussion-topic.ts`

- [ ] **Step 1: Confirm nothing outside the files being deleted still references them**

Run each of the following and confirm every hit is inside a file in the delete list above (Task 7's commit already removed `book/page.tsx`'s own references):

```bash
grep -rn "BookingLeadForm" src
grep -rn "book/actions" src
grep -rln "lead-schema" src
```

Expected: zero hits outside the five files listed above.

- [ ] **Step 2: Delete the five files**

```bash
git rm src/components/forms/BookingLeadForm.tsx
git rm "src/app/(en)/(marketing)/book/actions.ts"
git rm "src/app/(en)/(marketing)/book/actions.test.ts"
git rm src/lib/domain/lead-schema.ts
git rm src/lib/domain/lead-schema.test.ts
```

- [ ] **Step 3: Grep-verify which `discussion-topic.ts` exports are now truly unreferenced**

`resolveSubmittedDiscussionTopic`, `mapServiceToDiscussionTopic`, `isDiscussionTopic`, `PREFER_NOT_TO_SAY`, and `DISCUSSION_TOPIC_VALUES` existed solely to serve `BookingLeadForm.tsx` and `book/actions.ts` (now deleted). Run, for each name, from the repo root:

```bash
grep -rn "resolveSubmittedDiscussionTopic\|mapServiceToDiscussionTopic\|isDiscussionTopic\|PREFER_NOT_TO_SAY\|DISCUSSION_TOPIC_VALUES" src --include="*.ts" --include="*.tsx" | grep -v "src/lib/domain/discussion-topic.ts"
```

If this prints zero lines, every one of those five is dead — proceed to Step 4 exactly as written. **If it prints any line**, that export (and only that one) has a live caller: keep it and its transitive dependency (e.g. `SERVICE_TO_TOPIC`, used only by `mapServiceToDiscussionTopic`) in the file unchanged, and only remove the others confirmed dead. Do not guess — the grep output is the source of truth here, not this plan.

- [ ] **Step 4: Trim `discussion-topic.ts`** (assuming Step 3 confirmed all five are dead — adjust per its actual output if not)

Replace the full contents of `src/lib/domain/discussion-topic.ts`:

```ts
/**
 * Patient-facing "what would you like to discuss" options — R7.2 UX
 * addendum. Retained after the R9 booking funnel correction removed
 * the public lead-capture form: `DISCUSSION_TOPICS` and
 * `discussionTopicLabel` are still used by admin pages to display the
 * discussion topic stored on historical leads created before this
 * correction. The form-submission helpers that used to live here
 * (`resolveSubmittedDiscussionTopic`, `mapServiceToDiscussionTopic`,
 * `isDiscussionTopic`, `PREFER_NOT_TO_SAY`) were removed — their only
 * callers, `BookingLeadForm.tsx` and `book/actions.ts`, no longer exist.
 */
export const DISCUSSION_TOPICS = [
  { value: "mens_sexual_health", label: "Men's Sexual Health" },
  { value: "penile_doppler_vascular", label: "Penile Doppler / Vascular Assessment" },
  { value: "male_hormonal_health", label: "Male Hormonal Health" },
  { value: "penile_girth", label: "Penile Girth Enhancement" },
  { value: "penile_surgery", label: "Penile Surgery" },
  { value: "male_aesthetics", label: "Male Aesthetics" },
  { value: "fertility", label: "Fertility" },
  { value: "general_urology", label: "General Urology" },
] as const;

export type DiscussionTopic = (typeof DISCUSSION_TOPICS)[number]["value"];

export function discussionTopicLabel(value: string | null | undefined): string {
  if (!value) return "Not specified";
  return DISCUSSION_TOPICS.find((t) => t.value === value)?.label ?? "Not specified";
}
```

- [ ] **Step 5: Typecheck — the real safety net for this deletion**

Run: `npx tsc --noEmit`
Expected: PASS. Any file that still imported something just deleted/removed fails loudly here.

- [ ] **Step 6: Run the full test suite**

Run: `npm run test`
Expected: PASS — the deleted files' own tests are gone with them; nothing else should reference them.

- [ ] **Step 7: Commit**

```bash
git add src/lib/domain/discussion-topic.ts
git commit -m "$(cat <<'EOF'
chore(booking): remove code orphaned by the /book form removal

BookingLeadForm.tsx, book/actions.ts (+ its test), and lead-schema.ts
(+ its test) had no callers left after Task 7 rebuilt /book without a
form. discussion-topic.ts's form-submission-only helpers
(resolveSubmittedDiscussionTopic, mapServiceToDiscussionTopic,
isDiscussionTopic, PREFER_NOT_TO_SAY) are removed for the same reason;
DISCUSSION_TOPICS/discussionTopicLabel are kept — admin lead-history
pages still display them for leads created before this correction.
service-interest.ts and the Checkbox/Select/Input UI primitives are
untouched (still used, or kept as reusable primitives per the R9
booking funnel correction spec's cleanup scope).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: `routes.ts` arPath + new `/ar/book` page

**Spec (verbatim, owner's suggested structure):** H1 "احجز موعداً"; supporting copy "تُدار مواعيد الاستشارة مع الدكتور أليخاندرو مولينا من خلال مستشفى إن إم سي رويال – مدينة خليفة."; primary CTA "المتابعة إلى حجز الموعد عبر NMC"; supporting line "سيتم تحويلك إلى نظام الحجز الرسمي لدى NMC." Professional MSA, no form, no enquiry CTA. EN/AR parity with Task 7's rebuilt `/book` — same structure, only language/direction differs (root Arabic layout already sets `dir="rtl"`/`lang="ar"`, established since R9 Phase A — this page needs no direction handling of its own). No `tracking-[0.2em]`/`uppercase` on Arabic eyebrow text (established convention since Batch 1 — Arabic has no uppercase, and the letter-spacing look doesn't read the same in Arabic script).

**Files:**
- Modify: `src/lib/seo/routes.ts`
- Modify: `src/lib/seo/routes.test.ts`
- Modify: `src/app/sitemap.test.ts`
- Create: `src/app/(ar)/ar/(marketing)/book/page.tsx`
- Test: `src/app/(ar)/ar/(marketing)/book/page.test.ts` (new)

**Interfaces:**
- Consumes: `NmcBookingButton` (Task 5), `BookPageViewTracker` with `path` prop (Task 6), `AR_IDENTITY.doctorTitle` (`@/lib/i18n/ar-identity`, pre-existing: `"استشاري أمراض المسالك البولية والذكورة"`).

- [ ] **Step 1: Register the Arabic route**

In `src/lib/seo/routes.ts`, change:

```ts
  { path: "/book", status: "live", priority: 0.8 },
```

to:

```ts
  { path: "/book", status: "live", priority: 0.8, arPath: "/ar/book" },
```

- [ ] **Step 2: Update `routes.test.ts` — the two now-stale null assertions, plus the arPath list**

Replace:

```ts
  it("returns null for an English route with no Arabic equivalent yet", () => {
    expect(getLocalizedPathPair("/book")).toBeNull();
  });

  it("returns null for an Arabic path with no matching registry entry", () => {
    expect(getLocalizedPathPair("/ar/book")).toBeNull();
  });
```

with:

```ts
  it("returns the en/ar pair for /book, now that /ar/book exists (R9 booking funnel correction)", () => {
    expect(getLocalizedPathPair("/book")).toEqual({ en: "/book", ar: "/ar/book" });
  });

  it("returns the same pair when looked up from the Arabic side", () => {
    expect(getLocalizedPathPair("/ar/book")).toEqual({ en: "/book", ar: "/ar/book" });
  });
```

And in the `withArPath` array (declaration order — `/book` sits between `/about` and `/mens-health` in `routes.ts`), change:

```ts
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/mens-health",
```

to:

```ts
    expect(withArPath).toEqual([
      "/",
      "/about",
      "/book",
      "/mens-health",
```

(rest of the array unchanged).

- [ ] **Step 3: Update `sitemap.test.ts`**

In the "includes the R9 Phase B Batch 1 + Batch 2 + Batch 3 /ar/* routes" test, add `"/ar/book"` to the literal array (position doesn't matter — the test sorts both sides):

```ts
      [
        "/ar",
        "/ar/about",
        "/ar/book",
        "/ar/mens-health",
        "/ar/mens-health/testosterone",
        "/ar/sexual-medicine",
        "/ar/sexual-medicine/premature-ejaculation",
        "/ar/erectile-dysfunction",
        "/ar/erectile-dysfunction/penile-doppler",
        "/ar/penile-implant",
        "/ar/peyronies-disease",
        "/ar/male-aesthetics",
        "/ar/male-aesthetics/penile-girth-enhancement",
        "/ar/male-aesthetics/scrotal-lift",
        "/ar/male-aesthetics/penile-filler-correction",
        "/ar/male-fertility",
        "/ar/male-fertility/varicocele",
      ]
```

Also rename that test's title to "...Batch 1 + Batch 2 + Batch 3 + the booking funnel correction /ar/* routes" so it stays accurate.

- [ ] **Step 4: Write the failing page test**

```ts
// src/app/(ar)/ar/(marketing)/book/page.test.ts
import { describe, expect, it } from "vitest";
import { findAll } from "@/lib/test-utils/react-element";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import BookPageAr from "./page";

describe("BookPageAr", () => {
  it("renders no form and no name/email/discussion-topic/privacy-consent inputs", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    expect(findAll(tree, (el) => el.type === "form")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "input")).toHaveLength(0);
    expect(findAll(tree, (el) => el.type === "select")).toHaveLength(0);
  });

  it("renders the localized H1 'احجز موعداً'", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const h1s = findAll(tree, (el) => el.type === "h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].props.children).toBe("احجز موعداً");
  });

  it("renders exactly one NmcBookingButton with the localized CTA label, sourced from /ar/book", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const ctas = findAll(tree, (el) => el.type === NmcBookingButton);
    expect(ctas).toHaveLength(1);
    expect(ctas[0].props.label).toBe("المتابعة إلى حجز الموعد عبر NMC");
    expect(ctas[0].props.sourcePage).toBe("/ar/book");
  });

  it("passes path=\"/ar/book\" to BookPageViewTracker", async () => {
    const tree = await BookPageAr({ searchParams: Promise.resolve({}) });
    const trackers = findAll(tree, (el) => el.type === BookPageViewTracker);
    expect(trackers).toHaveLength(1);
    expect(trackers[0].props.path).toBe("/ar/book");
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run "src/app/(ar)/ar/(marketing)/book/page.test.ts"`
Expected: FAIL — `Cannot find module './page'`

- [ ] **Step 6: Create the Arabic page**

```tsx
// src/app/(ar)/ar/(marketing)/book/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { isServiceInterest, type ServiceInterest } from "@/lib/domain/service-interest";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";

const PATH = "/ar/book";

export const metadata: Metadata = buildMetadata({
  title: "احجز موعداً",
  description:
    "احجز استشارة مع الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة، في مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "احجز موعداً", href: PATH },
];

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPageAr({ searchParams }: Props) {
  const params = await searchParams;
  const defaultService: ServiceInterest | undefined =
    params.service && isServiceInterest(params.service) ? params.service : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Suspense fallback={null}>
        <BookPageViewTracker path={PATH} service={defaultService} />
      </Suspense>

      <Breadcrumb items={breadcrumbItems} />

      {/* Direct NMC handoff — R9 booking funnel correction: no form. */}
      <section className="py-section-y">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">الاستشارة</p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">احجز موعداً</h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              تُدار مواعيد الاستشارة مع {AR_IDENTITY.doctorTitle} من خلال مستشفى إن إم سي رويال –
              مدينة خليفة.
            </p>

            <div className="mt-10">
              <NmcBookingButton sourcePage={PATH} label="المتابعة إلى حجز الموعد عبر NMC" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              سيتم تحويلك إلى نظام الحجز الرسمي لدى NMC.
            </p>

            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-11 items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                عرض الملف الشخصي في NMC
              </a>
            )}
          </Reveal>
        </Container>
      </section>

      {/* Practice details */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">الطبيب</p>
            <p className="mt-4 font-display text-2xl text-foreground">{AR_IDENTITY.doctorDisplayName}</p>
            <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-eyebrow font-medium text-accent-strong">موقع العيادة</p>
            <p className="mt-4 font-display text-2xl text-foreground">مستشفى إن إم سي رويال – مدينة خليفة</p>
            <p className="mt-2 text-sm text-muted-foreground">أبوظبي، الإمارات العربية المتحدة</p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 7: Run all three test files to verify they pass**

Run: `npx vitest run "src/app/(ar)/ar/(marketing)/book/page.test.ts" src/lib/seo/routes.test.ts src/app/sitemap.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/lib/seo/routes.ts src/lib/seo/routes.test.ts src/app/sitemap.test.ts "src/app/(ar)/ar/(marketing)/book/page.tsx" "src/app/(ar)/ar/(marketing)/book/page.test.ts"
git commit -m "$(cat <<'EOF'
feat(ar): add /ar/book — the Arabic direct NMC handoff (R9 booking funnel correction)

Built directly to the new low-friction spec, not as a translation of
the old form — there was never an Arabic version of the removed form
to translate. Registers arPath: "/ar/book" in routes.ts, which gives
it self-canonical + reciprocal hreflang via buildMetadata() and
sitemap inclusion automatically, matching every other R9 Phase B
Arabic route.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: `BookingCta` — route Arabic pages to `/ar/book`

**Bug found during this correction's investigation:** `BookingCta` (the site-wide "Book a Consultation" button rendered on every marketing page across Batches 1-3) hardcodes its `href` to `/book`, with zero locale-awareness — every Arabic page's booking CTA has always linked to the English page. This task fixes it without threading a `locale` prop through the dozens of already-shipped call sites: it detects the current path via `usePathname()`.

**Files:**
- Modify: `src/components/ui/BookingCta.tsx`
- Test: `src/components/ui/BookingCta.test.ts` (new)

**Interfaces:**
- Produces: `resolveBookHref(pathname: string, service?: string): string` — a hooks-free pure function extracted so the routing logic (the actual bug being fixed) is directly unit-testable; `usePathname()` itself can't be exercised outside a real render, per Task 2's constraint.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/ui/BookingCta.test.ts
import { describe, expect, it } from "vitest";
import { resolveBookHref } from "./BookingCta";

describe("resolveBookHref", () => {
  it("routes to /book from an English page", () => {
    expect(resolveBookHref("/erectile-dysfunction")).toBe("/book");
  });

  it("routes to /ar/book from an Arabic page — the fix for the site-wide CTA", () => {
    expect(resolveBookHref("/ar/erectile-dysfunction")).toBe("/ar/book");
  });

  it("routes to /ar/book from the bare Arabic homepage", () => {
    expect(resolveBookHref("/ar")).toBe("/ar/book");
  });

  it("appends the service query param onto the locale-correct path", () => {
    expect(resolveBookHref("/ar/male-aesthetics/scrotal-lift", "scrotal_lift")).toBe(
      "/ar/book?service=scrotal_lift",
    );
    expect(resolveBookHref("/male-aesthetics/scrotal-lift", "scrotal_lift")).toBe("/book?service=scrotal_lift");
  });

  it("URI-encodes the service value", () => {
    expect(resolveBookHref("/erectile-dysfunction", "a b")).toBe("/book?service=a%20b");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/BookingCta.test.ts`
Expected: FAIL — `resolveBookHref` is not exported yet.

- [ ] **Step 3: Implement**

Replace the full contents of `src/components/ui/BookingCta.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { isBookingConfigured } from "@/config/practice";
import { isArabicPath } from "@/lib/seo/routes";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { Button, type ButtonProps } from "./Button";

/**
 * Pure routing logic, extracted from the component so it's directly
 * unit-testable without a render (usePathname() can't be exercised
 * outside one). Routes to /ar/book on any Arabic page, /book otherwise
 * — this is the actual fix for the bug this task addresses: every
 * Arabic page's BookingCta previously linked to the English /book.
 */
export function resolveBookHref(pathname: string, service?: string): string {
  const bookPath = isArabicPath(pathname) ? "/ar/book" : "/book";
  return service ? `${bookPath}?service=${encodeURIComponent(service)}` : bookPath;
}

/**
 * Primary booking CTA — routes to /book (or /ar/book on an Arabic
 * page) for the direct, low-friction NMC handoff; /book no longer
 * collects a lead (R9 booking funnel correction). Fires
 * `book_cta_click`. Degrades gracefully while `practice.bookingUrl` is
 * still a placeholder (see config/practice.ts).
 */
export function BookingCta({
  children = "Book a Consultation",
  service,
  ctaPosition,
  sourcePage,
  className,
  variant,
  size,
}: {
  children?: React.ReactNode;
  service?: string;
  ctaPosition: string;
  sourcePage: string;
} & Pick<ButtonProps, "className" | "variant" | "size">) {
  const pathname = usePathname();

  if (!isBookingConfigured) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        disabled
        title="Booking link pending owner confirmation"
      >
        {children}
      </Button>
    );
  }

  const href = resolveBookHref(pathname, service);

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link
        href={href}
        onClick={() =>
          trackEvent({
            name: "book_cta_click",
            properties: {
              source_page: sourcePage,
              service,
              cta_position: ctaPosition,
            },
          })
        }
      >
        {children}
      </Link>
    </Button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/BookingCta.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/BookingCta.tsx src/components/ui/BookingCta.test.ts
git commit -m "$(cat <<'EOF'
fix(ar): BookingCta routes Arabic pages to /ar/book, not /book

Found during the R9 booking funnel correction: every Arabic page's
site-wide "Book a Consultation" CTA has always hardcoded /book,
despite /ar/* pages existing since Batch 1. Extracts the routing
decision into resolveBookHref() (pure, unit-tested) so the fix doesn't
require threading a locale prop through every existing call site.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Privacy page — correct copy that now describes a form that no longer exists

**Scope discipline (Global Constraints):** edit only the sections that explicitly describe the removed form as present reality (`Information We Collect`, `Booking and Third-Party Links`, `Data Security`, `Your Rights`). Leave `Cookies and Analytics`, `Where Information Is Processed`, `Retention`, `Changes to This Policy`, `Contact` untouched — they remain accurate. This file carries a DRAFT/pending-legal-review disclaimer already; these edits keep that disclaimer as-is.

**Files:**
- Modify: `src/app/(en)/(legal)/privacy/page.tsx`

- [ ] **Step 1: Update `LAST_UPDATED`**

```ts
const LAST_UPDATED = "14 September 2026 (R9 booking funnel correction)";
```

- [ ] **Step 2: Rewrite "Information We Collect"**

Replace:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Information We Collect</h2>
              <p className="mt-3">
                When you submit the &ldquo;Book a Consultation&rdquo; form on this
                website, we collect your full name and email address, and, only
                if you choose to provide it, a general topic you&rsquo;d like to
                discuss (selected from a short list, such as &ldquo;Male
                Hormonal Health&rdquo; or &ldquo;General Urology&rdquo;) —
                this field is optional, and you may select
                &ldquo;Prefer not to say&rdquo; instead. We do not ask for and
                do not collect symptoms, a diagnosis, medical history,
                medications, test results, or clinical records through this
                website.
              </p>
              <p className="mt-3">
                We are conscious that, because this is a medical practice&rsquo;s
                website, even a general topic selection can be sensitive —
                it may indicate an area of health interest, even though it is
                not a diagnosis and is entirely optional. This field is
                handled with the same access controls as your other contact
                details (see &ldquo;Data Security&rdquo; below), is never
                combined with the analytics described below, and — as with any
                data you submit through this form — you may ask us to delete it
                at any time (see &ldquo;Your Rights&rdquo;).
              </p>
              <p className="mt-3">
                We also record where a visit or enquiry came from — such as the
                referring website, search engine, or campaign link (UTM
                parameters) — and, where applicable, which page on this site
                linked you to the booking page. This is used only to
                understand which channels bring visitors to the site, not to
                build a profile of you as an individual.
              </p>
              <p className="mt-3">
                Standard technical information (such as browser type and general
                usage data) may also be logged automatically by the hosting
                infrastructure that serves this website, as is typical for any
                website.
              </p>
            </div>
```

with:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Information We Collect</h2>
              <p className="mt-3">
                Booking an appointment through this website does not require
                you to submit your name, email address, or any health
                information to us. The &ldquo;Book a Consultation&rdquo; page
                takes you directly to {practice.facilityShortName}&rsquo;s
                official booking system, where any information needed to
                schedule your appointment is provided directly to{" "}
                {practice.facilityShortName}, not to this website. We do not
                ask for and do not collect symptoms, a diagnosis, medical
                history, medications, test results, or clinical records
                through this website.
              </p>
              <p className="mt-3">
                We record where a visit came from — such as the referring
                website, search engine, or campaign link (UTM parameters) —
                and, where applicable, which page on this site linked you to
                the booking page. This is used only to understand which
                channels bring visitors to the site, not to build a profile of
                you as an individual.
              </p>
              <p className="mt-3">
                Standard technical information (such as browser type and general
                usage data) may also be logged automatically by the hosting
                infrastructure that serves this website, as is typical for any
                website.
              </p>
            </div>
```

- [ ] **Step 3: Rewrite "Booking and Third-Party Links"**

Replace:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Booking and Third-Party Links</h2>
              <p className="mt-3">
                Submitting the booking form creates a record with this
                practice&rsquo;s own systems, used to follow up with you and
                understand where enquiries come from. It does not, by itself,
                create an appointment. Clicking &ldquo;Continue to NMC
                Booking&rdquo; (and the &ldquo;View NMC Profile&rdquo; link)
                takes you to {practice.facilityShortName}&rsquo;s official
                platforms, which operate under their own privacy policy. This
                website does not process appointment scheduling itself and does
                not have access to any information you provide on{" "}
                {practice.facilityShortName}&rsquo;s systems.
              </p>
            </div>
```

with:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Booking and Third-Party Links</h2>
              <p className="mt-3">
                Clicking &ldquo;Continue to NMC Booking&rdquo; (or the
                &ldquo;View NMC Profile&rdquo; link) on the booking page takes
                you directly to {practice.facilityShortName}&rsquo;s official
                platforms, which operate under their own privacy policy. This
                website does not process appointment scheduling itself, does
                not collect your name, email, or health information as part
                of booking, and does not have access to any information you
                provide on {practice.facilityShortName}&rsquo;s systems.
              </p>
            </div>
```

- [ ] **Step 4: Rewrite "Data Security"**

Replace:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Data Security</h2>
              <p className="mt-3">
                Contact details submitted through the booking form — including
                the optional topic field described above — are stored in a
                database that is not directly accessible from the browser: all
                reads and writes happen through this website&rsquo;s own
                server, and the database itself is configured to deny direct
                access entirely, accessible only through that server.
                Reasonable technical measures are used to help protect this
                website more generally. As noted above, this website does not
                collect symptoms, a diagnosis, medical history, medications,
                test results, or clinical records.
              </p>
            </div>
```

with:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Data Security</h2>
              <p className="mt-3">
                This website&rsquo;s database is not directly accessible from
                the browser: all reads and writes happen through this
                website&rsquo;s own server, and the database itself is
                configured to deny direct access entirely, accessible only
                through that server. Booking an appointment does not submit
                your name, email, or health information to this website.
                Reasonable technical measures are used to help protect this
                website more generally. As noted above, this website does not
                collect symptoms, a diagnosis, medical history, medications,
                test results, or clinical records.
              </p>
            </div>
```

- [ ] **Step 5: Rewrite "Your Rights"**

Replace:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Your Rights</h2>
              <p className="mt-3">
                You may have rights in relation to any personal data processed
                about you under applicable data protection law in the United
                Arab Emirates, including the right to ask what information we
                hold about you, to request its correction or deletion, and to
                withdraw any consent you have given at any time. Withdrawing
                consent does not affect the lawfulness of anything already done
                based on it. For analytics cookies specifically, withdrawal is
                immediate via the &ldquo;Cookie Settings&rdquo; link in the
                footer. For data you submitted through this website&rsquo;s
                booking form, contact us using the details below. For
                information you provide directly to{" "}
                {practice.facilityShortName} as part of booking or attending a
                consultation, such requests should be directed to{" "}
                {practice.facilityShortName}.
              </p>
              <p className="mt-3">
                Submitting the booking form is consent to that specific
                purpose — being contacted to facilitate your appointment — and
                is not consent to receive marketing or promotional
                communications. This website does not send marketing
                communications, and would only ever do so on the basis of
                separate, explicit consent obtained for that specific purpose.
              </p>
            </div>
```

with:

```tsx
            <div>
              <h2 className="font-display text-xl text-foreground">Your Rights</h2>
              <p className="mt-3">
                You may have rights in relation to any personal data processed
                about you under applicable data protection law in the United
                Arab Emirates, including the right to ask what information we
                hold about you, to request its correction or deletion, and to
                withdraw any consent you have given at any time. Withdrawing
                consent does not affect the lawfulness of anything already done
                based on it. For analytics cookies specifically, withdrawal is
                immediate via the &ldquo;Cookie Settings&rdquo; link in the
                footer. If you previously submitted information through this
                website&rsquo;s booking form, or for any other data-protection
                request, contact us using the details below. For information
                you provide directly to {practice.facilityShortName} as part
                of booking or attending a consultation, such requests should
                be directed to {practice.facilityShortName}.
              </p>
              <p className="mt-3">
                This website does not send marketing communications, and would
                only ever do so on the basis of separate, explicit consent
                obtained for that specific purpose.
              </p>
            </div>
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS. There is no automated content test for this page (matches the pre-existing convention — it was untested before too); verify by re-reading the diff that no other section was touched.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(en)/(legal)/privacy/page.tsx"
git commit -m "$(cat <<'EOF'
docs(privacy): correct copy that described the now-removed booking form

"Information We Collect", "Booking and Third-Party Links", "Data
Security", and "Your Rights" explicitly described the booking form
collecting name/email/discussion-topic as present reality — no longer
true after the R9 booking funnel correction removed that form.
"Your Rights" still accurately acknowledges historical form
submissions (leads created before this correction are not deleted).
Cookies and Analytics / Where Processed / Retention / Changes /
Contact are untouched — they remain accurate. Still a DRAFT pending
legal review, unchanged.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Admin dashboard — funnel no longer implies lead creation is required

**Spec:** "Booking funnel: Book page visit → NMC booking click. Lead creation is no longer a required funnel step." The existing `FunnelChart` inserts "Leads Created" as a sequential stage between "Book Page Visits" and "NMC Booking Clicks" — that ordering implies a lead must exist before an NMC click can happen, which is no longer true (and never was, strictly, but especially isn't now). "Leads" stays visible as a separate KPI card (historical/legacy metric), just not as a funnel gate.

**Files:**
- Modify: `src/app/admin/(protected)/page.tsx`
- Test: `src/app/admin/(protected)/page.test.ts` (new)

- [ ] **Step 1: Write the failing test**

```ts
// src/app/admin/(protected)/page.test.ts
import { describe, expect, it, vi } from "vitest";
import { findAll } from "@/lib/test-utils/react-element";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { KpiCard } from "@/components/admin/KpiCard";

vi.mock("@/lib/admin/queries", () => ({
  getOverviewKpis: vi.fn().mockResolvedValue({
    visitors: 10,
    page_views: 20,
    book_cta_clicks: 5,
    leads_created: 2,
    nmc_booking_clicks: 3,
  }),
  getFunnel: vi.fn().mockResolvedValue({
    visits: 10,
    book_cta_clicks: 5,
    book_page_views: 4,
    leads_created: 2,
    nmc_booking_clicks: 3,
  }),
}));

import AdminOverviewPage from "./page";

describe("AdminOverviewPage", () => {
  it("keeps the primary booking funnel to Book Page Visits -> NMC Booking Clicks, without a Leads Created stage", async () => {
    const tree = await AdminOverviewPage({ searchParams: Promise.resolve({}) });
    const funnels = findAll(tree, (el) => el.type === FunnelChart);
    expect(funnels).toHaveLength(1);
    const stageLabels = (funnels[0].props.stages as { label: string }[]).map((s) => s.label);
    expect(stageLabels).not.toContain("Leads Created");
    expect(stageLabels[stageLabels.length - 1]).toBe("NMC Booking Clicks");
    expect(stageLabels[stageLabels.length - 2]).toBe("Book Page Visits");
  });

  it("still shows Leads as a separate legacy KPI card, not folded into the funnel", async () => {
    const tree = await AdminOverviewPage({ searchParams: Promise.resolve({}) });
    const kpis = findAll(tree, (el) => el.type === KpiCard);
    const leadsCard = kpis.find((k) => k.props.label === "Leads");
    expect(leadsCard).toBeDefined();
    expect(leadsCard!.props.value).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/admin/(protected)/page.test.ts"`
Expected: FAIL — "Leads Created" is currently present in the funnel stages.

- [ ] **Step 3: Fix**

In `src/app/admin/(protected)/page.tsx`, change:

```tsx
        <FunnelChart
          stages={[
            { label: "Website Visits", count: funnel.visits },
            { label: "Book CTA Clicks", count: funnel.book_cta_clicks },
            { label: "Book Page Visits", count: funnel.book_page_views },
            { label: "Leads Created", count: funnel.leads_created },
            { label: "NMC Booking Clicks", count: funnel.nmc_booking_clicks },
          ]}
        />
```

to:

```tsx
        <FunnelChart
          stages={[
            { label: "Website Visits", count: funnel.visits },
            { label: "Book CTA Clicks", count: funnel.book_cta_clicks },
            { label: "Book Page Visits", count: funnel.book_page_views },
            { label: "NMC Booking Clicks", count: funnel.nmc_booking_clicks },
          ]}
        />
```

Also update the `<h2>` immediately above it — currently just "Funnel" — to "Booking Funnel" for clarity that this specifically tracks the book → NMC path, not a general acquisition funnel (the KPI cards above still cover Visitors/Page Views/Book CTA Clicks/Leads/NMC Booking Clicks as an overview independent of this sequential funnel).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/admin/(protected)/page.test.ts"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add "src/app/admin/(protected)/page.tsx" "src/app/admin/(protected)/page.test.ts"
git commit -m "$(cat <<'EOF'
fix(admin): funnel no longer treats lead creation as a required booking step

R9 booking funnel correction: the primary conversion path is now Book
Page Visit -> NMC Booking Click; /book no longer creates a lead at
all. "Leads Created" is removed from FunnelChart's sequential stages
(it implied a lead must exist before an NMC click could happen) and
stays visible only as the existing separate "Leads" KPI card, now
correctly framed as a legacy/historical metric.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Arabic glossary — booking-funnel terms

**Files:**
- Modify: `docs/arabic-medical-glossary.md`

- [ ] **Step 1: Add four rows**

Add to the table (these four strings are the owner's own verbatim suggested Arabic copy from the R9 booking funnel correction spec, not independently translated):

```markdown
| Book a Consultation (booking-handoff page H1) | احجز موعداً | /ar/book (R9 booking funnel correction) | Owner-specified verbatim. Distinct from the pre-existing shared `BookingCta` default string `احجز استشارة` (row above) — this one is specifically the /ar/book page's own H1, not a button label. |
| Continue to NMC Booking (primary CTA) | المتابعة إلى حجز الموعد عبر NMC | /ar/book (R9 booking funnel correction) | Owner-specified verbatim. Used only on the NmcBookingButton component, never as a BookingCta label. |
| "Appointments are managed through NMC" (supporting copy) | تُدار مواعيد الاستشارة مع [الطبيب] من خلال مستشفى إن إم سي رويال – مدينة خليفة | /ar/book (R9 booking funnel correction) | Owner-specified verbatim. |
| "You will be redirected to NMC" (supporting line) | سيتم تحويلك إلى نظام الحجز الرسمي لدى NMC | /ar/book (R9 booking funnel correction) | Owner-specified verbatim. |
```

- [ ] **Step 2: Commit**

```bash
git add docs/arabic-medical-glossary.md
git commit -m "$(cat <<'EOF'
docs: add /ar/book terminology to the Arabic glossary

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Whole-branch verification and the final 14-item deliverable report

This is the plan's closing task — no further Batch 4 work starts until this is delivered and the owner reviews it.

- [ ] **Step 1: Full verification suite**

Run, in order, stopping to fix forward (never skip a check) if any fails:

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
git diff --check
```

All five must pass clean. `git diff --check` catches stray whitespace/conflict-marker issues across every commit made in this plan.

- [ ] **Step 2: Confirm no destructive database action was taken**

```bash
git log --oneline feat/arabic-localization-r9-phase-b -- supabase/migrations/ | head -5
git show --stat <the Task 1 migration commit>
```

Confirm: the only new file under `supabase/migrations/` is `0007_booking_funnel_origin_page_and_nmc_click_fix.sql`, it contains no `drop table`/`drop column`/`truncate`/`delete from leads`, and it was never applied to any live database from this session (no `supabase db push`, no MCP `apply_migration` call, no `execute_sql` call was ever run against a live project during this plan — confirm by recollection of this plan's own execution, since there is no other record).

- [ ] **Step 3: Confirm historical lead data is untouched**

```bash
git log --oneline feat/arabic-localization-r9-phase-b -- src/lib/admin/queries.ts src/app/admin/**/leads/
```

Confirm `getLeads`/`getLead` (`src/lib/admin/queries.ts`) were never modified by this plan — they still read `leads` directly with the same column lists as before Task 1.

- [ ] **Step 4: Produce the final deliverable**

Compose and deliver to the owner exactly the 14 items requested in the R9 booking funnel correction spec:

1. **Files changed** — list every file touched across Tasks 1–13 (migration; `/api/events/route.ts`; `proxy.ts`; `NmcBookingButton.tsx`; `BookPageViewTracker.tsx`; English `/book/page.tsx`; deleted `BookingLeadForm.tsx`/`book/actions.ts(+test)`/`lead-schema.ts(+test)`; trimmed `discussion-topic.ts`; `routes.ts`; new `/ar/book/page.tsx`; `BookingCta.tsx`; `privacy/page.tsx`; admin `page.tsx`; glossary; every corresponding `*.test.ts`).
2. **New booking flow** — Clinical page → `/book` (or `/ar/book`) → `NmcBookingButton` → `practice.bookingUrl`, no intermediate step.
3. **Removed public-form elements** — name/email/discussion-topic fields, privacy-consent checkbox, the "How Booking Works" section, `BookingLeadForm`, the `createLead` server action.
4. **Analytics behavior** — `book_page_view`, `book_cta_click`, `nmc_booking_click` all still fire; `origin_page` and a cookie-derived `source` fallback are now attached server-side to every event.
5. **Attribution behavior** — `attr_first`/`attr_last`/`book_origin` cookies unchanged in how they're set (Task 4 only widens `book_origin`'s scope to `/ar/book`); UTM capture unchanged; all of it now also reaches `analytics_events` via Task 3's enrichment.
6. **Dashboard/funnel changes** — `admin_overview_kpis`/`admin_funnel`/`admin_page_performance`/`admin_source_performance` now compute `nmc_booking_clicks`/`nmc_clicks` from `analytics_events` instead of `leads`; the Overview page's `FunnelChart` no longer includes "Leads Created" as a sequential stage; "Leads" remains a separate KPI card.
7. **Lead-data preservation** — `leads` table schema, RLS, and all existing rows are completely untouched; `getLeads`/`getLead` are unmodified; the public flow simply stops calling `createLead` (which no longer exists).
8. **Privacy copy changes** — four sections rewritten (Information We Collect, Booking and Third-Party Links, Data Security, Your Rights) to stop describing the removed form as present reality, while still accurately acknowledging historical form submissions; five sections left untouched.
9. **`/ar/book` implementation** — new page, built directly to the low-friction spec (not a translation of the old form), Arabic copy per the owner's verbatim suggested strings.
10. **SEO/hreflang status** — `/book` now has `arPath: "/ar/book"` in `routes.ts`; both pages get self-canonical + reciprocal hreflang automatically via `buildMetadata()`; `/ar/book` is included in `sitemap.xml` per standard route policy (no `index: false` set).
11. **Tests/build results** — paste the actual pass/fail summary from Step 1's five commands.
12. **Known concerns** — (a) `admin_service_performance` was deliberately left reading only from `leads` (service-interest is now a purely historical/legacy concept, since `/book` collects no discussion topic — this is accurate, not broken); (b) `BookPageViewTracker`'s own hook-driven firing logic has no direct unit test (pre-existing gap, not introduced by this change — see Task 6); (c) the SQL migration is written but **not applied to any database** — this is Step 2's explicit safety decision, not an oversight, and needs the owner's own deploy step.
13. **Whether any migration was required** — YES: `supabase/migrations/0007_booking_funnel_origin_page_and_nmc_click_fix.sql`, additive only, **not yet applied**.
14. **Whether Production changed** — **NO.** No merge to `main`. No deploy. All work is on `feat/arabic-localization-r9-phase-b` only, verified in the local worktree.

Then **stop**. Do not merge to `main`. Do not deploy Production. Do not begin Batch 4 without explicit further instruction.
