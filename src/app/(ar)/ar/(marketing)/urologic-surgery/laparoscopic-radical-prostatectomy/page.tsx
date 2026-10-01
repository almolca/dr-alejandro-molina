import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import visual from "@/components/editorial/VisualSystem.module.css";
import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { doctor } from "@/config/doctor";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EditorialTexture } from "@/components/ui/EditorialTexture";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { OutcomeBenchmarkTable, type BenchmarkColumn, type BenchmarkRow } from "@/components/sections/OutcomeBenchmarkTable";
import { SurgicalSeriesStats, type SurgicalSeriesStat } from "@/components/sections/SurgicalSeriesStats";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/urologic-surgery/laparoscopic-radical-prostatectomy";
const series = doctor.laparoscopicProstatectomy;

export const metadata: Metadata = buildMetadata({
  title: "استئصال البروستاتا الجذري بالمنظار في أبوظبي",
  description:
    `استئصال البروستاتا الجذري بالمنظار لعلاج سرطان البروستاتا في أبوظبي مع د. أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة — ${series.procedureCount} إجراء منجز. مقارنة شفافة بين المنظار والروبوت، نتائج مرجعية منشورة، وسلسلة د. مولينا الجراحية الخاصة.`,
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة المسالك البولية", href: "/ar/urologic-surgery" },
  { name: "استئصال البروستاتا الجذري بالمنظار", href: PATH },
];

const experienceFactors = [
  {
    title: "منحنى التعلّم",
    description:
      "تُظهر البيانات المنشورة حول استئصال البروستاتا الجذري بالمنظار باستمرار أن النتائج — وخاصة الهامش الجراحي الإيجابي — تتحسن بشكل كبير مع تراكم خبرة الجراح المبكرة، وتستمر في التحسن إلى ما بعد أول 100 إلى 200 حالة قبل الوصول إلى مستوى مستقر.",
  },
  {
    title: "حجم الجراحات",
    description:
      "يرتبط ارتفاع الحجم التراكمي للحالات بنتائج أفضل من الناحية السرطانية والوظيفية عبر الأدبيات المنشورة، بغض النظر عن المنصة طفيفة التوغل المستخدمة.",
  },
  {
    title: "التشريح القمي",
    description:
      "قمة البروستاتا هي الموقع الأكثر شيوعًا تشريحيًا للهامش الجراحي الإيجابي. يُعد التشريح الدقيق عند هذا المستوى، الذي يوازن بين الاستئصال الكامل للسرطان والحفاظ على العضلة العاصرة البولية، من الخطوات الصعبة تقنيًا في العملية.",
  },
  {
    title: "إدارة عنق المثانة",
    description:
      "تؤثر طريقة التعامل مع عنق المثانة وإعادة بنائه على استعادة التحكم في التبول مبكرًا وعلى الجودة التقنية لإعادة الوصل بالإحليل.",
  },
  {
    title: "الحفاظ على الحزمة الوعائية العصبية",
    description:
      "حيثما كان ذلك مناسبًا من الناحية السرطانية، يُعد الحفاظ على الحزم الوعائية العصبية المجاورة للبروستاتا أمرًا محوريًا لاستعادة وظيفة الانتصاب — وهو قرار يُتخذ بشكل فردي، لا يُطبَّق بشكل موحّد على كل مريض.",
  },
  {
    title: "مفاغرة المثانة والإحليل",
    description:
      "يجب أن تكون إعادة الوصل بين المثانة والإحليل دقيقة ومحكمة — إذ تؤثر جودتها على مدة القسطرة والتحكم المبكر في التبول.",
  },
  {
    title: "اتخاذ القرار السرطاني",
    description:
      "القرارات أثناء الجراحة — مثل مدى اتساع الهامش المطلوب أخذه في موقع معين، أو ما إذا كان ينبغي تعديل الحفاظ على الأعصاب أو التخلي عنه بناءً على ما يُكتشف أثناء العملية — هي أحكام مبنية على الخبرة، لا خطوات يمكن توحيدها بالكامل مسبقًا.",
  },
  {
    title: "اختيار المرضى",
    description:
      "تحديد المرضى المناسبين — وغير المناسبين — لنهج الحفاظ على الأعصاب، ووضع توقعات واقعية بناءً على ذلك، هو بحد ذاته مهارة تتطور مع الخبرة.",
  },
];

const benchmarkColumns: BenchmarkColumn[] = [
  { label: "د. أليخاندرو مولينا", sublabel: "السلسلة الجراحية الشخصية بالمنظار", highlight: true },
  { label: "المنظار — منحنى التعلّم", sublabel: "سلاسل منشورة أقل حجمًا" },
  { label: "المنظار — حجم عالٍ", sublabel: "سلاسل منشورة لخبراء" },
  { label: "الروبوت — معاصرة", sublabel: "سلاسل منشورة عالية الحجم" },
];

const socialContinenceNoteAr = "غير مُبلَّغ عنه باستمرار وفق تعريف الحفاظة الأمان الواحدة نفسه في الأدبيات المنشورة التي تم تحديدها.";
const potencyLearningCurveNoteAr = "~30–50% (تقدير مستند إلى أدبيات منحنى التعلّم العامة؛ غير مُبلَّغ عنه مباشرة وفق هذا التعريف في دراسة مخصصة)";

const benchmarkRows: BenchmarkRow[] = [
  {
    metric: "التحكم الصارم في التبول عند 12 شهرًا",
    definition: "صفر حفاظات يوميًا",
    values: ["89%", "~65–80%", "85–94%", "85–95%"],
  },
  {
    metric: "التحكم الاجتماعي في التبول عند 12 شهرًا",
    definition: "0–1 حفاظة أمان يوميًا",
    values: ["93%", socialContinenceNoteAr, socialContinenceNoteAr, socialContinenceNoteAr],
  },
  {
    metric: "الفاعلية الجنسية عند 12 شهرًا",
    definition: "مرضى كانوا يتمتعون بفاعلية جنسية سابقًا، مع الحفاظ على الأعصاب من الجانبين، وانتصاب كافٍ للإيلاج مع أو بدون مثبطات PDE5",
    values: ["74%", potencyLearningCurveNoteAr, "65–76%", "55–85%"],
  },
  {
    metric: "الهامش الجراحي الإيجابي الإجمالي",
    values: ["16%", "20–30%", "~8–15%", "10–20%"],
  },
  {
    metric: "الهامش الجراحي الإيجابي — pT2",
    values: ["6%", "~18–30%", "~10–15%", "~7–10%"],
  },
  {
    metric: "الهامش الجراحي الإيجابي — pT3",
    values: ["18%", "~30–45%", "~28–35%", "~30–40%"],
  },
  {
    metric: "المضاعفات الكبرى",
    definition: "Clavien-Dindo بدرجة ≥III",
    values: ["2.5%", "~5–10%", "~3–6%", "~3–5%"],
  },
];

const seriesStats: SurgicalSeriesStat[] = [
  { value: series.procedureCount, label: "الإجراءات المنجزة", definition: "استئصال بروستاتا جذري بالمنظار، سلسلة شخصية." },
  { value: `${series.outcomes.strictContinence.value}%`, label: "التحكم الصارم في التبول", definition: `عند 12 شهرًا، صفر حفاظات يوميًا.` },
  { value: `${series.outcomes.socialContinence.value}%`, label: "التحكم الاجتماعي في التبول", definition: `عند 12 شهرًا، 0–1 حفاظة أمان يوميًا.` },
  { value: `${series.outcomes.potency.value}%`, label: "الفاعلية الجنسية", definition: `عند 12 شهرًا، بين المرضى الذين كانوا يتمتعون بفاعلية جنسية سابقًا مع الحفاظ على الأعصاب من الجانبين، مع انتصاب كافٍ للإيلاج مع أو بدون مثبطات PDE5.` },
  { value: `${series.outcomes.marginsOverall.value}%`, label: "الهامش الجراحي الإيجابي الإجمالي", definition: "معدل الهامش الجراحي الإيجابي الإجمالي." },
  { value: `${series.outcomes.marginsPT2.value}%`, label: "هامش إيجابي — pT2", definition: "معدل الهامش الجراحي الإيجابي لمرحلة pT2." },
  { value: `${series.outcomes.marginsPT3.value}%`, label: "هامش إيجابي — pT3", definition: "معدل الهامش الجراحي الإيجابي لمرحلة pT3." },
  { value: `${series.outcomes.majorComplications.value}%`, label: "المضاعفات الكبرى", definition: "بدرجة Clavien-Dindo ≥III." },
];

const faqItems = [
  {
    question: "هل استئصال البروستاتا الجذري بالروبوت أفضل من المنظار؟",
    answer:
      "ليس كقاعدة عامة يمكن تعميمها. قد تقدّم التقنية الروبوتية مزايا تقنية، لكن النتائج المنشورة تتفاوت بشكل كبير بين الجراحين والمراكز، ويمكن للسلاسل عالية الحجم بالمنظار أن تحقق نتائج سرطانية ووظيفية ضمن النطاق الذي تُبلغ عنه البرامج الروبوتية المعاصرة عالية الحجم. المنصة الجراحية جزء واحد فقط من النتيجة — إذ تؤدي خبرة الجراح والتقنية واختيار المرضى وحجم الجراحات دورًا رئيسيًا أيضًا. انظر المقارنة المرجعية أعلاه للاطلاع على النطاقات المنشورة التي تستند إليها هذه المعلومات.",
  },
  {
    question: "هل يُجري الروبوت الجراحة؟",
    answer:
      "لا. في الجراحة بمساعدة الروبوت، يتحكم الجراح في كل حركة للأدوات في الوقت الفعلي من وحدة تحكم — فالمنصة الروبوتية أداة يُشغّلها الجراح، وليست نظامًا مستقلًا يعمل بذاته أو يتخذ قرارات بشكل مستقل. يُجري د. مولينا استئصال البروستاتا الجذري بالمنظار، وليس بمساعدة الروبوت.",
  },
  {
    question: "هل تؤثر خبرة الجراح على النتائج؟",
    answer:
      "نعم، بشكل كبير. تُظهر دراسات منحنى التعلّم المنشورة أن النتائج — وخاصة مقاييس السيطرة على السرطان مثل الهامش الجراحي الإيجابي — تتحسن بشكل ملحوظ مع تراكم خبرة الجراح، مع إظهار أن استئصال البروستاتا الجذري بالمنظار تحديدًا له منحنى تعلّم أبطأ من الجراحة المفتوحة. وينطبق هذا بغض النظر عن المنصة طفيفة التوغل المستخدمة.",
  },
  {
    question: "ما معدل التحكم في التبول بعد استئصال البروستاتا الجذري؟",
    answer:
      `يختلف تعافي التحكم في التبول باختلاف التعريف المستخدم. في سلسلة د. مولينا الخاصة، يصل ${series.outcomes.strictContinence.value}% من المرضى إلى تحكم كامل دون حفاظات (صفر حفاظات يوميًا) عند 12 شهرًا، بينما يصل ${series.outcomes.socialContinence.value}% إلى معيار التحكم الاجتماعي (0–1 حفاظة أمان يوميًا) بحلول الفترة الزمنية نفسها. هذه الأرقام من سلسلة د. مولينا الشخصية — انظر التعريفات والنطاقات المرجعية المنشورة أدناه للسياق.`,
  },
  {
    question: "ما فرص استعادة الوظيفة الجنسية؟",
    answer:
      `يعتمد ذلك بشكل كبير على الوظيفة الجنسية الأساسية قبل الجراحة، والعمر، وما إذا كان الحفاظ على الأعصاب مناسبًا من الناحية السرطانية وتم تنفيذه من جانب واحد أو من الجانبين. في سلسلة د. مولينا، وصل ${series.outcomes.potency.value}% من المرضى الذين كانوا يتمتعون بفاعلية جنسية سابقًا مع الحفاظ على الأعصاب من الجانبين إلى انتصاب كافٍ للإيلاج مع أو بدون مثبطات PDE5، عند 12 شهرًا. لا ينطبق هذا الرقم على المرضى الذين لم يكونوا يتمتعون بفاعلية جنسية سابقًا، أو الذين لم يخضعوا للحفاظ على الأعصاب من الجانبين، أو الذين تطلّبت حالتهم استئصالًا أوسع لضمان السلامة السرطانية.`,
  },
  {
    question: "ما هو الهامش الجراحي الإيجابي؟",
    answer:
      "يعني الهامش الجراحي الإيجابي وجود خلايا سرطانية عند الحافة الخارجية للنسيج المستأصل تحت الفحص المجهري لطبيب علم الأمراض، مما يشير إلى احتمال عدم استئصال بعض الخلايا السرطانية بالكامل. وهو مؤشر يمكن أن يرتبط باحتمال أعلى للانتكاس الكيميائي الحيوي بمرور الوقت، لكن الهامش الإيجابي بحد ذاته لا يعني أن السرطان قد عاد أو سيعود — إذ تعتمد درجة الخطورة على موقع الهامش ومداه وخصائص الورم المرضية الأخرى، وتُناقش بشكل فردي أثناء المتابعة.",
  },
  {
    question: "هل يمكن الحفاظ على الأعصاب دائمًا؟",
    answer:
      "لا. تأتي السلامة السرطانية أولاً — ولا يكون الحفاظ على الأعصاب مناسبًا إلا عندما لا يُضعف السيطرة على السرطان، بناءً على موقع الورم وخصائصه. بعض المرضى مناسبون للحفاظ على الأعصاب من الجانبين، وبعضهم مناسب للحفاظ من جانب واحد فقط، وبالنسبة لبعض المرضى لا يكون الحفاظ على الأعصاب مناسبًا على الإطلاق. يُقيَّم ذلك ويُناقش بشكل فردي، لا افتراضي.",
  },
  {
    question: "كم تستغرق فترة التعافي؟",
    answer:
      "تُستخدم عادةً قسطرة بولية لفترة قصيرة بعد الجراحة، ويقضي معظم المرضى عددًا صغيرًا من الأيام في المستشفى. يعود النشاط الخفيف عمومًا خلال أسابيع قليلة، مع استئناف النشاط الكامل تدريجيًا خلال الأسابيع إلى الأشهر التالية، بينما يستمر التحكم في التبول والوظيفة الجنسية — عند الاقتضاء — في التعافي تدريجيًا خلال الأشهر التالية. تُناقش التوقعات المحددة لحالتك كجزء من خطة علاجك.",
  },
];

export default function LaparoscopicRadicalProstatectomyPageAr() {
  return (
    <div className={visual.scope}>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbItems.map((i) => ({ name: i.name, path: i.href })),
            { inLanguage: "ar" },
          ),
          medicalWebPageSchema(
            {
              name: "استئصال البروستاتا الجذري بالمنظار",
              description:
                "علاج جراحي بالمنظار لسرطان البروستاتا الموضعي، مع شرح شفاف للفرق بين المنظار والروبوت ونتائج مرجعية منشورة تُعرض إلى جانب سلسلة د. مولينا الجراحية الشخصية.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Laparoscopic Radical Prostatectomy",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* 1. Hero */}
      <EditorialField className={`${visual.flagshipHero} py-14`}>
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                جراحة المسالك البولية المتقدمة · أبوظبي
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-display-2xl text-foreground">
                استئصال البروستاتا الجذري بالمنظار لعلاج سرطان البروستاتا
              </h1>
              <p className="mt-4 max-w-xl font-display text-display-sm text-accent-strong">
                خبرة تتجاوز التقنية
              </p>
              {/* 2. الخبرة والمرجعية */}
              <div className={visual.flagshipMetrics}>
                <p><strong>{series.procedureCount}</strong><span>استئصال بروستاتا جذري بالمنظار</span></p>
                <p><strong>{series.outcomes.potency.value}%</strong><span>الفاعلية الجنسية عند 12 شهرًا<br />لدى مرضى كانوا فاعلين جنسيًا سابقًا، مع الحفاظ على الأعصاب من الجانبين، مع أو بدون مثبطات PDE5</span></p>
              </div>
              <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
                أكثر من 500 إجراء استئصال بروستاتا جذري بالمنظار، مع
                تركيز على السيطرة على السرطان والتحكم في التبول والحفاظ
                على الوظيفة الجنسية عندما يكون ذلك مناسبًا من الناحية
                السرطانية.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                يُجري د. مولينا استئصال البروستاتا الجذري بالمنظار، وليس
                بالروبوت — توضح هذه الصفحة الفرق بين النهجين، ولماذا تُعد
                المنصة الجراحية جزءًا واحدًا فقط من النتيجة.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="urologic_surgery" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
              </div>
            </Reveal>
            <p className="mt-6 text-sm text-muted-foreground">{AR_IDENTITY.doctorDisplayName}<br />{AR_IDENTITY.doctorTitle}</p>
          </div>
          <EditorialFrame slot="prostatectomyFlagship" landscape priority tone="dark" alt="د. أليخاندرو مولينا يُجري استئصال البروستاتا الجذري بالمنظار في غرفة العمليات" />
        </Container>
      </EditorialField>

      {/* 3. ما هو استئصال البروستاتا الجذري */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="فهم الإجراء"
            heading="ما هو استئصال البروستاتا الجذري"
            description="استئصال البروستاتا الجذري هو الاستئصال الجراحي الكامل لغدة البروستاتا، إلى جانب الحويصلتين المنويتين، كعلاج لسرطان البروستاتا. الهدف هو استئصال السرطان بالكامل مع الحفاظ، حيثما كان ذلك مناسبًا من الناحية السرطانية، على البُنى المسؤولة عن التحكم في التبول والوظيفة الجنسية."
            locale="ar"
          />
        </Container>
      </section>

      {/* 4. من قد يكون مرشحًا */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="الأهلية"
            heading="من قد يكون مرشحًا"
            description="يُنظر عمومًا في استئصال البروستاتا الجذري للرجال المصابين بسرطان بروستاتا محصور داخل الغدة (مرض موضعي)، وأحيانًا لحالات مختارة من المرض المتقدم موضعيًا، وذلك حسب الصحة العامة ومتوسط العمر المتوقع والتفضيل الشخصي مقارنة بخيارات علاجية أخرى مثل العلاج الإشعاعي أو المراقبة الفعّالة. هذا ليس توصية بأن الجراحة هي الخيار الصحيح لكل رجل مصاب بسرطان البروستاتا — إذ تُقيَّم الأهلية بشكل فردي، بناءً على تشخيصك المحدد وصورك الإشعاعية وتقرير خزعتك وصحتك العامة، وتُناقش إلى جانب البدائل ذات الصلة بحالتك."
            locale="ar"
          />
        </Container>
      </section>

      {/* 5. النهج بالمنظار */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="النهج المتبع"
            heading="النهج بالمنظار"
            description="يُجرى استئصال البروستاتا الجذري بالمنظار من خلال عدة شقوق صغيرة في البطن، باستخدام كاميرا (منظار) وأدوات متخصصة طويلة يُشغّلها الجراح مباشرة بيده، بدلاً من شق مفتوح كبير واحد. يرتبط هذا النهج طفيف التوغل بفقدان دم أقل وندوب أصغر وتعافٍ مبكر أسرع بشكل عام مقارنة بالجراحة المفتوحة، مع السعي لتحقيق الأهداف الجراحية نفسها — الاستئصال الكامل للسرطان، والحفاظ على الأعصاب حيثما كان ذلك مناسبًا."
            locale="ar"
          />
        </Container>
      </section>

      {/* 6. المنظار مقابل الروبوت — قسم الشفافية */}
      <section className="section-dark relative bg-background py-section-y text-foreground">
        <EditorialTexture watermark={false} />
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="مقارنة شفافة"
            heading="استئصال البروستاتا الجذري: المنظار مقابل الروبوت"
            locale="ar"
          />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              كلا النهجين — بالمنظار وبمساعدة الروبوت — من الأساليب طفيفة
              التوغل: تُستأصل البروستاتا من خلال عدة شقوق صغيرة بدلاً من
              شق مفتوح كبير واحد، باستخدام كاميرا وأدوات بدلاً من يد
              الجراح مباشرة داخل الجسم.
            </p>
            <p>
              تستخدم الجراحة الروبوتية منصة جراحية روبوتية يتحكم بها
              الجراح في الوقت الفعلي من وحدة تحكم على بُعد أمتار قليلة،
              حيث تُترجَم حركات يد الجراح إلى حركات الأدوات داخل جسم
              المريض. لا يعمل الروبوت بشكل مستقل ولا يتخذ قرارات جراحية
              بذاته — فكل حركة هي حركة الجراح نفسه.
            </p>
            <p>
              يختلف المنظار والروبوت تقنيًا — من حيث الأدوات والتصوير
              ومدى مباشرة تحكم الجراح بالأدوات — لكن المنصة الجراحية وحدها
              لا تحدد النتيجة. المنصة الجراحية جزء واحد فقط من النتيجة:
              تؤدي خبرة الجراح والتقنية واختيار المرضى وحجم الجراحات
              دورًا رئيسيًا أيضًا. قد تقدّم التقنية الروبوتية مزايا تقنية،
              لكن النتائج المنشورة تتفاوت بشكل كبير بين الجراحين
              والمراكز، ويمكن للسلاسل عالية الحجم بالمنظار أن تحقق نتائج
              سرطانية ووظيفية ضمن النطاق الذي تُبلغ عنه البرامج الروبوتية
              المعاصرة عالية الحجم.
            </p>
            <p className="font-display text-lg text-foreground">
              يُجري د. مولينا استئصال البروستاتا الجذري بالمنظار، وليس
              بالروبوت.
            </p>
          </div>
        </Container>
      </section>

      {/* 7. لماذا تهم خبرة الجراح */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="لماذا تهم"
            heading="لماذا تهم خبرة الجراح"
            description="استئصال البروستاتا الجذري — بأي منصة طفيفة التوغل — عملية تتطلب مهارة تقنية عالية، حيث تؤثر عوامل محددة تتطور عبر مسيرة الجراح المهنية بشكل جوهري على كلٍ من السيطرة على السرطان والتعافي الوظيفي."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {experienceFactors.map((factor) => (
              <StaggerItem key={factor.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{factor.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{factor.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          المنصة الجراحية جزء واحد فقط من النتيجة. تؤدي خبرة الجراح
          والتقنية واختيار المرضى وحجم الجراحات دورًا رئيسيًا أيضًا.
        </PullQuote>
      </Container>

      {/* 8. النتائج تعتمد على أكثر من المنصة */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="الأدلة"
            heading="النتائج تعتمد على أكثر من المنصة"
            description="نطاقات مرجعية منشورة — وليست مقارنة عشوائية. السلاسل المنشورة غير قابلة للمقارنة المباشرة فيما بينها: تختلف النتائج حسب اختيار المرضى ومرحلة الورم والوظيفة الأساسية وأهلية الحفاظ على الأعصاب وتعريفات النتائج وحجم خبرة الجراح ومدة المتابعة. تُقدَّم هذه الأرقام كسياق، لا كمقارنة تجريبية مباشرة."
            locale="ar"
          />
          <div className="mt-10">
            <OutcomeBenchmarkTable
              columns={benchmarkColumns}
              rows={benchmarkRows}
              disclaimer="هذه نطاقات مرجعية منشورة، وليست مقارنة عشوائية. السلاسل المنشورة غير قابلة للمقارنة المباشرة فيما بينها: تختلف النتائج حسب اختيار المرضى ومرحلة الورم والوظيفة الأساسية وأهلية الحفاظ على الأعصاب وتعريفات النتائج وحجم خبرة الجراح ومدة المتابعة. تُقدَّم هذه الأرقام كسياق، لا كمقارنة تجريبية مباشرة."
              locale="ar"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              تقع نتائج د. مولينا ضمن النطاق الذي تُبلغ عنه السلاسل
              المعاصرة عالية الحجم، سواء بالمنظار أو بالروبوت. وحيثما كانت
              أرقام محددة — مثل معدلات الهامش الجراحي لمرحلتي pT2 وpT3 —
              مواتية عدديًا مقارنة بالنطاقات المنشورة، فإن الوصف الأدق هو
              أنها تتماشى مع الطرف المواتي من النطاقات المنشورة، لا أنها
              دليل على تفوق عام على أي نهج محدد.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 9. سلسلة د. مولينا */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="سلسلة د. مولينا"
            heading="سلسلة د. مولينا لاستئصال البروستاتا الجذري بالمنظار"
            locale="ar"
          />
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            النتائج التالية هي سلسلة د. مولينا الشخصية لاستئصال البروستاتا
            الجذري بالمنظار — بيانات سلسلة ممارسة مقدَّمة من الجراح
            المعالج، وليست سجلًا مدققًا بشكل مستقل أو تجربة مقارنة عشوائية.
            تُعرض النطاقات المرجعية المنشورة بشكل منفصل، أعلاه، كسياق لا
            كمقارنة مباشرة.
          </p>
          <div className="mt-12">
            <SurgicalSeriesStats stats={seriesStats} locale="ar" />
          </div>
        </Container>
      </section>

      {/* 10. السيطرة على السرطان */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="بعد الجراحة" heading="السيطرة على السرطان" locale="ar" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              بعد الجراحة، يفحص طبيب علم الأمراض البروستاتا المستأصلة وأي
              نسيج مُستأصَل آخر، ويُصدر تقريرًا يوضح المرحلة المرضية (مدى
              امتداد السرطان داخل البروستاتا أو خارجها)، ودرجة الورم، وما
              إذا كان هناك هامش جراحي إيجابي عند أي نقطة على طول الحافة
              الخارجية للعينة.
            </p>
            <p>
              الهامش الجراحي الإيجابي نتيجة مرضية، لا تشخيصًا للانتكاس —
              فهو يعني وجود خلايا سرطانية عند الحافة المقطوعة للنسيج
              المستأصل، وهو ما يمكن أن يرتبط باحتمال أعلى للانتكاس
              الكيميائي الحيوي بمرور الوقت، لكنه لا يعني بحد ذاته أن
              السرطان قد عاد أو سيعود.
            </p>
            <p>
              تتمحور المتابعة بعد الجراحة حول قياس مستضد البروستاتا
              النوعي (PSA). ولأن البروستاتا قد استُؤصلت، يجب أن ينخفض
              مستوى PSA إلى مستوى غير قابل للكشف؛ ويُعرَّف الارتفاع
              المؤكد من تلك النقطة بأنه الانتكاس الكيميائي الحيوي — وهو
              نتيجة مخبرية قد تتطلب أو لا تتطلب علاجًا إضافيًا، وتُناقش
              بشكل فردي في حال حدوثها.
            </p>
          </div>
        </Container>
      </section>

      {/* 11. التحكم في التبول */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="التعافي" heading="التحكم في التبول" locale="ar" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              يُبلَّغ عن التحكم في التبول عمومًا بطريقتين: تعريف صارم يعني
              صفر حفاظات يوميًا، وتعريف اجتماعي للتحكم يسمح بحفاظة أمان
              واحدة كحد أقصى يوميًا للاطمئنان لا للتسرب الفعلي. كلا
              التعريفين طريقة مشروعة لوصف التعافي، وكلاهما يُذكر هنا
              بشكل منفصل ليكون الفرق واضحًا بدلاً من دمجه في رقم واحد.
            </p>
            <p>
              يتعافى التحكم في التبول عادةً بشكل تدريجي على مدى الأسابيع
              والأشهر التالية لإزالة القسطرة، لا فورًا — والتسرب المبكر
              في الأسابيع الأولى متوقع ولا يُنبئ بالنتيجة النهائية. في
              سلسلة د. مولينا، يستخدم {series.outcomes.strictContinence.value}%
              من المرضى صفر حفاظات يوميًا عند 12 شهرًا، بينما يصل{" "}
              {series.outcomes.socialContinence.value}% إلى معيار
              التحكم الاجتماعي (0–1 حفاظة أمان يوميًا) بحلول الفترة
              الزمنية نفسها.
            </p>
          </div>
        </Container>
      </section>

      {/* 12. الحفاظ على الأعصاب والوظيفة الجنسية */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الوظيفة الجنسية" heading="الحفاظ على الأعصاب والوظيفة الجنسية" locale="ar" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              تأتي السلامة السرطانية أولاً. لا يكون الحفاظ على
              الأعصاب — أي الحزم الوعائية العصبية المجاورة للبروستاتا
              والمسؤولة عن الوظيفة الجنسية — مناسبًا إلا عندما لا يُضعف
              الاستئصال الكامل للسرطان، بناءً على موقع الورم وخصائصه.
            </p>
            <p>
              ليس كل مريض مرشحًا للحفاظ على الأعصاب، وحتى بين المرشحين،
              بعضهم مناسب للحفاظ من الجانبين بينما البعض الآخر مناسب
              للحفاظ من جانب واحد فقط، أو لا يكون مناسبًا على الإطلاق.
              تؤثر الوظيفة الجنسية الأساسية قبل الجراحة والعمر والتشريح
              والنتائج المرضية المحددة جميعها في هذا القرار الفردي.
            </p>
            <p>
              في سلسلة د. مولينا، وصل {series.outcomes.potency.value}%
              من المرضى الذين كانوا يتمتعون بفاعلية جنسية سابقًا مع
              الحفاظ على الأعصاب من الجانبين إلى انتصاب كافٍ للإيلاج مع
              أو بدون مثبطات PDE5، عند 12 شهرًا. ينطبق هذا الرقم تحديدًا
              على تلك الفئة — المرضى الذين كانوا يتمتعون بفاعلية جنسية
              سابقًا وخضعوا للحفاظ على الأعصاب من الجانبين — ولا يُعمَّم
              على المرضى خارج هذا التعريف.
            </p>
            <p>
              بالنسبة للرجال الذين يعانون من ضعف انتصاب مستمر بعد علاج
              سرطان البروستاتا، يُقيَّم ذلك ويُدار بالطريقة نفسها المتبعة
              مع{" "}
              <Link href="/ar/erectile-dysfunction" className="text-foreground underline decoration-accent-strong underline-offset-4">
                ضعف الانتصاب لأي سبب آخر
              </Link>
              ، بما في ذلك إعادة التأهيل والأدوية عند الاقتضاء. وحيثما لا
              تتعافى الوظيفة الجنسية وتؤثر بشكل كبير على جودة الحياة، ولم
              تنجح العلاجات الأخرى،{" "}
              <Link href="/ar/penile-implant" className="text-foreground underline decoration-accent-strong underline-offset-4">
                دعامة القضيب
              </Link>{" "}
              أحد الخيارات التي تُناقش في تلك المرحلة.
            </p>
          </div>
        </Container>
      </section>

      {/* 13. المضاعفات والسلامة */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="السلامة" heading="المضاعفات والسلامة" locale="ar" />
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              كما هو الحال مع أي جراحة كبرى، يحمل استئصال البروستاتا
              الجذري خطر حدوث مضاعفات، معظمها بسيط ويُدار بسهولة. تُصنَّف
              المضاعفات الكبرى باستخدام نظام Clavien-Dindo، حيث تعني
              الدرجة ≥III تحديدًا مضاعفة تتطلب تدخلاً جراحيًا أو منظاريًا
              أو إشعاعيًا تحت التخدير، أو حدثًا مهددًا للحياة أو مميتًا —
              وهو معيار أعلى بكثير من أي مضاعفة بحد ذاتها.
            </p>
            <p>
              في سلسلة د. مولينا، معدل المضاعفات الكبرى (بدرجة
              Clavien-Dindo ≥III) هو {series.outcomes.majorComplications.value}%.
              تُناقش المخاطر المحددة ذات الصلة بحالتك الفردية بالتفصيل
              أثناء الاستشارة، قبل اتخاذ أي قرار بالمضي قدمًا.
            </p>
          </div>
        </Container>
      </section>

      {/* 14. التعافي */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="ما يمكن توقعه"
            heading="التعافي"
            description="تُستخدم عادةً قسطرة بولية لفترة قصيرة بعد الجراحة للسماح بالتئام إعادة الوصل بين المثانة والإحليل، ويقضي معظم المرضى عددًا صغيرًا من الأيام في المستشفى. يعود النشاط الخفيف عمومًا خلال أسابيع قليلة، مع استئناف النشاط الكامل خلال الأسابيع إلى الأشهر التالية. يُفحص مستوى PSA على فترات أثناء المتابعة للتأكد من انخفاضه إلى مستوى غير قابل للكشف واستمراره كذلك، بينما يستمر التحكم في التبول والوظيفة الجنسية — عند الاقتضاء — في التعافي تدريجيًا خلال الأشهر التالية. يختلف التعافي الفردي، وتُناقش التوقعات المحددة لحالتك كجزء من خطة علاجك."
            locale="ar"
          />
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "جراحة المسالك البولية", href: "/ar/urologic-surgery" },
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "دعامة القضيب", href: "/ar/penile-implant" },
          { label: "الصحة الرجولية", href: "/ar/mens-health" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش تشخيصك وخياراتك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "العودة إلى جراحة المسالك البولية", href: "/ar/urologic-surgery" }}
      />
    </div>
  );
}
