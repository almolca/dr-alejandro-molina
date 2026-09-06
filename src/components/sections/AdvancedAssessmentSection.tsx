import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

/** Spec §7 Section 7 — horizontal flow. */
const steps = [
  "Consultation",
  "Hormonal / metabolic assessment",
  "Penile vascular assessment where indicated",
  "Individual treatment strategy",
];

export function AdvancedAssessmentSection() {
  return (
    <section className="bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow="Advanced ED Assessment"
          heading="Understand the Cause Before Choosing the Treatment"
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {steps.map((step, index) => (
            <StaggerItem key={step} className="relative pr-8">
              <span className="font-display text-3xl text-accent-strong">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 max-w-[20ch] font-display text-lg text-foreground">
                {step}
              </p>
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-0 top-4 hidden h-px w-6 bg-border lg:block"
                />
              )}
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col gap-8 border-t border-border pt-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Featured
              </p>
              <h3 className="mt-3 font-display text-xl text-foreground">
                Penile Duplex Ultrasound
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Ultrasound assessment of penile blood flow, used when
                vascular contributors to erectile dysfunction need to be
                evaluated.
              </p>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground md:text-right">
              Shockwave therapy may be considered for selected patients
              where clinically appropriate.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
