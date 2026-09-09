import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { ClinicalDecisionFlow } from "@/components/editorial/ClinicalDecisionFlow";
import { ConsultationPathwayDiagram } from "@/components/illustrations/ConsultationPathwayDiagram";
import { doctor } from "@/config/doctor";
import visual from "@/components/editorial/VisualSystem.module.css";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
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

/**
 * Phase R1-R2: "Low Libido" previously linked to `/mens-health/low-libido`,
 * a route whose own status in `lib/seo/routes.ts` is `"planned"` — a
 * live link to a page that doesn't exist. Removed; reduced libido is
 * now folded into the Testosterone row's own description instead.
 * Erectile Dysfunction added as the "contextually appropriate" second
 * link (brief item 16).
 */
const areas = [
  {
    label: "Testosterone & Male Hormonal Health",
    description:
      "Symptoms, diagnosis and when treatment is clinically appropriate — including reduced libido, assessed alongside hormonal, medical and psychosexual factors.",
    href: "/mens-health/testosterone",
  },
  {
    label: "Erectile Dysfunction",
    description:
      "Sexual-function changes are assessed as part of the same hormonal and metabolic picture where relevant.",
    href: "/erectile-dysfunction",
  },
  {
    label: "Premature Ejaculation & Peyronie's Disease",
    description:
      "Ejaculatory control and penile curvature are two of the other common reasons men consult — each assessed with the same specialist approach.",
    href: "/sexual-medicine",
  },
];

const faqItems = [
  {
    question: "Does every symptom mean I have low testosterone?",
    answer:
      "No. Fatigue, low libido and reduced performance can be associated with testosterone deficiency, but they can also have many other causes — assessment looks at the full picture before attributing symptoms to any one cause.",
  },
  {
    question: "Will I automatically be offered treatment?",
    answer:
      "No. Treatment is considered only after appropriate clinical and biochemical assessment, and only when there's a clear indication for it.",
  },
  {
    question: "Is erectile dysfunction always related to hormones?",
    answer:
      "Not always. It can have hormonal, vascular, metabolic, neurological, medication-related and psychosexual contributors — assessment identifies which are relevant for you specifically.",
  },
];

export default function MensHealthPage() {
  return (
    <div className={visual.scope}>
      <JsonLd data={breadcrumbSchema(breadcrumbItems.map((i) => ({ name: i.name, path: i.href })))} />

      <Breadcrumb items={breadcrumbItems} />

      <section className={visual.hero}>
        <HeroAtmosphere align="right" restrained />
        <Container className={`${visual.heroGrid} relative z-10`}>
          <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
              Men&rsquo;s Health
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">Men&rsquo;s Health</h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              Hormonal, metabolic and sexual-health assessment for men
              experiencing low testosterone, reduced libido, fatigue or
              changes in sexual function.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" size="lg" />
            </div>
          </Reveal>
          <div className={visual.physicianIdentity}><p>{doctor.displayName}</p><span>{doctor.title} · FEBU · Abu Dhabi</span></div>
          </div>
          <EditorialFrame slot="mensHealthHero" landscape priority />
        </Container>
      </section>

      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">How assessment works</p>
              <h2 className="mt-4 font-display text-display-lg">Understand the full picture before choosing treatment.</h2>
              <div className="mt-8"><PullQuote>Not every symptom means low testosterone, and not every low result automatically requires treatment.</PullQuote></div>
            </div>
            <div className="bg-surface p-6 lg:p-8">
              <ClinicalDecisionFlow />
              <p className="mt-4 text-sm text-muted-foreground">Hormonal assessment · Metabolic / medical contributors · Sexual function</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-section-y">
        <Container>
          <div className={visual.split}>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Connected areas of care</p>
              <h2 className="mt-4 font-display text-display-md">Symptoms in context.</h2>
              <p className="mt-6 max-w-md text-sm text-muted-foreground">Sexual health, hormonal health, fertility and urinary / andrology concerns inform targeted assessment and individual treatment planning.</p>
              <ConsultationPathwayDiagram className="mt-8 h-14 w-full max-w-xs text-muted-foreground" />
              <div className={visual.clinicalAreas}>
                <Link href="/sexual-medicine"><span>01</span>Sexual health</Link>
                <Link href="/mens-health/testosterone"><span>02</span>Hormonal health</Link>
                <Link href="/male-fertility"><span>03</span>Fertility</Link>
                <Link href="/book"><span>04</span>Urinary / andrology concerns</Link>
              </div>
            </div>
            <div className="bg-surface p-8">
              {areas.map((area) => <div className="py-6 first:pt-0 last:pb-0" key={area.href}>
                <h3 className="font-display text-2xl"><Link className="underline decoration-border underline-offset-4" href={area.href}>{area.label}</Link></h3>
                <p className="mt-4 text-sm text-muted-foreground">{area.description}</p>
              </div>)}
            </div>
          </div>
        </Container>
      </section>

      <RelatedTreatments items={[{ label: "Penile Girth Enhancement", href: "/male-aesthetics/penile-girth-enhancement" }]} />

      <Faq items={faqItems} />

      <TreatmentCtaSection
        heading="Begin With a Hormonal Health Assessment"
        sourcePage={PATH}
        secondary={{ label: "Explore Testosterone & Male Hormonal Health", href: "/mens-health/testosterone" }}
      />
    </div>
  );
}
