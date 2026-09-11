import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";

/**
 * Legal pages sit outside `(marketing)` per spec §20's architecture
 * (siblings to it, not nested), but still get the same global chrome —
 * shared here rather than duplicating `PageShell` in three files.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
