/**
 * Art-directed neutral placeholder for image-dependent sections (spec
 * §18: "Add image placeholders until assets are provided" — clearly
 * labelled, not generic stock imagery, no invented photographs of Dr.
 * Molina). A fine diagonal hairline pattern gives the panel intentional
 * texture instead of reading as a broken/missing asset.
 */
export function ImagePlaceholder({
  caption,
  index,
  className,
}: {
  caption: string;
  index?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full items-end border border-border bg-surface p-6 ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-border) 0px, var(--color-border) 1px, transparent 1px, transparent 28px)",
      }}
    >
      {index && (
        <span className="absolute left-6 top-6 font-display text-sm text-accent-strong">
          {index}
        </span>
      )}
      <p className="max-w-[24ch] text-xs leading-relaxed text-muted-foreground">
        {caption}
      </p>
    </div>
  );
}
