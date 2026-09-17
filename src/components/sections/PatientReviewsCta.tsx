import Link from "next/link";
import { publicReviewHeadlineWithPlatforms, verifiedReviewTotal } from "@/config/reputation";
import { AR_REPUTATION } from "@/lib/i18n/ar-reputation";

/**
 * Compact aggregate review trust line, used near the booking CTA — the
 * fuller multi-platform breakdown lives in PatientFeedbackSection.
 * Reads from the same centralized `reputation.ts` config (R7.1).
 */
export function PatientReviewsCta({ locale }: { locale?: "ar" } = {}) {
  if (verifiedReviewTotal <= 0) return null;
  const isAr = locale === "ar";

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      <span>{isAr ? AR_REPUTATION.reviewHeadlineWithPlatforms : publicReviewHeadlineWithPlatforms}</span>
      <Link
        href={isAr ? "/ar/about#reviews" : "/about#reviews"}
        className="font-medium text-foreground underline decoration-accent-strong underline-offset-4"
      >
        {isAr ? "عرض آراء المرضى" : "See patient reviews"}
      </Link>
    </p>
  );
}
