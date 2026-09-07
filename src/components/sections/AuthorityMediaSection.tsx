import Image from "next/image";
import { doctor } from "@/config/doctor";
import { mediaAppearances } from "@/config/mediaAppearances";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Compact homepage authority layer — Phase R2.1/R3. Combines
 * Professional Recognition + Media/Editorial Contributions + Medical
 * Training in one section, rather than three separate homepage
 * sections (which would re-lengthen the page the Phase R1-R2
 * consolidation just shortened). Today, Recognition and Media both
 * have zero publish-ready entries, so this renders exactly the Medical
 * Training content alone (unchanged from the section this replaced,
 * `MedicalTrainingSection`) — the structure is ready to grow the
 * moment real, verified Recognition/Media data exists, without
 * another homepage restructure. Renders nothing at all if none of the
 * three has anything to show.
 */
export function AuthorityMediaSection() {
  const publishableAwards = doctor.awards.filter((a) => a.publishReady);
  const publishableMedia = mediaAppearances.filter((m) => m.publishReady);
  const hasTraining = Boolean(doctor.medicalTrainer?.description);

  if (!hasTraining && publishableAwards.length === 0 && publishableMedia.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Image
            src="/brand/logo-full.png"
            alt=""
            width={1536}
            height={1024}
            className="mx-auto mb-8 h-auto w-36 opacity-90"
          />
          {publishableAwards.length > 0 && (
            <p className="text-sm text-foreground">
              {publishableAwards.map((a) => `${a.officialTitle} — ${a.issuer}, ${a.year}`).join(" · ")}
            </p>
          )}
          {publishableMedia.length > 0 && (
            <p className="mt-3 text-sm text-foreground">
              {publishableMedia.map((m) => `${m.title} — ${m.outletName}`).join(" · ")}
            </p>
          )}
          {hasTraining && (
            <>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Medical Education &amp; Training
              </p>
              <p className="mt-6 text-body-lg text-muted-foreground">
                {doctor.medicalTrainer!.description}
              </p>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
