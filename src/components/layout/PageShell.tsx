import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

/** Global shell — spec §38 Phase 1: "global shell, header/footer". */
export function PageShell({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: "en" | "ar";
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SkipLink />
      <Header locale={locale} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
