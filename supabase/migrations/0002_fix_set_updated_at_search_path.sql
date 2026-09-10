-- 0002_fix_set_updated_at_search_path.sql
-- Pins search_path on the updated_at trigger function (flagged by
-- Supabase's security advisor as a mutable-search-path function).

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
