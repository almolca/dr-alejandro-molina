import { doctor } from "@/config/doctor";
import { mediaAppearances, editorialContributions } from "@/config/mediaAppearances";
import { verifiedReviewTotal, publicReviewHeadline } from "@/config/reputation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Compact Home trust layer: awards, verified review summary, editorial contribution and training — restrained, text-led (the full card breakdown lives in PatientFeedbackSection / RecognitionSection on About). */
export function AuthorityMediaSection() {
  const publishableAwards = doctor.awards.filter((a) => a.publishReady);
  const publishableMedia = mediaAppearances.filter((m) => m.publishReady);
  const publishableEditorial = editorialContributions.filter((e) => e.publishReady);
  const hasTraining = Boolean(doctor.medicalTrainer?.description);
  const hasReviews = verifiedReviewTotal > 0;

  if (!hasTraining && publishableAwards.length === 0 && publishableMedia.length === 0 && !hasReviews) {
    return null;
  }

  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          {publishableAwards.length > 0 && (
            <p className="mb-3 text-sm text-foreground">
              {publishableAwards.map((a) => a.officialTitle).join(" · ")}
            </p>
          )}
          {hasReviews && (
            <p className="mb-3 text-sm text-foreground">
              {publicReviewHeadline}
            </p>
          )}
          {publishableMedia.length > 0 && (
            <p className="mt-3 text-sm text-foreground">
              {publishableMedia.map((m) => `${m.title} — ${m.outletName}`).join(" · ")}
            </p>
          )}
          {publishableEditorial.length > 0 && (
            <p className="mt-3 text-sm text-foreground">
              {publishableEditorial.map((e) => e.wording).join(" · ")}
            </p>
          )}
          {hasTraining && (
            <>
              <p className="mt-8 text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Medical Education &amp; Training
              </p>
              <h2 className="mt-4 font-display text-display-md">{doctor.medicalTrainer.program}</h2>
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
