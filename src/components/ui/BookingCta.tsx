"use client";

import Link from "next/link";
import { isBookingConfigured } from "@/config/practice";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { Button, type ButtonProps } from "./Button";

/**
 * Primary booking CTA — R7.2 brief §22. Routes to the owned lead-capture
 * funnel (`/book`, preserving service context) rather than linking
 * straight to NMC; the NMC handoff now happens only from inside `/book`
 * after a lead is captured (`BookingLeadForm`'s "Continue to NMC
 * Booking" step). Fires `book_cta_click`, not `nmc_booking_click` — that
 * event belongs solely to the post-lead-capture NMC handoff. Degrades
 * gracefully while `practice.bookingUrl` is still a placeholder (see
 * config/practice.ts), same as before.
 */
export function BookingCta({
  children = "Book a Consultation",
  service,
  ctaPosition,
  sourcePage,
  className,
  variant,
  size,
}: {
  children?: React.ReactNode;
  service?: string;
  ctaPosition: string;
  sourcePage: string;
} & Pick<ButtonProps, "className" | "variant" | "size">) {
  if (!isBookingConfigured) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        disabled
        title="Booking link pending owner confirmation"
      >
        {children}
      </Button>
    );
  }

  const href = service ? `/book?service=${encodeURIComponent(service)}` : "/book";

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link
        href={href}
        onClick={() =>
          trackEvent({
            name: "book_cta_click",
            properties: {
              source_page: sourcePage,
              service,
              cta_position: ctaPosition,
            },
          })
        }
      >
        {children}
      </Link>
    </Button>
  );
}
