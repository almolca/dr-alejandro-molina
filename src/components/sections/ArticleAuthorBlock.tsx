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
 * AuthorityStripSection. No date is shown here beyond what the article
 * hero already displays (its real `datePublished`); this component
 * doesn't invent a "reviewed by" date.
 */
const credentialFragments = [
  doctor.yearsOfExperience !== undefined && `${doctor.yearsOfExperience}+ years in Urology`,
  doctor.credentials.includes("FEBU — Fellow of the European Board of Urology") && "FEBU",
  doctor.girthEnhancementSince !== undefined &&
    `Penile Girth Enhancement since ${doctor.girthEnhancementSince}`,
].filter((fragment): fragment is string => Boolean(fragment));

export function ArticleAuthorBlock() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-6">
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
  );
}
