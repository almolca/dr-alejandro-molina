import { InternalLink as Link } from "@/components/ui/InternalLink";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

/**
 * Spec §7 Section 4 — "Premium dark section". The four items are laid
 * out as a bordered spec-sheet grid rather than shadowed cards, to stay
 * out of "SaaS dashboard" territory on a background that would make
 * that failure mode especially obvious.
 */
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
  {
    title: "Who may benefit",
    description:
      "Men with severe or refractory erectile dysfunction where other treatments no longer provide reliable results.",
  },
  {
    title: "Recovery & expectations",
    description:
      "A structured recovery period, with realistic expectations discussed at consultation.",
  },
];

export function PenileImplantSection() {
  return (
    <section className="section-dark bg-background py-section-y text-foreground">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <SectionHeading
            eyebrow="Penile Implant Surgery"
            heading="A Definitive Option for Advanced Erectile Dysfunction"
            description="Penile prosthesis surgery is an established surgical option for appropriately selected men with severe or refractory erectile dysfunction — considered once other treatments no longer provide reliable results."
          />

          <StaggerGroup className="grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2">
            {facts.map((fact) => (
              <StaggerItem
                key={fact.title}
                className="border-t border-border pt-6 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0 sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-border sm:[&:nth-child(n+3)]:pt-6"
              >
                <h3 className="font-display text-xl text-foreground">
                  <AmpersandText text={fact.title} />
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {fact.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/penile-implant"
            className="inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
          >
            Explore Penile Implants
          </Link>
        </div>
      </Container>
    </section>
  );
}
