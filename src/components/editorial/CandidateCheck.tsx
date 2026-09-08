import styles from "./Editorial.module.css";

/**
 * Candidate / not-candidate module (R6.2) — a paired panel that
 * reframes existing candidacy prose as a scannable comparison rather
 * than two separate paragraphs buried in running text. Content only,
 * no new clinical claims: callers pass copy already established
 * elsewhere on the page.
 */
export function CandidateCheck({
  goodHeading = "Often a reasonable next step",
  goodIf,
  notHeading = "Usually explored first, or considered separately",
  notIf,
}: {
  goodHeading?: string;
  goodIf: string[];
  notHeading?: string;
  notIf: string[];
}) {
  return (
    <div className={styles.candidateCheck}>
      <div className={styles.candidateColumn}>
        <h3>{goodHeading}</h3>
        <ul>
          {goodIf.map((item) => (
            <li key={item}>
              <span aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${styles.candidateColumn} ${styles.candidateColumnAlt}`}>
        <h3>{notHeading}</h3>
        <ul>
          {notIf.map((item) => (
            <li key={item}>
              <span aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
