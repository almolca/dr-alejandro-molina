-- 0001_leads_and_analytics.sql
-- R7.2 — Patient acquisition, booking attribution & analytics schema.
-- See docs/patient-acquisition.md for the full architecture writeup.

create extension if not exists pgcrypto;

-- ============================================================
-- leads
-- ============================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  full_name text not null,
  email text not null,
  phone text not null,

  service_interest text not null,
  status text not null default 'lead_created',
  preferred_contact_method text,

  first_touch_source text,
  first_touch_landing_page text,
  first_touch_at timestamptz,

  last_touch_source text,
  last_touch_page text,
  last_touch_at timestamptz,

  referrer text,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  booking_clicked_at timestamptz,

  privacy_consent boolean not null,
  privacy_consent_at timestamptz not null,

  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,

  metadata jsonb,

  constraint leads_service_interest_check check (service_interest in (
    'erectile_dysfunction','penile_doppler','venous_leak','premature_ejaculation',
    'penile_girth','filler_correction','male_aesthetics','penile_implant',
    'peyronies','testosterone','fertility','varicocele','vasectomy',
    'general_urology','other'
  )),
  constraint leads_status_check check (status in (
    'lead_created','sent_to_nmc','booked','attended','cancelled','not_booked'
  )),
  constraint leads_privacy_consent_check check (privacy_consent = true),
  constraint leads_full_name_len check (char_length(full_name) between 1 and 200),
  constraint leads_email_len check (char_length(email) between 3 and 254),
  constraint leads_phone_len check (char_length(phone) between 3 and 40)
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_service_interest_idx on public.leads (service_interest);
create index leads_utm_source_idx on public.leads (utm_source);
create index leads_first_touch_source_idx on public.leads (first_touch_source);

alter table public.leads enable row level security;
-- No policies created: default-deny. Only the service role (which
-- bypasses RLS entirely) can read/write. No anon/authenticated policy
-- of any kind exists for this table, by design (brief §17).

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- analytics_events
-- ============================================================
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  anonymous_session_id text not null,
  event_name text not null,
  path text not null,
  service_interest text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer_category text,
  metadata jsonb,

  constraint analytics_events_event_name_check check (event_name in (
    'page_view','book_cta_click','book_page_view',
    'lead_submit_success','lead_submit_error','nmc_booking_click',
    'physician_profile_click'
  )),
  constraint analytics_events_path_len check (char_length(path) between 1 and 500),
  constraint analytics_events_session_len check (char_length(anonymous_session_id) between 1 and 100)
);

create index analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index analytics_events_event_name_idx on public.analytics_events (event_name);
create index analytics_events_path_idx on public.analytics_events (path);
create index analytics_events_source_idx on public.analytics_events (source);

alter table public.analytics_events enable row level security;
-- No policies: default-deny, service role only (same rationale as leads).

-- ============================================================
-- Admin aggregation RPCs — SECURITY DEFINER, service_role only.
-- Each takes a [start_at, end_at) timestamptz window.
-- ============================================================

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
    (select count(*) from leads
       where status = 'sent_to_nmc' and booking_clicked_at >= start_at and booking_clicked_at < end_at);
$$;

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
    (select count(*) from leads where status = 'sent_to_nmc' and booking_clicked_at >= start_at and booking_clicked_at < end_at);
$$;

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
  )
  select
    coalesce(v.path, c.path) as path,
    coalesce(v.c, 0) as views,
    coalesce(c.c, 0) as book_clicks,
    0::bigint as leads,
    0::bigint as nmc_clicks
  from page_views v
  full outer join clicks c on c.path = v.path
  order by coalesce(v.c, 0) desc;
$$;

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
    select coalesce(last_touch_source, 'other') as source, count(*) c
    from leads
    where status = 'sent_to_nmc' and booking_clicked_at >= start_at and booking_clicked_at < end_at
    group by 1
  )
  select
    coalesce(s.source, c.source, l.source, n.source) as source,
    coalesce(s.c, 0), coalesce(c.c, 0), coalesce(l.c, 0), coalesce(n.c, 0)
  from sessions s
  full outer join clicks c using (source)
  full outer join lead_rows l using (source)
  full outer join nmc_rows n using (source)
  order by coalesce(l.c, 0) desc;
$$;

create or replace function public.admin_service_performance(start_at timestamptz, end_at timestamptz)
returns table (
  service_interest text,
  leads bigint,
  nmc_clicks bigint
)
language sql security definer set search_path = public as $$
  with lead_rows as (
    select service_interest, count(*) c from leads
    where created_at >= start_at and created_at < end_at
    group by 1
  ),
  nmc_rows as (
    select service_interest, count(*) c from leads
    where status = 'sent_to_nmc' and booking_clicked_at >= start_at and booking_clicked_at < end_at
    group by 1
  )
  select coalesce(l.service_interest, n.service_interest), coalesce(l.c, 0), coalesce(n.c, 0)
  from lead_rows l full outer join nmc_rows n using (service_interest)
  order by coalesce(l.c, 0) desc;
$$;

revoke execute on function public.admin_overview_kpis(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_funnel(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_page_performance(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_source_performance(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.admin_service_performance(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.admin_overview_kpis(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_funnel(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_page_performance(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_source_performance(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_service_performance(timestamptz, timestamptz) to service_role;
