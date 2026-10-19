"use server";

import { z } from "zod";
import { createAdminAuthClient } from "@/lib/supabase/admin-auth-client";
import { recoveryOrigin } from "@/lib/auth/password-recovery";

export async function requestPasswordReset(_previous: { message: string } | null, form: FormData) {
  const email = z.string().trim().max(254).email().safeParse(form.get("email"));
  if (!email.success) return { message: "Enter a valid email address. / Introduce un email válido." };
  try {
    const client = await createAdminAuthClient();
    await client.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${recoveryOrigin()}/admin/reset-password/callback`,
    });
  } catch {
    // Do not disclose account existence, provider errors, or email delivery status.
  }
  return { message: "If the account exists, you will receive a recovery email. Open it in this browser. Please wait before trying again. / Si la cuenta existe, recibirás un email. Ábrelo en este navegador y espera antes de volver a intentarlo." };
}
