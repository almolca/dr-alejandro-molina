import type { ReactNode } from "react";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Closing consultation CTA reused across inner treatment pages (spec
 * §29: every treatment page ends with a "CTA to consultation"). Kept
 * light/surface-toned deliberately — each page gets its own one
 * distinctive dark or olive moment elsewhere for rhythm (spec §16
 * "restrained dark sections"); repeating that treatment at the same
 * closing position on every page would make it expected rather than
 * restrained.
 */
export function TreatmentCtaSection({
  heading,
  sourcePage,
  secondary,
  bookingLabel,
}: {
  heading: ReactNode;
  sourcePage: string;
  secondary?: { label: string; href: string };
  /** Override the default "Book a Consultation" wording for this page only — e.g. "Book a Confidential Consultation" on Penile Filler Correction. */
  bookingLabel?: string;
}) {
  return (
    <section className="bg-surface py-section-y">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <h2 className="mx-auto max-w-xl font-display text-display-md text-foreground">
            {heading}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <BookingCta sourcePage={sourcePage} ctaPosition="page-closing-cta" size="lg">
              {bookingLabel}
            </BookingCta>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
