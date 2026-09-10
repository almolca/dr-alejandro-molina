import { ClinicalDecisionFlow } from "@/components/editorial/ClinicalDecisionFlow";
import visual from "@/components/editorial/VisualSystem.module.css";
import { VascularFlowDiagram } from "@/components/illustrations/VascularFlowDiagram";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const contributors = [
  "Vascular",
  "Hormonal",
  "Metabolic",
  "Neurological",
  "Medication-related",
  "Psychosexual",
];

const pillars = [
  "Symptoms",
  "Total & free testosterone",
  "SHBG",
  "LH / FSH",
  "Prolactin",
  "Thyroid",
  "Metabolic health",
  "Sleep",
  "Fertility plans",
];

/**
 * Homepage section merging the former standalone ErectileDysfunction
 * and Testosterone sections into one "Sexual & Hormonal Health" module
 * — Phase R1-R2 homepage consolidation (13 → 10 sections).
 */
export function SexualHormonalHealthSection() {
  return (
    <section className={`${visual.clinicalBand} py-section-y`}>
      <Container>
        <SectionHeading eyebrow="Sexual & Hormonal Health" heading="Diagnosis Before Treatment, in Both Directions" />

        <ClinicalDecisionFlow />

        <div className="mt-10 grid gap-16 border-t border-border pt-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h3 className="font-display text-display-md text-foreground">
              Erectile Dysfunction Deserves a Diagnosis, Not Just a Prescription
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Erectile dysfunction can have vascular, hormonal, metabolic,
              neurological, medication-related and psychosexual
              contributors. Treatment is selected according to the
              underlying cause, medical history and individual priorities.
            </p>
            <StaggerGroup className="relative mt-8 border-l border-border pl-8">
              {contributors.map((item) => (
                <StaggerItem key={item} className="relative py-2">
                  <span className="absolute -left-[calc(2rem+3px)] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-strong" />
                  <span className="text-sm text-foreground">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link
                href="/erectile-dysfunction"
                className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                Explore Erectile Dysfunction
              </Link>
            </div>
            <VascularFlowDiagram className="mt-10 h-20 w-32 text-muted-foreground" />
          </Reveal>

          <Reveal delay={0.05}>
            <blockquote className="font-display text-display-md italic leading-snug text-foreground">
              &ldquo;Symptoms come first.
              <br />
              Numbers need context.&rdquo;
            </blockquote>
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              What assessment considers
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {pillars.map((pillar) => (
                <li
                  key={pillar}
                  className="border-b border-border px-1 py-2 text-sm text-foreground"
                >
                  {pillar}
                </li>
              ))}
            </ul>
            <Link
              href="/mens-health/testosterone"
              className="mt-8 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Male Hormonal Health
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
