import Link from "next/link";
import { publicReviewHeadlineWithPlatforms, verifiedReviewTotal } from "@/config/reputation";

/**
 * Compact aggregate review trust line, used near the booking CTA — the
 * fuller multi-platform breakdown lives in PatientFeedbackSection.
 * Reads from the same centralized `reputation.ts` config (R7.1).
 *
 * R7.1.2 §6 correction: previously picked whichever single verified
 * platform had a `profileUrl` (in practice always Doctoralia, since
 * Google's `profileUrl` is unset) and showed a platform-specific line
 * like "5 · 237 reviews on Doctoralia" — decoupling the CTA's wording
 * from the actual verified aggregate and privileging one platform.
 * Now always shows the same neutral, platform-inclusive aggregate
 * headline, gated only on whether there is any verified review data
 * at all.
 */
export function PatientReviewsCta() {
  if (verifiedReviewTotal <= 0) return null;

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      <span>{publicReviewHeadlineWithPlatforms}</span>
      <Link
        href="/about#reviews"
        className="font-medium text-foreground underline decoration-accent-strong underline-offset-4"
      >
        See patient reviews
      </Link>
    </p>
  );
}
