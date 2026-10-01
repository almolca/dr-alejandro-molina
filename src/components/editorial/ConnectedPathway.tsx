import type { ComponentType, SVGProps } from "react";
import { ChevronRight } from "lucide-react";

export type PathwayNode = {
  Icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  title: string;
  description: string;
};

/**
 * A connected, icon-led process visual — nodes joined by a line and a
 * directional chevron, replacing a plain numbered grid for the specific
 * sections that are meant to read as a sequence (R12 visual-differentiation
 * pass). The step number is kept as a small secondary label under the
 * icon, not the primary visual cue — see each call site's own heading
 * for the real title.
 *
 * Desktop: a horizontal row (wraps if the container is narrow — each
 * node has a fixed width so wrapping degrades gracefully rather than
 * distorting node sizing). Mobile: a vertical stack with a vertical
 * connector. RTL: the row itself reverses automatically (flexbox
 * respects `dir` on `flex-direction: row`), and the chevron glyph
 * flips via `rtl:rotate-180` — the same pattern `Breadcrumb` already
 * uses for its own chevron.
 */
export function ConnectedPathway({ nodes, locale }: { nodes: PathwayNode[]; locale?: "ar" }) {
  const isAr = locale === "ar";
  return (
    <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:gap-y-10">
      {nodes.map((node, i) => (
        <div key={node.title} className="contents">
          <div className="flex w-full flex-col items-start gap-3 sm:w-40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
              <node.Icon className="h-6 w-6 text-accent-strong" aria-hidden />
            </div>
            <div>
              <p className={`text-xs text-muted-foreground ${isAr ? "" : "tracking-widest"}`}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 font-display text-base text-foreground">{node.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{node.description}</p>
            </div>
          </div>
          {i < nodes.length - 1 && (
            <>
              <div aria-hidden className="flex h-8 items-center justify-center self-center sm:hidden">
                <ChevronRight size={16} className="rotate-90 text-accent-strong/50" />
              </div>
              <div aria-hidden className="mt-6 hidden shrink-0 items-center sm:flex sm:w-8">
                <span className="h-px flex-1 bg-accent-strong/30" />
                <ChevronRight size={14} className="ms-0.5 shrink-0 text-accent-strong/60 rtl:rotate-180" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
