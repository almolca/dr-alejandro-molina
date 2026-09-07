import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Short homepage teaser for AndroMax training — new in Phase R1-R2.
 * Deliberately no CTA, mirroring the About page's own Medical
 * Education section: keeps the B2B training proposition separate from
 * the clinical B2C booking flow. Renders nothing if
 * `doctor.medicalTrainer` is unset (fail-safe pattern).
 */
export function MedicalTrainingSection() {
  if (!doctor.medicalTrainer?.description) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Medical Education &amp; Training
          </p>
          <p className="mt-6 text-body-lg text-muted-foreground">
            {doctor.medicalTrainer.description}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
