import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Erectile Dysfunction — abstract circulation/signal pathway. Three
 * independent flow lines (vascular, neurological, hormonal contributors)
 * converge toward a single response point, with one line showing a
 * deliberate gap/reconnection standing in for "assessment" rather than
 * assumed function. No literal anatomy.
 */
export function VascularFlowDiagram({ className = "h-40 w-40 text-muted-foreground", title }: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 160" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <path d="M8,42 C55,24 95,58 138,42 C158,34 176,46 196,52" opacity={0.55} />
      <path d="M8,84 C55,64 95,104 138,84" opacity={0.85} />
      <path d="M150,84 C168,84 180,84 196,80" strokeDasharray="1 8" opacity={0.85} />
      <path d="M8,124 C55,144 95,106 138,122 C158,130 176,116 196,108" opacity={0.55} />
      <circle cx="203" cy="80" r="5" className="text-accent-strong" stroke="currentColor" />
      <circle cx="203" cy="80" r="1.4" className="text-accent-strong" stroke="currentColor" fill="currentColor" />
    </svg>
  );
}
