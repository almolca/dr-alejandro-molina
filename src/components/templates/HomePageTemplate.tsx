import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { Reveal } from "@/components/motion/Reveal";
import type { HomePageContent } from "@/content/types";

/**
 * Homepage page-family template (R9 Phase A, spec §5 Approach C). Takes
 * typed content and renders it with the existing shared primitives — no
 * layout decisions live in the content object itself. This is an
 * intentionally reduced "representative subset" of the full English
 * homepage's ~10 sections (hero, trust/authority stats, FAQ, booking
 * CTA only) — full section parity is a Phase B follow-up, not built
 * here.
 */
export function HomePageTemplate({ content }: { content: HomePageContent }) {
  return (
    <div>
      <section className="relative overflow-hidden py-section-y">
        <HeroAtmosphere align="left" />
        <Container className="relative z-10">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              {content.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-display-2xl text-foreground">
              {content.hero.heading}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {content.hero.specialtyLine}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
              {content.hero.description}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">{content.hero.credentialLine}</p>
              <p className="mt-1 text-sm text-muted-foreground">{content.hero.locationLine}</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <BookingCta sourcePage="/ar" ctaPosition="homepage-pilot-hero">
                {content.hero.ctaLabel}
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow={content.trust.eyebrow} heading={content.trust.heading} size="md" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {content.trust.stats.map((stat) => (
              <li key={stat} className="border-t border-border pt-4 text-body-lg text-foreground">
                {stat}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq
        items={content.faq.items}
        eyebrow={content.faq.eyebrow}
        heading={content.faq.heading}
        locale="ar"
      />

      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-2xl text-center">
          <h2 className="font-display text-display-lg text-foreground">{content.booking.heading}</h2>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground">
            {content.booking.description}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{content.booking.supportingLine}</p>
          <div className="mt-8 flex justify-center">
            <BookingCta sourcePage="/ar" ctaPosition="homepage-pilot-booking" size="lg">
              {content.booking.ctaLabel}
            </BookingCta>
          </div>
        </Container>
      </section>
    </div>
  );
}
