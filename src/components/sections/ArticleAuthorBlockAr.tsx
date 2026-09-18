import { doctor } from "@/config/doctor";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { InternalLink as Link } from "@/components/ui/InternalLink";

/**
 * Arabic mirror of `ArticleAuthorBlock` (R10 Phase C — first-wave
 * Arabic Insights articles). Kept as a sibling component rather than
 * adding a `locale` prop to the English one, matching the established
 * `*SectionAr.tsx` pattern used across the Arabic site rather than
 * touching shared English-only components.
 */
const credentialFragmentsAr = [
  doctor.yearsOfExperience !== undefined && `${doctor.yearsOfExperience}+ عامًا في طب المسالك البولية`,
  "FEBU",
  doctor.girthEnhancementSince !== undefined &&
    `زيادة سماكة القضيب منذ ${doctor.girthEnhancementSince}`,
].filter((fragment): fragment is string => Boolean(fragment));

export function ArticleAuthorBlockAr() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-6">
      <div>
        <p className="font-display text-lg text-foreground">{AR_IDENTITY.doctorDisplayName}</p>
        <p className="text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
        {credentialFragmentsAr.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {credentialFragmentsAr.join(" · ")}
          </p>
        )}
      </div>
      <Link
        href="/ar/about"
        className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
      >
        نبذة عن {AR_IDENTITY.doctorDisplayName}
      </Link>
    </div>
  );
}
