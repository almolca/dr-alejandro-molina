import Image from "next/image";
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { publications, trainingPrograms } from "@/config/reputation";
import styles from "./Editorial.module.css";

export function AuthorityMetric({value,label}: {value:string;label:string}) {
  return <div className={styles.metric}><dt>{label}</dt><dd>{value}</dd></div>;
}
export function PhysicianAuthority({ dark = false, recognition = false }: { dark?: boolean; recognition?: boolean }) {
  return <div className={`${styles.authority} ${dark ? styles.authorityDark : ""}`}>
    <p className="mb-6 text-xs font-medium uppercase tracking-widest">{doctor.title}</p>
    <dl className={styles.metrics}>
      {doctor.yearsOfExperience !== undefined && <AuthorityMetric value={`${doctor.yearsOfExperience}+`} label="Years in Urology" />}
      {doctor.girthProcedureCount && <AuthorityMetric value={doctor.girthProcedureCount} label="Penile Girth Enhancement procedures" />}
      {doctor.girthEnhancementSince !== undefined && <AuthorityMetric value={`Since ${doctor.girthEnhancementSince}`} label="Penile Girth Enhancement" />}
    </dl>
    <div className={styles.rail}>
      {doctor.credentials.includes("FEBU — Fellow of the European Board of Urology") && <p><strong>FEBU</strong> · Fellow of the European Board of Urology</p>}
      {doctor.medicalTrainer && (
        <p className={styles.railItem}>
          {trainingPrograms[0]?.logoSrc && (
            <Image src={trainingPrograms[0].logoSrc} alt={trainingPrograms[0].program} width={100} height={32} className={styles.railLogo} />
          )}
          <span><strong>Medical Trainer</strong> · {doctor.medicalTrainer.program}<br />Trains urologists &amp; aesthetic physicians</span>
        </p>
      )}
      {editorialContributions.filter(item => item.publishReady).map((item) => {
        const publicationLogo = publications.find((pub) => pub.outletName === item.outletName)?.logoSrc;
        return (
          <p key={item.outletName} className={styles.railItem}>
            {publicationLogo && <Image src={publicationLogo} alt={item.outletName} width={80} height={32} className={styles.railLogo} />}
            <span>{item.wording}</span>
          </p>
        );
      })}
    </div>
    {recognition && <ul className={styles.recognitionRail} aria-label="Professional recognition">
      {doctor.awards.filter(award => award.publishReady).map(award => <li key={award.officialTitle}>{award.officialTitle}</li>)}
    </ul>}
  </div>;
}
