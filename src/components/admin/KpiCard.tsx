export function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 font-display text-3xl text-stone-900">{value.toLocaleString()}</p>
    </div>
  );
}
