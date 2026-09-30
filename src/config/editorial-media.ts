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
  girthFlagship: { src: "/images/penile-girth-enhancement.png", alt: "", approved: true },
  testosteroneHero: { src: "/images/testosterone.jpeg", alt: "", approved: true },
  edHero: { src: "/images/erectile-dysfunction.jpeg", alt: "", approved: true },
  peHero: { src: "/images/premature-ejaculation.jpeg", alt: "", approved: true },
  peyroniesHero: { src: "/images/peyronies-disease.jpeg", alt: "", approved: true },
  // Owner-supplied 2026-09-30 for the Urologic Surgery pillar. Alt text
  // deliberately describes only what is visibly depicted (a surgeon
  // performing laparoscopy; surgical instruments and a monitor in an
  // operating theatre) rather than naming Dr. Molina — provenance of
  // these two images (stock vs. a genuine photograph of him) hasn't
  // been confirmed, and `laparoscopic-radical-prostatectomy.jpeg`
  // specifically shows no identifiable person at all. See PhotoFrame's
  // header comment for the parallel rule this mirrors: never caption
  // imagery as documentary evidence of a specific real event/person
  // without verified provenance. AR pages override this via
  // EditorialFrame's `alt` prop, same pattern as PhotoFrame.
  urologicSurgeryHero: { src: "/images/urologic-surgery.jpeg", alt: "Laparoscopic urologic surgery in the operating theatre", approved: true },
  prostatectomyFlagship: { src: "/images/laparoscopic-radical-prostatectomy.jpeg", alt: "Laparoscopic instruments and monitor during radical prostatectomy in the operating theatre", approved: true },
};
