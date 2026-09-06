import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Professional recognition — SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md
 * Phase B6. Renders ONLY entries where `publishReady` is `true`.
 * `doctor.awards` currently holds two owner-confirmed recognitions
 * (Top Doctors Spain 2020, Doctoralia Awards Spain 2022) with
 * `publishReady: false` — their exact official title/category hasn't
 * been verified against the primary source yet, so this component
 * renders nothing for either until that changes. This is deliberate:
 * the UI is prepared now so flipping `publishReady` later is the only
 * step needed, without ever risking the `"EXACT OFFICIAL TITLE
 * REQUIRED"` placeholder reaching a real page.
 */
export function RecognitionSection() {
  const publishable = doctor.awards.filter((award) => award.publishReady);
  if (publishable.length === 0) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Recognition
          </p>
          <ul className="mt-8 flex flex-col items-center gap-4">
            {publishable.map((award) => (
              <li key={`${award.issuer}-${award.year}`} className="text-sm text-muted-foreground">
                {award.officialTitle} — {award.issuer}, {award.year}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
