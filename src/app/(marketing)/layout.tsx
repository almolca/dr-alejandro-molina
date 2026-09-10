import { Suspense, type ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

/**
 * Marketing shell — spec §20 suggested architecture groups public
 * marketing routes under `(marketing)/`. Header/footer chrome lives
 * here rather than the root layout, since `/privacy`, `/terms` and
 * `/medical-disclaimer` sit outside this group (spec §20) and a future
 * implementer may want a lighter legal-page layout.
 *
 * `page_view` tracking (R7.2 brief §40) is mounted here — not in the
 * root layout — so legal/boilerplate pages and `/admin` never count
 * toward acquisition-funnel page views.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PageShell>
  );
}
