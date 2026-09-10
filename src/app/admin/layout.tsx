import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Outer /admin shell — applies to every /admin route, including
 * /admin/login. Sets noindex (brief §34) but does NOT gate access
 * itself; the auth guard lives in `(protected)/layout.tsx` so
 * /admin/login (which has no data to protect) isn't caught by its own
 * redirect-to-login logic.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
