import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

/** Global shell — spec §38 Phase 1: "global shell, header/footer". */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SkipLink />
      <Header />
      {/*
        tabIndex={-1}: makes this a valid focus target for the skip link
        without adding it to normal Tab order. Without it, activating
        the skip link scrolls the viewport but leaves keyboard focus on
        `document.body` — confirmed with a real keyboard-navigation
        test in Phase 5 QA (WCAG 2.4.1 requires focus to actually move,
        not just the visible scroll position).
      */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
