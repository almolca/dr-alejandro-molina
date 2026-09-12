import type { Metadata } from "next";
import visual from "@/components/editorial/VisualSystem.module.css";
import { buildMetadata } from "@/lib/seo/metadata";
import { homeFaqItemsAr } from "@/content/ar/homeFaq";
import { Faq } from "@/components/ui/Faq";
import { HeroSectionAr } from "@/components/sections/ar/HeroSectionAr";
import { AuthorityStripSectionAr } from "@/components/sections/ar/AuthorityStripSectionAr";
import { FeaturedProcedureSectionAr } from "@/components/sections/ar/FeaturedProcedureSectionAr";
import { CoreExpertiseSectionAr } from "@/components/sections/ar/CoreExpertiseSectionAr";
import { SexualHormonalHealthSectionAr } from "@/components/sections/ar/SexualHormonalHealthSectionAr";
import { AdvancedPenileSurgerySectionAr } from "@/components/sections/ar/AdvancedPenileSurgerySectionAr";
import { AboutSectionAr } from "@/components/sections/ar/AboutSectionAr";
import { AuthorityMediaSectionAr } from "@/components/sections/ar/AuthorityMediaSectionAr";
import { InsightsSectionAr } from "@/components/sections/ar/InsightsSectionAr";
import { BookingSectionAr } from "@/components/sections/ar/BookingSectionAr";

export const metadata: Metadata = buildMetadata({
  title: "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة، أبوظبي",
  description:
    "رعاية متخصصة في الطب الجنسي، الصحة الهرمونية للرجال، جراحة القضيب، الخصوبة، والتجميل الذكوري في أبوظبي، الإمارات العربية المتحدة.",
  path: "/ar",
});

/**
 * R9 Phase B0 — full Arabic homepage, mirroring the English homepage's
 * 10-section composition (`src/app/(en)/(marketing)/page.tsx`) 1:1,
 * plus one Arabic-only FAQ block (no English-homepage equivalent).
 * Wrapped in `visual.scope` like the English page — required for the
 * dark/olive section color overrides used below. See
 * `docs/superpowers/specs/2026-09-11-r9-phase-b0-arabic-homepage-parity-spec.md`.
 */
export default function ArabicHomePage() {
  return (
    <div className={visual.scope}>
      <HeroSectionAr />
      <AuthorityStripSectionAr />
      <FeaturedProcedureSectionAr />
      <CoreExpertiseSectionAr />
      <SexualHormonalHealthSectionAr />
      <AdvancedPenileSurgerySectionAr />
      <AboutSectionAr />
      <AuthorityMediaSectionAr />
      <InsightsSectionAr />
      <Faq items={homeFaqItemsAr} eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" locale="ar" />
      <BookingSectionAr />
    </div>
  );
}
