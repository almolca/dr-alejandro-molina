import type { ReactNode } from "react";
import styles from "./VisualSystem.module.css";

export function EditorialField({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`${styles.hero} ${className}`}>{children}</section>;
}
