import type { Metadata } from "next";
import { CurvatureAssessmentDiagram } from "@/components/illustrations/CurvatureAssessmentDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/peyronies-disease";

export const metadata: Metadata = buildMetadata({
  title: "مرض بيروني",
  description:
    "تقييم متخصص لمرض بيروني في أبوظبي — انحناء القضيب وأثره على وظيفة الانتصاب، مع مسارات علاج تحفظية وإجرائية وجراحية تُلائم المرحلة والشدة.",
  path: PATH,
});

/** Breadcrumb parent stays the English /penile-surgery route — same documented gap as /ar/penile-implant (Task 6). */
const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة القضيب", href: "/penile-surgery" },
  { name: "مرض بيروني", href: PATH },
];

const phases = [
  {
    label: "المرحلة النشطة",
    description: "قد يستمر الانحناء أو اللويحة أو الألم في التغير. يكون العلاج خلال هذه المرحلة تحفظيًا عمومًا، لأن الحالة لم تستقر بعد.",
  },
  {
    label: "المرحلة المستقرة",
    description: "بمجرد استقرار الحالة وتوقف الانحناء عن التغير، يمكن النظر في نطاق أوسع من الخيارات — بما في ذلك التصحيح الإجرائي أو الجراحي — عند الاقتضاء.",
  },
];

const pathways = [
  { tier: "تحفظي", description: "المراقبة وإدارة الأعراض المصاحبة، وهو مناسب بشكل خاص خلال المرحلة النشطة أو مع انحناء خفيف لا يؤثر على الوظيفة." },
  { tier: "إجرائي", description: "يمكن النظر في خيارات مختارة غير جراحية أو طفيفة التوغل بمجرد استقرار الحالة، حسب الشدة والأثر." },
  { tier: "جراحي", description: "يُنظر في التصحيح الجراحي للانحناء الأكثر أهمية والمؤثر على الوظيفة، بمجرد استقرار الحالة ومراجعة الخيارات غير الجراحية." },
];

const faqItems = [
  {
    question: "ما هو مرض بيروني؟",
    answer: "حالة تتضمن تكوّن لويحة ليفية داخل القضيب، يمكن أن تسبب انحناءً، وفي بعض الحالات ألمًا أو تأثيرًا على وظيفة الانتصاب.",
  },
  {
    question: "هل سيزداد انحنائي سوءًا؟",
    answer: "يختلف هذا من حالة لأخرى. غالبًا ما يمر مرض بيروني بمرحلة نشطة يمكن أن تحدث خلالها تغيرات، تليها مرحلة مستقرة — يساعد التقييم في تحديد المرحلة التي تمر بها.",
  },
  {
    question: "هل أحتاج إلى جراحة؟",
    answer: "ليس بالضرورة. تُدار حالات كثيرة تحفظيًا، خاصة خلال المرحلة النشطة أو مع انحناء خفيف. يُنظر في الجراحة للانحناء المستقر الأكثر أهمية والمؤثر على الوظيفة.",
  },
  {
    question: "هل الموجات فوق الصوتية ضرورية دائمًا؟",
    answer: "ليس دائمًا. قد تُستخدم عند الاقتضاء، خاصة لتقييم اللويحة أو تدفق الدم عندما تتأثر وظيفة الانتصاب أيضًا.",
  },
  {
    question: "هل يمكن أن يؤثر مرض بيروني على الانتصاب؟",
    answer: "نعم، لدى بعض الرجال. يُقيَّم الانحناء ووظيفة الانتصاب معًا، لأن كلًا منهما يمكن أن يؤثر على الآخر.",
  },
];

export default function PeyroniesDiseasePageAr() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "مرض بيروني",
              description: "تقييم متخصص لانحناء القضيب ومرض بيروني، مع علاج يُلائم المرحلة والشدة.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Peyronie's Disease",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                جراحة القضيب
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                مرض بيروني
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                تقييم متخصص لانحناء القضيب واللويحة وأثرها على وظيفة
                الانتصاب — مع علاج يُلائم المرحلة والشدة.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="peyronies" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="peyroniesHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Active vs stable phase */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="فهم المرحلة" heading="المرحلة النشطة والمستقرة" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {phases.map((phase, index) => (
              <Reveal key={phase.label} delay={index * 0.08}>
                <div className={`card-hover border-t border-border pt-6 md:border-t-0 md:pt-0 ${index === 1 ? "md:border-r md:border-border md:pr-16" : ""}`}>
                  <h3 className="font-display text-2xl text-foreground">{phase.label}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Curvature and erectile function + assessment */}
      <section className="py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              الانحناء والوظيفة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              يُقيَّمان معًا، لا بمعزل عن بعضهما
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يمكن أن يؤثر مرض بيروني على شكل القضيب أثناء الانتصاب، وفي
              بعض الرجال، على وظيفة الانتصاب نفسها. يُقيَّم كلاهما معًا،
              لأنهما يمكن أن يؤثرا على تخطيط العلاج.
            </p>
            <CurvatureAssessmentDiagram className="mt-8 h-32 w-40 text-muted-foreground" />
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              كيف يجري التقييم
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              التاريخ المرضي، الفحص، والموجات فوق الصوتية عند الاقتضاء
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يشمل التقييم التاريخ المرضي والفحص المناسب. قد تُستخدم
              الموجات فوق الصوتية عند الاقتضاء لتقييم اللويحة وتدفق
              الدم، خاصة عندما تتأثر وظيفة الانتصاب أيضًا.
            </p>
          </div>
        </Container>
      </section>

      {/* Pathways — olive */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="الإدارة" heading="مسارات تحفظية وإجرائية وجراحية" locale="ar" />
          <div className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathways.map((pathway, index) => (
              <Reveal key={pathway.tier} delay={index * 0.06} className="card-hover">
                <span className="font-display text-sm text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{pathway.tier}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{pathway.description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              لا تتطلب كل حالة من مرض بيروني علاجًا فعالاً. يمكن ببساطة
              مراقبة الانحناء الخفيف الذي لا يؤثر على الوظيفة. وكما هو
              الحال مع أي علاج لمرض بيروني، تختلف الاستجابة من شخص لآخر،
              ولا يمكن ضمان نتيجة محددة — بما في ذلك التقويم الكامل.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "جراحة زراعة دعامة القضيب", href: "/ar/penile-implant" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش مرحلتك وشدة حالتك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
