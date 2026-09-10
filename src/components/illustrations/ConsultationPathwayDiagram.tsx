import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Shared hub illustration (Men's Health, Sexual Medicine, Male
 * Aesthetics) — a linear pathway of nodes standing in for consultation,
 * diagnosis and a tailored plan, echoing the sites' own numbered-step
 * pattern rather than introducing a new metaphor.
 */
export function ConsultationPathwayDiagram({ className = "h-24 w-full text-muted-foreground", title }: IllustrationProps) {
  const nodes = [30, 100, 170, 240];
  return (
    <svg viewBox="0 0 270 60" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <line x1="30" y1="30" x2="240" y2="30" opacity={0.4} />
      {nodes.map((x, i) => (
        <circle key={x} cx={x} cy="30" r={i === nodes.length - 1 ? 8 : 6} opacity={i === nodes.length - 1 ? 1 : 0.7} className={i === nodes.length - 1 ? "text-accent-strong" : undefined} stroke="currentColor" />
      ))}
    </svg>
  );
}
