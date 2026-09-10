import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * URL-driven (no client state, brief §37) so the picker works via plain
 * links — refreshing or sharing a dashboard URL preserves the range.
 */
export function TimeRangePicker({
  basePath,
  currentRange,
}: {
  basePath: string;
  currentRange: string;
}) {
  const options = [
    { param: "7d", label: "7 days" },
    { param: "30d", label: "30 days" },
    { param: "90d", label: "90 days" },
  ];

  return (
    <div className="flex gap-1 rounded-sm border border-stone-200 bg-white p-1">
      {options.map((opt) => (
        <Link
          key={opt.param}
          href={`${basePath}?range=${opt.param}`}
          className={cn(
            "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            currentRange === opt.param
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:bg-stone-100",
          )}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
