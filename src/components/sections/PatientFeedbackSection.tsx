import { reviewPlatforms, topDoctorsAggregate, publicReviewHeadline, verifiedReviewTotal } from "@/config/reputation";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Patient Feedback — R7.1. Every number here comes from
 * `config/reputation.ts`, never hardcoded here. An entry with
 * `verified: false` renders a bare profile link, never an invented
 * rating or count (see that file's header for verification provenance
 * per platform).
 */
export function PatientFeedbackSection() {
  const google = reviewPlatforms.find((p) => p.platform === "Google");
  const doctoralia = reviewPlatforms.find((p) => p.platform === "Doctoralia");
  const topDoctors = reviewPlatforms.filter((p) => p.platform === "Top Doctors");

  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow="Patient Feedback"
          heading="Independently Reviewed"
          description={verifiedReviewTotal > 0 ? publicReviewHeadline : undefined}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {google && (
            <div className={editorialStyles.candidateColumn}>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Google</p>
              {google.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">{google.rating} / 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">{google.reviewCount} verified reviews</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Verified profile</p>
              )}
              {google.profileUrl && (
                <a href={google.profileUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
                  Read Google Reviews
                </a>
              )}
            </div>
          )}
          {doctoralia && (
            <div className={editorialStyles.candidateColumn}>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Doctoralia</p>
              {doctoralia.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">{doctoralia.rating} / 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">{doctoralia.reviewCount} verified reviews</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Verified profile</p>
              )}
              {doctoralia.profileUrl && (
                <a href={doctoralia.profileUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
                  Read Doctoralia Reviews
                </a>
              )}
            </div>
          )}
          {topDoctors.length > 0 && (
            <div className={`${editorialStyles.candidateColumn} ${editorialStyles.candidateColumnAlt}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Top Doctors</p>
              <p className="mt-3 font-display text-3xl text-foreground">
                {topDoctorsAggregate.rating} / 5
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{topDoctorsAggregate.reviewCount} verified reviews</p>
              <div className="mt-4 flex flex-col gap-1">
                {topDoctors.map((entry) =>
                  entry.profileUrl ? (
                    <a
                      key={entry.label}
                      href={entry.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                    >
                      {entry.label ? `View ${entry.label} profile` : "View profile"}
                    </a>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-xs text-muted-foreground">
            Ratings and review counts shown are read directly from each
            platform and updated periodically — they are not generated
            or estimated by this website.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
