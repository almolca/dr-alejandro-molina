import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Testosterone / hormonal health — a regulatory network: a central node
 * (the primary marker) with satellite nodes at varying orbits (metabolic,
 * sleep, thyroid and other contributors), connected by thin radii rather
 * than a literal molecule or gland drawing.
 */
export function HormoneBalanceDiagram({ className = "h-40 w-40 text-muted-foreground", title }: IllustrationProps) {
  const satellites = [
    { x: 100, y: 26, r: 6 },
    { x: 168, y: 62, r: 5 },
    { x: 160, y: 138, r: 5.5 },
    { x: 84, y: 168, r: 4.5 },
    { x: 26, y: 118, r: 5 },
    { x: 36, y: 48, r: 4.5 },
  ];
  return (
    <svg viewBox="0 0 200 200" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <circle cx="100" cy="100" r="72" opacity={0.25} strokeDasharray="1 7" />
      {satellites.map((s) => (
        <line key={`${s.x}-${s.y}`} x1="100" y1="100" x2={s.x} y2={s.y} opacity={0.4} />
      ))}
      {satellites.map((s) => (
        <circle key={`c-${s.x}-${s.y}`} cx={s.x} cy={s.y} r={s.r} opacity={0.7} />
      ))}
      <circle cx="100" cy="100" r="14" className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}
