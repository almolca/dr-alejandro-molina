"use client";

import { isBookingConfigured, practice } from "@/config/practice";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

/**
 * The single primary CTA on /book and /ar/book (R9 booking funnel
 * correction) — a direct, low-friction handoff to NMC's own booking
 * system. Always a real `<a href={practice.bookingUrl}>`, never a
 * button-only onClick handler: clicking it must navigate natively even
 * if `trackEvent()` no-ops (no analytics consent), the JS bundle never
 * loads, or the `/api/events` beacon fails — booking must never depend
 * on any of that. Mirrors `components/ui/BookingCta.tsx`'s own
 * graceful-degradation pattern while `practice.bookingUrl` is unset.
 */
export function NmcBookingButton({
  sourcePage,
  label,
  className,
}: {
  sourcePage: string;
  label: string;
  className?: string;
}) {
  if (!isBookingConfigured) {
    return (
      <Button
        size="lg"
        disabled
        title="Booking link pending owner confirmation"
        className={cn(className)}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className={className}>
      <a
        href={practice.bookingUrl}
        onClick={() =>
          trackEvent({
            name: "nmc_booking_click",
            properties: { source_page: sourcePage, cta_position: "book-page-primary" },
          })
        }
      >
        {label}
      </a>
    </Button>
  );
}
