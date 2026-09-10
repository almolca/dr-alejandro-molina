import { resolveTimeRange } from "@/lib/admin/time-range";
import { getFunnel, getOverviewKpis } from "@/lib/admin/queries";
import { TimeRangePicker } from "@/components/admin/TimeRangePicker";
import { KpiCard } from "@/components/admin/KpiCard";
import { FunnelChart } from "@/components/admin/FunnelChart";

export const metadata = { robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ range?: string }> };

export default async function AdminOverviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const { start, end, label, rangeParam } = resolveTimeRange(params);

  const [kpis, funnel] = await Promise.all([getOverviewKpis(start, end), getFunnel(start, end)]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-stone-900">Overview</h1>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
        <TimeRangePicker basePath="/admin" currentRange={rangeParam} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Visitors" value={kpis.visitors} />
        <KpiCard label="Page Views" value={kpis.page_views} />
        <KpiCard label="Book CTA Clicks" value={kpis.book_cta_clicks} />
        <KpiCard label="Leads" value={kpis.leads_created} />
        <KpiCard label="NMC Booking Clicks" value={kpis.nmc_booking_clicks} />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg text-stone-900">Funnel</h2>
        <FunnelChart
          stages={[
            { label: "Website Visits", count: funnel.visits },
            { label: "Book CTA Clicks", count: funnel.book_cta_clicks },
            { label: "Book Page Visits", count: funnel.book_page_views },
            { label: "Leads Created", count: funnel.leads_created },
            { label: "NMC Booking Clicks", count: funnel.nmc_booking_clicks },
          ]}
        />
      </div>
    </div>
  );
}
