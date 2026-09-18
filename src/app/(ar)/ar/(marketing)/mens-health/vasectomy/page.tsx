import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { PullQuote } from "@/components/ui/PullQuote";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/mens-health/vasectomy";

export const metadata: Metadata = buildMetadata({
  title: "قطع القناة المنوية بدون مشرط في أبوظبي",
  description:
    "قطع القناة المنوية بدون مشرط في أبوظبي مع الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة — نهج طفيف التوغل مع استشارة منظمة، ورعاية بعد الإجراء، وفحوصات ما بعد قطع القناة المنوية.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "صحة الرجل", href: "/ar/mens-health" },
  { name: "قطع القناة المنوية بدون مشرط", href: PATH },
];

const conventional = [
  "شق جلدي واحد أو أكثر",
  "فتح أكبر للجلد والنسيج",
  "قد تكون الغرز ضرورية، حسب التقنية المستخدمة",
];

const noScalpel = [
  "فتحة مركزية صغيرة جدًا بالوخز",
  "تشريح محدود",
  "يمكن الوصول عادة إلى كلا الأسهرين من الفتحة نفسها",
  "غالبًا لا تكون هناك حاجة لغرز جلدية",
  "بشكل عام انزعاج وتورم أقل مرتبطان بالجرح",
  "عودة سريعة عادة إلى النشاط اليومي المعتاد",
];

const procedureSteps = [
  "يُطبَّق مخدر موضعي على جلد الصفن والأنسجة المحيطة به.",
  "يُحدَّد كل أسهر ويُثبَّت تحت الجلد.",
  "تُصنع فتحة مركزية صغيرة جدًا في الصفن.",
  "يُخرَج كل أسهر عبر الفتحة نفسها بالتتابع.",
  "يُقطَع الأسهر ويُغلَق باستخدام التقنية التي يختارها الجرّاح.",
  "غالبًا ما تُغلَق الفتحة الصغيرة من تلقاء نفسها أو تحتاج فقط إلى عناية بسيطة بالجرح.",
];

const benefits = [
  { title: "فتحة جلدية أصغر", description: "وخزة مركزية صغيرة واحدة بدلاً من شقوق منفصلة على كل جانب." },
  { title: "تعامل أقل مع الأنسجة", description: "تشريح محدود مقارنة بالنهج الجراحي التقليدي بالشق." },
  { title: "عبء أقل على الجرح", description: "تعطيل أقل للجلد والنسيج بشكل عام، وغالبًا دون الحاجة إلى غرز." },
  { title: "بشكل عام انزعاج وكدمات أقل", description: "يُبلغ معظم المرضى عن مسار أكثر راحة بعد الإجراء، رغم أن ذلك يختلف فرديًا." },
  { title: "خطر أقل لبعض مضاعفات الجرح", description: "الفتحة الأصغر تقلل من بعض مخاطر الجرح مقارنة بالشقوق الأكبر." },
  { title: "تعافٍ سريع لمعظم المرضى", description: "يعود كثير من المرضى إلى العمل المكتبي خلال يوم أو يومين، حسب مستوى الراحة." },
  { title: "لا تأثير على الوظيفة الجنسية", description: "لا يتأثر عادة إنتاج التستوستيرون، ولا الانتصاب، ولا الرغبة الجنسية، ولا النشوة." },
];

const recoveryAdvice = [
  "الراحة في يوم الإجراء",
  "ملابس داخلية داعمة لعدة أيام",
  "كمادات ثلج أو باردة بشكل متقطع، إذا أُوصي بذلك",
  "مسكنات بسيطة عند الحاجة",
  "تجنّب التمارين الشاقة ورفع الأثقال لعدة أيام",
  "تجنّب النشاط الجنسي لمدة أسبوع تقريبًا، أو حسب التوجيه الطبي",
  "غالبًا ما تكون العودة إلى العمل المكتبي ممكنة خلال يوم إلى يومين، حسب مستوى الراحة",
];

const sexualFunction = [
  "إنتاج التستوستيرون",
  "الرغبة الجنسية",
  "جودة الانتصاب",
  "النشوة الجنسية",
  "الإحساس أثناء القذف",
];

const risks = [
  "الكدمات",
  "التورم",
  "انزعاج مؤقت",
  "نزيف أو تجمع دموي",
  "العدوى",
  "الورم الحبيبي المنوي",
  "ألم صفني مستمر (متلازمة الألم بعد قطع القناة المنوية)",
  "إعادة الاتصال المبكرة أو المتأخرة",
  "عدم تحقيق مستوى مقبول من الخلو من الحيوانات المنوية في التحليل بعد الإجراء",
];

const goodCandidates = [
  "الرجال المتأكدون من اكتمال أسرتهم",
  "الرجال الباحثون عن وسيلة منع حمل دائمة وفعالة",
  "المرضى الذين يدركون أن إعادة الوصل غير مضمونة",
];

const needsDiscussion = [
  "عدم اليقين بشأن إنجاب أطفال مستقبلاً",
  "عدوى صفنية نشطة",
  "مشكلات تشريحية صفنية ملحوظة",
  "ألم مزمن في الخصية أو الصفن",
  "جراحة صفنية معقدة سابقة، عند الاقتضاء",
];

const faqItems = [
  {
    question: "هل قطع القناة المنوية بدون مشرط مؤلم؟",
    answer:
      "يُجرى الإجراء تحت مخدر موضعي، لذا يشعر معظم المرضى بضغط أو شد أكثر من ألم حاد أثناء الإجراء نفسه. بعض الانزعاج والكدمات والتورم بعد الإجراء أمر طبيعي وعادة ما يمكن التحكم به بمسكنات بسيطة.",
  },
  {
    question: "ما حجم الفتحة؟",
    answer:
      "تستخدم تقنية عدم استخدام المشرط وخزة مركزية صغيرة جدًا في جلد الصفن بدلاً من شقوق منفصلة — أصغر بكثير من النهج التقليدي بالشق.",
  },
  {
    question: "هل تلزم الغرز؟",
    answer:
      "غالبًا لا. نظرًا لصغر الفتحة، فإنها غالبًا ما تُغلَق من تلقاء نفسها دون غرز، رغم أن ذلك قد يعتمد على التشريح الفردي وتفاصيل إجرائك.",
  },
  {
    question: "متى يمكنني العودة إلى العمل؟",
    answer:
      "يعود كثير من المرضى إلى العمل المكتبي خلال يوم إلى يومين، حسب مستوى الراحة. العمل ذو الجهد البدني عادة ما يحتاج وقتًا أطول — يُناقَش ذلك بشكل فردي.",
  },
  {
    question: "متى يمكنني ممارسة الرياضة مجددًا؟",
    answer:
      "يُنصح عادة بتجنّب التمارين الشاقة ورفع الأثقال لعدة أيام. يُحدَّد الجدول الزمني الخاص بك عند الإجراء والمتابعة.",
  },
  {
    question: "متى يمكنني ممارسة العلاقة الحميمة بعد قطع القناة المنوية؟",
    answer: "يُنصح عادة بتجنّب النشاط الجنسي لمدة أسبوع تقريبًا، أو حسب توجيه الجرّاح.",
  },
  {
    question: "هل أصبح عقيمًا فور الإجراء؟",
    answer:
      "لا. لا يؤدي قطع القناة المنوية إلى عقم فوري — يبقى بعض الحيوانات المنوية المتبقية في الجزء الذي يلي موضع الإغلاق. يجب الاستمرار في وسيلة منع حمل بديلة حتى يؤكد تحليل السائل المنوي بعد الإجراء الخلو الكافي من الحيوانات المنوية، ويُجرى الفحص بعد فترة مناسبة وفق بروتوكول طبيبك المعالج.",
  },
  {
    question: "هل يؤثر قطع القناة المنوية على التستوستيرون؟",
    answer:
      "لا. يقطع الإجراء الأسهر، وليس إنتاج الهرمونات في الخصيتين — لا تتأثر مستويات التستوستيرون عادة.",
  },
  {
    question: "هل يؤثر قطع القناة المنوية على الانتصاب أو القذف؟",
    answer:
      "لا. لا تتأثر عادة جودة الانتصاب ولا الرغبة الجنسية ولا النشوة ولا الإحساس أثناء القذف. كما أن حجم السائل المنوي يتغير قليلاً جدًا، لأن الحيوانات المنوية تشكل جزءًا صغيرًا فقط من السائل المنوي — ومعظم السائل يأتي من البروستاتا والحويصلات المنوية.",
  },
  {
    question: "هل يمكن عكس قطع القناة المنوية؟",
    answer:
      "إجراءات إعادة الوصل مثل مفاغرة الأسهر ممكنة في حالات مختارة، لكنها أكثر تعقيدًا من الإجراء الأصلي وغير مضمونة لاستعادة الخصوبة — تختلف النتائج حسب المدة منذ قطع القناة المنوية وعوامل فردية أخرى. يجب اعتبار قطع القناة المنوية وسيلة منع حمل دائمة.",
    readMoreHref: "/ar/male-fertility",
    readMoreLabel: "اعرف المزيد عن تقييم خصوبة الرجل",
  },
  {
    question: "هل يمكن أن يعيد الأسهر الاتصال من تلقاء نفسه؟",
    answer:
      "نادرًا، نعم — إعادة الاتصال المبكرة أو المتأخرة خطر معروف وغير شائع، وهو أحد أسباب استخدام تحليل السائل المنوي بعد الإجراء للتأكد من الخلو الكافي قبل الاعتماد على الإجراء لمنع الحمل.",
  },
  {
    question: "هل سيبدو السائل المنوي مختلفًا؟",
    answer:
      "ليس بشكل ملحوظ. تمثل الحيوانات المنوية جزءًا صغيرًا فقط من حجم القذف، لذا يبدو السائل المنوي ويشعر به عادة بشكل مشابه إلى حد كبير بعد الإجراء.",
  },
  {
    question: "هل يزيد قطع القناة المنوية من خطر سرطان البروستاتا؟",
    answer:
      "لا تدعم الأدلة الحالية اعتبار قطع القناة المنوية سببًا لسرطان البروستاتا. كان هذا موضوع اهتمام بحثي، لكن لم تُثبَت أي علاقة سببية.",
  },
  {
    question: "ما هي متلازمة الألم بعد قطع القناة المنوية؟",
    answer:
      "تشير إلى انزعاج صفني أو خصوي مستمر يستمر بعد فترة التعافي المتوقعة. وهو خطر غير شائع لكنه معروف، وهو أحد العوامل التي تُناقَش كجزء من الموافقة المستنيرة قبل المتابعة.",
  },
];

export default function VasectomyPageAr() {
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
              name: "قطع القناة المنوية بدون مشرط",
              description:
                "قطع القناة المنوية بدون مشرط — وسيلة دائمة لمنع الحمل لدى الرجال تُجرى عبر فتحة صفنية مركزية صغيرة، مع استشارة حول التعافي والمخاطر والفحوصات بعد الإجراء.",
              path: PATH,
              aboutType: "MedicalProcedure",
              // R10: aligned with every other page's convention — an
              // English schema.org taxonomy value, not visible page
              // copy (see the code comment on /ar/male-fertility for
              // the same rationale). Previously this was the only page
              // using an Arabic string here.
              aboutName: "No-Scalpel Vasectomy",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">قطع القناة المنوية بدون مشرط</p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              نهج طفيف التوغل لمنع الحمل الدائم لدى الرجال
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              يستخدم قطع القناة المنوية بدون مشرط فتحة صفنية مركزية صغيرة جدًا
              للوصول إلى الأسهر بأقل قدر من تعطيل الأنسجة، ما يوفر نهجًا فعالًا
              في العيادة الخارجية لمنع الحمل بشكل دائم.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="vasectomy" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
            <p className="mt-6 text-xs font-medium text-muted-foreground">
              {AR_IDENTITY.doctorTitle} · أبوظبي
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What is it */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="ما هو" heading="ما هو قطع القناة المنوية بدون مشرط؟" locale="ar" />
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                قطع القناة المنوية هو إجراء دائم لمنع الحمل لدى الرجال، حيث
                يُقطَع الأسهر — الأنبوب الذي ينقل الحيوانات المنوية — بحيث لا
                تعود الحيوانات المنوية إلى القذف.
              </p>
              <p>
                في تقنية عدم استخدام المشرط، بدلاً من الشقوق الجلدية التقليدية
                على كل جانب، يُصَل إلى الأسهر عبر فتحة صغيرة جدًا، عادة في
                الجلد المركزي للصفن. يمكن عادة معالجة كلا الجانبين من خلال
                هذه الفتحة الصغيرة نفسها.
              </p>
              <p className="text-foreground">
                لا يؤثر ذلك على إنتاج التستوستيرون أو الانتصاب أو الرغبة
                الجنسية أو القدرة على النشوة. يتغير حجم القذف قليلاً جدًا،
                لأن الحيوانات المنوية تمثل جزءًا صغيرًا فقط من حجم السائل
                المنوي.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How the technique differs */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="التقنية"
            heading="كيف تختلف تقنية عدم استخدام المشرط"
            description="مقارنة بين الأساليب، وليست حكمًا على قطع القناة المنوية التقليدي — كلاهما تقنيتان معتمدتان وصالحتان."
            locale="ar"
          />
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">النهج التقليدي</p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                {conventional.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">نهج عدم استخدام المشرط</p>
              <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                {noScalpel.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* The procedure */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="ما يمكن توقعه" heading="الإجراء" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {procedureSteps.map((step, index) => (
              <StaggerItem key={step}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{step}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              هذا عرض عام موجّه للمريض. تُناقَش التقنية الدقيقة المستخدمة لقطع
              وإغلاق الأسهر بشكل فردي كجزء من استشارتك، ولا تُوحَّد مسبقًا
              لكل مريض.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="مزايا محتملة"
            heading="فوائد نهج عدم استخدام المشرط"
            description="مزايا محتملة، وليست ضمانات — تختلف النتائج الفردية."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Recovery */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الرعاية بعد الإجراء" heading="التعافي" locale="ar" />
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {recoveryAdvice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يختلف التعافي فرديًا. هذا إرشاد عام، وليس بديلاً عن تعليمات
              الرعاية المحددة التي تُعطى لك أثناء إجرائك.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Not immediately sterile — the page's one distinctive dark/olive moment */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium text-accent-strong">مهم</p>
            <p className="mt-6 font-display text-display-md text-foreground">
              لست عقيمًا فورًا بعد قطع القناة المنوية.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              لا يؤدي قطع القناة المنوية إلى عقم فوري. يبقى بعض الحيوانات
              المنوية المتبقية أسفل موضع الإغلاق. يجب الاستمرار في وسيلة
              منع حمل بديلة حتى يؤكد تحليل السائل المنوي بعد الإجراء الخلو
              الكافي من الحيوانات المنوية. يُجرى الفحص عادة بعد فترة مناسبة
              بعد الإجراء، وفق بروتوكول طبيبك المعالج والمختبر.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Sexual function */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="طمأنة" heading="التأثير على الوظيفة الجنسية" locale="ar" />
          <Reveal delay={0.05}>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              لا يؤثر قطع القناة المنوية عادة على:
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
              {sexualFunction.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يبقى السائل المنوي يبدو مشابهًا إلى حد كبير بعد قطع القناة
              المنوية، لأن معظم سائل القذف يأتي من البروستاتا والحويصلات
              المنوية، وليس من الخصيتين.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Permanence / reversal */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الموافقة المستنيرة" heading="الديمومة وإعادة الوصل" locale="ar" />
          <div className="mt-10">
            <PullQuote>يجب اعتبار قطع القناة المنوية وسيلة منع حمل دائمة.</PullQuote>
          </div>
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                إجراءات إعادة الوصل مثل{" "}
                <Link
                  href="/ar/male-fertility"
                  className="text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  مفاغرة الأسهر
                </Link>{" "}
                ممكنة في حالات مختارة، لكنها أكثر تعقيدًا من الإجراء الأصلي
                وغير مضمونة لاستعادة الخصوبة — تختلف النتائج حسب المدة منذ
                قطع القناة المنوية وعوامل فردية أخرى.
              </p>
              <p>
                قد يرغب المرضى غير المتأكدين من خصوبتهم المستقبلية في مناقشة
                تجميد الحيوانات المنوية قبل المتابعة. لا يُوصى بذلك بشكل
                روتيني لكل مريض، لكن يُطرَح عند وجود صلة بالظروف الفردية.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Risks */}
      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="الموافقة المستنيرة" heading="المخاطر" locale="ar" />
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              المضاعفات الخطيرة غير شائعة، لكن لا يوجد إجراء خالٍ تمامًا من
              المخاطر. تُراجَع هذه المخاطر بشكل فردي كجزء من الموافقة
              المستنيرة قبل المتابعة.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Who is it for */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium text-accent-strong">لمن هذا الإجراء</p>
            <h2 className="mt-4 font-display text-display-md text-foreground">المرشحون المناسبون</h2>
            <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {goodCandidates.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow font-medium text-accent-strong">يستحق النقاش أولاً</p>
            <h2 className="mt-4 font-display text-display-md text-foreground">يتطلب مزيدًا من النقاش</h2>
            <ul className="mt-6 space-y-4 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {needsDiscussion.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/*
        Only 2 items, not 3: the English page's third RelatedTreatments
        item links to /insights, which has no Arabic content at all
        (individual /insights/[slug] articles are English-only) — a
        navigational choice, not a content gap. See this plan's Global
        Constraints for the explicit ruling.
      */}
      <RelatedTreatments
        locale="ar"
        items={[
          { label: "خصوبة الرجل", href: "/ar/male-fertility" },
          { label: "التستوستيرون والصحة الهرمونية للرجال", href: "/ar/mens-health/testosterone" },
        ]}
      />

      <Faq items={faqItems} locale="ar" eyebrow="الأسئلة الشائعة" heading="الأسئلة الشائعة" />

      <TreatmentCtaSection
        heading="ناقش ما إذا كان قطع القناة المنوية مناسبًا لك"
        sourcePage={PATH}
        secondary={{ label: "استكشف صحة الرجل", href: "/ar/mens-health" }}
        bookingLabel="احجز استشارتك السرية"
      />
    </>
  );
}
