import styles from "./VisualSystem.module.css";

/** An assessment sequence, not a promise that every patient needs every test. */
export function ClinicalDecisionFlow() {
  return <ol className={styles.flow} aria-label="Clinical assessment sequence">
    {["Symptoms", "History", "Examination", "Targeted tests", "Diagnosis", "Individual treatment plan"].map((step, index) => (
      <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
    ))}
  </ol>;
}
