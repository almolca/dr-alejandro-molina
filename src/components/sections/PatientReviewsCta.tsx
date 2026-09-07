import { patientReviews } from "@/config/patientReviews";

/**
 * Renders nothing until `patientReviews` is configured with
 * `publishReady: true` and a real `profileUrl`. If a rating/count is
 * ever configured but not yet verified, still show only a neutral CTA
 * linking to the verified profile — never a star rating or count
 * without verification. Today this always renders nothing, since no
 * profile is configured at all.
 */
export function PatientReviewsCta() {
  if (!patientReviews?.publishReady || !patientReviews.profileUrl) return null;

  const showRating =
    patientReviews.rating !== undefined && patientReviews.reviewCount !== undefined;

  return (
    <a
      href={patientReviews.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
    >
      {showRating
        ? `${patientReviews.rating} · ${patientReviews.reviewCount} reviews on ${patientReviews.platformName}`
        : `Read Verified Patient Reviews on ${patientReviews.platformName}`}
    </a>
  );
}
