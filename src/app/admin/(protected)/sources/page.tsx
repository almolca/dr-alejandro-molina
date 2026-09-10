import { resolveTimeRange } from "@/lib/admin/time-range";
import { getSourcePerformance } from "@/lib/admin/queries";
import { TimeRangePicker } from "@/components/admin/TimeRangePicker";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { SourcePerformanceRow } from "@/lib/admin/queries";

export const metadata = { robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ range?: string }> };

const SOURCE_LABELS: Record<string, string> = {
  google_organic: "Google Organic",
  google_business: "Google Business",
  direct: "Direct",
  instagram: "Instagram",
  mens_health: "Men's Health",
  doctoralia: "Doctoralia",
  top_doctors: "Top Doctors",
  nmc: "NMC",
  referral: "Referral",
  other: "Other",
};

const columns: Column<SourcePerformanceRow>[] = [
  { key: "source", header: "Source", render: (r) => SOURCE_LABELS[r.source] ?? r.source },
  { key: "sessions", header: "Sessions", render: (r) => r.sessions.toLocaleString(), align: "right" },
  { key: "book_clicks", header: "Book Clicks", render: (r) => r.book_clicks.toLocaleString(), align: "right" },
  { key: "leads", header: "Leads", render: (r) => r.leads.toLocaleString(), align: "right" },
  { key: "nmc_clicks", header: "NMC Clicks", render: (r) => r.nmc_clicks.toLocaleString(), align: "right" },
  {
    key: "conversion",
    header: "Session → Lead %",
    render: (r) => (r.sessions > 0 ? `${((r.leads / r.sessions) * 100).toFixed(1)}%` : "—"),
    align: "right",
  },
];

export default async function AdminSourcesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { start, end, label, rangeParam } = resolveTimeRange(params);
  const rows = await getSourcePerformance(start, end);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-stone-900">Acquisition Sources</h1>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
        <TimeRangePicker basePath="/admin/sources" currentRange={rangeParam} />
      </div>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.source} />
    </div>
  );
}
