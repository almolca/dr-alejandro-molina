import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { ResponseThresholdDiagram } from "@/components/illustrations/ResponseThresholdDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
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

const PATH = "/ar/sexual-medicine/premature-ejaculation";

export const metadata: Metadata = buildMetadata({
  title: "سرعة القذف",
  description:
    "تقييم متخصص لسرعة القذف في أبوظبي — خيارات سلوكية ونفسية-جنسية وطبية وإجرائية تُلائم كل حالة، بما في ذلك علاج حمض الهيالورونيك في الحشفة في حالات مختارة.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "الطب الجنسي", href: "/ar/sexual-medicine" },
  { name: "سرعة القذف", href: PATH },
];

const factors = [
  { label: "نفسية / قلق الأداء", description: "يمكن أن يؤدي القلق بشأن الأداء الجنسي، سواء كان طويل الأمد أو ظرفيًا، إلى تقصير زمن القذف بحد ذاته." },
  { label: "سياق العلاقة", description: "يمكن أن تكون العلاقات الجديدة، أو قلة النشاط الجنسي، أو التوتر في العلاقة، عوامل مساهمة ذات صلة." },
  { label: "الحساسية / عتبة الاستجابة", description: "يمتلك بعض الرجال عتبة استجابة قذفية منخفضة بطبيعتهم، موجودة منذ التجارب الجنسية الأولى." },
  { label: "ضعف الانتصاب", description: "يمكن أن يؤدي القلق بشأن الحفاظ على الانتصاب إلى تقصير زمن القذف بشكل مستقل — وغالبًا ما يُقيَّم الاثنان معًا." },
  { label: "عوامل هرمونية أو طبية", description: "بشكل أقل شيوعًا، يمكن أن تسهم عوامل هرمونية أو متعلقة بالبروستاتا أو عصبية، وتُراعى عند الحاجة." },
  { label: "التجارب السابقة", description: "يمكن أن تلعب الأنماط المكتسبة من تجارب جنسية سابقة دورًا، بمعزل عن أي سبب جسدي." },
];

const approaches = [
  { title: "تقنيات سلوكية", description: "تقنيات منظمة، مثل أسلوبي التوقف والبدء أو الضغط، تهدف إلى بناء الوعي والتحكم مع مرور الوقت." },
  { title: "الدعم النفسي-الجنسي", description: "يُنظر فيه عندما يبدو أن قلق الأداء أو عوامل العلاقة أو التجارب السابقة عوامل مساهمة مهمة." },
  { title: "العلاج الطبي", description: "يمكن النظر في خيارات فموية أو موضعية بعد التقييم، بما يلائم النمط المعني وأي موانع استعمال." },
  { title: "خيارات إجرائية في حالات مختارة", description: "قد يكون عدد قليل من المرضى مرشحين لخيار إجرائي، يُناقش بشكل فردي وبعد النظر في الخيارات أعلاه فقط." },
];

const glansProcedurePoints = [
  "تُقيَّم الملاءمة بشكل فردي، بناءً على الأعراض والتاريخ المرضي والتشريح والتوقعات — ولا يُطرح كخيار روتيني أو افتراضي.",
  "تُناقش الأهداف والحدود الواقعية بالتفصيل قبل النظر في أي إجراء.",
  "هو جزء واحد من استراتيجية إدارة أوسع، لا حلاً قائمًا بذاته مضمون النتيجة.",
  "لا يُناقش إلا إلى جانب الخيارات السلوكية والنفسية-الجنسية والطبية أعلاه، بما يلائم نتائج التقييم الفردي.",
];

const faqItems = [
  {
    question: "هل سرعة القذف شائعة؟",
    answer: "القذف المبكر العرضي شائع وليس مصدر قلق طبي بالضرورة. يركز التقييم على التكرار، ودرجة التحكم، والضيق أو الصعوبة التي يسببها — لا على عتبة زمنية واحدة.",
  },
  {
    question: "ما الفرق بين سرعة القذف الدائمة والمكتسبة؟",
    answer: "سرعة القذف الدائمة موجودة منذ التجارب الجنسية الأولى للرجل. أما سرعة القذف المكتسبة فتتطور لاحقًا، وغالبًا إلى جانب عامل مساهم محدد. هذا التمييز مهم لكيفية التقييم والتعامل مع الحالة.",
  },
  {
    question: "هل ترتبط سرعة القذف بضعف الانتصاب؟",
    answer: "من الممكن ذلك. يمكن أن يؤدي القلق بشأن الحفاظ على الانتصاب إلى تقصير زمن القذف بشكل مستقل، ولهذا يُقيَّم الاثنان معًا بدلاً من التعامل مع كل منهما بمعزل عن الآخر.",
  },
  {
    question: "ما هو علاج حمض الهيالورونيك في الحشفة، وهل هو مناسب لي؟",
    answer: "هو خيار إجرائي قد يُنظر فيه في حالات مختارة كجزء من استراتيجية إدارة أوسع — وليس الخيار الأول أو الوحيد. تعتمد الملاءمة على التقييم الفردي ولا تُفترض مسبقًا أبدًا.",
  },
  {
    question: "هل سأُعرض عليّ الأدوية أو الإجراء تلقائيًا؟",
    answer: "لا. يُختار العلاج وفقًا للنمط المعني والعوامل المساهمة والأولويات الفردية — تُراعى الخيارات السلوكية والنفسية-الجنسية إلى جانب الخيارات الطبية والإجرائية، لا يُتجاوزان.",
  },
  {
    question: "كيف أبدأ؟",
    answer: "تبدأ العملية باستشارة سرية لفهم النمط المعني، وأي عوامل مساهمة، والنهج — أو مجموعة النُهج — التي قد تكون مناسبة.",
  },
];

export default function PrematureEjaculationPageAr() {
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
              name: "سرعة القذف",
              description: "تقييم متخصص لسرعة القذف — خيارات سلوكية ونفسية-جنسية وطبية وإجرائية تُلائم كل حالة.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Premature Ejaculation",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                الطب الجنسي
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-display-xl text-foreground">
                سرعة القذف
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                تقييم متخصص للقذف الذي يحدث أسرع من المرغوب، مع النظر في
                العلاج عبر خيارات سلوكية ونفسية-جنسية وطبية وإجرائية —
                تُلائم الفرد، لا نهجًا افتراضيًا واحدًا.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="premature_ejaculation" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
                <a
                  href="#treatment-approach"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  اطّلع على نهج العلاج
                </a>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="peHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* What it is */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="ما هي"
            heading="تراجع التحكم في توقيت القذف"
            size="md"
            description="تشير سرعة القذف إلى حدوث القذف أسرع مما يرغب الرجل أو شريكته، غالبًا مع شعور محدود بالتحكم، وما يصاحب ذلك من ضيق."
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase text-muted-foreground">
              ليست عتبة زمنية واحدة
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              القذف المبكر العرضي شائع وليس مصدر قلق طبي بالضرورة. يركز
              التقييم على <strong className="text-foreground">التكرار</strong>،
              و<strong className="text-foreground">درجة التحكم</strong>،
              و<strong className="text-foreground">الضيق أو الصعوبة</strong>{" "}
              التي يسببها — لا على مقارنته برقم ثابت.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Contributing factors */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading eyebrow="لماذا يهم التقييم" heading="يمكن أن تسهم عدة عوامل" locale="ar" />
          <Reveal delay={0.05} className="mt-10 flex justify-center sm:justify-start">
            <ResponseThresholdDiagram className="h-24 w-24 text-muted-foreground" />
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {factors.map((factor) => (
              <StaggerItem key={factor.label} className="border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{factor.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{factor.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Treatment approach — dark section */}
      <section id="treatment-approach" className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="نهج العلاج" heading="يُلائم الفرد، لا تسلسلاً ثابتًا" locale="ar" />
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            لا يحتاج كل رجل إلى كل نهج، ولا توجد نقطة بداية صحيحة واحدة —
            يعتمد النهج على ما إذا كان النمط دائمًا أو مكتسبًا، وما إذا
            كان ضعف الانتصاب حاضرًا أيضًا، والعوامل الشخصية وعوامل
            العلاقة.
          </p>

          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {approaches.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="grid grid-cols-[3rem_1fr] gap-x-6 gap-y-2 py-7 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline">
                  <span className="font-display text-2xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl text-foreground sm:col-start-2">
                    {step.title}
                  </h3>
                  <p className="col-span-2 text-sm text-muted-foreground sm:col-span-1 sm:col-start-3">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Selected procedural option */}
      <section className="border-t border-border py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            خيار إجرائي مختار
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            علاج حمض الهيالورونيك في الحشفة
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            في حالات مختارة، يمكن النظر في علاج حمض الهيالورونيك في
            الحشفة كجزء من استراتيجية إدارة أوسع لسرعة القذف. هذا ليس
            الخيار الأول أو الوحيد، وغير مناسب لكل مريض، ولا يُنظر فيه
            إلا بعد أن يوضح التقييم النمط المعني وبعد مناقشة الخيارات
            أعلاه.
          </p>
          <ul className="mt-8 space-y-4 border-t border-border pt-8">
            {glansProcedurePoints.map((point) => (
              <li key={point} className="flex gap-4 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          يُنظر في كل نهج — سلوكي أو نفسي-جنسي أو طبي أو إجرائي — بناءً
          على التقييم الفردي، ولا يُفترض أبدًا من وصف عام.
        </PullQuote>
      </Container>

      {/* Why specialist care */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            لماذا الرعاية المتخصصة
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            {AR_IDENTITY.doctorDisplayName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{AR_IDENTITY.doctorTitle}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            تُقيَّم سرعة القذف ضمن ممارسة استشاري أمراض المسالك البولية
            والذكورة، إلى جانب الصحة الجنسية والهرمونية ذات الصلة — إذ
            يمكن أن تكون وظيفة الانتصاب والعوامل الهرمونية والسياق
            النفسي-الجنسي جميعها ذات صلة بالحالة نفسها.
          </p>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "الطب الجنسي", href: "/ar/sexual-medicine" },
          { label: "نبذة عن د. مولينا", href: "/ar/about" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ بتقييم فردي"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
