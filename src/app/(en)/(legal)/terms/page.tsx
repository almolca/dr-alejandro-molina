import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { practice } from "@/config/practice";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * DRAFT — pending final UAE legal/compliance review (spec §28, Phase 4
 * instruction §10). This is professional-draft-quality placeholder
 * content, not a legally reviewed policy. Do not treat as approved for
 * launch without owner/legal sign-off. See IMPLEMENTATION_REPORT.md.
 */

const PATH = "/terms";
const LAST_UPDATED = "3 September 2026";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `Terms of use for the personal website of ${doctor.displayName}.`,
  path: PATH,
  index: false,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Terms of Use", href: PATH },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Legal
          </p>
          <h1 className="mt-4 font-display text-display-lg text-foreground">Terms of Use</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-xl text-foreground">Acceptance of Terms</h2>
              <p className="mt-3">
                By accessing this website, you agree to these Terms of
                Use. If you do not agree with them, please do not use
                this website.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Purpose of This Website</h2>
              <p className="mt-3">
                This website provides general information about{" "}
                {doctor.displayName}&rsquo;s clinical practice areas.
                Its content is informational and does not constitute
                medical advice, diagnosis or treatment, and does not
                replace an individual consultation. See our{" "}
                <a
                  href="/medical-disclaimer"
                  className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
                >
                  Medical Disclaimer
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">No Doctor-Patient Relationship</h2>
              <p className="mt-3">
                Viewing this website, or using its content, does not
                create a doctor-patient relationship. A doctor-patient
                relationship is established only through a formal
                consultation with {doctor.displayName} at{" "}
                {practice.facilityName}.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Booking via Third Party</h2>
              <p className="mt-3">
                Appointment booking is handled entirely by{" "}
                {practice.facilityShortName} through its own official
                systems. This website does not process bookings,
                payments, or patient data, and is not responsible for
                the availability or operation of{" "}
                {practice.facilityShortName}&rsquo;s booking platform.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Intellectual Property</h2>
              <p className="mt-3">
                The content, design and branding of this website are
                the property of {doctor.displayName} unless otherwise
                stated, and may not be reproduced without permission.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Limitation of Liability</h2>
              <p className="mt-3">
                This website and its content are provided on an
                &ldquo;as is&rdquo; basis. To the fullest extent
                permitted by applicable law, no liability is accepted
                for any loss or damage arising from reliance on
                information presented on this website, in place of
                individual medical assessment.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Governing Law</h2>
              <p className="mt-3">
                These Terms are governed by the laws applicable in the
                Emirate of Abu Dhabi and the United Arab Emirates,
                without prejudice to any mandatory local regulatory
                requirements.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Changes to These Terms</h2>
              <p className="mt-3">
                These Terms may be updated from time to time. The
                &ldquo;Last updated&rdquo; date above reflects the most
                recent revision.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Contact</h2>
              <p className="mt-3">
                For questions about these Terms, please use the contact
                details provided by {practice.facilityShortName} for{" "}
                {doctor.displayName}.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
