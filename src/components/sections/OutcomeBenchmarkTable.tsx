import { cn } from "@/lib/utils/cn";

/**
 * A value like "85–95%" or "~65–80%" is a numeral range, not prose — in
 * an RTL (Arabic) paragraph, the Unicode bidi algorithm can visually
 * reorder the two numbers around the dash (rendering "85–95%" as
 * "95%–85" on screen, even though the DOM/source order is correct).
 * Some values here are a numeric range FOLLOWED by an Arabic
 * parenthetical explanation (e.g. the learning-curve potency estimate),
 * so only the leading numeric run gets forced `dir="ltr"` — wrapping the
 * whole string would also flip the word order of the trailing Arabic
 * prose. Genuine prose values (e.g. the "not consistently reported"
 * note), which start with a letter, don't match and render untouched.
 */
function splitLeadingNumeric(value: string): { numeric: string; rest: string } {
  const match = value.match(/^([~\d][\d.,\s–-]*%?)([\s\S]*)$/);
  if (!match) return { numeric: "", rest: value };
  return { numeric: match[1], rest: match[2] };
}

export type BenchmarkColumn = {
  label: string;
  sublabel?: string;
  /** Visually distinguishes Dr. Molina's own column from the three published-literature tiers. */
  highlight?: boolean;
};

export type BenchmarkRow = {
  metric: string;
  definition?: string;
  /** One entry per column, same order/length as `columns`. */
  values: string[];
};

/**
 * "Outcomes depend on more than the platform" — the published-benchmark
 * comparison. Renders as a card per column (Dr. Molina's series, then
 * each literature tier), each card listing every metric underneath —
 * never an HTML `<table>`. On mobile the cards stack to full width; on
 * desktop they sit side by side. This is deliberate: the codebase has no
 * horizontal-scroll-table precedent anywhere in patient-facing pages,
 * and a 4-column table squeezed into a narrow viewport is exactly what
 * this avoids structurally rather than via scroll affordance.
 *
 * The disclaimer is a required, visually prominent prop — not optional
 * fine print — per the explicit "must not look like a randomized
 * head-to-head comparison" requirement this section exists to satisfy.
 */
export function OutcomeBenchmarkTable({
  columns,
  rows,
  disclaimer,
  locale,
}: {
  columns: BenchmarkColumn[];
  rows: BenchmarkRow[];
  disclaimer: string;
  locale?: "ar";
}) {
  const isAr = locale === "ar";
  return (
    <div>
      <div className="rounded-sm border border-accent-strong/40 bg-surface px-6 py-5 text-sm leading-relaxed text-foreground">
        {disclaimer}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        {columns.map((column, columnIndex) => (
          <div
            key={column.label}
            className={cn(
              "rounded-sm border p-6",
              column.highlight ? "border-accent-strong bg-background" : "border-border bg-surface",
            )}
          >
            <p className={cn("font-display text-lg text-foreground", column.highlight && "text-accent-strong")}>
              {column.label}
            </p>
            {column.sublabel && (
              <p className="mt-1 text-xs text-muted-foreground">{column.sublabel}</p>
            )}
            <dl className="mt-6 space-y-5 border-t border-border pt-6">
              {rows.map((row) => (
                <div key={row.metric}>
                  <dt className={cn("text-xs font-medium uppercase text-muted-foreground", !isAr && "tracking-wide")}>
                    {row.metric}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {(() => {
                      const { numeric, rest } = splitLeadingNumeric(row.values[columnIndex]);
                      return numeric ? (
                        <>
                          <span dir="ltr" className="inline-block">{numeric}</span>
                          {rest}
                        </>
                      ) : (
                        rest
                      );
                    })()}
                  </dd>
                  {columnIndex === 0 && row.definition && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.definition}</p>
                  )}
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
