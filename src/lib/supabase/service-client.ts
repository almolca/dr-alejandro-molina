import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — server-only, brief §17. Bypasses RLS
 * entirely, so it must never be imported from a Client Component or any
 * module that could end up in the browser bundle. Guarded at runtime
 * (rather than via the `server-only` package, to avoid an extra
 * dependency) since `SUPABASE_SERVICE_ROLE_KEY` is never available in
 * the browser anyway — this throw is a clear failure mode, not the
 * primary safeguard.
 */
let cached: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("getServiceSupabase() must never be called from the browser.");
  }
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase service role is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
