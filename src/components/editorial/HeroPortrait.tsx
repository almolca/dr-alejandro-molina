import Image from "next/image";
import { photography } from "@/config/photography";
import styles from "./VisualSystem.module.css";

/**
 * Transparent-cutout physician portrait for hero compositions (Home,
 * About). Unlike PhotoFrame, this renders with no bordered box — the
 * source PNG's own transparency is meant to sit directly in the hero's
 * own atmosphere (see HeroAtmosphere), with a soft bottom fade instead
 * of a hard crop line. `objectPosition` is per-instance since each
 * portrait's headroom/crop needs are its own, not a shared default.
 */
export function HeroPortrait({
  slot,
  priority = false,
  objectPosition = "center 4%",
  alt,
}: {
  slot: keyof typeof photography;
  priority?: boolean;
  objectPosition?: string;
  /** Overrides the config's (English) alt text — used to localize alt text without forking the image asset (R9 Phase B0, spec §5). */
  alt?: string;
}) {
  const asset = photography[slot];
  const ready = asset.approved && asset.src?.startsWith("/images/");
  if (!ready || !asset.src) return null;
  return (
    <div className={styles.portrait} data-photo-slot={slot}>
      <Image
        src={asset.src}
        alt={alt ?? asset.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        preload={priority}
        style={{ objectFit: "cover", objectPosition }}
      />
    </div>
  );
}
