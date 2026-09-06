import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

/** Spec §7 Section 6 — service list, not cards; luxurious but medically restrained. */
const services = [
  "Penile Girth Enhancement",
  "Scrotal Lift",
  "Assessment of Previous Fillers",
  "Complex / Revision Cases",
];

export function MaleAestheticsSection() {
  return (
    <section className="py-section-y">
      <Container className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* order-last on mobile: heading/copy before the placeholder
            image, even though the image sits left on desktop
            (lg:order-first) — found in the Phase 5 UX audit; the
            previous lg:order-2/lg:order-1 pair only reordered at the
            lg breakpoint, leaving mobile on unstyled source order
            (image first). */}
        <MaskedReveal className="order-last aspect-[4/5] w-full border border-border bg-surface lg:order-first">
          <ImagePlaceholder
            index="§6"
            caption="Editorial / material texture imagery — anatomy-led, not a clinical photograph. No genital close-ups."
          />
        </MaskedReveal>

        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Male Genital Aesthetics
            </p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">
              Male Genital Aesthetics
            </h2>
            <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
              An anatomy-led, medically supervised approach to penile
              enhancement and revision.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 space-y-5 border-t border-border pt-8">
              {services.map((service) => (
                <li key={service} className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="h-px w-6 shrink-0 bg-accent-strong"
                  />
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <Link
              href="/male-aesthetics"
              className="mt-10 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Explore Male Aesthetics
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
