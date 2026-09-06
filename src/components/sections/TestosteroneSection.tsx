import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/** Spec §7 Section 5 — diagnostic pillars, shown as a flowing index rather than boxed cards. */
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

export function TestosteroneSection() {
  return (
    <section className="py-section-y">
      <Container>
        <SectionHeading
          eyebrow="Testosterone & Hormonal Health"
          heading="Testosterone Is Part of the Picture — Not the Whole Picture"
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal delay={0.05}>
            <blockquote className="font-display text-display-md italic leading-snug text-foreground">
              &ldquo;Symptoms come first.
              <br />
              Numbers need context.&rdquo;
            </blockquote>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              What assessment considers
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {pillars.map((pillar) => (
                <li
                  key={pillar}
                  className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
                >
                  {pillar}
                </li>
              ))}
            </ul>
            <Link
              href="/mens-health/testosterone"
              className="mt-10 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Male Hormonal Health
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
