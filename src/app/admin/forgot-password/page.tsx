"use client";
import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "./actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  return <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4"><div className="w-full max-w-md border border-stone-200 bg-white p-8">
    <h1 className="font-display text-2xl">Reset password / Recuperar contraseña</h1>
    <form action={action} className="mt-6 space-y-4">
      <label htmlFor="email">Email</label><Input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
      {state && <p role="status" className="text-sm">{state.message}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Sending… / Enviando…" : "Send recovery email / Enviar email"}</Button>
    </form><Link href="/admin/login" className="mt-6 block underline">Back to sign in / Volver al login</Link>
  </div></main>;
}
