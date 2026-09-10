import Image from "next/image";
import { doctor } from "@/config/doctor";
import { editorialContributions } from "@/config/mediaAppearances";
import { awardLogos, publications, trainingPrograms } from "@/config/reputation";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import styles from "./Editorial.module.css";

export function AuthorityMetric({
  value,
  label,
  animate,
}: {
  value: string;
  label: string;
  animate?: { from: number; to: number; prefix?: string; suffix?: string };
}) {
  return (
    <div className={styles.metric}>
      <dt>{label}</dt>
      <dd>
        {animate ? (
          <AnimatedNumber from={animate.from} to={animate.to} prefix={animate.prefix} suffix={animate.suffix} finalText={value} />
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

/**
 * Animation start year for the "Since 2018" stat (spec R7.1.4 §2) — the
 * current year at render/build time, not a permanently hardcoded value,
 * so a future rebuild automatically counts down from whatever year it's
 * then deployed in. Evaluated in this Server Component, so it's a plain
 * number by the time it reaches the client `AnimatedNumber` — same as
 * the literal it replaces, no new hydration/SSR risk. The final
 * displayed and announced value is always "Since 2018" regardless of
 * this start point (see `AuthorityMetric`'s `value` prop below, unrelated
 * to `animate.from`).
 */
const SINCE_STAT_COUNT_FROM = new Date().getFullYear();

/** Real intrinsic aspect ratios (not display size — CSS governs that) for the two approved award logo assets, so next/image never infers a wrong ratio. */
const AWARD_LOGO_RATIOS: Record<string, { width: number; height: number }> = {
  "Top Doctors Spain 2020": { width: 369, height: 100 }, // real asset 1221×331px, ≈3.69:1
  "Doctoralia Awards Spain 2022": { width: 262, height: 100 }, // real asset 6918×2640px, ≈2.62:1
};

export function PhysicianAuthority({ dark = false, recognition = false }: { dark?: boolean; recognition?: boolean }) {
  return <div className={`${styles.authority} ${dark ? styles.authorityDark : ""}`}>
    <p className="mb-6 text-xs font-medium uppercase tracking-widest">{doctor.title}</p>
    <dl className={styles.metrics}>
      {doctor.yearsOfExperience !== undefined && (
        <AuthorityMetric
          value={`${doctor.yearsOfExperience}+`}
          label="Years in Urology"
          animate={{ from: 0, to: doctor.yearsOfExperience, suffix: "+" }}
        />
      )}
      {doctor.girthProcedureCount && (
        <AuthorityMetric
          value={doctor.girthProcedureCount}
          label="Penile Girth Enhancement procedures"
          animate={{ from: 0, to: doctor.girthProcedureCountValue, suffix: "+" }}
        />
      )}
      {doctor.girthEnhancementSince !== undefined && (
        <AuthorityMetric
          value={`Since ${doctor.girthEnhancementSince}`}
          label="Penile Girth Enhancement"
          animate={{ from: SINCE_STAT_COUNT_FROM, to: doctor.girthEnhancementSince, prefix: "Since " }}
        />
      )}
    </dl>
    <div className={styles.rail}>
      {doctor.credentials.includes("FEBU — Fellow of the European Board of Urology") && <p><strong>FEBU</strong> · Fellow of the European Board of Urology</p>}
      {doctor.medicalTrainer && (
        <p className={styles.railItem}>
          {trainingPrograms[0]?.logoSrc && (
            <Image src={trainingPrograms[0].logoSrc} alt={trainingPrograms[0].program} width={32} height={32} className={styles.railLogo} />
          )}
          <span><strong>Medical Trainer</strong> · {doctor.medicalTrainer.program}<br />Trains urologists &amp; aesthetic physicians</span>
        </p>
      )}
      {editorialContributions.filter(item => item.publishReady).map((item) => {
        const publicationLogo = publications.find((pub) => pub.outletName === item.outletName)?.logoSrc;
        return (
          <p key={item.outletName} className={styles.railItem}>
            {publicationLogo && <Image src={publicationLogo} alt={item.outletName} width={57} height={32} className={styles.railLogo} />}
            <span>{item.wording}</span>
          </p>
        );
      })}
    </div>
    {recognition && (
      <div className={styles.recognitionRow}>
        <p className={styles.recognitionEyebrow}>Professional Recognition</p>
        <ul className={styles.recognitionRail} aria-label="Professional recognition">
          {doctor.awards
            .filter((award) => award.publishReady)
            .map((award) => {
              const logoSrc = awardLogos[award.officialTitle];
              const ratio = AWARD_LOGO_RATIOS[award.officialTitle];
              return (
                <li key={award.officialTitle}>
                  {logoSrc && ratio ? (
                    <Image
                      src={logoSrc}
                      alt={award.officialTitle}
                      width={ratio.width}
                      height={ratio.height}
                      className={styles.recognitionLogo}
                    />
                  ) : (
                    award.officialTitle
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    )}
  </div>;
}
