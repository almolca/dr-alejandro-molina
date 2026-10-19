"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminAuthClient } from "@/lib/supabase/admin-auth-client";
import { isAllowedAdminEmail } from "@/lib/auth/admin";
import { passwordSchema, RECOVERY_COOKIE, validRecoveryProof } from "@/lib/auth/password-recovery";

export async function resetPassword(_previous: { error: string } | null, form: FormData) {
  const parsed = passwordSchema.safeParse({ password: form.get("password"), confirmPassword: form.get("confirmPassword") });
  if (!parsed.success) return { error: "Use 12–128 characters and matching passwords. / Usa entre 12 y 128 caracteres y contraseñas iguales." };
  const store = await cookies();
  try {
    const client = await createAdminAuthClient();
    const { data: { user }, error } = await client.auth.getUser();
    const { data: { session } } = await client.auth.getSession();
    if (error || !user || !session || !isAllowedAdminEmail(user.email) || !validRecoveryProof(store.get(RECOVERY_COOKIE)?.value, user.id, session.access_token)) {
      store.delete(RECOVERY_COOKIE);
      return { error: "Recovery link invalid or expired. Request another email. / Enlace inválido o caducado. Solicita otro email." };
    }
    const result = await client.auth.updateUser({ password: parsed.data.password });
    if (result.error) return { error: "Password could not be updated. Use a different password or request a new link. / No se pudo actualizar. Usa otra contraseña o solicita otro enlace." };
    store.delete(RECOVERY_COOKIE);
    await client.auth.signOut({ scope: "global" });
  } catch {
    return { error: "Unable to reset password. Request a new recovery email. / Solicita un nuevo email de recuperación." };
  }
  redirect("/admin/login?reset=success");
}
