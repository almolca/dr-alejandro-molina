/**
 * Dashboard time-range resolution — R7.2 brief §27/§37. Supports the
 * three preset windows plus a custom from/to range. Default: 30 days.
 */
export type TimeRange = { start: Date; end: Date; label: string; rangeParam: string };

const PRESETS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

export function resolveTimeRange(searchParams: {
  range?: string;
  from?: string;
  to?: string;
}): TimeRange {
  if (searchParams.from && searchParams.to) {
    const start = new Date(searchParams.from);
    const end = new Date(searchParams.to);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start < end) {
      return {
        start,
        end,
        label: `${searchParams.from} – ${searchParams.to}`,
        rangeParam: "custom",
      };
    }
  }

  const days = PRESETS[searchParams.range ?? "30d"] ?? 30;
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end, label: `Last ${days} days`, rangeParam: `${days}d` };
}
