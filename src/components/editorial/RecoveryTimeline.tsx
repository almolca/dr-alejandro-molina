import styles from "./Editorial.module.css";

export type RecoveryPhase = {
  label: string;
  description: string;
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
          <span className={styles.marker} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={styles.story}>
            <h3 className="font-display text-xl text-foreground">{phase.label}</h3>
            <p className={`mt-3 text-sm text-muted-foreground ${isAr ? "" : "max-w-md"}`}>{phase.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
