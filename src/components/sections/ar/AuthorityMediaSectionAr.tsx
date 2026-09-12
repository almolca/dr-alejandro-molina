import { doctor } from "@/config/doctor";
import { mediaAppearances, editorialContributions } from "@/config/mediaAppearances";
import { verifiedReviewTotal } from "@/config/reputation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { AR as PHYSICIAN_AUTHORITY_AR } from "@/components/editorial/PhysicianAuthority";

/**
 * Arabic translation of `publicReviewHeadline` in `config/reputation.ts`.
 * Deliberately not derived — same "owner approval" reasoning as that
 * string's own comment. If `publicReviewHeadline` is ever revisited by
 * the owner, this constant must be updated in lockstep (see the sync
 * comment on `publicReviewHeadline` itself).
 */
const REVIEW_HEADLINE_AR = "أكثر من 450 تقييمًا من المرضى عبر منصات مستقلة";

/**
 * Arabic mirror of `AuthorityMediaSection`. Award names (e.g. "Top
 * Doctors Spain 2020") are kept verbatim — proper nouns, not
 * translated — matching how the Phase A pilot's existing trust block
 * already handled them. Media appearance titles/outlet names are also
 * kept in English — same "don't fabricate a translation" treatment as
 * the Insights article titles elsewhere on the homepage.
 */
export function AuthorityMediaSectionAr() {
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
          {hasReviews && <p className="mb-3 text-sm text-foreground">{REVIEW_HEADLINE_AR}</p>}
          {publishableMedia.length > 0 && (
            <p className="mt-3 text-sm text-foreground">
              {publishableMedia.map((m) => `${m.title} — ${m.outletName}`).join(" · ")}
            </p>
          )}
          {publishableEditorial.length > 0 && (
            <p className="mt-3 text-sm text-foreground">
              {publishableEditorial
                .map((e) => PHYSICIAN_AUTHORITY_AR.editorialWordingByOutlet[e.outletName] ?? e.wording)
                .join(" · ")}
            </p>
          )}
          {hasTraining && (
            <>
              <p className="mt-8 text-eyebrow font-medium uppercase text-accent-strong">التعليم والتدريب الطبي</p>
              <h2 className="mt-4 font-display text-display-md">{doctor.medicalTrainer.program}</h2>
              <p className="mt-6 text-body-lg text-muted-foreground">
                إلى جانب ممارسته السريرية، يقدّم د. مولينا تدريبًا متخصصًا في
                تقنيات تجميل القضيب لأطباء المسالك البولية وأطباء التجميل من
                خلال برنامج AndroMax Training.
              </p>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
