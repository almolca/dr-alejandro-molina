import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Penile Filler Correction — a reassessment motif: a dashed "original"
 * contour line and a solid "current" contour line, with a single marker
 * at the point they diverge (irregularity/migration), read together
 * rather than either shape read alone. Non-explicit, diagrammatic.
 */
export function ContourReviewDiagram({ className = "h-40 w-40 text-muted-foreground", title }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <path d="M14,90 C55,74 80,74 100,80 C122,86 145,78 186,68" strokeDasharray="2 7" opacity={0.55} />
      <path d="M14,102 C55,96 78,110 100,98 C120,88 148,96 186,84" opacity={0.9} />
      <line x1="100" y1="80" x2="100" y2="98" opacity={0.5} />
      <circle cx="100" cy="89" r="4.5" className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}
