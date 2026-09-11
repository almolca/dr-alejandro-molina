import { Suspense, type ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default function ArabicMarketingLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell locale="ar">
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PageShell>
  );
}
