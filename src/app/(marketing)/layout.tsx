import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";

/**
 * Marketing shell — spec §20 suggested architecture groups public
 * marketing routes under `(marketing)/`. Header/footer chrome lives
 * here rather than the root layout, since `/privacy`, `/terms` and
 * `/medical-disclaimer` sit outside this group (spec §20) and a future
 * implementer may want a lighter legal-page layout.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
