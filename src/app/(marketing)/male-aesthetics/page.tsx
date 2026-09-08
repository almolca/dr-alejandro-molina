import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { ContourPlanningDiagram } from "@/components/illustrations/ContourPlanningDiagram";
import { Button } from "@/components/ui/Button";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { AuthorityBlock } from "@/components/ui/AuthorityBlock";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TonalSection } from "@/components/ui/TonalSection";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/male-aesthetics";

export const metadata: Metadata = buildMetadata({
  title: "Male Genital Aesthetics",
  description:
    "Specialist urological and andrological assessment in Abu Dhabi for men considering penile enhancement or revision of previous treatment — anatomy-led, medically supervised. Flagship procedure: penile girth enhancement with hyaluronic acid.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Genital Aesthetics", href: PATH },
];

/**
 * Girth Enhancement's authority line — config-driven per Phase A;
 * simply omitted from the sentence if either field is unset.
 */
const girthAuthorityLine = [
  doctor.girthProcedureCount !== undefined && `${doctor.girthProcedureCount} procedures performed`,
  doctor.girthEnhancementSince !== undefined && `experience since ${doctor.girthEnhancementSince}`,
]
  .filter((part): part is string => Boolean(part))
  .join(", ");

/**
 * Phase R1-R2: Scrotal Lift and Filler Correction, rendered as a
 * visually secondary pair beneath the standalone flagship Girth
 * Enhancement feature below — was previously three equal-weight rows
 * despite the copy itself calling Girth Enhancement "the flagship
 * procedure at this practice."
 */
const secondaryAreas = [
  {
    title: "Scrotal Lift",
    description:
      "Scrotal aesthetic surgery for men with excess or lax scrotal skin. Assessment and surgical planning are individualized, with scar placement, recovery and limitations discussed in detail.",
    cta: { label: "Explore Scrotal Lift", href: "/male-aesthetics/scrotal-lift" },
  },
  {
    title: "Penile Filler Correction",
    description:
      "Men who have previously had penile filler — here or elsewhere — sometimes present with asymmetry, nodules, irregularity, migration or dissatisfaction with prior results. These cases are assessed individually, with dissolution or revision considered where appropriate.",
    cta: { label: "Explore Penile Filler Correction", href: "/male-aesthetics/penile-filler-correction" },
  },
];

const faqItems = [
  {
    question: "Is this the same as generic cosmetic filler treatment?",
    answer:
      "No. Male genital aesthetics is approached within an andrology and urology context, with a full anatomical and medical assessment — not a generic walk-in cosmetic procedure.",
  },
  {
    question: "What if I've had filler elsewhere that I'm not happy with?",
    answer:
      "Previous filler problems — including asymmetry, nodules or irregularity — are assessed individually, with revision considered where appropriate.",
  },
  {
    question: "Are surgical options available?",
    answer:
      "Surgical approaches are considered only where appropriate and approved, and discussed individually at consultation — not offered as a default option. Scrotal lift, for men with excess or lax scrotal skin, is one such surgical option.",
  },
  {
    question: "Can a specific result be guaranteed?",
    answer:
      "No specific outcome can be guaranteed. Individual results vary, and realistic expectations are discussed in detail as part of assessment.",
  },
  {
    question: "How does the process start?",
    answer:
      "The process begins with a medical consultation to assess anatomy, goals and suitability before any option is discussed further.",
  },
];

