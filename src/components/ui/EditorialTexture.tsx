/**
 * Editorial background texture — Phase R3 correction, replaces the
 * narrower TextureOverlay. Pure CSS/SVG (hairline contour pattern +
 * soft radial glow + an extremely faint, oversized AM watermark using
 * the real logo symbol) — no bitmap texture asset beyond the logo
 * itself, no JS, no animation. `pointer-events-none` + `aria-hidden`
 * since it's purely decorative. Callers give their section
 * `className="relative"` and render this as the first child.
 */
export function EditorialTexture({ watermark = true }: { watermark?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 32px), radial-gradient(ellipse at 20% 0%, currentColor 0%, transparent 60%)",
          color: "var(--color-accent-strong)",
        }}
      />
      {watermark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/logo-symbol.png"
          alt=""
          className="absolute -right-24 -top-24 w-[28rem] opacity-[0.025] grayscale"
        />
      )}
    </div>
  );
}
