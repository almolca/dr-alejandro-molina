import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

/** Spec §7 Section 3 — Cause matrix, condensed as a diagnostic pathway, not a photo. */
const contributors = [
  "Vascular",
  "Hormonal",
  "Metabolic",
  "Neurological",
  "Medication-related",
  "Psychosexual",
];

/** Spec §7 Section 3 — editorial split layout. */
export function ErectileDysfunctionSection() {
  return (
    <section className="py-section-y">
      <Container className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Erectile Dysfunction
          </p>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Erectile Dysfunction Deserves a Diagnosis, Not Just a
            Prescription
          </h2>
          <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
            Erectile dysfunction can have vascular, hormonal, metabolic,
            neurological, medication-related and psychosexual
            contributors. Treatment is selected according to the
            underlying cause, medical history and individual priorities.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <Link
              href="/erectile-dysfunction"
              className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Erectile Dysfunction
            </Link>
            <Link
              href="/penile-implant"
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              Penile Implant Surgery
            </Link>
          </div>
        </Reveal>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Possible contributors
          </p>
          <StaggerGroup className="relative mt-6 border-l border-border pl-8">
            {contributors.map((item) => (
              <StaggerItem key={item} className="relative py-4">
                <span className="absolute -left-[calc(2rem+3px)] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-strong" />
                <span className="font-display text-xl text-foreground sm:text-2xl">
                  {item}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
