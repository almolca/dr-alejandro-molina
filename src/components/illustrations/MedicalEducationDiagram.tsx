import { accessibilityProps, illustrationBaseProps, type IllustrationProps } from "./illustration-base";

/**
 * AndroMax Training / physician education — a mentor–trainee connection
 * with concentric arcs standing in for ultrasound-guided training, plus a
 * small branching mark for case-based decision-making. Reads as
 * professional education, not patient care — no patient figure implied.
 */
export function MedicalEducationDiagram({ className = "h-32 w-32 text-muted-foreground", title }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 160" className={className} {...illustrationBaseProps} {...accessibilityProps(title)}>
      {title && <title>{title}</title>}
      <circle cx="48" cy="60" r="10" opacity={0.85} />
      <circle cx="120" cy="104" r="7" opacity={0.7} />
      <path d="M56,66 C75,78 95,88 114,100" opacity={0.5} />
      {[18, 30, 42].map((r) => (
        <path
          key={r}
          d={`M${48 - r},${60 - r * 0.2} A${r},${r} 0 0 1 ${48 + r * 0.3},${60 - r * 0.95}`}
          opacity={0.3}
        />
      ))}
      <path d="M120,104 L120,124 M120,124 L108,136 M120,124 L132,136" opacity={0.55} />
      <circle cx="48" cy="60" r="4" className="text-accent-strong" stroke="currentColor" fill="currentColor" />
    </svg>
  );
}
