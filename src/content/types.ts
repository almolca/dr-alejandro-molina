/**
 * Typed content shape for the homepage template (R9 Phase A). Content
 * only — no JSX, no layout decisions, no `any`. Additional page-family
 * types get added here as Phase B builds more templates.
 */
export type HomePageContent = {
  hero: {
    eyebrow: string;
    heading: string;
    specialtyLine: string;
    description: string;
    credentialLine: string;
    locationLine: string;
    ctaLabel: string;
  };
  trust: {
    eyebrow: string;
    heading: string;
    stats: string[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: { question: string; answer: string }[];
  };
  booking: {
    heading: string;
    description: string;
    supportingLine: string;
    ctaLabel: string;
  };
};
