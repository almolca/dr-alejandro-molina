"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminAuthClient } from "@/lib/supabase/admin-auth-client";
import { isAllowedAdminEmail } from "@/lib/auth/admin";

const signInSchema = z.object({
  email: z.string().trim().max(254).email(),
  password: z.string().min(1).max(200),
});

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createAdminAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user?.email) {
    return { error: "Invalid credentials." };
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAdminAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
