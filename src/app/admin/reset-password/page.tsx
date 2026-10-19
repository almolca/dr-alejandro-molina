import Link from "next/link";
import { cookies } from "next/headers";
import { createAdminAuthClient } from "@/lib/supabase/admin-auth-client";
import { isAllowedAdminEmail } from "@/lib/auth/admin";
import { RECOVERY_COOKIE, validRecoveryProof } from "@/lib/auth/password-recovery";
import { ResetForm } from "./ResetForm";
export default async function ResetPasswordPage() {
  let valid = false;
  try {
    const client = await createAdminAuthClient();
    const { data: { user }, error } = await client.auth.getUser();
    const { data: { session } } = await client.auth.getSession();
    valid = !error && !!user && !!session && isAllowedAdminEmail(user.email) && validRecoveryProof((await cookies()).get(RECOVERY_COOKIE)?.value, user.id, session.access_token);
  } catch { /* Missing or expired recovery fails closed. */ }
  return <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4"><div className="w-full max-w-md border border-stone-200 bg-white p-8">
    <h1 className="font-display text-2xl">New password / Nueva contraseña</h1>
    {valid ? <ResetForm /> : <p role="alert" className="mt-6">Recovery link invalid or expired. Request a new email and open it in the same browser. / Enlace inválido o caducado. Solicita otro email y ábrelo en el mismo navegador.</p>}
    <Link href="/admin/forgot-password" className="mt-6 block underline">Request recovery email / Solicitar email</Link>
  </div></main>;
}
