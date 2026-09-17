import styles from "./VisualSystem.module.css";

const STEPS_EN = ["Symptoms", "History", "Examination", "Targeted tests", "Diagnosis", "Individual treatment plan"];
const STEPS_AR = ["الأعراض", "التاريخ المرضي", "الفحص السريري", "فحوصات موجّهة", "التشخيص", "خطة علاج فردية"];

/** An assessment sequence, not a promise that every patient needs every test. */
export function ClinicalDecisionFlow({ locale }: { locale?: "ar" } = {}) {
  const steps = locale === "ar" ? STEPS_AR : STEPS_EN;
  return <ol className={styles.flow} aria-label={locale === "ar" ? "تسلسل التقييم السريري" : "Clinical assessment sequence"}>
    {steps.map((step, index) => (
      <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
    ))}
  </ol>;
}
