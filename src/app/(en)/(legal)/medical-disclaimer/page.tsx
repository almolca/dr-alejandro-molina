import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { practice } from "@/config/practice";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * DRAFT — pending final UAE/DoH legal and medical-compliance review
 * (spec §28, Phase 4 instruction §10). This is professional-draft-
 * quality placeholder content, not a legally or clinically reviewed
 * disclaimer. Do not treat as approved for launch without owner/legal
 * sign-off. See IMPLEMENTATION_REPORT.md.
 */

const PATH = "/medical-disclaimer";
const LAST_UPDATED = "3 September 2026";

export const metadata: Metadata = buildMetadata({
  title: "Medical Disclaimer",
  description: `Medical disclaimer for the personal website of ${doctor.displayName}.`,
  path: PATH,
  index: false,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Medical Disclaimer", href: PATH },
];

export default function MedicalDisclaimerPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Legal
          </p>
          <h1 className="mt-4 font-display text-display-lg text-foreground">
            Medical Disclaimer
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-xl text-foreground">Informational Purpose Only</h2>
              <p className="mt-3">
                The content on this website, including all pages
                describing conditions and treatments and all Insights
                articles, is provided for general informational
                purposes only. It is intended to help you understand
                the areas of practice of {doctor.displayName} and is
                not a substitute for professional medical advice,
                diagnosis or treatment.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Not a Substitute for Individual Assessment</h2>
              <p className="mt-3">
                Every person&rsquo;s medical situation is different.
                Nothing on this website should be used to diagnose or
                treat a health condition, and no content here should be
                relied upon as a recommendation for your individual
                circumstances. Diagnosis and treatment decisions require
                a formal consultation and, where appropriate,
                examination and investigations.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Seeking Consultation</h2>
              <p className="mt-3">
                If you have concerns about your health, or are
                considering any of the conditions or treatments
                described on this website, please arrange a
                consultation with {doctor.displayName} at{" "}
                {practice.facilityName}, {practice.city}, or consult
                another qualified healthcare professional.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Medical Emergencies</h2>
              <p className="mt-3">
                This website is not monitored for messages and cannot
                be used to seek urgent medical care. If you believe you
                are experiencing a medical emergency, please contact
                your local emergency services or attend your nearest
                emergency department immediately.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">No Guarantees</h2>
              <p className="mt-3">
                Descriptions of treatments and procedures on this
                website reflect general clinical information and are
                not guarantees of outcome. Individual results vary, and
                risks, benefits and alternatives for any treatment are
                discussed individually at consultation.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Changes to This Disclaimer</h2>
              <p className="mt-3">
                This disclaimer may be updated from time to time. The
                &ldquo;Last updated&rdquo; date above reflects the most
                recent revision.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
