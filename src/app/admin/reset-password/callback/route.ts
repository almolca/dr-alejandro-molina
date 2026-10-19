import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createAdminAuthClient } from "@/lib/supabase/admin-auth-client";
import { isAllowedAdminEmail } from "@/lib/auth/admin";
import { createRecoveryProof, RECOVERY_COOKIE, recoveryOrigin } from "@/lib/auth/password-recovery";

export async function GET(request: NextRequest) {
  const store = await cookies();
  store.delete(RECOVERY_COOKIE);
  const destination = new URL("/admin/reset-password", recoveryOrigin());
  const code = request.nextUrl.searchParams.get("code");
  try {
    if (code && !request.nextUrl.searchParams.has("error")) {
      const client = await createAdminAuthClient();
      const flowId = request.nextUrl.searchParams.get("sb_flow_id");
      const { data, error } = await client.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
      if (!error && "redirectType" in data && data.redirectType === "recovery" && data.user && data.session && isAllowedAdminEmail(data.user.email)) {
        store.set(RECOVERY_COOKIE, createRecoveryProof(data.user.id, data.session.access_token), {
          httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge: 900,
        });
        return NextResponse.redirect(destination, 303);
      }
      await client.auth.signOut({ scope: "local" });
    }
  } catch { /* Fail closed without returning tokens or provider messages. */ }
  destination.searchParams.set("error", "invalid");
  return NextResponse.redirect(destination, 303);
}
