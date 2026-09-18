import Image from "next/image";
import { doctor } from "@/config/doctor";
import { cn } from "@/lib/utils/cn";

/**
 * Approved lockup with only its near-white matte removed; original RGB
 * and canvas preserved. `compact` is the header's scroll-collapsed
 * state (mobile only — the md:/xl: widths always win regardless, so
 * desktop/tablet never sees it); footer ignores it.
 */
export function BrandLogo({ footer = false, compact = false }: { footer?: boolean; compact?: boolean }) {
  return (
    <Image
      src="/brand/logo-full-transparent.png"
      alt={`${doctor.displayName} — ${doctor.title}`}
      width={1536}
      height={1024}
      sizes={footer ? "(min-width: 768px) 320px, 190px" : "(min-width: 1280px) 210px, (min-width: 768px) 200px, 160px"}
      preload={!footer}
      className={cn(
        "h-auto transition-[width] duration-200 ease-out",
        footer ? "w-[190px] max-w-full md:w-80" : "shrink-0 md:w-[200px] xl:w-[210px]",
        !footer && (compact ? "w-[110px]" : "w-[160px]"),
      )}
    />
  );
}
