import type { Metadata } from "next";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
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

const PATH = "/ar/penile-implant";

export const metadata: Metadata = buildMetadata({
  title: "جراحة زراعة دعامة القضيب في أبوظبي",
  description:
    "جراحة زراعة دعامة القضيب لعلاج ضعف الانتصاب الشديد في أبوظبي — الخيارات القابلة للنفخ والمرنة، الأهلية، المسار الجراحي، التعافي، والتوقعات الواقعية.",
  path: PATH,
});

/** Breadcrumb parent stays the English /penile-surgery route — never built in any R9 Phase B batch, out of this phase's scope entirely (not just "later batch"). Label is still Arabic. */
const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "جراحة القضيب", href: "/penile-surgery" },
  { name: "جراحة زراعة دعامة القضيب", href: PATH },
];

const prosthesisTypes = [
  {
    name: "دعامة قضيبية قابلة للنفخ",
    points: [
      "أجهزة من قطعتين أو ثلاث قطع، مصممة لمحاكاة الصلابة والارتخاء الطبيعيين عن قرب",
      "تتضمن آلية مضخة داخلية، تُوضع غالبًا في كيس الصفن",
      "الخيار الأكثر اختيارًا بين المرشحين",
    ],
  },
  {
    name: "دعامة قضيبية مرنة",
    points: [
      "تصميم ميكانيكي أبسط، دون مضخة داخلية",
      "قضبان شبه صلبة يمكن وضعها يدويًا",
      "قد يُنظر فيها عند تفضيل نهج جراحي أبسط",
    ],
  },
];

const pathway = [
  { phase: "التقييم", description: "التأكد من أن ضعف الانتصاب شديد أو مقاوم للعلاج، ومراجعة العلاجات السابقة المجربة، وتقييم الصحة العامة والتوقعات قبل النظر في الجراحة." },
  { phase: "الجراحة", description: "تُجرى تحت التخدير المناسب. يُوضع الجهاز المختار — القابل للنفخ أو المرن — داخل الحجرات الكهفية للقضيب." },
  { phase: "التعافي", description: "تلي ذلك فترة تعافٍ منظمة، مع استئناف تدريجي للنشاط وإدخال استخدام الجهاز تحت إشراف طبي، وتُناقش الجداول الزمنية بشكل فردي أثناء الاستشارة." },
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
  { title: "السبب والشدة", description: "التأكد من أن ضعف الانتصاب شديد أو مقاوم للعلاج فعليًا — لا افتراض ذلك من الأعراض وحدها." },
  { title: "العلاجات السابقة", description: "مراجعة ما جُرِّب بالفعل — الأدوية الفموية، الأجهزة الفراغية، العلاج بالحقن — ولماذا نجح أو لم ينجح." },
  { title: "السياق السريري الأوسع", description: "تُقيَّم العوامل الوعائية والهرمونية والتشريحية التي قد تسهم، ولا تُغفل لصالح حل جراحي سريع." },
  { title: "توقعات واقعية", description: "ما يمكن للدعامة أن تستعيده وما لا يمكنها ذلك — من حيث الصلابة والإحساس والنشوة والطول المتصور — يُناقش قبل أي قرار جراحي، لا بعده." },
  { title: "اختيار الجهاز", description: "قابل للنفخ أو مرن، يُختار وفقًا للتشريح والصحة والتفضيل الشخصي، ولا يُطرح كتوصية افتراضية واحدة." },
];

const faqItems = [
  {
    question: "هل دعامة القضيب دائمة؟",
    answer: "الجهاز مصمم للاستخدام طويل الأمد، رغم أن الأجزاء الميكانيكية قد تتآكل مع الوقت وقد يحتاج بعض المرضى في النهاية إلى جراحة تصحيحية. لا تُقدَّم كحل شامل، ولا يُنظر فيها إلا بعد استكشاف علاجات أخرى.",
  },
  {
    question: "ما الفرق بين الدعامات القضيبية القابلة للنفخ والمرنة؟",
    answer: "تستخدم الأجهزة القابلة للنفخ آلية مضخة لمحاكاة الصلابة والارتخاء الطبيعيين. أما الأجهزة المرنة فهي قضبان شبه صلبة أبسط تُوضع يدويًا. يعتمد اختيار ما يُناقش على تشريحك وصحتك وتفضيلك.",
    readMoreHref: "/insights/inflatable-vs-malleable-penile-implant",
    readMoreLabel: "اقرأ المزيد: Inflatable vs Malleable Penile Implant (مقال بالإنجليزية)",
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
    answer: "نعم — يُعد ضعف الانتصاب الناتج عن استئصال البروستاتا سببًا معترفًا به وراسخًا يدفع المرضى للنظر في دعامة القضيب، خاصة بمجرد أن لا تحقق العلاجات الأخرى نتائج موثوقة. تنطبق مبادئ التقييم نفسها: التأكد من الشدة، ومراجعة ما جُرِّب بالفعل، ومناقشة التوقعات الواقعية قبل المضي قدمًا.",
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
            <PhotoFrame slot="implantPhysician" priority />
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
              {doctor.medicalTrainer && (
                <p>
                  <strong>مدرّب طبي</strong> · {doctor.medicalTrainer.program}
                </p>
              )}
            </div>
          </div>
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
                <h3 className="font-display text-lg text-foreground">{item.title}</h3>
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

      {/* Inflatable vs malleable comparison */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="خيارات الجهاز" heading="القابل للنفخ مقابل المرن" locale="ar" />
          <Reveal delay={0.05}>
            <ImplantDeviceDiagram
              className="mt-10 h-24 w-full max-w-xl text-muted-foreground"
              title="مخطط تخطيطي لدعامة قضيبية قابلة للنفخ من ثلاث قطع: أسطوانة ومضخة وخزان"
            />
          </Reveal>
          <MaskedReveal className="mt-10 max-w-xl">
            <PhotoFrame slot="implantDevice" landscape />
          </MaskedReveal>
          <div className="mt-14 grid gap-x-16 gap-y-14 border-t border-border pt-14 md:grid-cols-2">
            {prosthesisTypes.map((type) => (
              <Reveal key={type.name} className="card-hover border border-border p-6">
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

      {/* Pathway — dark section */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="المسار الجراحي" heading="التقييم، الجراحة، التعافي" locale="ar" />
          <MaskedReveal className="mt-10 max-w-2xl">
            <PhotoFrame slot="implantSurgical" landscape tone="dark" />
          </MaskedReveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 md:grid-cols-3">
            {pathway.map((step, index) => (
              <StaggerItem key={step.phase} className="card-hover border-t border-border pt-6 md:border-t-0 md:pt-0 md:[&:not(:first-child)]:border-r md:[&:not(:first-child)]:border-border md:[&:not(:first-child)]:pr-8">
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
          <SectionHeading eyebrow="بعد الزراعة" heading="الوظيفة الجنسية بعد الجراحة" size="md" locale="ar" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
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
