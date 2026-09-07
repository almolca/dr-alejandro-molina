import { practiceLocationLine } from "@/config/practice";
import { BookingCta } from "@/components/ui/BookingCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

/** Spec §7 Section 1 — verbatim trust-strip credentials only (no invented claims). */
const trustStrip = [
  "European-trained",
  "Andrology & Sexual Medicine",
  "Penile Surgery",
  "Male Genital Aesthetics",
];

/**
 * Phase R1-R2: H1 now carries the physician's name directly (was a
 * generic specialty label, "Advanced Andrology & Men's Health") — the
 * audit found the previous H1 failed its own "why this doctor" test.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid min-h-[85vh] items-center gap-12 py-section-y lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Consultant Urologist &amp; Andrologist · Abu Dhabi
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-display-2xl text-foreground">
              Dr. Alejandro Molina
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Andrology · Men&rsquo;s Sexual Health · Male Genital Aesthetics
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
              Specialist care in sexual medicine, male hormonal health,
              penile surgery and male genital aesthetics, with
              particular expertise in Penile Girth Enhancement.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Consultant Urologist &amp; Andrologist
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {practiceLocationLine}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage="/" ctaPosition="hero" size="lg">
                Book a Confidential Consultation
              </BookingCta>
              <Button asChild variant="secondary" size="lg">
                <a href="/male-aesthetics/penile-girth-enhancement">
                  Explore Penile Girth Enhancement
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <MaskedReveal className="aspect-[4/5] w-full border border-border bg-surface lg:aspect-[3/4]">
          <ImagePlaceholder index="01" label="Portrait of Dr. Alejandro Molina" />
        </MaskedReveal>
      </Container>

      <div className="border-t border-border bg-surface">
        <Container>
          <Reveal>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {trustStrip.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
