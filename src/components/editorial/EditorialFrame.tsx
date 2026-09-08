import Image from "next/image";
import { editorialMedia } from "@/config/editorial-media";
import styles from "./VisualSystem.module.css";

/** A reserved editorial/treatment imagery surface — conceptual visuals, distinct from physician photography (see PhotoFrame). */
export function EditorialFrame({ slot, landscape = false, priority = false, tone = "light" }: {
  slot: keyof typeof editorialMedia;
  landscape?: boolean;
  priority?: boolean;
  /** "dark" sits this frame on a charcoal section — avoids a bright box pasted on a dark background. */
  tone?: "light" | "dark";
}) {
  const asset = editorialMedia[slot];
  const ready = asset.approved && asset.src?.startsWith("/images/");
  return (
    <div
      data-editorial-slot={slot}
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
