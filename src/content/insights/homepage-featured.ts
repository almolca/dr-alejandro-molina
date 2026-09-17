export type HomepageFeaturedArticle = {
  title: string;
  tag: string;
  href: string;
  featured?: boolean;
};

/**
 * The homepage's 3 featured article teasers — shared between
 * `InsightsSection` (English) and `InsightsSectionAr` (R9 Phase B0) so
 * titles/tags/hrefs have one source of truth. No dates or bylines (spec:
 * "do not publish fake content dates or fake research claims").
 */
export const homepageFeaturedArticles: HomepageFeaturedArticle[] = [
  {
    title: "When Is a Penile Implant Considered for Erectile Dysfunction?",
    tag: "Penile Implant Surgery",
    href: "/insights/penile-implant-when-considered",
    featured: true,
  },
  {
    title: "Low Testosterone: Symptoms, Diagnosis and When Treatment Is Appropriate",
    tag: "Hormonal Health",
    href: "/insights/low-testosterone-symptoms-diagnosis",
  },
  {
    title: "Penile Girth Enhancement: What a Medical Assessment Should Consider",
    tag: "Male Genital Aesthetics",
    href: "/insights/penile-girth-enhancement-assessment",
  },
];
