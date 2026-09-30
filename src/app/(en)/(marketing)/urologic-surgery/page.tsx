import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { doctor } from "@/config/doctor";
import { Button } from "@/components/ui/Button";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/urologic-surgery";

export const metadata: Metadata = buildMetadata({
  title: "Advanced Urologic Surgery in Abu Dhabi",
  description:
    "Laparoscopic surgical care for prostate cancer from Dr. Alejandro Molina, Consultant Urologist & Andrologist in Abu Dhabi — including laparoscopic radical prostatectomy, with transparent explanation of how surgeon experience and technique shape outcomes.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Urologic Surgery", href: PATH },
];

const faqItems = [
  {
    question: "Is this the same practice that focuses on men's sexual health?",
    answer:
      "Yes. Dr. Molina's practice in andrology and sexual medicine continues as before — Urologic Surgery is a separate, additional area reflecting his broader training and experience as a Consultant Urologist, with a particular focus on laparoscopic radical prostatectomy for prostate cancer.",
  },
  {
    question: "Does Dr. Molina perform robotic surgery?",
    answer:
      "No. Dr. Molina performs laparoscopic, not robot-assisted, radical prostatectomy. The Laparoscopic Radical Prostatectomy page explains the difference between the two approaches and why the surgical platform is only one part of the outcome.",
    readMoreHref: "/urologic-surgery/laparoscopic-radical-prostatectomy",
    readMoreLabel: "Explore Laparoscopic Radical Prostatectomy",
  },
  {
    question: "What other procedures fall under Urologic Surgery?",
    answer:
      "Laparoscopic radical prostatectomy is the current focus of this area. Dr. Molina's broader urologic surgical background also includes laparoscopic kidney surgery; further procedure-specific pages will be added here as they are completed.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a consultation to review your diagnosis, imaging and pathology, and to discuss whether laparoscopic radical prostatectomy is an appropriate option for you.",
  },
];

export default function UrologicSurgeryPage() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Advanced Urologic Surgery",
            description:
              "Laparoscopic surgical care for prostate cancer, with a transparent explanation of how surgeon experience and technique shape outcomes.",
            path: PATH,
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <EditorialField className="py-14">
        <HeroAtmosphere align="left" restrained />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <MaskedReveal className="order-last w-full lg:order-first">
            <EditorialFrame slot="urologicSurgeryHero" landscape priority />
          </MaskedReveal>

          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Advanced Urologic Surgery · Abu Dhabi
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                Advanced Urologic Surgery
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-muted-foreground">
                Laparoscopic surgical care for prostate and kidney
                disease, from a Consultant Urologist &amp; Andrologist —
                with a particular focus on laparoscopic radical
                prostatectomy for prostate cancer.
              </p>
              <Link href="/urologic-surgery/laparoscopic-radical-prostatectomy" className="mt-6 inline-flex text-sm underline decoration-accent-strong underline-offset-4">
                Explore Laparoscopic Radical Prostatectomy
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="urologic_surgery" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
              </div>
            </Reveal>
            <div className={visual.physicianIdentity}><p>{doctor.displayName}</p><span>{doctor.title}</span></div>
          </div>
        </Container>
      </EditorialField>

      {/* Flagship — Laparoscopic Radical Prostatectomy */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.6fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading eyebrow="Focus area" heading="Laparoscopic Radical Prostatectomy" size="xl" />
            <div className={visual.flagshipMetrics}>
              <p><strong>{doctor.laparoscopicProstatectomy.procedureCount}</strong><span>Laparoscopic radical prostatectomies</span></p>
              <p><strong>{doctor.laparoscopicProstatectomy.outcomes.majorComplications.value}%</strong><span>Major complications (Clavien-Dindo ≥III)</span></p>
            </div>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                Surgical treatment of localized prostate cancer, performed
                laparoscopically — not robotically. The surgical platform
                is only one part of the outcome: surgeon experience,
                technique, patient selection and surgical volume also
                play a major role, explained transparently on the full
                procedure page, alongside published benchmark ranges for
                context.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/urologic-surgery/laparoscopic-radical-prostatectomy">Explore Laparoscopic Radical Prostatectomy</Link>
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Broader surgical background — prose only, no links to not-yet-built pages */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Surgical background"
            heading="Beyond Prostate Cancer Surgery"
            description="Dr. Molina's training and experience as a Consultant Urologist extend beyond prostate cancer surgery to laparoscopic kidney surgery. Procedure-specific pages for these areas will be added here as they are completed — in the meantime, they can be discussed directly at consultation."
          />
        </Container>
      </section>

      {/* About Dr. Molina */}
      <section className="border-t border-border bg-background py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            About
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            {doctor.displayName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Urologic surgery at this practice is performed within a
            Consultant Urologist &amp; Andrologist&rsquo;s practice
            {doctor.yearsOfExperience !== undefined &&
              ` — ${doctor.yearsOfExperience}+ years of experience in Urology`}
            .
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
          >
            About {doctor.displayName}
          </Link>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Laparoscopic Radical Prostatectomy", href: "/urologic-surgery/laparoscopic-radical-prostatectomy" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Penile Implant Surgery", href: "/penile-implant" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Your Diagnosis and Options"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
      />
    </div>
  );
}
