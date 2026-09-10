import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cookie-bound Supabase client for admin auth (login/session) —
 * R7.2 brief §25/§26. Uses the anon/publishable key, never the service
 * role key. A new client must be created per request (Supabase SSR
 * guidance), so this is a factory, not a singleton.
 */
export async function createAdminAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component that can't set cookies
            // (no active response to attach to) — safe to ignore since
            // session refresh will retry from a Server Action/Route
            // Handler, per @supabase/ssr's own guidance.
          }
        },
      },
    },
  );
}
