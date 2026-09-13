import Link from "next/link";
import { doctor } from "@/config/doctor";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import styles from "./VisualSystem.module.css";

/** Temporary EN destination for the CTA link — no /ar/male-aesthetics/penile-girth-enhancement yet (ships Batch 3). */
export function FlagshipAuthorityFeature({ locale }: { locale?: "ar" } = {}) {
  const isAr = locale === "ar";
  return <div className={styles.feature}>
    <p className={`text-xs uppercase ${isAr ? "" : "tracking-widest"}`}>{isAr ? "تركيز سريري متخصص" : "A dedicated clinical focus"}</p>
    <h2 className="mt-4 max-w-xl font-display text-display-lg">{isAr ? "زيادة سماكة القضيب" : "Penile Girth Enhancement"}</h2>
    <div className={styles.featureNumbers}>
      <div><strong>{doctor.girthProcedureCount}</strong><span>{isAr ? "الإجراءات المنجزة" : "Procedures performed"}</span></div>
      <div><strong>{doctor.girthEnhancementSince}</strong><span>{isAr ? "خبرة منذ" : "Experience since"}</span></div>
    </div>
    <p className="mb-6 text-sm">{isAr ? AR_IDENTITY.doctorTitle : doctor.title}<br />{isAr ? "مدرّب طبي" : "Medical Trainer"} · {doctor.medicalTrainer.program}</p>
    <Link className={styles.featureLink} href="/male-aesthetics/penile-girth-enhancement">{isAr ? "استكشف زيادة سماكة القضيب ←" : "Explore Penile Girth Enhancement →"}</Link>
  </div>;
}
