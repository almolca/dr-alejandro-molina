/**
 * Restrained background texture for select authority/trust sections —
 * Phase R2.1/R3. Pure CSS (hairline diagonal pattern + a soft radial
 * glow, at very low opacity) — no bitmap asset, no JS, no animation.
 * `pointer-events-none` and `aria-hidden` since it's purely decorative.
 * Must be layered behind content — callers give their section
 * `className="relative"` and render this as the first child.
 */
export function TextureOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 32px), radial-gradient(ellipse at 20% 0%, currentColor 0%, transparent 60%)",
        color: "var(--color-accent-strong)",
      }}
    />
  );
}
