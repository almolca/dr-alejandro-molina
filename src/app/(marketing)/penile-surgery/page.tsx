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

const PATH = "/penile-surgery";

export const metadata: Metadata = buildMetadata({
  title: "Penile Surgery",
  description:
    "Specialist penile surgery in Abu Dhabi — penile implant surgery for severe erectile dysfunction and Peyronie's disease assessment and management.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Penile Surgery", href: PATH },
];

const areas = [
  {
    label: "Penile Implant Surgery",
    description: "A surgical option for severe or refractory erectile dysfunction.",
    href: "/penile-implant",
  },
  {
    label: "Peyronie's Disease",
    description: "Curvature and erectile function, with conservative, procedural and surgical pathways.",
    href: "/peyronies-disease",
  },
];

export default function PenileSurgeryPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Penile Surgery
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Penile Surgery</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Surgical options considered once appropriate assessment
              and, where relevant, non-surgical treatment have been
              explored.
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
          <StaggerGroup className="grid grid-cols-1 gap-x-16 gap-y-10 border-t border-border pt-10 md:grid-cols-2">
            {areas.map((area) => (
              <StaggerItem key={area.href}>
                <Link href={area.href} className="group block">
                  <span className="font-display text-2xl text-foreground transition-colors group-hover:text-accent-strong">
                    {area.label}
                  </span>
                  <span className="mt-3 block max-w-sm text-sm text-muted-foreground">
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
            question: "Is surgery always the first option?",
            answer:
              "No. Surgical options here are considered once appropriate assessment — and, where relevant, non-surgical treatment — have been explored first.",
          },
          {
            question: "How are penile implant surgery and Peyronie's disease related?",
            answer:
              "They're separate conditions, but Peyronie's disease can affect erectile function, and prior pelvic surgery or structural conditions can be relevant to both — assessment considers them together where relevant.",
          },
        ]}
      />

      <TreatmentCtaSection
        heading="Discuss Whether Surgery Is Right for You"
        sourcePage={PATH}
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
        bookingLabel="Book a Confidential Consultation"
      />
    </>
  );
}
