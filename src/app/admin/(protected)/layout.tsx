import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/auth/admin";
import { signOut } from "@/app/admin/login/actions";

/**
 * Guarded admin shell — R7.2 brief §25/§27/§34. Every route under this
 * group requires an authenticated, allow-listed session; unauthorized
 * visitors are redirected to /admin/login before any lead data is
 * fetched, let alone rendered (brief §26: "no lead data client-side
 * before auth is confirmed").
 */
export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/leads", label: "Leads" },
];

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const { email } = await requireAdminSession();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <nav className="flex flex-wrap gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span>{email}</span>
            <form action={signOut}>
              <button type="submit" className="underline underline-offset-2 hover:text-stone-900">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
