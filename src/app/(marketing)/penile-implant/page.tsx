import type { Metadata } from "next";
import { AmpersandText } from "@/components/ui/AmpersandText";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import { CandidateCheck } from "@/components/editorial/CandidateCheck";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import { ImplantDeviceDiagram } from "@/components/illustrations/ImplantDeviceDiagram";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/penile-implant";

export const metadata: Metadata = buildMetadata({
  title: "Penile Implant Surgery",
  description:
    "Penile implant surgery for severe erectile dysfunction in Abu Dhabi — inflatable and malleable options, candidacy, the surgical pathway, recovery and realistic expectations.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Penile Surgery", href: "/penile-surgery" },
  { name: "Penile Implant Surgery", href: PATH },
];

const prosthesisTypes = [
  {
    name: "Inflatable prosthesis",
    points: [
      "Two- or three-piece devices designed to closely mirror natural rigidity and flaccidity",
      "Includes an internal pump mechanism, most often placed in the scrotum",
      "The option most commonly selected among candidates",
    ],
  },
  {
    name: "Malleable prosthesis",
    points: [
      "A simpler mechanical design, with no internal pump",
      "Semi-rigid rods that can be manually positioned",
      "May be considered when a simpler surgical approach is preferred",
    ],
  },
];

const pathway = [
  {
    phase: "Assessment",
    description:
      "Confirming that erectile dysfunction is severe or refractory, reviewing previous treatments tried, and evaluating overall health and expectations before surgery is considered.",
  },
  {
    phase: "Surgery",
    description:
      "Performed under appropriate anaesthesia. The chosen device — inflatable or malleable — is placed within the erectile chambers of the penis.",
  },
  {
    phase: "Recovery",
    description:
      "A structured recovery period follows, with activity gradually resumed and device use introduced under guidance, timelines discussed individually at consultation.",
  },
];

const risks = [
  "Infection",
  "Mechanical wear or device malfunction over time, in some cases requiring revision surgery",
  "Changes in sensation",
  "Bleeding or bruising",
  "Risks associated with anaesthesia and surgery generally",
];

const notAppropriate = [
  "Active infection at the time of assessment",
  "Reversible or unaddressed causes of erectile dysfunction not yet fully explored",
  "Expectations that don't align with what the surgery is designed to do",
  "Certain anatomical or medical factors identified at assessment",
];

const candidateGoodIf = [
  "Erectile dysfunction is severe or refractory",
  "Oral medication, vacuum devices or injectable therapy have not provided reliable results",
  "The underlying cause has already been appropriately assessed",
];

const faqItems = [
  {
    question: "Is a penile implant permanent?",
    answer:
      "The device is intended for long-term use, though mechanical parts can wear over time and some patients may eventually need revision surgery. It is not offered as a universal cure, and is only considered after other treatments have been explored.",
  },
  {
    question: "What's the difference between inflatable and malleable implants?",
    answer:
      "Inflatable devices use a pump mechanism to mirror natural rigidity and flaccidity. Malleable devices are simpler semi-rigid rods that are manually positioned. Which is discussed depends on your anatomy, health and preference.",
  },
  {
    question: "Will sensation be normal after surgery?",
    answer:
      "The implant is designed to support rigidity for penetration. It does not aim to change sensation, which is generally governed by separate mechanisms — this is discussed individually during assessment.",
  },
  {
    question: "How long is recovery?",
    answer:
      "Recovery involves a structured period following surgery. Specific timelines are discussed individually at consultation, based on your surgical plan.",
  },
  {
    question: "Am I a candidate for a penile implant?",
    answer:
      "Candidacy depends on the cause and severity of erectile dysfunction, previous treatments tried, and overall health — assessed individually at consultation.",
  },
  {
    question: "What are the alternatives to a penile implant?",
    answer:
      "A penile implant sits at the end of the erectile dysfunction treatment ladder, not the start. Alternatives explored first typically include lifestyle and risk-factor management, PDE5 inhibitors, hormonal treatment where indicated, vacuum devices, shockwave therapy and intracavernosal injection therapy — an implant is considered once these no longer give reliable results.",
    readMoreHref: "/erectile-dysfunction",
    readMoreLabel: "See the full Erectile Dysfunction treatment ladder",
  },
];

