/**
 * R4.2 photography slots, filled in R6 with owner-approved physician
 * imagery. These are AI-generated/AI-edited images based on Dr.
 * Molina's own likeness and reference material, explicitly approved by
 * him for use as branded physician/editorial imagery — not as
 * documentary photography of a specific real consultation, surgery or
 * training event (see .gitignore, 2026-09-08). Alt text stays generic
 * professional identity, never a claim about a specific real event.
 * Empty slots render neutral media surfaces without captions or fake
 * images.
 */
export type PhotographyAsset = {
  src: string | null;
  alt: string;
  approved: boolean;
};

export const photography: Record<
  "homeHero" | "homeClinical" | "aboutPortrait" | "aboutConsultation" |
  "aboutTraining" | "girthConsultation" |
  "implantPhysician" | "implantDevice" | "implantSurgical",
  PhotographyAsset
> = {
  homeHero: { src: "/images/doctor/doctor-home-hero.png", alt: "Dr. Alejandro Molina, Consultant Urologist & Andrologist", approved: true },
  homeClinical: { src: "/images/doctor/doctor-explaining.png", alt: "Dr. Alejandro Molina in clinical practice", approved: true },
  aboutPortrait: { src: "/images/doctor/doctor-about-hero.png", alt: "Portrait of Dr. Alejandro Molina", approved: true },
  aboutConsultation: { src: "/images/doctor/doctor-explaining.png", alt: "Dr. Alejandro Molina, Consultant Urologist & Andrologist", approved: true },
  aboutTraining: { src: "/images/doctor/doctor-scrubs.png", alt: "Dr. Alejandro Molina, Consultant Urologist & Andrologist", approved: true },
  girthConsultation: { src: "/images/doctor/doctor-scrubs.png", alt: "Dr. Alejandro Molina, Consultant Urologist & Andrologist", approved: true },
  implantPhysician: { src: "/images/doctor/doctor-with-prosthesis.png", alt: "Dr. Alejandro Molina, Consultant Urologist & Andrologist", approved: true },
  implantDevice: { src: "/images/doctor/penile-prosthesis.png", alt: "Reviewing penile prosthesis treatment options", approved: true },
  implantSurgical: { src: "/images/doctor/doctor-operating-theatre.png", alt: "Dr. Alejandro Molina in a surgical setting", approved: true },
};
