import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Premature Ejaculation — an abstract timing/control gauge: a smooth
 * response curve crossing a marked threshold line, with baseline tick
 * marks standing in for individual assessment points. Deliberately a
 * graph/instrument motif, not an anatomical or sensitivity illustration —
 * restrained per the brief's "very restrained and non-explicit" note.
 */
export function ResponseThresholdDiagram({ className = "h-40 w-40 text-muted-foreground", title }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 140" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <line x1="10" y1="118" x2="210" y2="118" opacity={0.5} />
      {[30, 70, 110, 150, 190].map((x) => (
        <line key={x} x1={x} y1="112" x2={x} y2="124" opacity={0.4} />
      ))}
      <line x1="10" y1="48" x2="210" y2="48" strokeDasharray="2 6" opacity={0.6} />
      <path d="M10,108 C50,104 70,96 95,70 C112,52 122,44 140,44 C165,44 180,60 210,64" opacity={0.85} />
      <circle cx="140" cy="44" r="4.5" className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}
