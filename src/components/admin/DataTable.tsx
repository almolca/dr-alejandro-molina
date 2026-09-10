import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
};

/**
 * Read-only table shell shared by Pages/Sources/Services/Leads — brief
 * §29/§30/§31/§32. Scrolls horizontally within its own container so a
 * wide table never forces the page body to scroll sideways.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No data yet for this range.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-stone-500 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-stone-100 last:border-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-stone-800 ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
