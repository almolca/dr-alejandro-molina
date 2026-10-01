import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import { CandidateCheck } from "@/components/editorial/CandidateCheck";
import { ConnectedPathway } from "@/components/editorial/ConnectedPathway";
import { RecoveryTimeline } from "@/components/editorial/RecoveryTimeline";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import {
  Activity, Pill, Syringe, AlertCircle, Scissors, Bandage, CalendarCheck,
  Fingerprint, Ruler, Droplet, EyeOff, Layers, ListChecks, Waves, Hand,
  HeartPulse, History, Scan, Target,
} from "lucide-react";
import { ImplantDeviceDiagram, PumpIcon, RigidityIcon, CurvatureAssessmentDiagram } from "@/components/illustrations";
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

const PATH = "/ar/penile-implant";

export const metadata: Metadata = buildMetadata({
  title: "جراحة زراعة دعامة القضيب في أبوظبي",
  description:
    "جراحة زراعة دعامة القضيب لعلاج ضعف الانتصاب الشديد في أبوظبي — الخيارات القابلة للنفخ والمرنة، الأهلية، المسار الجراحي، التعافي، والتوقعات الواقعية.",
  path: PATH,
});

/**
 * R10 Phase B: the middle crumb previously pointed to the English-only
 * "/penile-surgery" (never built in Arabic — see
 * docs/r10-arabic-seo-research.md §5.3), dropping an Arabic reader into
 * English mid-navigation. Reduced to a 2-level trail until a genuine
 * "/ar/penile-surgery" page exists to restore the fuller hierarchy —
 * this also matches the route's own flat (non-nested) URL shape in
 * routes.ts.
 */
const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة زراعة دعامة القضيب", href: PATH },
];

const inflatableFeatures = [
  { title: "المكوّنات", description: "قطعتان أو ثلاث: أسطوانات تُوضع داخل الأجسام الكهفية، وخزان للسائل، ومضخة — تُوضع غالبًا في كيس الصفن.", Icon: Layers },
  { title: "النفخ", description: "الضغط على المضخة ينقل السائل من الخزان إلى الأسطوانتين، مما يُنتج الصلابة عند الرغبة.", Icon: PumpIcon },
  { title: "إفراغ الهواء", description: "آلية تحرير تُعيد السائل إلى الخزان، مما يسمح بالعودة إلى حالة الارتخاء.", Icon: Waves },
  { title: "مظهر حالة الارتخاء", description: "عند الإفراغ، يكون مظهر الارتخاء قريبًا من الطبيعي لدى معظم الرجال، ولا يكون الجهاز ملحوظًا عادةً تحت الملابس.", Icon: EyeOff },
  { title: "تشغيل المريض", description: "يُشغِّل المريض المضخة بنفسه، محققًا الصلابة وإرخاءها عند رغبته.", Icon: Hand },
  { title: "لماذا هو الخيار الأكثر اختيارًا", description: "آلية النفخ والإفراغ فيه تحاكي عن قرب الدورة الطبيعية للصلابة والارتخاء.", Icon: HeartPulse },
];

const howItWorksStages = [
  { Icon: Waves, title: "الارتخاء (الحالة الافتراضية)", description: "لا يوجد سائل داخل الأسطوانتين." },
  { Icon: PumpIcon, title: "تفعيل المضخة", description: "يضغط المريض على المضخة، فينتقل السائل من الخزان." },
  { Icon: RigidityIcon, title: "الصلابة للعلاقة الحميمة", description: "يملأ السائل الأسطوانتين، فينتج الصلابة عند الطلب." },
];

const pathway = [
  { phase: "التقييم", description: "التأكد من أن ضعف الانتصاب شديد أو مقاوم للعلاج، ومراجعة العلاجات السابقة المجربة، وتقييم الصحة العامة والتوقعات قبل النظر في الجراحة.", Icon: ListChecks },
  { phase: "الجراحة", description: "تُجرى تحت التخدير المناسب. يُوضع الجهاز المختار — القابل للنفخ أو المرن — داخل الحجرات الكهفية للقضيب.", Icon: Scissors },
  { phase: "التعافي", description: "تلي ذلك فترة تعافٍ منظمة، مع استئناف تدريجي للنشاط وإدخال استخدام الجهاز تحت إشراف طبي، وتُناقش الجداول الزمنية بشكل فردي أثناء الاستشارة.", Icon: Bandage },
];

