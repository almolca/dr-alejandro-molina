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
  "testosteroneHero" | "edHero" | "peHero" | "peyroniesHero" |
  "urologicSurgeryHero" | "prostatectomyFlagship",
  EditorialMediaAsset
> = {
  mensHealthHero: { src: "/images/mens-health.png", alt: "", approved: true },
  aestheticsHero: { src: "/images/male-aesthetics.png", alt: "", approved: true },
  girthFlagship: { src: "/images/penile-girth-enhancement.png", alt: "Abstract illustration of a stepped increase in circumference, representing the concept of penile girth enhancement", approved: true },
  testosteroneHero: { src: "/images/testosterone.jpeg", alt: "", approved: true },
  edHero: { src: "/images/erectile-dysfunction.jpeg", alt: "", approved: true },
  peHero: { src: "/images/premature-ejaculation.jpeg", alt: "", approved: true },
  peyroniesHero: { src: "/images/peyronies-disease.jpeg", alt: "", approved: true },
  // Owner-supplied 2026-09-30 for the Urologic Surgery pillar, corrected
  // 2026-09-30 (initial pass had the two images swapped). `urologicSurgeryHero`
  // is a general, non-identifying laparoscopic-surgery scene (instruments
  // and a monitor). `prostatectomyFlagship` is owner-confirmed as the
  // approved depiction of Dr. Molina performing laparoscopic surgery —
  // its alt text names him accordingly; AR pages override both via
  // EditorialFrame's `alt` prop, same pattern as PhotoFrame.
  urologicSurgeryHero: { src: "/images/urologic-surgery.jpeg", alt: "Laparoscopic urologic surgery in the operating theatre", approved: true },
  prostatectomyFlagship: { src: "/images/laparoscopic-radical-prostatectomy.jpeg", alt: "Dr. Alejandro Molina performing laparoscopic radical prostatectomy in the operating theatre", approved: true },
};
