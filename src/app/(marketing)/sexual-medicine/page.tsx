import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/sexual-medicine";

export const metadata: Metadata = buildMetadata({
  title: "Sexual Medicine",
  description:
    "Specialist sexual medicine in Abu Dhabi — erectile dysfunction assessment, Penile Doppler and shockwave therapy, with treatment matched to the underlying cause.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Sexual Medicine", href: PATH },
];

const areas = [
  {
    label: "Erectile Dysfunction",
    description: "Diagnosis-first assessment and a treatment ladder matched to the cause.",
    href: "/erectile-dysfunction",
  },
  {
    label: "Penile Doppler",
    description: "Advanced ultrasound assessment of penile blood flow, where indicated.",
    href: "/erectile-dysfunction/penile-doppler",
  },
  {
    label: "Shockwave Therapy",
    description: "Li-SWT — one option considered for selected patients, after assessment.",
    href: "/erectile-dysfunction/shockwave-therapy",
  },
];

export default function SexualMedicinePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Sexual Medicine
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Sexual Medicine</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Specialist assessment and treatment for erectile
              dysfunction, matched to the underlying cause rather than a
              single default approach.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <StaggerGroup className="border-t border-border">
            {areas.map((area, index) => (
              <StaggerItem key={area.href}>
                <Link
                  href={area.href}
                  className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-6 gap-y-2 border-b border-border py-8 sm:grid-cols-[4rem_1fr_1fr] sm:items-center"
                >
                  <span className="font-display text-2xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-2 font-display text-2xl text-foreground sm:col-span-1">
                    {area.label}
                  </span>
                  <span className="col-span-2 max-w-sm text-sm text-muted-foreground sm:col-span-1">
                    {area.description}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Faq
        items={[
          {
            question: "Where do I start if I'm not sure what's causing the problem?",
            answer:
              "With an assessment. Erectile dysfunction can have several contributing causes, and treatment is matched to what's actually found — not assumed from symptoms alone.",
          },
          {
            question: "Is Penile Doppler always required?",
            answer:
              "No. It's used when a vascular cause needs to be evaluated specifically, not as a routine step for every patient.",
          },
          {
            question: "Is shockwave therapy a first-line treatment?",
            answer:
              "No. It's one option that may be considered for selected patients after assessment, not a stand-alone starting point.",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="Start With an Assessment, Not an Assumption"
        sourcePage={PATH}
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
        bookingLabel="Book a Confidential Consultation"
      />
    </>
  );
}
