-- 0006_add_locale_to_analytics_events.sql
-- R9 Phase A: tag analytics_events with the locale (en/ar) the event
-- fired from. Derived client-side from the page path in trackEvent()
-- (src/lib/analytics/events.ts) — not user input, not PII. Nullable so
-- any pre-migration rows remain valid; every new row going forward
-- always carries a value since trackEvent() always computes one.

alter table public.analytics_events add column locale text;

alter table public.analytics_events add constraint analytics_events_locale_check
  check (locale is null or locale in ('en', 'ar'));

create index analytics_events_locale_idx on public.analytics_events (locale);
