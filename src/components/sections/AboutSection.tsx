import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Spec §7 Section 8 — a condensed narrative teaser, not the full CV
 * ("Do not duplicate the entire CV... use a structured credential list
 * separately" — that full list belongs on /about, spec §15).
 */
const highlightLabels = [
  "Hospital Clínic Barcelona training",
  "FEBU — Fellow of the European Board of Urology",
  "Advanced laparoscopic surgery",
  "Practicing in the United Arab Emirates",
];
const highlights = doctor.credentials.filter((c) => highlightLabels.includes(c));

export function AboutSection() {
  return (
    <section className="py-section-y">
      <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        {/* order-last on mobile: text identifies the page before the
            placeholder image does, even though the image sits in the
            left column on desktop (lg:order-first) — found in the
            Phase 5 UX audit. */}
        <MaskedReveal className="order-last aspect-[3/4] w-full border border-border bg-surface lg:order-first">
          <ImagePlaceholder
            index={doctor.displayName}
            label="Portrait of Dr. Alejandro Molina"
          />
        </MaskedReveal>

        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              About Dr. Molina
            </p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">
              European Training. Surgical Background. Dedicated Focus on
              Men&rsquo;s Health.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
              {highlights.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              Meet Dr. Molina
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
