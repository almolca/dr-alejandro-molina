"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";
import type { ServiceInterest } from "@/lib/domain/service-interest";

/**
 * Fires `book_page_view` once per mount — brief §11/§41 (dedup against
 * React re-renders/hydration). A `useRef` guard on top of the effect's
 * empty dependency array, since Strict Mode double-invokes effects in
 * development and this must still fire exactly once logically.
 */
export function BookPageViewTracker({ service }: { service?: ServiceInterest }) {
  const searchParams = useSearchParams();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackEvent({
      name: "book_page_view",
      properties: {
        path: "/book",
        service,
        utm_source: searchParams.get("utm_source") ?? undefined,
        utm_medium: searchParams.get("utm_medium") ?? undefined,
        utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      },
    });
    // Fire once on mount only — see the ref guard above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
