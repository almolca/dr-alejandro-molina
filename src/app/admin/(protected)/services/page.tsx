import { resolveTimeRange } from "@/lib/admin/time-range";
import { getServicePerformance } from "@/lib/admin/queries";
import { discussionTopicLabel } from "@/lib/domain/discussion-topic";
import { TimeRangePicker } from "@/components/admin/TimeRangePicker";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { ServicePerformanceRow } from "@/lib/admin/queries";

export const metadata = { robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ range?: string }> };

const columns: Column<ServicePerformanceRow>[] = [
  { key: "service", header: "Discussion Topic", render: (r) => discussionTopicLabel(r.service_interest) },
  { key: "leads", header: "Leads", render: (r) => r.leads.toLocaleString(), align: "right" },
  { key: "nmc_clicks", header: "NMC Clicks", render: (r) => r.nmc_clicks.toLocaleString(), align: "right" },
  {
    key: "conversion",
    header: "Lead → NMC %",
    render: (r) => (r.leads > 0 ? `${((r.nmc_clicks / r.leads) * 100).toFixed(1)}%` : "—"),
    align: "right",
  },
];

export default async function AdminServicesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { start, end, label, rangeParam } = resolveTimeRange(params);
  const rows = await getServicePerformance(start, end);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-stone-900">Discussion Topics</h1>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
        <TimeRangePicker basePath="/admin/services" currentRange={rangeParam} />
      </div>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.service_interest ?? "not_specified"} />
    </div>
  );
}
