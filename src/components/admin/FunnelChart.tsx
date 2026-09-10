function pct(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

/**
 * Plain-div funnel bars — brief §28/§36 explicitly says not to
 * overengineer this and to use Recharts "only if already appropriate";
 * it isn't in this repo, so a single lightweight funnel doesn't justify
 * adding it.
 */
export function FunnelChart({
  stages,
}: {
  stages: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...stages.map((s) => s.count));

  return (
    <div className="space-y-3 rounded-sm border border-stone-200 bg-white p-5">
      {stages.map((stage, i) => {
        const prev = i > 0 ? stages[i - 1].count : null;
        const widthPct = Math.max(2, (stage.count / max) * 100);
        return (
          <div key={stage.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-stone-900">{stage.label}</span>
              <span className="text-stone-500">
                {stage.count.toLocaleString()}
                {prev !== null && (
                  <span className="ml-2 text-xs">
                    ({pct(stage.count, prev)} of previous)
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-sm bg-stone-100">
              <div
                className="h-3 rounded-sm bg-stone-900"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
