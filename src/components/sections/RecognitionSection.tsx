import visual from "@/components/editorial/VisualSystem.module.css";
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Owner-approved names; typography remains the fallback until official logos exist. */
export function RecognitionSection() {
  const publishable = doctor.awards.filter((award) => award.publishReady);
  const editorial = editorialContributions.filter((item) => item.publishReady);
  if (publishable.length === 0 && editorial.length === 0) return null;

  return (
    <section className={`${visual.recognition} py-section-y`}>
      <Container className={visual.recognitionGrid}>
        {publishable.length > 0 && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">
              Professional Recognition
            </h2>
            <ul className="mt-6 space-y-4">
              {publishable.map((award) => (
                <li key={`${award.issuer}-${award.year}`} className="font-display text-[clamp(1.5rem,2.1vw,2rem)] leading-snug text-foreground">
                  {award.officialTitle}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {editorial.length > 0 && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">
              Editorial / Media
            </h2>
            <ul className="mt-6 space-y-4">
              {editorial.map((item) => (
                <li key={item.outletName} className="font-display text-[clamp(1.5rem,2.1vw,2rem)] leading-snug text-foreground">
                  {item.wording}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {doctor.medicalTrainer && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">Medical Education</h2>
            <p className="mt-6 font-display text-[clamp(1.5rem,2.1vw,2rem)] leading-snug">{doctor.medicalTrainer.program}</p>
            <p className="mt-4 text-sm">Medical Trainer</p>
            <p className="mt-2 max-w-xs text-sm">Training of urologists and aesthetic physicians</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
