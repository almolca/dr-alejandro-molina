"use client";

import { isBookingConfigured, practice } from "@/config/practice";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { Button, type ButtonProps } from "./Button";

/**
 * Primary booking CTA — spec §26: tracks `nmc_booking_click`, opens the
 * official NMC flow safely (`rel="noopener noreferrer"`, spec §32), and
 * degrades gracefully while `practice.bookingUrl` is still a placeholder
 * (see config/practice.ts) rather than linking to a broken/fabricated URL.
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

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={practice.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent({
            name: "nmc_booking_click",
            properties: {
              source_page: sourcePage,
              service,
              cta_position: ctaPosition,
            },
          })
        }
      >
        {children}
      </a>
    </Button>
  );
}
