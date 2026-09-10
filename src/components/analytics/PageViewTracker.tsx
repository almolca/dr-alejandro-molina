"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";

/**
 * Sitewide `page_view` tracker for marketing pages — R7.2 brief §40/§41.
 * Mounted once in `(marketing)/layout.tsx`; fires on the initial mount
 * and on every client-side pathname change, de-duplicated against the
 * same path firing twice in a row (covers React re-renders/hydration
 * without suppressing a genuine back/forward navigation to the same path).
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    trackEvent({
      name: "page_view",
      properties: {
        path: pathname,
        utm_source: searchParams.get("utm_source") ?? undefined,
        utm_medium: searchParams.get("utm_medium") ?? undefined,
        utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      },
    });
    // Intentionally excludes `searchParams` — a query-string-only change
    // (e.g. a filter) is not a new page view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
