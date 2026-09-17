import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";

/**
 * Legal pages sit outside (marketing) — same architecture as the
 * English (legal) group — so /ar/privacy doesn't mount PageViewTracker
 * the way /ar/marketing pages do. Found in the Batch 4 final review:
 * placing /ar/privacy under (marketing) silently made it fire
 * page_view analytics that its English counterpart deliberately never
 * does (see (en)/(legal)/layout.tsx's own doc comment).
 */
export default function ArabicLegalLayout({ children }: { children: ReactNode }) {
  return <PageShell locale="ar">{children}</PageShell>;
}
