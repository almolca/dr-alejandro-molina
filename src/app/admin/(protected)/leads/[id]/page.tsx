import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/lib/admin/queries";
import { serviceInterestLabel } from "@/lib/domain/service-interest";

export const metadata = { robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

function Field({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-1 text-sm text-stone-900">{value === null || value === undefined || value === "" ? "—" : String(value)}</dd>
    </div>
  );
}

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const l = lead as Record<string, string | boolean | null>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/leads" className="text-sm text-stone-500 underline underline-offset-2">
          ← All leads
        </Link>
        <h1 className="mt-2 font-display text-2xl text-stone-900">{l.full_name}</h1>
      </div>

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Contact</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Email" value={l.email} />
          <Field label="Phone" value={l.phone} />
          <Field label="Preferred contact" value={l.preferred_contact_method} />
          <Field label="Service interest" value={serviceInterestLabel(String(l.service_interest ?? ""))} />
          <Field label="Status" value={l.status} />
          <Field label="Created" value={l.created_at ? new Date(String(l.created_at)).toLocaleString() : null} />
        </dl>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Attribution</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="First-touch source" value={l.first_touch_source} />
          <Field label="First-touch landing page" value={l.first_touch_landing_page} />
          <Field label="First-touch at" value={l.first_touch_at ? new Date(String(l.first_touch_at)).toLocaleString() : null} />
          <Field label="Last-touch source" value={l.last_touch_source} />
          <Field label="Last-touch page" value={l.last_touch_page} />
          <Field label="Last-touch at" value={l.last_touch_at ? new Date(String(l.last_touch_at)).toLocaleString() : null} />
          <Field label="Referrer" value={l.referrer} />
          <Field label="UTM source" value={l.utm_source} />
          <Field label="UTM medium" value={l.utm_medium} />
          <Field label="UTM campaign" value={l.utm_campaign} />
          <Field label="UTM term" value={l.utm_term} />
          <Field label="UTM content" value={l.utm_content} />
        </dl>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Consent &amp; Booking</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Privacy consent" value={l.privacy_consent ? "Yes" : "No"} />
          <Field label="Privacy consent at" value={l.privacy_consent_at ? new Date(String(l.privacy_consent_at)).toLocaleString() : null} />
          <Field label="Marketing consent" value={l.marketing_consent ? "Yes" : "No"} />
          <Field
            label="NMC booking click"
            value={l.booking_clicked_at ? new Date(String(l.booking_clicked_at)).toLocaleString() : null}
          />
        </dl>
      </section>
    </div>
  );
}