export default function PenileImplantPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Implant Surgery",
            description:
              "Penile implant surgery for severe or refractory erectile dysfunction — inflatable and malleable options, candidacy, surgical pathway, recovery and realistic expectations.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Implant Surgery",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero — asymmetric split, distinct from the ED page's centered text-only hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
                Penile Surgery
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                Penile Implant Surgery
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                A surgical solution for severe erectile dysfunction when
                other treatments no longer provide reliable results.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg">
                  Book a Confidential Consultation
                </BookingCta>
                <a
                  href="#candidacy"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  Who may be a candidate
                </a>
              </div>
            </Reveal>
          </div>

          <MaskedReveal className="w-full self-start">
            <PhotoFrame slot="implantPhysician" priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Physician authority — Consultant-level expertise, not a generic surgical listing */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <div className={editorialStyles.authority}>
            <p className="mb-6 text-xs font-medium uppercase tracking-widest">{doctor.title}</p>
            <dl className={editorialStyles.metrics}>
              {doctor.yearsOfExperience !== undefined && (
                <AuthorityMetric value={`${doctor.yearsOfExperience}+`} label="Years in Urology" />
              )}
              <AuthorityMetric value="FEBU" label="Fellow of the European Board of Urology" />
              <AuthorityMetric value="Consultant" label="Urologist & Andrologist" />
            </dl>
            <div className={editorialStyles.rail}>
              <p>Advanced laparoscopic surgery · tertiary hospital experience</p>
              {doctor.medicalTrainer && (
                <p>
                  <strong>Medical Trainer</strong> · {doctor.medicalTrainer.program}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* What is it / candidacy */}
      <section id="candidacy" className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="What is a penile implant?"
            heading="A Device Placed Within the Penis to Restore Rigidity"
            size="md"
            description="A penile prosthesis is a surgically implanted device, placed within the erectile chambers of the penis, designed to allow a man to achieve a rigid erection when desired."
          />
          <div className="mt-4">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Candidacy — reviewed individually, never assumed
            </p>
            <CandidateCheck
              goodHeading="Often considered once"
              goodIf={candidateGoodIf}
              notHeading="Addressed or reassessed first"
              notIf={notAppropriate}
            />
          </div>
        </Container>
      </section>

      {/* Inflatable vs malleable comparison */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Device options" heading="Inflatable vs. Malleable" />
          <Reveal delay={0.05}>
            <ImplantDeviceDiagram
              className="mt-10 h-24 w-full max-w-xl text-muted-foreground"
              title="Schematic of a three-piece inflatable prosthesis: cylinder, pump and reservoir"
            />
          </Reveal>
          <MaskedReveal className="mt-10 max-w-xl">
            <PhotoFrame slot="implantDevice" landscape />
          </MaskedReveal>
          <div className="mt-14 grid gap-x-16 gap-y-14 border-t border-border pt-14 md:grid-cols-2">
            {prosthesisTypes.map((type) => (
              <Reveal key={type.name}>
                <h3 className="font-display text-2xl text-foreground">{type.name}</h3>
                <ul className="mt-6 space-y-4">
                  {type.points.map((point) => (
                    <li key={point} className="flex gap-4 text-sm text-muted-foreground">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pathway — dark section, this page's one dark moment */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="The surgical pathway" heading="Assessment, Surgery, Recovery" />
          <MaskedReveal className="mt-10 max-w-2xl">
            <PhotoFrame slot="implantSurgical" landscape tone="dark" />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathway.map((step, index) => (
              <StaggerItem key={step.phase} className="border-t border-border pt-6 md:border-t-0 md:pt-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-border md:[&:not(:first-child)]:pl-8">
                <span className="font-display text-sm text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{step.phase}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Sexual function after implantation */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="After implantation"
            heading="Sexual Function After Surgery"
            size="md"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              A penile implant is designed to allow a man to achieve a
              rigid erection when desired. It does not change sensation,
              orgasm or ejaculation, which are governed by separate
              mechanisms. As with any surgery, individual results vary,
              and expectations are discussed in detail during
              assessment — the aim is a realistic understanding of what
              the device can and cannot do before proceeding.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Pull quote — Phase R3 correction */}
      <Container className="max-w-2xl py-14">
        <PullQuote>
          The aim is a realistic understanding of what the device can
          and cannot do — before proceeding, not after.
        </PullQuote>
      </Container>

      {/* Risks — "not appropriate" cases already covered in the candidacy check above, not repeated here */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Realistic expectations
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            Risks and Complications
          </h2>
          <ul className="mt-8 space-y-3">
            {risks.map((risk) => (
              <li key={risk} className="flex gap-4 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {risk}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Shockwave Therapy", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "Penile Doppler", href: "/erectile-dysfunction/penile-doppler" },
          { label: "Testosterone & Hormonal Health", href: "/mens-health/testosterone" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading={<AmpersandText text="Discuss Candidacy & Next Steps" />}
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Explore Erectile Dysfunction", href: "/erectile-dysfunction" }}
      />
    </>
  );
}
