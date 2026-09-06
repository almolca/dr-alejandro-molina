import { ImageResponse } from "next/og";
import { doctor } from "@/config/doctor";
import { practiceLocationLine } from "@/config/practice";

/**
 * TEMPORARY site-wide social preview card — see icon.tsx for the full
 * rationale on why this is typographic, not photographic, and
 * explicitly not a final brand asset. Applies as the default `og:image`
 * (and Twitter card image, absent a separate `twitter-image.tsx`) for
 * every page that doesn't define a more specific one — none currently
 * do, so this is the one image shared across all 25 live pages when
 * linked externally. Colors are literal hex approximations of the
 * design tokens (`styles/tokens.css`), since this renders outside the
 * browser and can't read CSS custom properties.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#f7f4ee",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9c7a4e",
            fontFamily: "sans-serif",
          }}
        >
          {doctor.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            marginTop: 28,
            color: "#1c1815",
          }}
        >
          {doctor.displayName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 32,
            color: "#5c5346",
            fontFamily: "sans-serif",
          }}
        >
          {practiceLocationLine}
        </div>
      </div>
    ),
    { ...size },
  );
}
