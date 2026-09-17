import type { Metadata } from "next";
import { Suspense } from "react";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { isServiceInterest, type ServiceInterest } from "@/lib/domain/service-interest";
import { NmcBookingButton } from "@/components/booking/NmcBookingButton";
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
        <BookPageViewTracker path={PATH} service={defaultService} />
      </Suspense>

      <Breadcrumb items={breadcrumbItems} />

      {/* Direct NMC handoff — R9 booking funnel correction: no form. */}
      <section className="py-section-y">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Consultation
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Book a Consultation</h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              Appointments with {doctor.displayName} are managed through {practice.facilityName}.
            </p>

            <div className="mt-10">
              <NmcBookingButton sourcePage={PATH} label="Continue to NMC Booking" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              You will be redirected to the official {practice.facilityShortName} booking system.
            </p>

            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-11 items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                View NMC Profile
              </a>
            )}
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
    </>
  );
}
