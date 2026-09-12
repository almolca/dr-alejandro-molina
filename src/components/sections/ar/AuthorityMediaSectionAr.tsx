// src/components/sections/ar/AuthorityMediaSectionAr.tsx
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { verifiedReviewTotal } from "@/config/reputation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const REVIEW_HEADLINE_AR = "أكثر من 450 تقييمًا من المرضى عبر منصات مستقلة";
const EDITORIAL_WORDING_AR = "مساهم في مجلة Men's Health إسبانيا";

/**
 * Arabic mirror of `AuthorityMediaSection`. Award names (e.g. "Top
 * Doctors Spain 2020") are kept verbatim — proper nouns, not
 * translated — matching how the Phase A pilot's existing trust block
 * already handled them. `mediaAppearances` is currently an empty array
 * in production (see config/mediaAppearances.ts) so, like the English
 * component, this renders nothing for that block until it's populated.
 */
export function AuthorityMediaSectionAr() {
  const publishableAwards = doctor.awards.filter((a) => a.publishReady);
  const publishableEditorial = editorialContributions.filter((e) => e.publishReady);
  const hasTraining = Boolean(doctor.medicalTrainer?.description);
  const hasReviews = verifiedReviewTotal > 0;

  if (!hasTraining && publishableAwards.length === 0 && !hasReviews) {
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
          {publishableEditorial.length > 0 && (
            <p className="mt-3 text-sm text-foreground">{EDITORIAL_WORDING_AR}</p>
          )}
          {hasTraining && (
            <>
              <p className="mt-8 text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">التعليم والتدريب الطبي</p>
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
