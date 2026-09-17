"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { isBookingConfigured } from "@/config/practice";
import { isArabicPath } from "@/lib/seo/routes";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { Button, type ButtonProps } from "./Button";

/**
 * Pure routing logic, extracted from the component so it's directly
 * unit-testable without a render (usePathname() can't be exercised
 * outside one). Routes to /ar/book on any Arabic page, /book otherwise
 * — this is the actual fix for the bug this task addresses: every
 * Arabic page's BookingCta previously linked to the English /book.
 */
export function resolveBookHref(pathname: string, service?: string): string {
  const bookPath = isArabicPath(pathname) ? "/ar/book" : "/book";
  return service ? `${bookPath}?service=${encodeURIComponent(service)}` : bookPath;
}

/**
 * Primary booking CTA — routes to /book (or /ar/book on an Arabic
 * page) for the direct, low-friction NMC handoff; /book no longer
 * collects a lead (R9 booking funnel correction). Fires
 * `book_cta_click`. Degrades gracefully while `practice.bookingUrl` is
 * still a placeholder (see config/practice.ts).
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
  const pathname = usePathname();

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

  const href = resolveBookHref(pathname, service);

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
