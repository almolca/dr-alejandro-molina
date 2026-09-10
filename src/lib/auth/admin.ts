import { redirect } from "next/navigation";
import { createAdminAuthClient } from "@/lib/supabase/admin-auth-client";

/**
 * Admin access model — R7.2 brief §26. A simple server-side email
 * allowlist, not a roles table — proportionate for a single-owner MVP.
 * `ADMIN_ALLOWED_EMAILS` is comma-separated, case-insensitive, trimmed.
 */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

/**
 * Server-only guard for every /admin route — brief §25/§34. Redirects
 * to /admin/login if there is no session or the session's email isn't
 * allow-listed, so lead data is never exposed client-side before auth
 * is confirmed.
 */
export async function requireAdminSession(): Promise<{ email: string }> {
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAllowedAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return { email: user.email };
}
