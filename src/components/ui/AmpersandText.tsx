import { Fragment } from "react";

/**
 * Renders text, substituting the sans-serif ampersand for any "&".
 *
 * Design-quality fix found via visual QA: Fraunces' default ampersand
 * is an ornate calligraphic "et" ligature that, at normal display-text
 * reading size (not zoomed), is easy to misread as "&)" — a legibility
 * risk this brief's "precise, medically authoritative" tone (spec §2)
 * doesn't tolerate on primary headings. Setting just the ampersand in
 * the sans body face (a plain, unambiguous glyph) is a standard
 * editorial-typography fix for exactly this failure mode, and reads as
 * an intentional flourish rather than an inconsistency.
 */
export function AmpersandText({ text }: { text: string }) {
  const parts = text.split("&");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="font-sans">&</span>}
        </Fragment>
      ))}
    </>
  );
}
