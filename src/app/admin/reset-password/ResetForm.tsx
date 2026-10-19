"use client";
import { useActionState } from "react";
import { resetPassword } from "./actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
export function ResetForm() {
  const [state, action, pending] = useActionState(resetPassword, null);
  return <form action={action} className="mt-6 space-y-4">
    <p className="text-sm">Use 12–128 characters. / Usa entre 12 y 128 caracteres.</p>
    <label htmlFor="password">New password / Nueva contraseña</label>
    <Input id="password" name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" />
    <label htmlFor="confirmPassword">Confirm password / Confirmar contraseña</label>
    <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={12} maxLength={128} autoComplete="new-password" />
    {state && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
    <Button type="submit" disabled={pending}>{pending ? "Saving… / Guardando…" : "Save new password / Guardar contraseña"}</Button>
  </form>;
}
