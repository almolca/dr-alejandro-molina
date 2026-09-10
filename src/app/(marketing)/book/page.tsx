import type { Metadata } from "next";
import { Suspense } from "react";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { isServiceInterest, type ServiceInterest } from "@/lib/domain/service-interest";
import { BookingLeadForm } from "@/components/forms/BookingLeadForm";
import { BookPageViewTracker } from "@/components/analytics/BookPageViewTracker";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/book";

export const metadata: Metadata = buildMetadata({
  title: "Book a Consultation",
  description:
    "Book a consultation with Dr. Alejandro Molina, Consultant Urologist & Andrologist, at NMC Royal Hospital Khalifa City, Abu Dhabi.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Book a Consultation", href: PATH },
];

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  const defaultService: ServiceInterest | undefined =
    params.service && isServiceInterest(params.service) ? params.service : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Suspense fallback={null}>
        <BookPageViewTracker service={defaultService} />
      </Suspense>

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero + lead form */}
      <section className="py-section-y">
        <Container className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Consultation
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              Consult {doctor.displayName}
            </h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              {doctor.title} · {practiceLocationLine}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Share your details below and continue directly to the official{" "}
              {practice.facilityShortName} booking system to choose your appointment time.
            </p>
            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-11 items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                View NMC Profile
              </a>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <Suspense fallback={null}>
              <BookingLeadForm defaultService={defaultService} sourcePage={PATH} />
            </Suspense>
          </Reveal>
        </Container>
      </section>

      {/* Practice details */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Physician
            </p>
            <p className="mt-4 font-display text-2xl text-foreground">{doctor.displayName}</p>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Practice location
            </p>
            <p className="mt-4 font-display text-2xl text-foreground">{practice.facilityName}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {practice.city}, {practice.country}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What happens with your details */}
      <section className="py-section-y">
        <Container className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-display-md text-foreground">
              How Booking Works
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              This page is an owned gateway to {practice.facilityShortName}&rsquo;s official
              booking system, not a separate enquiry form — there is no callback workflow.
              Submitting sends your name, email and (if provided) what you&rsquo;d like to
              discuss to {doctor.displayName}&rsquo;s practice, and immediately continues you to
              the official {practice.facilityName} appointment system, where booking and any
              patient records are handled entirely by {practice.facilityShortName}. See our{" "}
              <a href="/privacy" className="underline decoration-accent-strong underline-offset-4">
                Privacy Policy
              </a>{" "}
              for details.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
