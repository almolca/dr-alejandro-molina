import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * Small, icon-scale concept glyphs — same visual grammar as the larger
 * diagrams in this directory (thin inherited stroke, geometric,
 * non-anatomical, one restrained accent element), but sized for use
 * inside a card/list alongside a title and a line of text rather than
 * as a standalone illustration. Built only for concepts a generic
 * icon set doesn't already convey well; everything else in this
 * redesign reuses lucide-react's own thin-line icons.
 */
const iconBaseProps = { viewBox: "0 0 28 28" };

/** Girth / circumference — expanding concentric rings, echoing the girth page's own hero illustration and ContourPlanningDiagram. */
export function GirthIcon({ className = "h-6 w-6", title }: IllustrationProps) {
  return (
    <svg {...iconBaseProps} className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <circle cx="14" cy="14" r="4.5" opacity={0.9} />
      <circle cx="14" cy="14" r="8" opacity={0.55} />
      <circle cx="14" cy="14" r="11.5" opacity={0.3} className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}

/** Reversibility — a droplet with a small return curve, standing in for HA filler and its ability to be dissolved. */
export function ReversibilityIcon({ className = "h-6 w-6", title }: IllustrationProps) {
  return (
    <svg {...iconBaseProps} className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <path d="M14 4.5C10.5 9.5 7.5 13 7.5 16.8A6.5 6.5 0 0 0 20.5 16.8C20.5 13 17.5 9.5 14 4.5Z" opacity={0.85} />
      <path d="M9.5 17.5a4.5 4.5 0 0 0 7 3" opacity={0.5} className="text-accent-strong" stroke="currentColor" />
      <path d="M16.8 20.8 15.7 19.9M16.8 20.8 15.5 21.2" opacity={0.5} className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}

/** Pump — a small bulb with a connecting tube, echoing ImplantDeviceDiagram's own pump element at icon scale. */
export function PumpIcon({ className = "h-6 w-6", title }: IllustrationProps) {
  return (
    <svg {...iconBaseProps} className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <ellipse cx="18" cy="14" rx="5.5" ry="4" className="text-accent-strong" stroke="currentColor" />
      <path d="M3.5 14H12.5" opacity={0.6} />
      <path d="M23 11.5c1 .6 1 5.4 0 5" strokeDasharray="1 3.2" opacity={0.5} />
    </svg>
  );
}

/** Rigidity — a line moving from a soft curve to straight, standing in for the flaccid-to-rigid transition without depicting anatomy. */
export function RigidityIcon({ className = "h-6 w-6", title }: IllustrationProps) {
  return (
    <svg {...iconBaseProps} className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <path d="M4 20c2-6 3-9 6-9" opacity={0.45} />
      <path d="M14 19V8" className="text-accent-strong" stroke="currentColor" />
      <path d="M11.2 10.8 14 8l2.8 2.8" className="text-accent-strong" stroke="currentColor" />
    </svg>
  );
}