const risks = [
  "العدوى",
  "التآكل الميكانيكي أو عطل الجهاز مع مرور الوقت، وقد يتطلب ذلك في بعض الحالات جراحة تصحيحية",
  "تغيرات في الإحساس",
  "النزيف أو الكدمات",
  "المخاطر المرتبطة بالتخدير والجراحة بشكل عام",
];

const notAppropriate = [
  "عدوى نشطة وقت التقييم",
  "أسباب قابلة للعكس أو غير مُستكشفة بالكامل لضعف الانتصاب",
  "توقعات لا تتوافق مع ما صُممت الجراحة لتحقيقه",
  "عوامل تشريحية أو طبية معينة تُكتشف أثناء التقييم",
];

const candidateGoodIf = [
  "ضعف الانتصاب شديد أو مقاوم للعلاج",
  "لم تحقق الأدوية الفموية أو الأجهزة الفراغية أو العلاج بالحقن نتائج موثوقة",
  "تم تقييم السبب الكامن بشكل مناسب بالفعل",
];

const pathwayPrinciples = [
  { title: "السبب والشدة", description: "التأكد من أن ضعف الانتصاب شديد أو مقاوم للعلاج فعليًا — لا افتراض ذلك من الأعراض وحدها.", Icon: AlertCircle },
  { title: "العلاجات السابقة", description: "مراجعة ما جُرِّب بالفعل — الأدوية الفموية، الأجهزة الفراغية، العلاج بالحقن — ولماذا نجح أو لم ينجح.", Icon: History },
  { title: "السياق السريري الأوسع", description: "تُقيَّم العوامل الوعائية والهرمونية والتشريحية التي قد تسهم، ولا تُغفل لصالح حل جراحي سريع.", Icon: Scan },
  { title: "توقعات واقعية", description: "ما يمكن للدعامة أن تستعيده وما لا يمكنها ذلك — من حيث الصلابة والإحساس والنشوة والطول المتصور — يُناقش قبل أي قرار جراحي، لا بعده.", Icon: Target },
  { title: "اختيار الجهاز", description: "قابل للنفخ أو مرن، يُختار وفقًا للتشريح والصحة والتفضيل الشخصي، ولا يُطرح كتوصية افتراضية واحدة.", Icon: PumpIcon },
];

