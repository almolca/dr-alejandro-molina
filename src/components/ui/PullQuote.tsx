import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <blockquote className="border-l-2 border-accent-strong py-1 pl-6 font-display text-xl italic leading-snug text-foreground sm:text-2xl">
        {children}
      </blockquote>
    </Reveal>
  );
}
