import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Penile Implant — a clean engineering-style schematic of a three-piece
 * inflatable system (cylinder, pump, reservoir) as abstract connected
 * shapes, the way a device manual diagrams components. Diagrammatic
 * only; not anatomical.
 */
export function ImplantDeviceDiagram({ className = "h-32 w-full text-muted-foreground", title }: IllustrationProps) {
  return (
    <svg viewBox="0 0 260 120" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <rect x="14" y="42" width="90" height="20" rx="10" opacity={0.8} />
      <path d="M104,52 L150,52" opacity={0.5} />
      <ellipse cx="168" cy="52" rx="16" ry="11" className="text-accent-strong" stroke="currentColor" />
      <path d="M184,52 L212,52" opacity={0.5} />
      <circle cx="230" cy="52" r="16" opacity={0.8} />
      <path d="M14,80 L104,80" strokeDasharray="1 6" opacity={0.35} />
      <path d="M168,74 L168,92" strokeDasharray="1 6" opacity={0.35} />
      <path d="M230,74 L230,92" strokeDasharray="1 6" opacity={0.35} />
    </svg>
  );
}
