import Image from "next/image";
import { photography } from "@/config/photography";
import styles from "./VisualSystem.module.css";

/** A reserved photograph surface, never a synthetic portrait or decorative text panel. */
export function PhotoFrame({ slot, landscape = false, priority = false, tone = "light" }: {
  slot: keyof typeof photography;
  landscape?: boolean;
  priority?: boolean;
  /** "dark" sits this frame on a charcoal section — avoids a bright box pasted on a dark background. */
  tone?: "light" | "dark";
}) {
  const asset = photography[slot];
  const ready = asset.approved && asset.src?.startsWith("/images/");
  return (
    <div
      data-photo-slot={slot}
      className={`${styles.media} ${landscape ? styles.mediaLandscape : ""} ${tone === "dark" ? styles.mediaDark : ""}`}
      aria-hidden={!ready || undefined}
    >
      {ready && asset.src && (
        tone === "dark" ? (
          <div className={styles.mediaInset}>
            <Image src={asset.src} alt={asset.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" preload={priority} />
          </div>
        ) : (
          <Image src={asset.src} alt={asset.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" preload={priority} />
        )
      )}
    </div>
  );
}
