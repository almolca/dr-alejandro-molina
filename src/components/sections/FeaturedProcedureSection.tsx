import Link from "next/link";
import { doctor } from "@/config/doctor";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Homepage flagship-procedure section — SEO_RESTRUCTURE_IMPLEMENTATION_
 * PLAN.md Phase A3. Introduces Penile Girth Enhancement by name as the
 * site's most prominent single internal link, without turning the
 * homepage into a procedure landing page (only one section among many —
 * see page.tsx composition). Copy reuses phrasing already live and
 * approved on the treatment page itself; the two authority lines are
 * config-driven and simply don't render if unset, same pattern as
 * AuthorityStripSection.
 */
const authorityLines = [
  doctor.girthProcedureCount !== undefined &&
    `${doctor.girthProcedureCount} procedures performed`,
  doctor.girthEnhancementSince !== undefined &&
    `Performing penile girth enhancement since ${doctor.girthEnhancementSince}`,
].filter((line): line is string => Boolean(line));

export function FeaturedProcedureSection() {
  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Flagship Procedure
          </p>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Penile Girth Enhancement
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground">
            Dr. Molina provides specialist, Consultant-led penile girth
            enhancement using hyaluronic acid — planned around individual
            anatomy, with realistic expectations and specialist
            follow-up.
          </p>
        </Reveal>

        {authorityLines.length > 0 && (
          <Reveal delay={0.05}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {authorityLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/male-aesthetics/penile-girth-enhancement">
                Learn About Penile Girth Enhancement
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
