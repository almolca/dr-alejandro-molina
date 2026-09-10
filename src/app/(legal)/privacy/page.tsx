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
 *
 * R8.1C/R8.1D hardened the *technical* implementation (consent gating,
 * accurate collected-fields list, cross-border/retention/processor
 * disclosure) and reviewed it against publicly available UAE PDPL
 * guidance — that is not the same thing as final legal sign-off, and
 * this file's content should not be read as a claim of guaranteed
 * legal compliance. The DRAFT status above is deliberately unchanged.
 */

const PATH = "/privacy";
const LAST_UPDATED = "10 September 2026 (R8.1D)";

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
                website, we collect your full name and email address, and, only
                if you choose to provide it, a general topic you&rsquo;d like to
                discuss (selected from a short list, such as &ldquo;Male
                Hormonal Health&rdquo; or &ldquo;General Urology&rdquo;) —
                this field is optional, and you may select
                &ldquo;Prefer not to say&rdquo; instead. We do not ask for and
                do not collect symptoms, a diagnosis, medical history,
                medications, test results, or clinical records through this
                website.
              </p>
              <p className="mt-3">
                We are conscious that, because this is a medical practice&rsquo;s
                website, even a general topic selection can be sensitive —
                it may indicate an area of health interest, even though it is
                not a diagnosis and is entirely optional. This field is
                handled with the same access controls as your other contact
                details (see &ldquo;Data Security&rdquo; below), is never
                combined with the analytics described below, and — as with any
                data you submit through this form — you may ask us to delete it
                at any time (see &ldquo;Your Rights&rdquo;).
              </p>
              <p className="mt-3">
                We also record where a visit or enquiry came from — such as the
                referring website, search engine, or campaign link (UTM
                parameters) — and, where applicable, which page on this site
                linked you to the booking page. This is used only to
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
                cookies, none of which are used for advertising or shared with
                any advertising network. Two remember where a visit first came
                from and most recently came from (e.g. a search engine, social
                media, or a specific campaign link), and a third remembers which
                page linked you to the booking page — these help us understand
                which channels bring enquiries, expire after 180 days (30
                minutes for the booking-referral one), and store only a short
                code (such as &ldquo;google_business&rdquo; or
                &ldquo;direct&rdquo;) and a page path — never your name, email,
                or phone number. Like the anonymous identifier described below,
                these are only set once you accept analytics cookies via the
                banner shown on this site.
              </p>
              <p className="mt-3">
                A separate anonymous identifier (a random code, not derived
                from any personal information) is used, subject to your consent
                below, to count page views and button clicks without
                identifying you individually. Anonymous, aggregate analytics
                events (such as a page view or a &ldquo;Book a
                Consultation&rdquo; button click) are only recorded once you
                accept analytics cookies. No symptom, health, or appointment
                information is ever sent to analytics, and analytics events are
                never linked to the contact details you submit through the
                booking form.
              </p>
              <p className="mt-3">
                You can change your cookie choice at any time using the
                &ldquo;Cookie Settings&rdquo; link in the footer of this site,
                which reopens the same banner shown on your first visit.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">
                Where Information Is Processed
              </h2>
              <p className="mt-3">
                This website is built and hosted on Vercel, and booking/lead
                and analytics data is stored in a database managed by
                Supabase. These are the specific infrastructure and database
                providers currently used to run this website. Based on their
                currently configured regions, the application itself runs in
                the United States and the database is located in India —
                both outside the United Arab Emirates. These providers act
                only on this website&rsquo;s instructions, as processors, and
                do not independently use your data for their own purposes.
                We use them because they provide the technical
                infrastructure this website runs on, not as a matter of
                preference for any particular country, and this section will
                be updated if that infrastructure changes.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Retention</h2>
              <p className="mt-3">
                Booking/lead records that do not result in a confirmed
                consultation are kept for up to 12 months from submission,
                after which they are eligible for deletion. Analytics data
                (the anonymous identifier and event records described above)
                is kept only for as long as reasonably useful for
                understanding how the site is used for our current
                operational needs.
              </p>
              <p className="mt-3">
                This describes our intended retention practice.
                Automated, scheduled deletion enforcing it is not yet
                implemented — this is identified as a follow-up operational
                requirement, not something already running. Regardless of
                how long information has been held, you may ask us to
                delete your information at any time (see &ldquo;Your
                Rights&rdquo;).
              </p>
              <p className="mt-3">
                This retention approach applies only to information
                collected through this website. It does not apply to your
                medical records, appointment history, or any clinical
                information held by {practice.facilityShortName}, which are
                governed by {practice.facilityShortName}&rsquo;s own
                policies, not this one.
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
                Contact details submitted through the booking form — including
                the optional topic field described above — are stored in a
                database that is not directly accessible from the browser: all
                reads and writes happen through this website&rsquo;s own
                server, and the database itself is configured to deny direct
                access entirely, accessible only through that server.
                Reasonable technical measures are used to help protect this
                website more generally. As noted above, this website does not
                collect symptoms, a diagnosis, medical history, medications,
                test results, or clinical records.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-foreground">Your Rights</h2>
              <p className="mt-3">
                You may have rights in relation to any personal data processed
                about you under applicable data protection law in the United
                Arab Emirates, including the right to ask what information we
                hold about you, to request its correction or deletion, and to
                withdraw any consent you have given at any time. Withdrawing
                consent does not affect the lawfulness of anything already done
                based on it. For analytics cookies specifically, withdrawal is
                immediate via the &ldquo;Cookie Settings&rdquo; link in the
                footer. For data you submitted through this website&rsquo;s
                booking form, contact us using the details below. For
                information you provide directly to{" "}
                {practice.facilityShortName} as part of booking or attending a
                consultation, such requests should be directed to{" "}
                {practice.facilityShortName}.
              </p>
              <p className="mt-3">
                Submitting the booking form is consent to that specific
                purpose — being contacted to facilitate your appointment — and
                is not consent to receive marketing or promotional
                communications. This website does not send marketing
                communications, and would only ever do so on the basis of
                separate, explicit consent obtained for that specific purpose.
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
