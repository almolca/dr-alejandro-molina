-- 0003_make_phone_optional.sql
-- R7.2 UX simplification: the public booking form no longer collects
-- phone, preferred contact method, or marketing consent — only name,
-- email, service, and privacy consent. `phone` was NOT NULL; relax it
-- (non-destructive, existing rows unaffected) rather than drop the
-- column, so nothing about the existing schema or historical leads
-- breaks. `preferred_contact_method` and `marketing_consent` were
-- already nullable/defaulted and need no change.

alter table public.leads alter column phone drop not null;
