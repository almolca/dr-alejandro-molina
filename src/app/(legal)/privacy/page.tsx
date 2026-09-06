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

const PATH = "/privacy";
const LAST_UPDATED = "3 September 2026";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for the personal website of ${doctor.displayName}.`,
  path: PATH,
  index: false,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Privacy Policy", href: PATH },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Legal
          </p>
          <h1 className="mt-4 font-display text-display-lg text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-xl text-foreground">Introduction</h2>
              <p className="mt-3">
                This Privacy Policy explains how information is
                handled on this website, the personal website of{" "}
                {doctor.displayName}, {doctor.title}, practicing at{" "}
                {practice.facilityName}, {practice.city},{" "}
                {practice.country}. This website is independent of{" "}
                {practice.facilityShortName} and does not act on its
                behalf, except where explicitly stated.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Information We Collect</h2>
              <p className="mt-3">
                This website does not include contact forms, account
                registration, or any mechanism for submitting personal
                or health information. It does not collect, process or
                store medical, symptom or appointment data of any kind.
              </p>
              <p className="mt-3">
                Standard technical information (such as browser type
                and general usage data) may be logged automatically by
                the hosting infrastructure that serves this website, as
                is typical for any website — this is not used to
                identify individual visitors for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Cookies and Analytics</h2>
              <p className="mt-3">
                This website does not currently use analytics or
                marketing cookies. If analytics tools are introduced in
                the future, this policy will be updated accordingly and
                appropriate consent mechanisms will be implemented
                before any such tool is activated. No symptom, health
                or appointment information is ever sent to analytics
                tools.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Booking and Third-Party Links</h2>
              <p className="mt-3">
                &ldquo;Book a Consultation&rdquo; and &ldquo;View NMC
                Profile&rdquo; links on this website take you to{" "}
                {practice.facilityShortName}&rsquo;s official
                platforms, which operate under their own privacy
                policy. This website does not process appointment
                bookings and does not have access to any information
                you provide on {practice.facilityShortName}&rsquo;s
                systems.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Data Security</h2>
              <p className="mt-3">
                Reasonable technical measures are used to help protect
                this website. Because no personal or health data is
                collected through the website itself, the associated
                data-protection risk is intentionally minimal by
                design.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Your Rights</h2>
              <p className="mt-3">
                You may have rights in relation to any personal data
                processed about you under applicable data protection
                law in the United Arab Emirates. Since this website
                does not itself collect personal data, most such rights
                would apply to information you provide directly to{" "}
                {practice.facilityShortName} as part of booking or
                attending a consultation, and should be directed to{" "}
                {practice.facilityShortName}.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Changes to This Policy</h2>
              <p className="mt-3">
                This policy may be updated from time to time. The
                &ldquo;Last updated&rdquo; date above reflects the most
                recent revision.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Contact</h2>
              <p className="mt-3">
                For questions about this policy, please use the contact
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
