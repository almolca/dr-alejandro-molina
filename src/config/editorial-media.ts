/**
 * R6 editorial/treatment imagery — conceptual, condition-level visuals
 * distinct from physician photography (see photography.ts). Owner-
 * approved AI-generated imagery (see .gitignore, 2026-09-08); never
 * captioned as a specific real patient, event or before/after result.
 * Empty slots render neutral media surfaces without captions or fake
 * images.
 */
export type EditorialMediaAsset = {
  src: string | null;
  alt: string;
  approved: boolean;
};

export const editorialMedia: Record<
  "mensHealthHero" | "aestheticsHero" | "girthFlagship" |
  "testosteroneHero" | "edHero" | "peHero" | "peyroniesHero",
  EditorialMediaAsset
> = {
  mensHealthHero: { src: "/images/mens-health.png", alt: "", approved: true },
  aestheticsHero: { src: "/images/male-aesthetics.png", alt: "", approved: true },
  girthFlagship: { src: "/images/penile-girth-enhancement.png", alt: "", approved: true },
  testosteroneHero: { src: "/images/testosterone.jpeg", alt: "", approved: true },
  edHero: { src: "/images/erectile-dysfunction.jpeg", alt: "", approved: true },
  peHero: { src: "/images/premature-ejaculation.jpeg", alt: "", approved: true },
  peyroniesHero: { src: "/images/peyronies-disease.jpeg", alt: "", approved: true },
};
