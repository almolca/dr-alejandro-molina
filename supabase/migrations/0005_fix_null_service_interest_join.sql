-- 0005_fix_null_service_interest_join.sql
-- R7.2.2 bug fix: admin_service_performance's `full outer join ...
-- using (service_interest)` never merges rows where service_interest
-- is NULL on both sides — standard SQL equality never matches NULL to
-- NULL (this is also why plain `using (col)`/`ON a.col = b.col` joins
-- silently fail to combine two "not specified" groups). Reproduced
-- live: a lead with no discussion topic and a separate NMC click on a
-- no-topic lead showed as two separate `service_interest: null` rows
-- (`{null, leads:1, nmc_clicks:0}` and `{null, leads:0, nmc_clicks:1}`)
-- instead of one combined row. Fixed by coalescing NULL to a sentinel
-- before the join (so NULL-vs-NULL becomes sentinel-vs-sentinel, which
-- *does* match), then converting the sentinel back to NULL in the
-- final projection via `nullif`. `admin_source_performance` already
-- uses this exact pattern (coalesce before join) and was never
-- affected; `admin_page_performance` joins on the NOT NULL `path`
-- column and was never affected either — this was isolated to
-- `admin_service_performance`.

create or replace function public.admin_service_performance(start_at timestamptz, end_at timestamptz)
returns table (
  service_interest text,
  leads bigint,
  nmc_clicks bigint
)
language sql security definer set search_path = public as $$
  with lead_rows as (
    select coalesce(service_interest, '__not_specified__') as service_interest, count(*) c from leads
    where created_at >= start_at and created_at < end_at
    group by 1
  ),
  nmc_rows as (
    select coalesce(service_interest, '__not_specified__') as service_interest, count(*) c from leads
    where status = 'sent_to_nmc' and booking_clicked_at >= start_at and booking_clicked_at < end_at
    group by 1
  )
  select
    nullif(coalesce(l.service_interest, n.service_interest), '__not_specified__'),
    coalesce(l.c, 0),
    coalesce(n.c, 0)
  from lead_rows l full outer join nmc_rows n using (service_interest)
  order by coalesce(l.c, 0) desc;
$$;
