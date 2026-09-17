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