const faqItems = [
  {
    question: "هل دعامة القضيب دائمة؟",
    answer: "الجهاز مصمم للاستخدام طويل الأمد، رغم أن الأجزاء الميكانيكية قد تتآكل مع الوقت وقد يحتاج بعض المرضى في النهاية إلى جراحة تصحيحية. لا تُقدَّم كحل شامل، ولا يُنظر فيها إلا بعد استكشاف علاجات أخرى.",
  },
  {
    question: "ما الفرق بين الدعامات القضيبية القابلة للنفخ والمرنة؟",
    answer: "تستخدم الأجهزة القابلة للنفخ آلية مضخة لمحاكاة الصلابة والارتخاء الطبيعيين. أما الأجهزة المرنة فهي قضبان شبه صلبة أبسط تُوضع يدويًا. يعتمد اختيار ما يُناقش على تشريحك وصحتك وتفضيلك.",
    readMoreHref: "/ar/insights/inflatable-vs-malleable-implant-ar",
    readMoreLabel: "اقرأ المزيد: الفرق بين الدعامة القابلة للنفخ والدعامة المرنة",
  },
  {
    question: "هل سيكون الإحساس طبيعيًا بعد الجراحة؟",
    answer: "صُممت الدعامة لدعم الصلابة اللازمة للإيلاج. لا تهدف إلى تغيير الإحساس، الذي تحكمه عمومًا آليات منفصلة — ويُناقش هذا بشكل فردي أثناء التقييم.",
    readMoreHref: "/insights/orgasm-ejaculation-after-penile-implant",
    readMoreLabel: "اقرأ المزيد: Can You Orgasm and Ejaculate With a Penile Implant? (مقال بالإنجليزية)",
  },
  {
    question: "كم تستغرق فترة التعافي؟",
    answer: "يمر التعافي عمومًا بثلاث مراحل: فترة شفاء أولية مع نشاط محدود، وعودة تدريجية إلى النشاط اليومي الطبيعي، وأخيرًا إدخال موجه لاستخدام الجهاز بمجرد كفاية الشفاء. يعتمد الجدول الزمني المحدد ضمن هذا الإطار على شفائك الفردي وخطتك الجراحية، ويُحدَّد أثناء الاستشارة بدلاً من ذكر رقم واحد هنا.",
    readMoreHref: "/insights/penile-implant-recovery-what-to-expect",
    readMoreLabel: "اقرأ المزيد: Penile Implant Recovery, What to Expect (مقال بالإنجليزية)",
  },
  {
    question: "هل أنا مرشح لدعامة القضيب؟",
    answer: "تعتمد الأهلية على ثلاثة أمور: ما إذا كان ضعف الانتصاب مؤكدًا كشديد أو مقاوم للعلاج، وما إذا جُرِّبت علاجات أخرى دون نتائج موثوقة، وصحتك العامة وتوقعاتك. تُقيَّم هذه الأمور الثلاثة معًا أثناء الاستشارة — انظر فحص الأهلية أعلاه لمعرفة كيفية موازنتها عادة.",
    readMoreHref: "/ar/insights/when-penile-implant-is-considered",
    readMoreLabel: "اقرأ المزيد: متى تكون دعامة القضيب الخيار المناسب؟",
  },
  {
    question: "ما هي بدائل دعامة القضيب؟",
    answer: "تقع دعامة القضيب في نهاية سلّم علاج ضعف الانتصاب، لا في بدايته. تشمل البدائل المُستكشفة أولاً عادةً إدارة نمط الحياة وعوامل الخطر، ومثبطات PDE5، والعلاج الهرموني عند الحاجة، والأجهزة الفراغية، والعلاج بالموجات الصادمة، والعلاج بالحقن داخل الكهفي — ويُنظر في الدعامة بمجرد أن تتوقف هذه الخيارات عن تحقيق نتائج موثوقة.",
    readMoreHref: "/ar/erectile-dysfunction",
    readMoreLabel: "اطّلع على سلّم علاج ضعف الانتصاب كاملاً",
  },
  {
    question: "كيف يعمل الجهاز فعليًا يوميًا؟",
    answer: "يُشغَّل الجهاز القابل للنفخ بآلية مضخة، تُوضع غالبًا في كيس الصفن، يستخدمها المريض بنفسه لتحقيق الصلابة وإرخائها عند الرغبة. أما الجهاز المرن فلا يحتوي على مضخة — يُوضع ببساطة يدويًا في وضعية صلبة أو أقل صلابة. أي آلية تناسبك أكثر هي أحد العوامل التي تُناقش عند الاختيار بين أنواع الأجهزة.",
  },
  {
    question: "هل سيبدو قضيبي أقصر بعد جراحة الدعامة؟",
    answer: "يلاحظ بعض الرجال بالفعل تراجعًا في الطول مقارنة بالانتصابات التي كانوا يحصلون عليها قبل تطور ضعف الانتصاب. يرتبط هذا عمومًا بتغيرات في الأنسجة ناتجة عن الحالة الكامنة نفسها — خاصة إذا كان ضعف الانتصاب طويل الأمد — لا شيئًا تزيله جراحة الدعامة. وهو جزء من نقاش التوقعات الواقعية أثناء التقييم، وليس مفاجأة تُترك لما بعد الجراحة.",
  },
  {
    question: "هل يمكنني إجراء جراحة دعامة قضيبية بعد جراحة البروستاتا؟",
    answer: "نعم — يُعد ضعف الانتصاب الناتج عن استئصال البروستاتا سببًا معترفًا به وراسخًا يدفع المرضى للنظر في دعامة القضيب، خاصة بمجرد أن لا تحقق العلاجات الأخرى نتائج موثوقة.",
    readMoreHref: "/ar/insights/penile-implant-after-radical-prostatectomy-ar",
    readMoreLabel: "اقرأ المزيد: دعامة القضيب بعد استئصال البروستاتا الجذري",
  },
  {
    question: "هل يمكن لدعامات القضيب علاج مرض بيروني؟",
    answer: "يمكن للدعامة معالجة العنصر الانتصابي عندما يتزامن مرض بيروني مع ضعف انتصاب لم يستجب بشكل موثوق لعلاجات أخرى، وفي بعض الحالات يمكن للتقنية الجراحية المستخدمة عند وضع الدعامة أن تساعد في معالجة الانحناء أيضًا. ليس هذا هو النهج الافتراضي لمرض بيروني وحده، وتُقيَّم الملاءمة بشكل فردي.",
    readMoreHref: "/ar/peyronies-disease",
    readMoreLabel: "استكشف مرض بيروني",
  },
  {
    question: "ما هو خطر العدوى؟",
    answer: "العدوى مضاعفة خطيرة لكنها غير شائعة لجراحة الدعامة. الأجهزة الحديثة والبروتوكولات الجراحية الصارمة مصممة خصيصًا لتقليل هذا الخطر. يمكن لمرض السكري وبعض العوامل الصحية الأخرى أن تزيد من الخطر الفردي، وهو أمر يُناقش ويُدار كجزء من تقييمك قبل الجراحة.",
  },
];

