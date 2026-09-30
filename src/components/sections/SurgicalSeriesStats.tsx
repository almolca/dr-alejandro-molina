import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils/cn";

export type SurgicalSeriesStat = {
  value: string;
  label: string;
  /** Required — every outcome figure here must carry its exact denominator/definition inline, never a bare percentage. */
  definition: string;
};

/**
 * Dr. Molina's personal laparoscopic radical prostatectomy series — 7
 * stats, each with its definition displayed directly underneath (owner
 * requirement: never present an outcome percentage without the
 * denominator that makes it meaningful). Visually mirrors the site's
 * existing `AuthorityBlock` stat-grid rhythm without reusing that
 * component directly, since `AuthorityBlock` is hardwired to the girth
 * procedure's own two stats.
 */
export function SurgicalSeriesStats({ stats, locale }: { stats: SurgicalSeriesStat[]; locale?: "ar" }) {
  const isAr = locale === "ar";
  return (
    <StaggerGroup className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <p className="font-display text-display-md text-foreground">{stat.value}</p>
          <p className={cn("mt-2 text-xs font-medium uppercase text-muted-foreground", !isAr && "tracking-widest")}>
            {stat.label}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stat.definition}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
