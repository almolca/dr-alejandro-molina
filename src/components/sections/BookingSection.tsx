import {
  isPhysicianProfileConfigured,
  practice,
  practiceLocationLine,
} from "@/config/practice";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Spec §7 Section 11 — strong closing CTA. Olive tone bookends the dark implant section without repeating it. */
export function BookingSection() {
  return (
    <section className="section-olive bg-background py-section-y text-foreground">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Consultation
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-display-xl text-foreground">
            Consult Dr. Alejandro Molina in Abu Dhabi
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground">
            {practiceLocationLine}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BookingCta
              sourcePage="/"
              ctaPosition="closing-section"
              size="lg"
            />
            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                View NMC Profile
              </a>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
