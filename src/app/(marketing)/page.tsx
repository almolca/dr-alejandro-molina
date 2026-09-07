import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { AboutSection } from "@/components/sections/AboutSection";
import { AdvancedPenileSurgerySection } from "@/components/sections/AdvancedPenileSurgerySection";
import { AuthorityMediaSection } from "@/components/sections/AuthorityMediaSection";
import { AuthorityStripSection } from "@/components/sections/AuthorityStripSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { CoreExpertiseSection } from "@/components/sections/CoreExpertiseSection";
import { FeaturedProcedureSection } from "@/components/sections/FeaturedProcedureSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { SexualHormonalHealthSection } from "@/components/sections/SexualHormonalHealthSection";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
};

/**
 * Full homepage — Phase R1-R2 consolidation from 13 sections to 10.
 * Dropped MaleAestheticsSection (redundant with Core Expertise + the
 * now-dark Featured Procedure section) and ConditionsSection (redundant
 * with nav/footer). Merged ErectileDysfunction + Testosterone into
 * SexualHormonalHealthSection, and PenileImplant + AdvancedAssessment
 * into AdvancedPenileSurgerySection (demoted from dark to light — see
 * that component's own comment for why). Penile Girth Enhancement now
 * holds the homepage's one dark "flagship" moment instead of Penile
 * Implant, correcting the audit's confirmed visual-hierarchy mismatch.
 *
 * Phase R2.1/R3: the former MedicalTrainingSection (AndroMax) was
 * consolidated into AuthorityMediaSection, which combines Recognition +
 * Media Appearances + Medical Training in one compact section — see
 * that component's own comment for how it grows once Recognition/Media
 * data exists.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AuthorityStripSection />
      <FeaturedProcedureSection />
      <CoreExpertiseSection />
      <SexualHormonalHealthSection />
      <AdvancedPenileSurgerySection />
      <AboutSection />
      <AuthorityMediaSection />
      <InsightsSection />
      <BookingSection />
    </>
  );
}
