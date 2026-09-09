import Image from "next/image";
import visual from "@/components/editorial/VisualSystem.module.css";
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { awardLogos, mensHealthAuthorProfileUrl, trainingPrograms } from "@/config/reputation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Owner-approved names and, as of R7.1, owner-supplied official logos. */
export function RecognitionSection() {
  const publishable = doctor.awards.filter((award) => award.publishReady);
  const editorial = editorialContributions.filter((item) => item.publishReady);
  const training = trainingPrograms[0];

  if (publishable.length === 0 && editorial.length === 0) return null;

  return (
    <section className={`${visual.recognition} py-section-y`}>
      <Container className={visual.recognitionGrid}>
        {publishable.length > 0 && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">
              Professional Recognition
            </h2>
            <ul className="mt-6 space-y-5">
              {publishable.map((award) => {
                const logoSrc = awardLogos[award.officialTitle];
                return (
                  <li key={`${award.issuer}-${award.year}`}>
                    {logoSrc && (
                      <span className={visual.logoChip}>
                        <Image src={logoSrc} alt={award.officialTitle} width={160} height={44} style={{ height: "1.75rem", width: "auto" }} />
                      </span>
                    )}
                    <p className={`mt-3 text-sm ${logoSrc ? visual.recognitionCaption : `font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug ${visual.recognitionHeading}`}`}>
                      {award.officialTitle}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
        {editorial.length > 0 && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">
              Editorial / Media
            </h2>
            <ul className="mt-6 space-y-5">
              {editorial.map((item) => (
                <li key={item.outletName}>
                  {item.outletName === "Men's Health Spain" && (
                    <span className={visual.logoChip}>
                      <Image src="/brand/authority/mens-health.jpg" alt="Men's Health Spain" width={100} height={44} style={{ height: "1.75rem", width: "auto" }} />
                    </span>
                  )}
                  <p className={`mt-3 font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug ${visual.recognitionHeading}`}>
                    {item.wording}
                  </p>
                  {item.outletName === "Men's Health Spain" && (
                    <a
                      href={mensHealthAuthorProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-2 inline-flex text-sm underline underline-offset-4"
                    >
                      View author profile
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {doctor.medicalTrainer && (
          <Reveal className={visual.recognitionColumn}>
            <h2 className="font-display text-2xl">Medical Education</h2>
            {training?.logoSrc && (
              <span className={`${visual.logoChip} mt-6`}>
                <Image src={training.logoSrc} alt={training.program} width={140} height={44} style={{ height: "1.75rem", width: "auto" }} />
              </span>
            )}
            <p className={`mt-3 font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug ${visual.recognitionHeading}`}>{doctor.medicalTrainer.program}</p>
            <p className="mt-4 text-sm">Medical Trainer</p>
            <p className={`mt-2 max-w-xs text-sm ${visual.recognitionBody}`}>
              {training?.positioningLine ?? "Training of urologists and aesthetic physicians"}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
