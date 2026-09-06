import { ImageResponse } from "next/og";

/**
 * TEMPORARY brand mark — see icon.tsx for the full rationale. Apple
 * touch icons are shown without transparency and with more surrounding
 * padding than a favicon, hence the separate (larger, more spaced)
 * composition rather than just scaling icon.tsx up.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1815",
          color: "#c9a06c",
          fontFamily: "serif",
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: -2,
        }}
      >
        AM
      </div>
    ),
    { ...size },
  );
}
