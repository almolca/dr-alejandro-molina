import { reviewPlatforms, topDoctorsAggregate, verifiedReviewTotal } from "@/config/reputation";
import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Patient Feedback — R7.1. Every number here comes from
 * `config/reputation.ts`, never hardcoded here. An entry with
 * `verified: false` renders a bare profile link, never an invented
 * rating or count (see that file's header for verification provenance
 * per platform). Platform names (Google, Doctoralia, Top Doctors) are
 * proper nouns and stay untranslated in both locales.
 */
export function PatientFeedbackSection({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  const google = reviewPlatforms.find((p) => p.platform === "Google");
  const doctoralia = reviewPlatforms.find((p) => p.platform === "Doctoralia");
  const topDoctors = reviewPlatforms.filter((p) => p.platform === "Top Doctors");

  return (
    <section id="reviews" className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow={isAr ? "آراء المرضى" : "Patient Feedback"}
          heading={isAr ? "تقييمات مستقلة" : "Independently Reviewed"}
          description={verifiedReviewTotal > 0 ? (isAr ? AR_REPUTATION.reviewHeadline : "450+ patient reviews across independent platforms") : undefined}
          locale={isAr ? "ar" : undefined}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {google && (
            <div className={editorialStyles.candidateColumn}>
              <p className={`text-xs font-medium uppercase text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>Google</p>
              {google.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">{google.rating} / 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">{isAr ? `${google.reviewCount} تقييم موثّق` : `${google.reviewCount} verified reviews`}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? "ملف موثّق" : "Verified profile"}</p>
              )}
              {google.profileUrl && (
                <a href={google.profileUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
                  {isAr ? "قراءة تقييمات Google" : "Read Google Reviews"}
                </a>
              )}
            </div>
          )}
          {doctoralia && (
            <div className={editorialStyles.candidateColumn}>
              <p className={`text-xs font-medium uppercase text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>Doctoralia</p>
              {doctoralia.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">{doctoralia.rating} / 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">{isAr ? `${doctoralia.reviewCount} تقييم موثّق` : `${doctoralia.reviewCount} verified reviews`}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? "ملف موثّق" : "Verified profile"}</p>
              )}
              {doctoralia.profileUrl && (
                <a href={doctoralia.profileUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
                  {isAr ? "قراءة تقييمات Doctoralia" : "Read Doctoralia Reviews"}
                </a>
              )}
            </div>
          )}
          {topDoctors.length > 0 && (
            <div className={`${editorialStyles.candidateColumn} ${editorialStyles.candidateColumnAlt}`}>
              <p className={`text-xs font-medium uppercase text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>Top Doctors</p>
              {topDoctorsAggregate.verified ? (
                <>
                  <p className="mt-3 font-display text-3xl text-foreground">
                    {topDoctorsAggregate.rating} / 5
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{isAr ? `${topDoctorsAggregate.reviewCount} تقييم موثّق` : `${topDoctorsAggregate.reviewCount} verified reviews`}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? "ملف موثّق" : "Verified profile"}</p>
              )}
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
                      {isAr
                        ? (entry.label ? `عرض الملف الشخصي – ${entry.label}` : "عرض الملف الشخصي")
                        : (entry.label ? `View ${entry.label} profile` : "View profile")}
                    </a>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-xs text-muted-foreground">
            {isAr
              ? "التقييمات وأعداد المراجعات المعروضة مأخوذة مباشرة من كل منصة ويتم تحديثها دوريًا — وهي غير مُنشأة أو مقدَّرة من قبل هذا الموقع."
              : "Ratings and review counts shown are read directly from each platform and updated periodically — they are not generated or estimated by this website."}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