export default function MaleAestheticsPage() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Male Genital Aesthetics",
            description:
              "Specialist urological and andrological assessment for men considering penile enhancement or revision of previous treatment.",
            path: PATH,
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero — image left this time, for rhythm distinct from the Implant page's image-right split.
          order-last on mobile: H1/positioning before the placeholder image, even though the
          image sits left on desktop (lg:order-first) — found in the Phase 5 UX audit. */}
      <EditorialField className="py-14">
        <HeroAtmosphere align="left" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first">
            <EditorialFrame slot="aestheticsHero" landscape priority />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Male Genital Aesthetics · Abu Dhabi
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                Male Genital Aesthetics
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
                Consultant-led penile and scrotal aesthetic care
                combining specialist urological anatomy, procedural
                experience and individual treatment planning.
              </p>
              <Link href="/male-aesthetics/penile-girth-enhancement" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">Explore Penile Girth Enhancement</Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
              </div>
            </Reveal>
          <div className={visual.physicianIdentity}><p>{doctor.displayName}</p><span>{doctor.title}</span></div>
          </div>
        </Container>
      </EditorialField>

      {/* Flagship — standalone, larger-scale treatment (Phase R1-R2),
          distinct from the secondary pair below rather than three
          equal-weight rows. */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.6fr] lg:items-center lg:gap-16">
          <div>
          <SectionHeading eyebrow="Flagship procedure" heading="Penile Girth Enhancement" size="xl" />
          <div className="my-8"><AuthorityBlock /></div>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              The flagship procedure at this practice, and the most
              common goal raised at consultation. Hyaluronic acid
              penile augmentation is the more commonly discussed
              starting point, planned around individual anatomy — not
              a walk-in cosmetic procedure — with surgical approaches
              considered only where appropriate.
              {girthAuthorityLine ? ` Dr. Molina's ${girthAuthorityLine}.` : ""}
            </p>
            <Button asChild size="lg" className="mt-8"><Link href="/male-aesthetics/penile-girth-enhancement">Explore Penile Girth Enhancement</Link></Button>
          </Reveal>
          </div>
          <Reveal delay={0.1} className="hidden justify-self-center lg:flex">
            <ContourPlanningDiagram className="h-40 w-40 text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      {/* Also available — visually secondary pair (Phase R1-R2), warm tonal gradient (Phase R3) */}
      <TonalSection tone="warm" className="border-t border-border">
        <Container>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Also available
          </p>
          <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-12 border-t border-border pt-10 md:grid-cols-2">
            {secondaryAreas.map((area) => (
              <Reveal key={area.title}>
                <h3 className="font-display text-xl text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <Link
                  href={area.cta.href}
                  className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  {area.cta.label}
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </TonalSection>

      {/* Why specialist assessment matters — moved earlier (Phase R1-R2):
          this concept is central to positioning and previously sat near
          the bottom of the page. Olive, this page's one distinctive
          tonal moment. */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Why specialist assessment matters
            </p>
            <p className="mt-6 text-body-lg text-foreground">
              Penile anatomy varies significantly between individuals.
              Treatment planned without a proper anatomical and medical
              assessment carries a greater risk of asymmetry,
              irregularity or dissatisfaction.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Anatomy",
                "Tissue characteristics",
                "Previous treatments",
                "Goals",
                "Risks",
                "Correction options",
                "Follow-up",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              As with any aesthetic or augmentation procedure,
              individual results vary and cannot be guaranteed. Risks
              depend on the specific approach considered, and are
              reviewed in detail during consultation alongside what can
              realistically be expected.
            </p>
          </Reveal>
        </Container>
      </section>


      {/* Physician presence — Phase R1-R2 */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">

          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              About
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {doctor.displayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Male genital aesthetics at this practice is performed
              within a Consultant Urologist &amp; Andrologist&rsquo;s
              practice
              {doctor.girthEnhancementSince !== undefined &&
                `, with penile girth enhancement experience since ${doctor.girthEnhancementSince}`}
              .
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              About {doctor.displayName}
            </Link>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" },
          { label: "Scrotal Lift", href: "/male-aesthetics/scrotal-lift" },
          { label: "Penile Filler Correction", href: "/male-aesthetics/penile-filler-correction" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Begin With a Medical Consultation"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{
          label: "Explore Penile Girth Enhancement",
          href: "/male-aesthetics/penile-girth-enhancement",
        }}
      />
    </div>
  );
}
