import type { ComponentType, SVGProps } from "react";
import styles from "./Editorial.module.css";

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
export type CandidateCheckItem = string | { Icon: IconType; text: string };

function renderItem(item: CandidateCheckItem) {
  if (typeof item === "string") {
    return (
      <li key={item}>
        <span aria-hidden />
        {item}
      </li>
    );
  }
  const { Icon, text } = item;
  return (
    <li key={text} className={styles.candidateItemWithIcon}>
      <Icon aria-hidden className="h-5 w-5 shrink-0" />
      {text}
    </li>
  );
}

/**
 * Candidate / not-candidate module (R6.2) — a paired panel that
 * reframes existing candidacy prose as a scannable comparison rather
 * than two separate paragraphs buried in running text. Content only,
 * no new clinical claims: callers pass copy already established
 * elsewhere on the page.
 *
 * R12: `goodIf`/`notIf` items can optionally be `{ Icon, text }` instead
 * of a plain string, rendering a small icon in place of the bullet dot
 * — additive and backward-compatible, so the original plain-string
 * candidacy call site on the implant page needs no changes.
 */
export function CandidateCheck({
  goodHeading = "Often a reasonable next step",
  goodIf,
  notHeading = "Usually explored first, or considered separately",
  notIf,
}: {
  goodHeading?: string;
  goodIf: CandidateCheckItem[];
  notHeading?: string;
  notIf: CandidateCheckItem[];
}) {
  return (
    <div className={styles.candidateCheck}>
      <div className={styles.candidateColumn}>
        <h3>{goodHeading}</h3>
        <ul>{goodIf.map(renderItem)}</ul>
      </div>
      <div className={`${styles.candidateColumn} ${styles.candidateColumnAlt}`}>
        <h3>{notHeading}</h3>
        <ul>{notIf.map(renderItem)}</ul>
      </div>
    </div>
  );
}
