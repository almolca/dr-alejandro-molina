import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Brain, CircleDot, Droplets, Pill, Stethoscope, Syringe, TestTube, Waves, Zap } from "lucide-react";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { VascularFlowDiagram } from "@/components/illustrations/VascularFlowDiagram";
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
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/erectile-dysfunction";

export const metadata: Metadata = buildMetadata({
  title: "تقييم وعلاج ضعف الانتصاب في أبوظبي",
  description:
    "تقييم وعلاج متخصص لضعف الانتصاب في أبوظبي — أسباب وعائية وهرمونية واستقلابية ونفسية-جنسية، مع خطة علاج فردية تُلائم كل حالة.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "الطب الجنسي", href: "/ar/sexual-medicine" },
  { name: "ضعف الانتصاب", href: PATH },
];

const erectionStages = [
  {
    title: "التدفق الشرياني الداخل",
    description: "يجب أن يتدفق الدم بكمية كافية إلى القضيب عبر الشرايين المغذية له — وهو الشرط الأول، والأكثر ارتباطًا في الأذهان بمفهوم الانتصاب.",
  },
  {
    title: "استرخاء العضلات الملساء الكهفية",
    description: "يجب أن تسترخي العضلات الملساء داخل الأنسجة الكهفية (الجسم الكهفي)، مما يسمح لهذه الأنسجة بالتمدد والامتلاء بالدم.",
  },
  {
    title: "الانسداد الوريدي",
    description: "مع تمدد الأجسام الكهفية داخل الغلاف المحيط بها، تُضغط الأوردة التي تُصرّف الدم عادةً خارج القضيب، مما يقلل التدفق الخارج — وهي نتيجة ميكانيكية للتمدد الكامل، وليست صمامًا منفصلاً يُغلق.",
  },
  {
    title: "الصلابة",
    description: "يحافظ التدفق الداخل الكافي، والتمدد الكامل، وانخفاض التدفق الخارج معًا على الصلابة. وإذا كانت إحدى هذه المراحل غير مكتملة، فقد يضعف الانتصاب أو يصعب الحفاظ عليه.",
  },
];

const causes = [
  { label: "وعائية", description: "انخفاض تدفق الدم إلى القضيب، غالبًا ما يرتبط بعوامل خطر القلب والأوعية الدموية مثل ارتفاع ضغط الدم أو الكوليسترول أو التدخين." },
  { label: "هرمونية", description: "يمكن أن يسهم انخفاض التستوستيرون أو اختلالات هرمونية أخرى في ضعف وظيفة الانتصاب والرغبة الجنسية." },
  { label: "استقلابية", description: "يُعد السكري ومتلازمة الاستقلاب من الأسباب الشائعة، إذ يؤثران على الأوعية الدموية ووظيفة الأعصاب مع مرور الوقت." },
  { label: "عصبية", description: "يمكن أن تؤثر الحالات التي تصيب الأعصاب — بما في ذلك السكري وإصابات العمود الفقري وجراحات الحوض — على الإشارات المرتبطة بالانتصاب." },
  { label: "مرتبطة بالأدوية", description: "قد تؤثر بعض الأدوية، ومنها مضادات الاكتئاب وعلاجات ضغط الدم، على وظيفة الانتصاب كأثر جانبي." },
  { label: "نفسية-جنسية", description: "يمكن أن يكون للتوتر والقلق وعوامل العلاقة والمزاج دور، سواء بشكل مستقل أو إلى جانب أسباب جسدية." },
  { label: "حوضية / بنيوية", description: "يمكن أن تؤثر جراحات الحوض السابقة، أو العلاج الإشعاعي، أو حالات بنيوية مثل مرض بيروني، على وظيفة الانتصاب بشكل مباشر." },
];

const vascularMechanisms = [
  {
    title: "القصور الشرياني",
    description: "انخفاض تدفق الدم الواصل إلى القضيب عبر الشرايين المغذية له — وهو الجانب «الداخل» من هذه الآلية الفسيولوجية. غالبًا ما يرتبط بعوامل خطر القلب والأوعية الدموية مثل ارتفاع ضغط الدم أو الكوليسترول أو التدخين.",
    icon: Droplets,
  },
  {
    title: "الخلل الوظيفي في الانسداد الوريدي",
    description: "يُعرف أحيانًا بـ«التسرب الوريدي» — إذ لا ينخفض التدفق الخارج بالقدر الكافي بعد اكتمال الانتصاب، حتى مع كفاية التدفق الداخل. وهي نتيجة ميكانيكية لتمدد كهفي غير مكتمل، وليست صمامًا معطلاً منفصلاً.",
    icon: Waves,
  },
  {
    title: "أنماط وظيفية غير بنيوية",
    description: "ليس كل نمط يبدو وعائيًا هو نمط بنيوي بالضرورة. فقد ينتج نمط مشابه دون سبب تشريحي ثابت بسبب ضعف التحفيز أو القلق أو ارتفاع النشاط الودي أو عوامل استقلابية.",
    icon: Brain,
  },
];

const ladder = [
  { title: "إدارة نمط الحياة وعوامل الخطر", description: "معالجة عوامل خطر القلب والأوعية الدموية والوزن ومستوى النشاط والكحول والتدخين، حيثما كانت ذات صلة بالسبب الكامن.", icon: Activity },
  { title: "مثبطات PDE5", description: "دواء فموي يمكن أن يدعم وظيفة الانتصاب لدى المرضى المختارين بعناية، ويُوصف بعد التقييم.", icon: Pill },
  { title: "العلاج الهرموني عند الحاجة", description: "يُؤخذ بعين الاعتبار فقط عند تحديد سبب هرموني، مثل نقص التستوستيرون، أثناء التقييم.", icon: TestTube },
  { title: "خيارات الأجهزة الفراغية", description: "أجهزة ميكانيكية غير جراحية يمكن أن تدعم وظيفة الانتصاب لدى مرضى مختارين.", icon: CircleDot },
  { title: "علاج مختار بالموجات الصادمة", description: "يمكن النظر في العلاج بالموجات الصادمة منخفضة الشدة لدى مرضى مختارين حيثما كان ذلك مناسبًا سريريًا.", icon: Zap },
  { title: "العلاج داخل الكهفي", description: "علاج بالحقن يُعطى مباشرة داخل القضيب، ويُستخدم عندما لا تكون العلاجات الفموية مناسبة أو فعالة.", icon: Syringe },
  { title: "جراحة زراعة دعامة القضيب", description: "خيار جراحي يُؤخذ بعين الاعتبار في حالات ضعف الانتصاب الشديدة أو المقاومة للعلاج، بعد أن لم تعد العلاجات الأخرى تحقق نتائج موثوقة.", icon: Stethoscope },
];

const faqItems = [
  {
    question: "هل ضعف الانتصاب مشكلة جسدية دائمًا؟",
    answer: "لا. يمكن أن يكون لضعف الانتصاب أسباب جسدية وهرمونية ونفسية، وغالبًا ما تجتمع معًا. يهدف التقييم إلى تحديد العوامل ذات الصلة قبل التخطيط للعلاج.",
  },
  {
    question: "هل أحتاج إلى دعامة قضيبية؟",
    answer: "لا يحتاج معظم الرجال إلى تدخل جراحي. لا يُنظر في دعامة القضيب إلا في حالات ضعف الانتصاب الشديدة أو المقاومة للعلاج، بعد استكشاف خيارات العلاج الأخرى.",
  },
  {
    question: "ما هو تقييم دوبلر القضيب؟",
    answer: "هو فحص بالموجات فوق الصوتية لتدفق الدم في القضيب، يُستخدم عند الحاجة إلى تقييم سبب وعائي كجزء من التقييم الشامل.",
  },
  {
    question: "هل يمكن أن يرتبط ضعف الانتصاب بالتستوستيرون؟",
    answer: "نعم، من الممكن ذلك. يُعد التقييم الهرموني، بما في ذلك التستوستيرون، جزءًا من التقييم الشامل — رغم أن ضعف الانتصاب ليس هرمونيًا في كل الحالات.",
  },
  {
    question: "ما أسباب ضعف الانتصاب عند الشباب؟",
    answer: "لا يقتصر ضعف الانتصاب على كبار السن. عند الشباب، غالبًا ما تكون الأسباب النفسية-الجنسية — مثل قلق الأداء أو التوتر أو عوامل العلاقة — أكثر شيوعًا نسبيًا، لكن الأسباب الوعائية والهرمونية والاستقلابية يمكن أن تحدث أيضًا في هذه الفئة العمرية. يهدف التقييم إلى تحديد الأسباب ذات الصلة الفعلية بدلاً من افتراض سبب واحد بناءً على العمر وحده.",
  },
  {
    question: "كيف يمكنني حجز استشارة؟",
    answer: `تُجرى الاستشارات في ${AR_IDENTITY.practiceLocationLine}. استخدم خيار «احجز استشارة» في هذه الصفحة، والذي يوجهك إلى إجراءات الحجز الرسمية لدى NMC.`,
  },
];

export default function ErectileDysfunctionPageAr() {
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
              name: "تقييم وعلاج ضعف الانتصاب",
              description: "تقييم وعلاج متخصص لضعف الانتصاب — أسباب وعائية وهرمونية واستقلابية ونفسية-جنسية، مع خطة علاج فردية تُلائم كل حالة.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Erectile Dysfunction",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.7fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                الطب الجنسي
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-display-xl text-foreground">
                تقييم وعلاج ضعف الانتصاب
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                يُختار العلاج وفقًا للسبب الكامن والتاريخ المرضي والأولويات
                الفردية — وليس وصفة موحدة تُطبق على الجميع.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="erectile_dysfunction" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
                <a
                  href="#treatment-ladder"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  اطّلع على سلّم العلاج
                </a>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="edHero" landscape priority />
          </MaskedReveal>
        </Container>
      </section>

      {/* Assessment vs treatment framing */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="التقييم أولاً"
            heading="تشخيص قبل الوصفة"
            size="md"
            description="يمكن أن يكون لضعف الانتصاب أسباب وعائية وهرمونية واستقلابية وعصبية ومرتبطة بالأدوية ونفسية-جنسية. تسبق الاستشارة والتقييم المناسب أي توصية علاجية."
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase text-muted-foreground">
              التقييم مقابل العلاج
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              يعني <strong className="text-foreground">التقييم</strong>{" "}
              فهم السبب: التاريخ المرضي، والفحص المناسب، والفحوصات
              الهرمونية أو الوعائية عند الحاجة. لا يُختار{" "}
              <strong className="text-foreground">العلاج</strong> إلا بعد
              وضوح هذه الصورة — وليس العكس.
            </p>
            <VascularFlowDiagram className="mt-8 h-24 w-full max-w-xs text-muted-foreground" />
          </Reveal>
        </Container>
      </section>

      {/* How an erection is maintained */}
      <section className="border-t border-border py-section-y">
        <Container>
          <SectionHeading
            eyebrow="فهم الآلية"
            heading="كيف يُحافظ على الانتصاب"
            description="أربع مراحل، لا آلية واحدة — ولهذا نادرًا ما يُفسَّر ضعف الانتصاب بالكامل بعبارة واحدة مثل «نقص الدم» أو «تسرب الأوردة»."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {erectionStages.map((stage, index) => (
              <StaggerItem key={stage.title} className="card-hover border-t border-border pt-6">
                <span className="font-display text-sm text-accent-strong">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg text-foreground">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Vascular mechanisms */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="التمييز بين الآليات"
            heading="الجانب الوعائي لضعف الانتصاب"
            description="يمثل انخفاض التدفق الشرياني الداخل، وضعف الانسداد الوريدي (يُعرف غالبًا بـ«التسرب الوريدي»)، والأنماط الوظيفية غير البنيوية ثلاث آليات وعائية مختلفة فعليًا — ويُستخدم تقييم دوبلر القضيب للتمييز بينها."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {vascularMechanisms.map((mechanism) => (
              <StaggerItem key={mechanism.title} className="card-hover border-t border-border pt-6">
                <mechanism.icon className="h-6 w-6 text-accent-strong" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg text-foreground">{mechanism.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mechanism.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-14 max-w-3xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              يُعد{" "}
              <Link href="/ar/erectile-dysfunction/penile-doppler" className="text-foreground underline decoration-accent-strong underline-offset-4">
                دوبلر القضيب
              </Link>{" "}
              وسيلة التمييز العملية بين هذه الآليات. لمزيد من التفصيل حول
              إحداها تحديدًا، انظر{" "}
              <Link href="/ar/insights/venous-leak-and-penile-doppler" className="text-foreground underline decoration-accent-strong underline-offset-4">
                التسرب الوريدي وضعف الانتصاب: ماذا يُظهر فحص دوبلر القضيب فعلاً؟
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cause matrix */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="فهم السبب" heading="العوامل المحتملة" locale="ar" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((cause) => (
              <StaggerItem key={cause.label} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{cause.label}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{cause.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Treatment ladder — dark section */}
      <section id="treatment-ladder" className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="سلّم العلاج" heading="علاج يُلائم السبب، خطوة بخطوة" locale="ar" />
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            لا يبدأ كل مريض من الخطوة الأولى، ولا يحتاج كل مريض إلى كل
            خطوة — يعكس السلّم نطاق الخيارات المطروحة، لا تسلسلاً ثابتًا
            يتبعه كل رجل.
          </p>

          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {ladder.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="card-hover grid grid-cols-[3rem_1fr] gap-x-6 gap-y-2 rounded-sm px-3 py-7 -mx-3 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline">
                  <div className="flex flex-col gap-1">
                    <step.icon aria-hidden size={18} className="text-accent-strong" />
                    <span className="font-display text-2xl text-accent-strong">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
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

      {/* Risks / realistic expectations */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="توقعات واقعية" heading="المخاطر والحدود" size="md" locale="ar" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يحمل كل خيار في سلّم العلاج اعتباراته الخاصة — من تداخلات
              الأدوية وموانع الاستعمال مع مثبطات PDE5، إلى المخاطر
              الجراحية المرتبطة بجراحة زراعة دعامة القضيب. وتختلف الاستجابة
              لأي علاج، بما في ذلك العلاج بالموجات الصادمة، من شخص لآخر
              وغير مضمونة. تُناقش هذه الجوانب بالتفصيل أثناء الاستشارة،
              إلى جانب تاريخك المرضي، بحيث تعكس أي خطة علاجية ظروفك
              الفردية بدلاً من افتراض عام.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "دوبلر القضيب", href: "/ar/erectile-dysfunction/penile-doppler" },
          { label: "العلاج بالموجات الصادمة", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "جراحة زراعة دعامة القضيب", href: "/ar/penile-implant" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ابدأ بتقييم، لا بافتراض"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف زراعة دعامة القضيب", href: "/ar/penile-implant" }}
      />
    </>
  );
}
