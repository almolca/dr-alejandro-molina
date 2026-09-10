import Link from "next/link";
import { resolveTimeRange } from "@/lib/admin/time-range";
import { getLeads } from "@/lib/admin/queries";
import { discussionTopicLabel, DISCUSSION_TOPICS } from "@/lib/domain/discussion-topic";
import { TimeRangePicker } from "@/components/admin/TimeRangePicker";
import { DataTable, type Column } from "@/components/admin/DataTable";
import type { LeadRow } from "@/lib/admin/queries";

export const metadata = { robots: { index: false, follow: false } };

const PAGE_SIZE = 25;
const STATUSES = ["lead_created", "sent_to_nmc", "booked", "attended", "cancelled", "not_booked"];

type Props = {
  searchParams: Promise<{ range?: string; status?: string; service?: string; page?: string }>;
};

function buildColumns(): Column<LeadRow>[] {
  return [
    {
      key: "created_at",
      header: "Created",
      render: (r) => new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    },
    { key: "full_name", header: "Name", render: (r) => <Link href={`/admin/leads/${r.id}`} className="underline underline-offset-2">{r.full_name}</Link> },
    { key: "email", header: "Email", render: (r) => r.email },
    { key: "service_interest", header: "Discussion Topic", render: (r) => discussionTopicLabel(r.service_interest) },
    { key: "source", header: "Source", render: (r) => r.last_touch_source ?? r.first_touch_source ?? "—" },
    { key: "status", header: "Status", render: (r) => r.status },
    {
      key: "booking_clicked_at",
      header: "NMC Click",
      render: (r) => (r.booking_clicked_at ? new Date(r.booking_clicked_at).toLocaleDateString("en-GB") : "—"),
    },
  ];
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { start, end, label, rangeParam } = resolveTimeRange(params);
  const page = Math.max(0, Number(params.page ?? "0") || 0);

  const { rows, total } = await getLeads({
    status: params.status,
    serviceInterest: params.service,
    from: start,
    to: end,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (overrides: Record<string, string | undefined>) => {
    const merged = { range: rangeParam, status: params.status, service: params.service, ...overrides };
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v);
    return `/admin/leads?${sp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-stone-900">Leads</h1>
          <p className="mt-1 text-sm text-stone-500">
            {label} · {total.toLocaleString()} total
          </p>
        </div>
        <TimeRangePicker basePath="/admin/leads" currentRange={rangeParam} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="mr-2 text-stone-500">Status:</span>
          <Link href={qs({ status: undefined, page: undefined })} className={!params.status ? "font-medium underline" : "text-stone-600"}>
            All
          </Link>
          {STATUSES.map((s) => (
            <Link key={s} href={qs({ status: s, page: undefined })} className={`ml-3 ${params.status === s ? "font-medium underline" : "text-stone-600"}`}>
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="mr-2 text-stone-500">Discussion topic:</span>
          <Link href={qs({ service: undefined, page: undefined })} className={!params.service ? "font-medium underline" : "text-stone-600"}>
            All
          </Link>
          {DISCUSSION_TOPICS.map((t) => (
            <Link key={t.value} href={qs({ service: t.value, page: undefined })} className={`ml-3 ${params.service === t.value ? "font-medium underline" : "text-stone-600"}`}>
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <DataTable columns={buildColumns()} rows={rows} rowKey={(r) => r.id} />

      {totalPages > 1 && (
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={qs({ page: String(Math.max(0, page - 1)) })}
            aria-disabled={page === 0}
            className={page === 0 ? "pointer-events-none text-stone-300" : "underline"}
          >
            Previous
          </Link>
          <span className="text-stone-500">
            Page {page + 1} of {totalPages}
          </span>
          <Link
            href={qs({ page: String(Math.min(totalPages - 1, page + 1)) })}
            aria-disabled={page >= totalPages - 1}
            className={page >= totalPages - 1 ? "pointer-events-none text-stone-300" : "underline"}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
