import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/mens-health";

export const metadata: Metadata = buildMetadata({
  title: "Men's Health",
  description:
    "Specialist men's health care in Abu Dhabi — testosterone and hormonal health, and related areas, assessed individually before any treatment is considered.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Men's Health", href: PATH },
];

const areas = [
  {
    label: "Testosterone & Male Hormonal Health",
    description: "Symptoms, diagnosis and when treatment is clinically appropriate.",
    href: "/mens-health/testosterone",
  },
  {
    label: "Low Libido",
    description: "Assessed alongside hormonal, medical and psychosexual factors.",
    href: "/mens-health/low-libido",
  },
];

export default function MensHealthPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Men&rsquo;s Health
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Men&rsquo;s Health</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Specialist care for the hormonal and general health
              concerns that matter to men — assessed individually,
              before any treatment is considered.
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
            {areas.map((area) => (
              <StaggerItem key={area.href}>
                <Link
                  href={area.href}
                  className="group flex flex-col gap-2 border-b border-border py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  <span className="font-display text-2xl text-foreground">{area.label}</span>
                  <span className="max-w-sm text-sm text-muted-foreground">{area.description}</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>
    </>
  );
}
