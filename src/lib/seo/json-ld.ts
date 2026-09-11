import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { site, siteUrl } from "@/config/site";

/**
 * Structured data builders — spec §25.
 *
 * Deliberately conservative: only emits fields backed by verified config
 * values. Never fabricates `aggregateRating`, reviews, unverified awards,
 * or a `LocalBusiness` implying Dr. Molina owns NMC (spec §25 explicit
 * prohibitions). The physician entity is modeled as affiliated with NMC,
 * not as its own local business.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLdObject = Record<string, any>;

/** Drop undefined/null/empty-string/empty-array values before serializing. */
function prune<T extends JsonLdObject>(obj: T): T {
  const out: JsonLdObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.length === 0) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
}

/** The current facility, represented accurately as an affiliation, not an owned business. */
function medicalOrganizationRef() {
  return prune({
    "@type": "MedicalOrganization",
    name: practice.facilityName,
    address: prune({
      "@type": "PostalAddress",
      addressLocality: practice.city,
      addressRegion: practice.emirate,
      addressCountry: practice.countryCode,
    }),
    url: practice.facilityUrl || undefined,
  });
}

/**
 * `EducationalOccupationalCredential` entries — currently just FEBU.
 * Only includes credentials that are genuinely formal, verified
 * qualifications (spec §25: no falsely-created data); general
 * background phrases already in `doctor.credentials` don't belong
 * here, only this one does.
 */
function credentialEntries() {
  return [
    {
      "@type": "EducationalOccupationalCredential",
      name: "FEBU",
      credentialCategory: "Fellow of the European Board of Urology",
    },
  ];
}

/** Owner-confirmed recognition names, emitted exactly as configured. */
function awardEntries() {
  return doctor.awards
    .filter((award) => award.publishReady)
    .map((award) => award.officialTitle);
}

export function personSchema() {
  return prune({
    "@context": "https://schema.org",
    "@type": "Person",
    name: doctor.displayName,
    jobTitle: doctor.title,
    description: site.description,
    url: siteUrl,
    image: new URL(doctor.profileImage.src, siteUrl).toString(),
    worksFor: medicalOrganizationRef(),
    knowsAbout: [...doctor.expertise],
    hasCredential: credentialEntries(),
    award: awardEntries(),
    sameAs: isPhysicianProfileConfigured ? [practice.physicianProfileUrl] : [],
  });
}

export function physicianSchema() {
  return prune({
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.displayName,
    medicalSpecialty: ["Urology", "Andrology"],
    availableService: undefined,
    hospitalAffiliation: medicalOrganizationRef(),
    address: prune({
      "@type": "PostalAddress",
      addressLocality: practice.city,
      addressRegion: practice.emirate,
      addressCountry: practice.countryCode,
    }),
    url: siteUrl,
  });
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}

/**
 * For individual treatment/condition pages (spec §24). Not used on the
 * Phase 1 placeholder home page — future page-level implementers should
 * call this from each treatment page's `page.tsx`.
 */
export function medicalWebPageSchema(input: {
  name: string;
  description: string;
  path: string;
  /** e.g. "MedicalCondition" name this page is about, if applicable. */
  aboutType?: "MedicalCondition" | "MedicalProcedure" | "MedicalTherapy";
  aboutName?: string;
}) {
  return prune({
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: input.name,
    description: input.description,
    url: new URL(input.path, siteUrl).toString(),
    about: input.aboutType
      ? prune({ "@type": input.aboutType, name: input.aboutName })
      : undefined,
    lastReviewed: undefined,
    reviewedBy: undefined,
  });
}

/** Only render when the page has genuinely visible FAQ content (spec §24). */
export function faqPageSchema(
  items: { question: string; answer: string }[],
  options?: { inLanguage?: string },
) {
  return prune({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: options?.inLanguage,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

/** For Insights articles (Phase 4+). */
export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return prune({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: new URL(input.path, siteUrl).toString(),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: { "@type": "Person", name: doctor.displayName },
  });
}

/**
 * VideoObject schema — Phase C video-ready architecture. Callers must
 * only invoke this when `article.video` AND `article.video.thumbnailUrl`
 * both exist (Google's structured-data guidelines treat `thumbnailUrl`
 * as required for VideoObject) — see the guard in `insights/[slug]/page.tsx`.
 * Never called speculatively; with no real videos yet, this function is
 * simply unreachable in production until owner-supplied video content
 * exists.
 */
export function videoObjectSchema(input: {
  video: { title: string; url: string; thumbnailUrl?: string; summary?: string };
  datePublished: string;
}) {
  return prune({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.video.title,
    description: input.video.summary || input.video.title,
    thumbnailUrl: input.video.thumbnailUrl,
    uploadDate: input.datePublished,
    contentUrl: input.video.url,
  });
}
