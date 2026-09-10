import Link from "next/link";
import { doctor } from "@/config/doctor";
import styles from "./VisualSystem.module.css";

export function FlagshipAuthorityFeature() {
  return <div className={styles.feature}>
    <p className="text-xs uppercase tracking-widest">A dedicated clinical focus</p>
    <h2 className="mt-4 max-w-xl font-display text-display-lg">Penile Girth Enhancement</h2>
    <div className={styles.featureNumbers}>
      <div><strong>{doctor.girthProcedureCount}</strong><span>Procedures performed</span></div>
      <div><strong>{doctor.girthEnhancementSince}</strong><span>Experience since</span></div>
    </div>
    <p className="mb-6 text-sm">{doctor.title}<br />Medical Trainer · {doctor.medicalTrainer.program}</p>
    <Link className={styles.featureLink} href="/male-aesthetics/penile-girth-enhancement">Explore Penile Girth Enhancement →</Link>
  </div>;
}
