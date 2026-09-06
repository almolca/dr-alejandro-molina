import { ImageResponse } from "next/og";

/**
 * TEMPORARY brand mark — spec §20/§41 explicitly warn against inventing
 * a final brand identity. This is a plain typographic monogram
 * generated from the site's own design-token colors (see
 * `styles/tokens.css` — ink/bronze approximated here as literal hex,
 * since the image renderer runs outside the browser and can't read CSS
 * custom properties), not a designed logo. Replace with a real
 * favicon/brand mark before launch — see IMPLEMENTATION_REPORT.md
 * Phase 5.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: -1,
        }}
      >
        AM
      </div>
    ),
    { ...size },
  );
}
