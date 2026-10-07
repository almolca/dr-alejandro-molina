import { doctor } from "@/config/doctor";
import { InternalLink as Link } from "@/components/ui/InternalLink";

/**
 * Visible physician-authorship block — SEO_RESTRUCTURE_IMPLEMENTATION_
 * PLAN.md Phase B3 / E-E-A-T. Every Insights article previously carried
 * authorship only in invisible `Article` JSON-LD (`articleSchema()`'s
 * `author` field) — this is the human-visible counterpart, applied
 * uniformly to every article via `insights/[slug]/page.tsx`, not just
 * the new Penile Girth Enhancement cluster.
 *
 * The credential summary line is config-driven and only includes facts
 * that are actually set — same fail-safe pattern as
 * AuthorityStripSection.
 *
 * `lastReviewedDate` (penile implant authority/E-E-A-T phase) adds the
 * "Medically reviewed by" line — only when the article's
 * `InsightArticle.lastReviewedDate` is a real, owner-confirmed date.
 * Dr. Molina is both the author and the only qualified reviewer on this
 * site, so the line reuses the exact same centralized `doctor.displayName`/
 * `doctor.title` already shown above, rather than a second hardcoded
 * string. Absent a confirmed date, nothing review-related renders here —
 * no "pending" badge, no invented date (replaces the old sitewide
 * `clinicalReviewRequired` boolean, which showed "Clinical review
 * pending" on every single article with no exceptions).
 */
const credentialFragments = [
  doctor.yearsOfExperience !== undefined && `${doctor.yearsOfExperience}+ years in Urology`,
  doctor.credentials.includes("FEBU — Fellow of the European Board of Urology") && "FEBU",
  doctor.girthEnhancementSince !== undefined &&
    `Penile Girth Enhancement since ${doctor.girthEnhancementSince}`,
].filter((fragment): fragment is string => Boolean(fragment));

export function ArticleAuthorBlock({ lastReviewedDate }: { lastReviewedDate?: string }) {
  return (
    <div className="border-y border-border py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg text-foreground">{doctor.displayName}</p>
          <p className="text-sm text-muted-foreground">{doctor.title}</p>
          {credentialFragments.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {credentialFragments.join(" · ")}
            </p>
          )}
        </div>
        <Link
          href="/about"
          className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
        >
          About {doctor.displayName}
        </Link>
      </div>
      {lastReviewedDate && (
        <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Medically reviewed by {doctor.displayName}</p>
          <p>{doctor.title}</p>
          <p>
            Last medically reviewed:{" "}
            {new Date(lastReviewedDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
