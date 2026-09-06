import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { AboutSection } from "@/components/sections/AboutSection";
import { AdvancedAssessmentSection } from "@/components/sections/AdvancedAssessmentSection";
import { AuthorityStripSection } from "@/components/sections/AuthorityStripSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { ConditionsSection } from "@/components/sections/ConditionsSection";
import { CoreExpertiseSection } from "@/components/sections/CoreExpertiseSection";
import { ErectileDysfunctionSection } from "@/components/sections/ErectileDysfunctionSection";
import { FeaturedProcedureSection } from "@/components/sections/FeaturedProcedureSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { MaleAestheticsSection } from "@/components/sections/MaleAestheticsSection";
import { PenileImplantSection } from "@/components/sections/PenileImplantSection";
import { TestosteroneSection } from "@/components/sections/TestosteroneSection";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
};

/**
 * Full homepage — spec §7, Sections 1–11, restructured per
 * SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md Phase A1: Male Genital
 * Aesthetics (with Penile Girth Enhancement as the flagship procedure,
 * introduced immediately after the authority strip) now precedes
 * ED/Implant/Testosterone, matching the updated physician-brand
 * strategy while keeping Core Expertise directly after it so the site
 * still reads as a full-specialty practice, not a single-procedure
 * page. Composition intentionally varies rhythm section to section
 * (editorial list, split layouts, horizontal flow, index, dark/olive
 * tonal shifts) rather than repeating one card-grid pattern (spec §38
 * Phase 2 / design quality bar, §37).
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AuthorityStripSection />
      <FeaturedProcedureSection />
      <CoreExpertiseSection />
      <MaleAestheticsSection />
      <ErectileDysfunctionSection />
      <PenileImplantSection />
      <TestosteroneSection />
      <AdvancedAssessmentSection />
      <AboutSection />
      <ConditionsSection />
      <InsightsSection />
      <BookingSection />
    </>
  );
}
