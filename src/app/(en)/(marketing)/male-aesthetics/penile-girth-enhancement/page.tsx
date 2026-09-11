import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { doctor } from "@/config/doctor";
import { trainingPrograms } from "@/config/reputation";
import { PhysicianAuthority } from "@/components/editorial/PhysicianAuthority";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { ClinicalPathway, ProcedureFramework, VariabilityFactors, CareStages } from "@/components/editorial/ProcedureFramework";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { Faq } from "@/components/ui/Faq";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/male-aesthetics/penile-girth-enhancement";

export const metadata: Metadata = buildMetadata({
  title: "Penile Girth Enhancement with Hyaluronic Acid",
  description:
    "Specialist penile girth enhancement in Abu Dhabi with Dr. Alejandro Molina, Consultant Urologist & Andrologist — 500+ procedures performed, experience since 2018. Anatomy-led, hyaluronic acid and surgical options, realistic expectations.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: "Male Genital Aesthetics", href: "/male-aesthetics" },
  { name: "Penile Girth Enhancement", href: PATH },
];

const strapline = ["Anatomy-led", "Medically supervised", "Individually planned"];

const options = [
  {
    label: "Non-surgical: hyaluronic acid",
    description:
      "Hyaluronic acid is injected to increase girth, planned according to individual anatomy. Technique, product choice and aftercare all affect the result, and treatment is carried out within a medical, andrology-led context — the more commonly discussed starting point at consultation. Published clinical literature supports hyaluronic acid as an option for penile girth enhancement, though outcomes vary with anatomy, technique and the treatment plan chosen — which is why individual planning matters more than any single published figure.",
  },
  {
    label: "Surgical approaches",
    description:
      "Surgical approaches to penile augmentation are only offered where currently approved and clinically appropriate, and are discussed individually — not assumed as a starting point.",
  },
];

const approachPillars = [
  {
    title: "Anatomy First",
    description:
      "Treatment is planned around individual anatomy, not a fixed protocol applied the same way to every patient. What suits one man's anatomy may not suit another's, and planning reflects that from the first consultation.",
  },
  {
    title: "Proportion Over Maximum Volume",
    description:
      "The objective is natural proportion, contour and symmetry — not the largest volume achievable in a single session. The key clinical question is what looks and feels proportionate for a given patient's anatomy, not how much product can be delivered.",
  },
  {
    title: "Individual Treatment Planning",
    description:
      "Anatomy, tissue characteristics, any previous procedures, circumcision status and personal goals all inform the plan. Two patients with similar goals can still receive different treatment plans, because their anatomy and history differ.",
  },
  {
    title: "Staged Treatment When Appropriate",
    description:
      "Not every patient is best served by a full planned treatment in one sitting. Where appropriate, treatment is staged, allowing tissue response to be assessed before any decision on further volume.",
  },
  {
    title: "Andrology-Led Assessment",
    description:
      "Genital anatomy and sexual function are assessed within a urology and andrology context, not as a generic cosmetic injecting service — because the same anatomy that determines aesthetic planning also relates to erectile and sexual function.",
  },
  {
    title: "Structured Follow-Up",
    description:
      "The procedure does not end when the treatment session finishes. Follow-up allows tissue settling to be reviewed and any concerns addressed as part of the planned pathway, not left for the patient to raise unprompted.",
  },
  {
    title: "Correction Expertise",
    description:
      "Previous filler — whether performed here or elsewhere — including irregularity, asymmetry, nodules or migration, can be assessed separately and in detail.",
    href: "/male-aesthetics/penile-filler-correction",
    linkLabel: "Explore Penile Filler Correction",
  },
];

const afterConsiderations = [
  {
    title: "Risks",
    description:
      "As with any augmentation procedure, risks can include swelling, bruising, asymmetry, irregularity, or dissatisfaction with the outcome achieved. These are reviewed individually, based on the option considered.",
  },
  {
    title: "Aftercare",
    description:
      "Aftercare guidance is provided following any procedure and is specific to the option chosen, discussed as part of your individual treatment plan.",
  },
  {
    title: "Revision / correction",
    description:
      "Where a patient is not satisfied with a previous procedure — whether performed here or elsewhere — revision is assessed individually, considering the original treatment and current anatomy.",
    href: "/male-aesthetics/penile-filler-correction",
    linkLabel: "Explore Penile Filler Correction",
  },
];

const faqItems = [
  {
    question: "Is penile girth enhancement safe?",
    answer:
      "No aesthetic or medical procedure is entirely risk-free. What safety actually depends on is anatomy-led assessment beforehand, technique, and a treatment plan matched to individual tissue — not the product alone. Performed within a Consultant Urologist & Andrologist's practice, risks such as swelling, bruising, asymmetry or irregularity are discussed and reviewed individually before proceeding, not eliminated. See Risks, Aftercare and Revision below for detail.",
  },
  {
    question: "How much size increase can I expect?",
    answer:
      "This depends on three things: your baseline anatomy and tissue elasticity, the technique and volume planned for your treatment, and whether treatment is delivered in one session or staged over more than one. Because those three factors vary significantly between patients, specific outcome measurements aren't published here — they're discussed in detail, and in the context of your own anatomy, at consultation.",
    readMoreHref: "/insights/how-much-girth-can-penile-filler-add",
    readMoreLabel: "Read more: How Much Girth Can Penile Filler Actually Add?",
  },
  {
    question: "Is this surgical or non-surgical?",
    answer:
      "Both are considered. Non-surgical options, including hyaluronic acid-based augmentation, are more commonly discussed first; surgical approaches are only offered where currently approved and clinically appropriate.",
  },
  {
    question: "What if I've had a bad experience with filler elsewhere?",
    answer:
      "Assessment focuses on your current anatomy and presentation — asymmetry, irregularity, nodules or suspected migration are the specific findings it looks for — rather than on the original provider or product. Revision, including dissolution where appropriate, is considered individually once that assessment is complete.",
    readMoreHref: "/male-aesthetics/penile-filler-correction",
    readMoreLabel: "Explore Penile Filler Correction",
  },
  {
    question: "Is the result permanent?",
    answer:
      "No — hyaluronic acid is gradually broken down by the body over time, which is why it is not typically a permanent result. How long it lasts varies with the product used, volume, technique and individual metabolism; surgical approaches, where appropriate, are discussed separately since their longevity profile differs.",
    readMoreHref: "/insights/how-long-does-penile-filler-last",
    readMoreLabel: "Read more: How Long Does Penile Filler Last?",
  },
  {
    question: "What does aftercare involve?",
    answer:
      "In general terms, aftercare covers activity restrictions during the initial settling period, what swelling or firmness to expect versus what would warrant contacting the clinic, and a scheduled follow-up review once tissue has settled. The specific guidance you receive is tailored to the option and volume planned for you.",
  },
  {
    question: "Can filler migrate, or develop nodules?",
    answer:
      "It can, though this is not the expected or typical course. Migration and nodules are specific findings assessment looks for at follow-up and at any later review — not something patients are left to self-diagnose. Suspected migration or a new nodule is a reasonable reason to seek assessment, whether the original treatment was performed here or elsewhere.",
    readMoreHref: "/insights/penile-filler-nodules-and-irregularities",
    readMoreLabel: "Read more: Penile Filler Nodules and Irregularities",
  },
  {
    question: "Can I have treatment if I am uncircumcised?",
    answer:
      "Circumcision status is one of the anatomical factors reviewed at assessment and factored into planning — it does not on its own rule treatment in or out. What matters is how it interacts with your specific anatomy and goals, which is assessed individually rather than assumed either way.",
  },
  {
    question: "Does the procedure affect erections or sensation?",
    answer:
      "Treatment targets the shaft's skin and subcutaneous tissue and is planned to avoid the structures responsible for erectile function. Temporary changes in sensation from swelling or the treatment itself can occur during the settling period, but a lasting effect on erectile function or sensation is not the expected outcome — this is discussed individually if you have specific concerns.",
  },
  {
    question: "Why do different patients receive different treatment plans?",
    answer:
      "Because anatomy, tissue characteristics, previous procedures, circumcision status and personal goals differ between patients — two men with a similar starting request can reasonably end up with different plans once their individual anatomy is assessed. This is the basis of the anatomy-led approach described above, not an inconsistency between patients.",
  },
  {
    question: "How do I start?",
    answer:
      "The process begins with a consultation to assess anatomy, goals and suitability before any option is planned.",
  },
];

export default function PenileGirthEnhancementPage() {
  const training = trainingPrograms[0];
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href }))),
          medicalWebPageSchema({
            name: "Penile Girth Enhancement",
            description:
              "A specialist medical approach to penile augmentation, with treatment planning based on anatomy, goals and realistic expectations.",
            path: PATH,
            aboutType: "MedicalProcedure",
            aboutName: "Penile Girth Enhancement",
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <EditorialField className={`${visual.flagshipHero} py-14`}>
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Flagship procedure · Abu Dhabi
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-display-2xl text-foreground">
              Penile Girth Enhancement
            </h1>
            <div className={visual.flagshipMetrics}><p><strong>{doctor.girthProcedureCount}</strong><span>Procedures performed</span></p><p><strong>Since {doctor.girthEnhancementSince}</strong><span>Penile Girth Enhancement</span></p></div>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              A specialist medical approach to penile augmentation, with
              treatment planning based on anatomy, goals and realistic
              expectations.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {strapline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_girth" size="lg">
                Book a Confidential Consultation
              </BookingCta>
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-muted-foreground">{doctor.displayName}<br />{doctor.title} · Medical Trainer</p>
          </div>
          <EditorialFrame slot="girthFlagship" landscape priority tone="dark" />
        </Container>
      </EditorialField>

      {/* Authority block — procedure-specific experience first for this page (Phase A brief) */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <PhysicianAuthority dark />
        </Container>
      </section>

      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Your clinical pathway" heading="From the first conversation to follow-up" />
          <ClinicalPathway />
        </Container>
      </section>

      {/* What patients want, briefly, then the full clinical philosophy */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <ProcedureFramework />
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Common goals
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              Size, Confidence and Symmetry
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Men considering penile girth enhancement typically want to
              address concerns about size, confidence or symmetry —
              goals that are discussed openly and without judgment at
              consultation, then translated into an individual plan
              below.
            </p>
          </div>
        </Container>
      </section>

      {/* Dr. Molina's Approach — the genuine clinical philosophy behind the flagship procedure, without exposing procedural technique */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="Clinical philosophy"
            heading="Dr. Molina's Approach to Penile Girth Enhancement"
            description="Seven principles that shape every treatment plan — not marketing language, but how anatomy-led planning actually works in practice."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {approachPillars.map((pillar) => (
              <StaggerItem key={pillar.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                {pillar.href && (
                  <Link
                    href={pillar.href}
                    className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                  >
                    {pillar.linkLabel}
                  </Link>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
          {training && (
            <Reveal delay={0.1}>
              <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-border pt-10">
                {training.logoSrc && (
                  <Image src={training.logoSrc} alt={training.program} width={140} height={44} style={{ height: "2rem", width: "auto" }} />
                )}
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">{training.role}.</strong>{" "}
                  {training.positioningLine}
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* Options — non-surgical first-line, surgical only where approved */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Options considered" heading="Non-Surgical First, Surgical Only Where Appropriate" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {options.map((option, index) => (
              <StaggerItem key={option.label}>
                <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[2fr_3fr] sm:gap-16">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">
                      {option.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Pull quote — Phase R2.1/R3 */}
      <Container className="max-w-2xl py-14">
        <PullQuote>
          Results depend on anatomy, technique and the option chosen —
          outcomes are discussed individually, never promised in advance.
        </PullQuote>
      </Container>

      {/* Expected variability — dark section, this page's one dark moment, used to give the "no numbers" honesty real weight */}
      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture watermark={false} />
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Expected variability
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              Results vary between individuals.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Outcomes depend on anatomy, technique and the option
              chosen. Specific outcome measurements are not quoted here
              — they are discussed individually, and in context, at
              consultation, rather than promised in advance.
            </p>
          </Reveal>
          <VariabilityFactors />
        </Container>
      </section>

      {/* Risks, aftercare, revision */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="Before and after" heading="Risks, Aftercare and Revision" />
          <CareStages items={afterConsiderations} />
        </Container>
      </section>

      {/* About Dr. Molina — brief §11: performed by a Consultant, not a generic injector */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className={visual.split}>
          <div>
            <PhotoFrame slot="girthConsultation" landscape />
          </div>
          <div>
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              About
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              {doctor.displayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{doctor.title}</p>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Penile girth enhancement is performed within a Consultant
              Urologist &amp; Andrologist&rsquo;s practice
              {doctor.yearsOfExperience !== undefined &&
                ` — ${doctor.yearsOfExperience}+ years of experience in Urology`}
              {doctor.girthEnhancementSince !== undefined &&
                `, performing penile girth enhancement since ${doctor.girthEnhancementSince}`}
              . {doctor.medicalTrainer?.description}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              About {doctor.displayName}
            </Link>
          </div>
          </div>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { label: "Male Genital Aesthetics", href: "/male-aesthetics" },
          { label: "Penile Filler Correction", href: "/male-aesthetics/penile-filler-correction" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
          { label: "Peyronie's Disease", href: "/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Discuss Your Anatomy and Goals"
        sourcePage={PATH}
        bookingLabel="Book a Confidential Consultation"
        secondary={{ label: "Back to Male Genital Aesthetics", href: "/male-aesthetics" }}
      />
    </div>
  );
}
