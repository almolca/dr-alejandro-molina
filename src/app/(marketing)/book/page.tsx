import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { isPhysicianProfileConfigured, practice, practiceLocationLine } from "@/config/practice";
import { BookingCta } from "@/components/ui/BookingCta";
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

export default function BookPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-2xl text-center mx-auto">
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
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
              {isPhysicianProfileConfigured && (
                <a
                  href={practice.physicianProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  View NMC Profile
                </a>
              )}
            </div>
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

      {/* What the CTA does */}
      <section className="py-section-y">
        <Container className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-display-md text-foreground">
              How Booking Works
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              &ldquo;Book a Consultation&rdquo; takes you directly to
              the official {practice.facilityName} appointment system,
              where you can arrange your consultation with{" "}
              {doctor.displayName}. This site does not collect or store
              any appointment or health information — booking and any
              patient records are handled entirely by{" "}
              {practice.facilityShortName}.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Closing CTA — dark, this page's conversion moment */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-display text-display-md text-foreground">
              Ready to Book Your Consultation?
            </h2>
            <div className="mt-8">
              <BookingCta sourcePage={PATH} ctaPosition="page-closing-cta" size="lg" />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