export default function PenileImplantPageAr() {
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
              name: "جراحة زراعة دعامة القضيب",
              description: "جراحة زراعة دعامة القضيب لعلاج ضعف الانتصاب الشديد أو المقاوم للعلاج — الخيارات القابلة للنفخ والمرنة، الأهلية، المسار الجراحي، التعافي والتوقعات الواقعية.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Implant Surgery",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                جراحة القضيب
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                جراحة زراعة دعامة القضيب
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                حل جراحي لضعف الانتصاب الشديد عندما لا تعود العلاجات
                الأخرى تحقق نتائج موثوقة.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_implant" size="lg">
                  احجز استشارتك السرية
                </BookingCta>
                <a
                  href="#candidacy"
                  className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
                >
                  من قد يكون مرشحًا
                </a>
              </div>
            </Reveal>
          </div>

          <MaskedReveal className="w-full self-start">
            <PhotoFrame slot="implantPhysician" priority alt="الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة" />
          </MaskedReveal>
        </Container>
      </section>

      {/* Physician authority */}
      <section className="border-t border-border bg-background py-14">
        <Container>
          <div className={editorialStyles.authority}>
            <p className="mb-6 text-xs font-medium uppercase">{AR_IDENTITY.doctorTitle}</p>
            <dl className={editorialStyles.metrics}>
              {doctor.yearsOfExperience !== undefined && (
                <AuthorityMetric value={`+${doctor.yearsOfExperience}`} label="سنوات في طب المسالك البولية" />
              )}
              <AuthorityMetric value="FEBU" label="زميل المجلس الأوروبي لطب المسالك البولية" />
              <AuthorityMetric value="استشاري" label="أمراض المسالك البولية والذكورة" />
            </dl>
            <div className={editorialStyles.rail}>
              <p>جراحة متقدمة بالمنظار · خبرة في المستشفيات الثالثية</p>
            </div>
          </div>
        </Container>
      </section>

      {/* متى يُنظر في دعامة القضيب — ملخص مرئي لسلّم علاج ضعف الانتصاب؛ بطاقات "نهجنا" أدناه هي الطبقة التفصيلية */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="أين يقع هذا الخيار"
            heading="متى يُنظر في دعامة القضيب؟"
            description="يعكس هذا الطريقة العامة التي يُتعامل بها عادةً مع ضعف الانتصاب، لا تسلسلاً صارمًا يجب على كل مريض اتّباعه — قد تُتخطى بعض الخطوات أو يُعاد ترتيبها بحسب الظروف الفردية."
            locale="ar"
          />
          <ConnectedPathway
            locale="ar"
            nodes={[
              { Icon: Activity, title: "ضعف الانتصاب", description: "يُؤكَّد ويُقيَّم لتحديد السبب الكامن." },
              { Icon: Pill, title: "الأدوية الفموية", description: "عادةً ما تكون مثبطات PDE5 هي العلاج الأول." },
              { Icon: Syringe, title: "خيارات أخرى غير جراحية", description: "الأجهزة الفراغية، الموجات الصادمة، أو الحقن." },
              { Icon: AlertCircle, title: "ضعف انتصاب مستمر", description: "يُنظر فيه عندما لا تحقق الخيارات أعلاه نتائج موثوقة." },
              { Icon: PumpIcon, title: "تقييم الدعامة", description: "تُناقش الأهلية ونوع الجهاز بشكل فردي." },
            ]}
          />
        </Container>
      </section>

      {/* Our approach */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="نهجنا"
            heading="جراحة زراعة دعامة القضيب نهاية مسار تقييم — لا بدايته"
            description="قرار دعامة القضيب قرار جراحي، والقرارات الجراحية تستحق أكثر من محادثة واحدة عن جهاز. قبل مناقشتها كخيار واقعي، يشمل التقييم:"
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pathwayPrinciples.map((item) => (
              <StaggerItem key={item.title} className="card-hover border-t border-border pt-6">
                <item.Icon aria-hidden strokeWidth={1.25} className="h-6 w-6 text-accent-strong" />
                <h3 className="mt-3 font-display text-lg text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              هذا ما يميز مسار ضعف انتصاب متخصصًا عن مزود دعامات عام —
              فالجهاز هو الخطوة الأخيرة من التقييم، لا المحادثة الأولى.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What is it / candidacy */}
      <section id="candidacy" className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="ما هي دعامة القضيب؟"
            heading="جهاز يُوضع داخل القضيب لاستعادة الصلابة"
            size="md"
            description="دعامة القضيب جهاز يُزرع جراحيًا، يُوضع داخل الحجرات الكهفية للقضيب، ومصمم للسماح للرجل بتحقيق انتصاب صلب عند الرغبة."
            locale="ar"
          />
          <div className="mt-4">
            <p className="text-sm font-medium uppercase text-muted-foreground">
              الأهلية — تُراجَع بشكل فردي، ولا تُفترض أبدًا
            </p>
            <CandidateCheck
              goodHeading="غالبًا ما يُنظر فيها بمجرد"
              goodIf={candidateGoodIf}
              notHeading="تُعالَج أو يُعاد تقييمها أولاً"
              notIf={notAppropriate}
            />
          </div>
        </Container>
      </section>

      {/* التركيز الأساسي: الدعامة القابلة للنفخ — الخيار الأكثر اختيارًا. تأتي المرنة كبطاقة ثانوية أصغر، بوزن بصري أقل عمدًا. */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="الخيار الأساسي" heading="الدعامة القضيبية القابلة للنفخ" description="يختار معظم المرضى الذين يخضعون لجراحة الدعامة جهازًا قابلاً للنفخ — وهو الخيار المُتناوَل بعمق أكبر هنا." locale="ar" />
          <Reveal delay={0.05}>
            <ImplantDeviceDiagram
              className="mt-10 h-24 w-full max-w-xl text-muted-foreground"
              title="مخطط تخطيطي لدعامة قضيبية قابلة للنفخ من ثلاث قطع: أسطوانة ومضخة وخزان"
            />
            <ul className="mt-4 flex max-w-xl flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase text-muted-foreground">
              <li>الأسطوانات</li>
              <li>المضخة</li>
              <li>الخزان</li>
            </ul>
          </Reveal>
          <MaskedReveal className="mt-10 max-w-xl">
            <PhotoFrame slot="implantDevice" landscape alt="مراجعة خيارات علاج دعامة القضيب" />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {inflatableFeatures.map((feature) => (
              <StaggerItem key={feature.title} className="border-t border-border pt-6">
                <feature.Icon aria-hidden strokeWidth={1.25} className="h-6 w-6 text-accent-strong" />
                <h3 className="mt-3 font-display text-lg text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* كيف تعمل — مخطط من ثلاث مراحل، بسيط عمدًا لا تصويري */}
          <div className="mt-16 border-t border-border pt-10">
            <p className="text-xs font-medium uppercase text-muted-foreground">كيف تعمل</p>
            <ConnectedPathway locale="ar" nodes={howItWorksStages} />
          </div>

          {/* المرنة — بطاقة ثانوية مدمجة، لا منافسة بصرية للخيار الأساسي */}
          <div className="mt-16 max-w-xl border-t border-border pt-10">
            <p className="text-xs font-medium uppercase text-muted-foreground">خيار ثانوي</p>
            <h3 className="mt-3 font-display text-xl text-foreground">الدعامة القضيبية المرنة</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              جهاز أبسط وشبه صلب دون مضخة — تُوضع القضبان يدويًا. لا تُعد
              أقل شأنًا أو قديمة: تبقى خيارًا مفيدًا في ظروف مختارة، بما في
              ذلك عندما تجعل البساطة، أو القدرة اليدوية، أو التشريح، أو
              جراحة سابقة، جهازًا أبسط ميكانيكيًا هو الأنسب. يُناقَش الجهاز
              المناسب لك بشكل فردي، لا افتراضًا مسبقًا.
            </p>
          </div>
        </Container>
      </section>

      {/* Pathway — dark section */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="المسار الجراحي" heading="التقييم، الجراحة، التعافي" locale="ar" />
          <MaskedReveal className="mt-10 max-w-2xl">
            <PhotoFrame slot="implantSurgical" landscape tone="dark" alt="الدكتور أليخاندرو مولينا في بيئة جراحية" />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathway.map((step, index) => (
              <StaggerItem key={step.phase} className="card-hover border-t border-border pt-6 md:border-t-0 md:pt-0 md:[&:not(:first-child)]:border-r md:[&:not(:first-child)]:border-border md:[&:not(:first-child)]:pr-8">
                <div className="flex items-center gap-3">
                  <step.Icon aria-hidden strokeWidth={1.25} className="h-6 w-6 text-accent-strong" />
                  <span className="font-display text-sm text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
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
          <SectionHeading eyebrow="بعد الزراعة" heading="الوظيفة الجنسية بعد الجراحة" size="md" locale="ar" />
          <div className="mt-10">
            <CandidateCheck
              goodHeading="ما الذي تغيّره"
              goodIf={[
                { Icon: RigidityIcon, text: "توفر صلابة ميكانيكية مناسبة للعلاقة الحميمة" },
                { Icon: EyeOff, text: "غير ملحوظة عادةً تحت الملابس بعد الإفراغ" },
              ]}
              notHeading="ما لا تغيّره"
              notIf={[
                { Icon: Fingerprint, text: "الإحساس — يُحافَظ عليه عمومًا إذا كان موجودًا مسبقًا، لا يغيّره الجهاز تلقائيًا" },
                { Icon: HeartPulse, text: "النشوة — تعتمد على المسارات العصبية والهرمونية نفسها الموجودة قبل الجراحة" },
                { Icon: Ruler, text: "طول القضيب — لا يزيد بطبيعته" },
                { Icon: Droplet, text: "القذف — يعتمد على حالتك الأساسية المتعلقة بالبروستاتا والإنجاب" },
              ]}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
              صُممت دعامة القضيب للسماح للرجل بتحقيق انتصاب صلب عند
              الرغبة. لا تغيّر الإحساس أو النشوة أو القذف، التي تحكمها
              آليات منفصلة. وكما هو الحال مع أي جراحة، تختلف النتائج
              الفردية، وتُناقش التوقعات بالتفصيل أثناء التقييم — والهدف
              هو فهم واقعي لما يمكن للجهاز فعله وما لا يمكنه قبل المضي
              قدمًا.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              يوميًا، يُفعَّل الجهاز القابل للنفخ بآلية مضخة، تُوضع غالبًا
              في كيس الصفن، يُشغّلها الرجل بنفسه عندما يريد الصلابة؛ أما
              الجهاز المرن فيُوضع ببساطة يدويًا. يلاحظ بعض الرجال
              أيضًا تراجعًا في الطول مقارنة بانتصاباتهم قبل تطور ضعف
              الانتصاب — ويرتبط هذا عمومًا بالحالة الكامنة نفسها، بما في
              ذلك تغيرات الأنسجة التي تحدث مع ضعف الانتصاب طويل الأمد
              غير المعالج، لا شيئًا تزيله جراحة الدعامة. هذا جزء من نقاش
              التوقعات الواقعية أثناء التقييم، لا مفاجأة تُترك لما بعد
              الجراحة.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          الهدف فهم واقعي لما يمكن للجهاز فعله وما لا يمكنه — قبل المضي
          قدمًا، لا بعده.
        </PullQuote>
      </Container>

      {/* استئصال البروستاتا الجذري ومرض بيروني — حالتان سريريتان محددتان تتقاطعان فيهما الدعامة مع تشخيص آخر مشمول في مكان آخر من الموقع */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="مسار سريري محدد" heading="دعامة القضيب بعد استئصال البروستاتا الجذري" locale="ar" />
          <ConnectedPathway
            locale="ar"
            nodes={[
              { Icon: Scissors, title: "استئصال البروستاتا الجذري", description: "الحفاظ على الأعصاب حيثما كان مناسبًا سرطانيًا." },
              { Icon: Bandage, title: "التعافي / إعادة التأهيل", description: "مثبطات PDE5، الأجهزة الفراغية، و/أو الحقن." },
              { Icon: AlertCircle, title: "ضعف انتصاب مستمر", description: "عندما لا تتعافى الوظيفة بشكل كافٍ بمرور الوقت." },
              { Icon: PumpIcon, title: "تقييم الدعامة", description: "يُناقش لدى مرضى مختارين، بشكل فردي." },
            ]}
          />
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              يمكن أن يستمر ضعف الانتصاب بعد استئصال البروستاتا الجذري،
              حتى عندما تسير الجراحة بشكل جيد ويُجرى الحفاظ على الأعصاب
              حيثما كان ذلك مناسبًا سرطانيًا. يقلل الحفاظ على الأعصاب من
              خطر ضعف الانتصاب الدائم، لكنه لا يضمن التعافي — إذ تؤثر
              الوظيفة الجنسية الأساسية قبل الجراحة والعمر وشفاء الأعصاب
              الفردي جميعها في النتيجة.
            </p>
            <p>
              عادةً ما تبدأ إعادة التأهيل بعد استئصال البروستاتا بسلّم
              العلاج نفسه المستخدم لضعف الانتصاب لأي سبب — مثبطات PDE5،
              والأجهزة الفراغية، والعلاج بالحقن داخل الكهفي — وغالبًا ما
              تُقدَّم مبكرًا لدعم التعافي بينما لا تزال وظيفة الأعصاب في
              طور الاستعادة.
            </p>
            <p>
              وحيثما لا تتعافى الوظيفة الجنسية بشكل كافٍ خلال هذه الفترة،
              ولا تحقق العلاجات الأخرى نتائج موثوقة، تكون دعامة القضيب
              أحد الخيارات التي تُناقش لدى مرضى مختارين — تُقيَّم وفق
              المبادئ نفسها المطبقة على أي مرشح، مُطبَّقة على حالتك
              الخاصة.
            </p>
            <p className="flex flex-wrap gap-x-2">
              <Link href="/ar/urologic-surgery/laparoscopic-radical-prostatectomy" className="text-foreground underline decoration-accent-strong underline-offset-4">
                تعرّف على استئصال البروستاتا الجذري بالمنظار
              </Link>
              <span aria-hidden>·</span>
              <Link href="/ar/insights/penile-implant-after-radical-prostatectomy-ar" className="text-foreground underline decoration-accent-strong underline-offset-4">
                اقرأ: دعامة القضيب بعد استئصال البروستاتا الجذري
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <section className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="مسار سريري محدد" heading="مرض بيروني ودعامة القضيب" locale="ar" />
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <CurvatureAssessmentDiagram className="h-16 w-16 text-accent-strong" />
              <p className="text-sm font-medium text-foreground">تشوّه بيروني</p>
            </div>
            <span aria-hidden className="font-display text-2xl text-muted-foreground">+</span>
            <div className="flex flex-col items-center gap-2 text-center">
              <Activity aria-hidden strokeWidth={1.25} className="h-12 w-12 text-accent-strong" />
              <p className="text-sm font-medium text-foreground">ضعف انتصاب شديد</p>
            </div>
            <span aria-hidden className="font-display text-2xl text-muted-foreground rtl:rotate-180">→</span>
            <div className="flex flex-col items-center gap-2 text-center">
              <PumpIcon className="h-12 w-12 text-accent-strong" />
              <p className="text-sm font-medium text-foreground">تقييم الدعامة<br />لدى حالات مختارة</p>
            </div>
          </div>
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              يمكن أن يتزامن مرض بيروني الشديد — حيث يؤثر الانحناء أو
              التشوه أو القِصَر بشكل كبير على الوظيفة الجنسية — مع ضعف
              انتصاب لا يستجيب بشكل موثوق لعلاجات أخرى. في مرضى مختارين،
              يمكن لدعامة القضيب معالجة العنصر الانتصابي، وحسب التقنية
              الجراحية المستخدمة، بعض الانحناء، في إجراء واحد. يُقيَّم هذا
              بشكل فردي وليس النهج الافتراضي لمرض بيروني وحده.
            </p>
            <Link href="/ar/peyronies-disease" className="inline-flex text-foreground underline decoration-accent-strong underline-offset-4">
              استكشف مرض بيروني
            </Link>
          </div>
        </Container>
      </section>

      {/* التعافي على مراحل — نفس المراحل الثلاث المذكورة بالفعل في الأسئلة الشائعة أدناه، دون أرقام أيام/أسابيع مخترعة */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading eyebrow="ما يمكن توقعه" heading="التعافي، مرحلة بمرحلة" locale="ar" />
          <RecoveryTimeline
            locale="ar"
            phases={[
              { Icon: Bandage, label: "الشفاء الأولي", description: "نشاط محدود أثناء الشفاء المبكر بعد الجراحة." },
              { Icon: Activity, label: "العودة التدريجية للنشاط", description: "يُستأنف النشاط اليومي الطبيعي تدريجيًا، وفقًا للإرشادات الخاصة بجراحتك." },
              { Icon: PumpIcon, label: "إدخال استخدام الجهاز", description: "بمجرد كفاية الشفاء، يُقدَّم استخدام الجهاز تحت إشراف طبي." },
              { Icon: CalendarCheck, label: "المتابعة", description: "تُراجَع التقدم وأي مخاوف كجزء من خطة تعافيك الفردية." },
            ]}
          />
        </Container>
      </section>

      {/* Risks */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-2xl">
          <p className="text-eyebrow font-medium uppercase text-accent-strong">
            توقعات واقعية
          </p>
          <h2 className="mt-4 font-display text-display-md text-foreground">
            المخاطر والمضاعفات
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
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "العلاج بالموجات الصادمة", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "دوبلر القضيب", href: "/ar/erectile-dysfunction/penile-doppler" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش الأهلية والخطوات التالية"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
