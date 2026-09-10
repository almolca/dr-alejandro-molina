import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BrandCurve } from "@/components/ui/BrandCurve";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedProcedureSection() {
  return (
    <section className="section-dark relative overflow-hidden bg-background py-section-y text-foreground">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">Flagship Procedure</p>
          <h2 className="mt-4 max-w-xl font-display text-display-xl">Penile Girth Enhancement</h2>
          <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
            Dr. Molina provides specialist, Consultant-led penile girth enhancement using hyaluronic acid — planned around individual anatomy, with realistic expectations and specialist follow-up.
          </p>
          <Button asChild size="lg" className="mt-8"><Link href="/male-aesthetics/penile-girth-enhancement">Explore Penile Girth Enhancement</Link></Button>
        </Reveal>
        <div className="border-l border-accent-strong/50 pl-8">
          <BrandCurve className="mb-10 h-8 w-full text-accent-strong" />
          <p className="font-display text-3xl leading-snug">Anatomy.<br />Precision.<br /><em>Continuity of care.</em></p>
          <p className="mt-6 text-sm text-muted-foreground">Assessment → Individual planning → Follow-up</p>
        </div>
      </Container>
    </section>
  );
}
