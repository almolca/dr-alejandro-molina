import Image from "next/image";
import { doctor } from "@/config/doctor";

/** Approved lockup with only its near-white matte removed; original RGB and canvas preserved. */
export function BrandLogo({ footer = false }: { footer?: boolean }) {
  return <Image src="/brand/logo-full-transparent.png" alt={`${doctor.displayName} — ${doctor.title}`} width={1536} height={1024} sizes={footer ? "320px" : "(min-width: 1280px) 210px, (min-width: 768px) 200px, 180px"} preload={!footer} className={footer ? "h-auto w-80 max-w-full" : "h-auto w-[180px] shrink-0 md:w-[200px] xl:w-[210px]"} />;
}
