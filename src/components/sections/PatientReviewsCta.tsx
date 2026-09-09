import { reviewPlatforms } from "@/config/reputation";

/**
 * Compact single-line review CTA, used near the booking CTA — the
 * fuller multi-platform breakdown lives in PatientFeedbackSection.
 * Reads from the same centralized `reputation.ts` config (R7.1),
 * replacing the old single-platform `config/patientReviews.ts` scaffold
 * (retired — it was never populated). Prefers Google since that's the
 * owner-verified primary platform; falls back to the first verified
 * platform found, or renders nothing if none are verified.
 */
export function PatientReviewsCta() {
  const platform =
    reviewPlatforms.find((p) => p.platform === "Google" && p.verified && p.profileUrl) ??
    reviewPlatforms.find((p) => p.verified && p.profileUrl);

  if (!platform?.profileUrl) return null;

  return (
    <a
      href={platform.profileUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
    >
      {platform.rating !== null && platform.reviewCount !== null
        ? `${platform.rating} · ${platform.reviewCount} reviews on ${platform.platform}`
        : `Read Verified Patient Reviews on ${platform.platform}`}
    </a>
  );
}
