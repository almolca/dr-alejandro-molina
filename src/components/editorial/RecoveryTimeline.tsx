import type { ComponentType, SVGProps } from "react";
import styles from "./Editorial.module.css";

export type RecoveryPhase = {
  label: string;
  description: string;
  /** R12: optional milestone icon, rendered above the step number. Omit for a number-only marker (backward compatible). */
  Icon?: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
};

/**
 * Generic phase-based recovery timeline — reuses `ExpertiseTimeline`'s
 * `.timeline`/`.milestone` CSS (1-col mobile, 2-col desktop with the
 * first/last item spanning full width) without its About-page-specific
 * hardcoded career copy. Deliberately phase-labelled, not day/week-labelled
 * — every page using this states timing is individual, so this component
 * never accepts or renders a numeric duration.
 */
export function RecoveryTimeline({ phases, locale }: { phases: RecoveryPhase[]; locale?: "ar" }) {
  const isAr = locale === "ar";
  return (
    <ol className={styles.timeline}>
      {phases.map((phase, index) => (
        <li className={styles.milestone} key={phase.label}>
          <div className="flex flex-col items-start gap-1.5">
            {phase.Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
                <phase.Icon aria-hidden className="h-5 w-5 text-accent-strong" />
              </div>
            )}
            <span className={styles.marker} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className={styles.story}>
            <h3 className="font-display text-xl text-foreground">{phase.label}</h3>
            <p className={`mt-3 text-sm text-muted-foreground ${isAr ? "" : "max-w-md"}`}>{phase.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
