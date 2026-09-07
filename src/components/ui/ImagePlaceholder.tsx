/**
 * Art-directed neutral placeholder for image-dependent sections (spec
 * §18: clearly labelled as a surface, never generic stock imagery, no
 * invented photographs of Dr. Molina). Renders no visible instruction
 * text — full per-slot photography intent lives in
 * MEDIA_REQUIREMENTS.md, not on the live page (Phase R1-R2 P0 fix).
 * `label` is a short, generic accessibility string only (e.g.
 * "Portrait of Dr. Alejandro Molina, photography pending") — never the
 * detailed internal brief.
 */
export function ImagePlaceholder({
  label,
  index,
  className,
}: {
  label: string;
  index?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative h-full w-full border border-border bg-surface ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-border) 0px, var(--color-border) 1px, transparent 1px, transparent 28px)",
      }}
    >
      {/* Bronze corner bracket (Phase R3 correction) — reads as an
          intentional editorial frame device rather than a generic
          placeholder box. */}
      <span aria-hidden className="absolute left-0 top-0 h-8 w-px bg-accent-strong" />
      <span aria-hidden className="absolute left-0 top-0 h-px w-8 bg-accent-strong" />
      {index && (
        <span className="absolute left-6 top-6 font-display text-sm text-accent-strong">
          {index}
        </span>
      )}
    </div>
  );
}
