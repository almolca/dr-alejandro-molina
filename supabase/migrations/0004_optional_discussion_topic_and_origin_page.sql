-- 0004_optional_discussion_topic_and_origin_page.sql
-- R7.2 UX/privacy addendum: /book's service field becomes an optional,
-- broader "discussion topic" (patient-controlled, not a diagnosis) and
-- a visitor must not be recorded as having a specific condition merely
-- because of which marketing page linked them here.
--
-- service_interest: relaxed to nullable, and its check constraint
-- swapped to the new broader 8-value enum (src/lib/domain/discussion-
-- topic.ts). The table has 0 rows in this project, so no data
-- migration is needed for the value-domain change.
--
-- origin_page: new nullable column — the marketing page that actually
-- linked to /book, captured reliably at /book's initial page load
-- (src/proxy.ts), not at form-submission time (the previous
-- `referrer` column, captured when the lead form POSTs, always
-- resolves to `/book` itself and was never a reliable "page before
-- booking" signal — documented as a known limitation, now fixed).

alter table public.leads alter column service_interest drop not null;

alter table public.leads drop constraint leads_service_interest_check;

alter table public.leads add constraint leads_service_interest_check check (
  service_interest is null or service_interest in (
    'mens_sexual_health','penile_doppler_vascular','male_hormonal_health',
    'penile_girth','penile_surgery','male_aesthetics','fertility','general_urology'
  )
);

alter table public.leads add column origin_page text;

create index leads_origin_page_idx on public.leads (origin_page);
