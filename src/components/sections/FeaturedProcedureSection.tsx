import Link from "next/link";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Homepage flagship-procedure section — SEO_RESTRUCTURE_IMPLEMENTATION_
 * PLAN.md Phase A3, upgraded to `.section-dark` in Phase R1-R2. The
 * audit found Penile Girth Enhancement was explicitly called "flagship"
 * in copy sitewide but never received the homepage's strongest visual
 * treatment — Penile Implant Surgery did, via its own dark band. This
 * section now holds the homepage's one dark "flagship" moment instead,
 * with the same AuthorityBlock metrics used on the treatment page
 * itself, so authority is visible here too, not just asserted in prose.
 */
export function FeaturedProcedureSection() {
  return (
    <section className="section-dark relative bg-background py-section-y text-foreground">
      <EditorialTexture />
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

        <Reveal delay={0.05}>
          <div className="mt-10">
            <AuthorityBlock align="center" />
          </div>
        </Reveal>

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
