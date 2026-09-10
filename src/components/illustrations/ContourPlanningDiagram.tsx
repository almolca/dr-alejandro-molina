import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Male Aesthetics / Girth Enhancement planning — layered topographic
 * contour lines around a shared centre line, standing in for
 * distribution, planning and individual variation rather than a literal
 * before/after body outline.
 */
export function ContourPlanningDiagram({ className = "h-40 w-40 text-muted-foreground", title }: IllustrationProps) {
  const layers = [16, 30, 44, 58];
  return (
    <svg viewBox="0 0 200 160" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      {layers.map((r, i) => (
        <path
          key={r}
          d={`M${100 - r * 1.5},130 C${100 - r * 1.5},${130 - r * 2.1} ${100 + r * 1.5},${130 - r * 2.1} ${100 + r * 1.5},130`}
          opacity={i === layers.length - 1 ? 1 : 0.35 + i * 0.12}
        />
      ))}
      <line x1="100" y1="14" x2="100" y2="130" strokeDasharray="1 7" opacity={0.4} />
      <circle cx="100" cy="130" r="3.5" className="text-accent-strong" stroke="currentColor" fill="currentColor" />
    </svg>
  );
}
