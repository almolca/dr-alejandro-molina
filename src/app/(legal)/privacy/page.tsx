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
const LAST_UPDATED = "10 September 2026";

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
                When you submit the &ldquo;Book a Consultation&rdquo; form on this
                website, we collect your full name, email address, mobile number,
                service of interest, and (if provided) your preferred contact
                method. We do not ask for and do not collect symptoms, diagnosis,
                medical history, medications, or any other health information
                through this website.
              </p>
              <p className="mt-3">
                We also record where a visit or enquiry came from — such as the
                referring website, search engine, or campaign link (UTM
                parameters) — and the page you were on when you clicked
                &ldquo;Continue to NMC Booking&rdquo;. This is used only to
                understand which channels bring visitors to the site, not to
                build a profile of you as an individual.
              </p>
              <p className="mt-3">
                Standard technical information (such as browser type and general
                usage data) may also be logged automatically by the hosting
                infrastructure that serves this website, as is typical for any
                website.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Cookies and Analytics</h2>
              <p className="mt-3">
                This website uses a small number of first-party, non-advertising
                cookies. Two remember where a visit first came from and most
                recently came from (e.g. a search engine, social media, or a
                specific campaign link), so we can understand which channels
                bring enquiries; these expire after 180 days and store only a
                short code (such as &ldquo;google_business&rdquo; or
                &ldquo;direct&rdquo;) and the page path — never your name, email,
                or phone number. A separate anonymous identifier (a random code,
                not derived from any personal information) is used, subject to
                your consent below, to count page views and button clicks
                without identifying you individually.
              </p>
              <p className="mt-3">
                Anonymous, aggregate analytics events (such as a page view or a
                &ldquo;Book a Consultation&rdquo; button click) are only recorded
                once you accept analytics cookies via the banner shown on this
                site. No symptom, health, or appointment information is ever
                sent to analytics, and analytics events are never linked to the
                contact details you submit through the booking form.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Booking and Third-Party Links</h2>
              <p className="mt-3">
                Submitting the booking form creates a record with this
                practice&rsquo;s own systems, used to follow up with you and
                understand where enquiries come from. It does not, by itself,
                create an appointment. Clicking &ldquo;Continue to NMC
                Booking&rdquo; (and the &ldquo;View NMC Profile&rdquo; link)
                takes you to {practice.facilityShortName}&rsquo;s official
                platforms, which operate under their own privacy policy. This
                website does not process appointment scheduling itself and does
                not have access to any information you provide on{" "}
                {practice.facilityShortName}&rsquo;s systems.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Data Security</h2>
              <p className="mt-3">
                Contact details submitted through the booking form are stored in
                a database that is not directly accessible from the browser —
                all reads and writes happen through this website&rsquo;s own
                server, protected against unrestricted public access. Reasonable
                technical measures are used to help protect this website more
                generally. We do not collect health data through this website.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Your Rights</h2>
              <p className="mt-3">
                You may have rights in relation to any personal data processed
                about you under applicable data protection law in the United
                Arab Emirates, including the right to ask what information we
                hold about you or to request its deletion. For data you
                submitted through this website&rsquo;s booking form, contact us
                using the details below. For information you provide directly
                to {practice.facilityShortName} as part of booking or attending
                a consultation, such requests should be directed to{" "}
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
