import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Peyronie's Disease — a measurement/assessment motif: a dashed straight
 * reference line against a curved line, with perpendicular tick marks at
 * the points of greatest deviation, the way an engineering tolerance
 * drawing represents deviation from a baseline. Non-anatomical.
 */
export function CurvatureAssessmentDiagram({ className = "h-40 w-40 text-muted-foreground", title }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <line x1="16" y1="100" x2="184" y2="100" strokeDasharray="2 7" opacity={0.5} />
      <path d="M16,96 C60,90 90,40 130,44 C155,46 168,66 184,72" opacity={0.85} />
      <line x1="100" y1="49" x2="100" y2="100" opacity={0.4} />
      <line x1="140" y1="55" x2="140" y2="100" opacity={0.4} />
      <circle cx="100" cy="49" r="4.5" className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}
