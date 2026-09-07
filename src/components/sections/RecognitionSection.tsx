import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Professional recognition — SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md
 * Phase B6, restyled Phase R2.1/R3 for a more editorial (not
 * badge-wall) treatment. Renders ONLY entries where `publishReady` is
 * `true`. `doctor.awards` currently holds two owner-confirmed
 * recognitions (Top Doctors Spain 2020, Doctoralia Awards Spain 2022)
 * with `publishReady: false` — their exact official title/category
 * hasn't been verified against the primary source yet, so this
 * component renders nothing for either until that changes.
 */
export function RecognitionSection() {
  const publishable = doctor.awards.filter((award) => award.publishReady);
  if (publishable.length === 0) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Professional Recognition
          </p>
          <div className="mt-8 flex flex-col items-center gap-6 divide-y divide-border">
            {publishable.map((award) => (
              <p
                key={`${award.issuer}-${award.year}`}
                className="pt-6 font-display text-lg text-foreground first:pt-0"
              >
                {award.officialTitle}
                <span className="mt-1 block text-sm text-muted-foreground">
                  {award.issuer}, {award.year}
                </span>
              </p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
