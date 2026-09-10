import { resolveTimeRange } from "@/lib/admin/time-range";
import { getPagePerformance } from "@/lib/admin/queries";
import { TimeRangePicker } from "@/components/admin/TimeRangePicker";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { PagePerformanceRow } from "@/lib/admin/queries";

export const metadata = { robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ range?: string }> };

const columns: Column<PagePerformanceRow>[] = [
  { key: "path", header: "Page", render: (r) => r.path },
  { key: "views", header: "Views", render: (r) => r.views.toLocaleString(), align: "right" },
  { key: "book_clicks", header: "Book Clicks", render: (r) => r.book_clicks.toLocaleString(), align: "right" },
  {
    key: "visit_to_book",
    header: "Visit → Book %",
    render: (r) => (r.views > 0 ? `${((r.book_clicks / r.views) * 100).toFixed(1)}%` : "—"),
    align: "right",
  },
  { key: "leads", header: "Leads", render: () => "—", align: "right" },
  { key: "nmc_clicks", header: "NMC Clicks", render: () => "—", align: "right" },
];

export default async function AdminPagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { start, end, label, rangeParam } = resolveTimeRange(params);
  const rows = await getPagePerformance(start, end);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-stone-900">Page Performance</h1>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
        <TimeRangePicker basePath="/admin/pages" currentRange={rangeParam} />
      </div>

      <p className="text-xs text-stone-500">
        Leads and NMC clicks aren&rsquo;t attributed to an individual page in this schema version
        (a lead only carries its last-touch marketing page, not necessarily where the form was
        submitted) — see docs/patient-acquisition.md. See Sources/Services for lead-level
        breakdowns instead.
      </p>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.path} />
    </div>
  );
}
