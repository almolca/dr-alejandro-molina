import { InternalLink as Link } from "@/components/ui/InternalLink";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const facts = [
  {
    title: "Inflatable implants",
    description:
      "Two- or three-piece devices designed to closely mirror natural rigidity and flaccidity.",
  },
  {
    title: "Malleable implants",
    description:
      "Semi-rigid rods that can be manually positioned, with no mechanical parts.",
  },
];

const steps = [
  "Consultation",
  "Hormonal / metabolic assessment",
  "Penile vascular assessment where indicated",
  "Individual treatment strategy",
];

/**
 * Homepage section merging the former standalone PenileImplant and
 * AdvancedAssessment sections — Phase R1-R2 consolidation. Deliberately
 * NOT `.section-dark`: Penile Girth Enhancement now holds the
 * homepage's one dark "flagship" moment (FeaturedProcedureSection), so
 * this secondary-priority surgical section uses the site's plain light
 * treatment instead, correcting the previous visual-priority mismatch
 * the audit found (Implant outweighing the explicitly-named flagship).
 */
export function AdvancedPenileSurgerySection() {
  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow="Advanced Penile Surgery"
          heading="A Definitive Option, Reached Through Assessment"
          description="Penile implant surgery is a considered, later-stage option — reached after a structured assessment, not offered as a first step."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2">
          {facts.map((fact) => (
            <StaggerItem key={fact.title}>
              <h3 className="font-display text-xl text-foreground">
                <AmpersandText text={fact.title} />
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{fact.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-14 border-t border-border pt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How the cause is confirmed first
          </p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, index) => (
              <StaggerItem key={step}>
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 max-w-[20ch] text-sm text-foreground">{step}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
            <Link
              href="/penile-implant"
              className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Penile Implants
            </Link>
            <Link
              href="/erectile-dysfunction/penile-doppler"
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              Penile Duplex Ultrasound
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
