/**
 * R4.2 photography slots. Only owner-approved local photographs may be
 * configured. Unapproved files in public/brand are deliberately never used.
 * Empty slots render neutral media surfaces without captions or fake images.
 */
export type PhotographyAsset = {
  src: string | null;
  alt: string;
  approved: boolean;
};

export const photography: Record<
  "homeHero" | "homeClinical" | "aboutPortrait" | "aboutConsultation" |
  "aboutTraining" | "girthClinical" | "girthConsultation" |
  "aestheticsClinical" | "mensHealthConsultation",
  PhotographyAsset
> = {
  homeHero: { src: null, alt: "Dr. Alejandro Molina", approved: false },
  homeClinical: { src: null, alt: "Dr. Molina in clinical practice", approved: false },
  aboutPortrait: { src: null, alt: "Portrait of Dr. Alejandro Molina", approved: false },
  aboutConsultation: { src: null, alt: "Dr. Molina during a consultation", approved: false },
  aboutTraining: { src: null, alt: "Dr. Molina providing medical training", approved: false },
  girthClinical: { src: null, alt: "Dr. Molina in a clinical setting", approved: false },
  girthConsultation: { src: null, alt: "Individual treatment planning with Dr. Molina", approved: false },
  aestheticsClinical: { src: null, alt: "Dr. Molina in clinical practice", approved: false },
  mensHealthConsultation: { src: null, alt: "A men's health consultation with Dr. Molina", approved: false },
};
