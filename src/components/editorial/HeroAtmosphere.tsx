import styles from "./VisualSystem.module.css";

/**
 * Reusable layered depth for hero/editorial sections — a soft
 * translucent plane plus one thin brand-curve line, echoing the logo's
 * mountain-arc mark rather than a generic decorative blob. Purely
 * decorative: render as the first child of a `position: relative`
 * ancestor (e.g. `.hero`); give sibling content `relative z-10` so it
 * sits above this layer.
 */
export function HeroAtmosphere({
  align = "right",
  restrained = false,
}: {
  /** Which side the translucent plane and curve lean toward. */
  align?: "left" | "right";
  /** A quieter version — smaller plane, for pages that should feel more restrained than the homepage. */
  restrained?: boolean;
}) {
  const curvePath = align === "left" ? "M -8 68 Q 35 44 108 30" : "M -8 30 Q 45 8 108 42";
  return (
    <div aria-hidden className={`${styles.atmosphere} ${restrained ? styles.atmosphereRestrained : ""}`}>
      <div className={`${styles.atmospherePlane} ${align === "left" ? styles.atmospherePlaneLeft : ""}`} />
      <svg className={styles.atmosphereCurve} viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={curvePath} />
      </svg>
    </div>
  );
}
