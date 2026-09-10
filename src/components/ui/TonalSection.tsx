import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const toneClass = {
  ivory: "bg-background",
  stone: "bg-surface",
  charcoal: "section-dark bg-background text-foreground",
  warm: "bg-gradient-to-b from-surface to-background",
} as const;

/**
 * Reusable tonal background wrapper — Phase R3 correction. Gives new
 * sections a consistent way to opt into a tone without repeating
 * className logic. Does not replace `.section-dark`/`.section-olive`
 * directly (those remain for existing call sites) — `tone="charcoal"`
 * here is a convenience alias for the same treatment.
 */
export function TonalSection({
  tone = "ivory",
  className,
  children,
}: {
  tone?: keyof typeof toneClass;
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn(toneClass[tone], "py-section-y", className)}>{children}</section>;
}
