"use client";

import { useActionState } from "react";
import { signIn } from "./actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm rounded-sm border border-stone-200 bg-white p-8">
        <h1 className="font-display text-2xl text-stone-900">Admin sign in</h1>
        <p className="mt-2 text-sm text-stone-500">Private analytics &amp; leads dashboard.</p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-stone-900">
              Email
            </label>
            <Input id="email" name="email" type="email" required autoComplete="email" className="mt-2" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-stone-900">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
