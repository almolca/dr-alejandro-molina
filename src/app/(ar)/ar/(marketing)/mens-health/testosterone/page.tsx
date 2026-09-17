// src/app/(ar)/ar/(marketing)/mens-health/testosterone/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { AR_IDENTITY } from "@/lib/i18n/ar-identity";
import { HormoneBalanceDiagram } from "@/components/illustrations/HormoneBalanceDiagram";
import { EditorialFrame } from "@/components/editorial/EditorialFrame";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { AuthorityMetric } from "@/components/editorial/PhysicianAuthority";
import editorialStyles from "@/components/editorial/Editorial.module.css";
import { doctor } from "@/config/doctor";
import { publications } from "@/config/reputation";
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

const PATH = "/ar/mens-health/testosterone";

export const metadata: Metadata = buildMetadata({
  title: "التستوستيرون والصحة الهرمونية للرجال في أبوظبي",
  description:
    "تقييم التستوستيرون والصحة الهرمونية للرجال في أبوظبي — الأعراض والتشخيص والفحص الكيميائي الحيوي الكامل، ومتى يكون العلاج مناسبًا سريريًا.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "صحة الرجل", href: "/ar/mens-health" },
  { name: "التستوستيرون والصحة الهرمونية للرجال", href: PATH },
];

/** Topic-label translations for the Men's Health Spain articles — external Spanish-language articles; these are topic descriptions, matching the exact wording used on /ar/about for consistency, not translated titles of an Arabic destination. */
const PUBLICATION_LABELS_AR: Record<string, string> = {
  "Testosterone and the body's daily rhythm": "التستوستيرون والإيقاع اليومي للجسم",
  "Testosterone, explained by an andrologist": "التستوستيرون بشرح طبيب الذكورة",
  "What testosterone actually does": "ما الذي يفعله التستوستيرون فعليًا",
};

const panel = [
  { label: "التستوستيرون الكلي والحر", description: "الهرمون الأساسي الذي يُقاس، سواء المرتبط أو الحر." },
  { label: "SHBG", description: "الغلوبيولين الرابط للهرمونات الجنسية — يؤثر على مقدار التستوستيرون المتاح بيولوجيًا." },
  { label: "LH / FSH", description: "هرمونات نخامية تساعد في التمييز بين الأنماط الأولية والثانوية." },
  { label: "البرولاكتين", description: "يُقيَّم كعامل محتمل مساهم في الأعراض الهرمونية والجنسية." },
  { label: "الغدة الدرقية", description: "يمكن أن تؤثر وظيفة الغدة الدرقية بشكل مستقل على الطاقة والرغبة الجنسية والمزاج." },
  { label: "الصحة الاستقلابية", description: "يتفاعل الوزن ومقاومة الإنسولين ومتلازمة الاستقلاب جميعها مع التستوستيرون." },
  { label: "النوم", description: "يمكن أن يؤدي ضعف النوم، بما في ذلك انقطاع النفس النومي غير المعالج، إلى خفض مستويات التستوستيرون." },
  { label: "خطط الإنجاب", description: "مهمة قبل بدء أي علاج هرموني قد يؤثر على الخصوبة." },
];

const approachPillars = [
  { title: "الأعراض والكيمياء الحيوية معًا", description: "لا يشكل الرقم وحده تشخيصًا، ولا الأعراض وحدها كذلك. يُقرأ الاثنان معًا، لأن كلًا منهما بمعزل عن الآخر قد يُضلل." },
  { title: "التستوستيرون الحر و SHBG في سياقهما", description: "يمكن أن يكون التستوستيرون الكلي وحده مضللاً. يؤثر SHBG على مقدار التستوستيرون المتاح بيولوجيًا فعليًا، ولهذا يُفسَّر التستوستيرون الحر و SHBG معًا بدلاً من التستوستيرون الكلي بمعزل عنهما." },
  { title: "النظر إلى ما هو أبعد من الرقم نفسه", description: "تساعد الهرمونات النخامية (LH/FSH) والبرولاكتين في تحديد الموضع الذي ينشأ منه النمط ضمن المحور الهرموني — لا مجرد ما إذا كان رقم واحد منخفضًا." },
  { title: "السياق الاستقلابي وسياق النوم", description: "يمكن للسمنة ومقاومة الإنسولين وانقطاع النفس النومي غير المعالج أن تخفض التستوستيرون أو تحاكي أعراضه. علاج الرقم دون معالجة هذه العوامل هو علاج للمشكلة الخاطئة." },
  { title: "التحقق من خطط الإنجاب أولاً", description: "يمكن لبعض العلاجات الهرمونية أن تؤثر على الخصوبة. يُسأل عن هذا ويُؤخذ بعين الاعتبار قبل بدء أي علاج — لا يُكتشف لاحقًا." },
  { title: "المتابعة، لا وصفة لمرة واحدة", description: "يُتابع العلاج، عند الحاجة إليه، بمراجعة دورية وفحوصات دم منتظمة — لا يُبدأ ويُترك دون متابعة." },
];

const monitoring = [
  "فحوصات دم دورية للمتابعة أثناء أي علاج",
  "مراجعة الأعراض إلى جانب الكيمياء الحيوية، لا الكيمياء الحيوية وحدها",
  "مراقبة موانع الاستعمال ومؤشرات السلامة ذات الصلة مع مرور الوقت",
  "تعديل العلاج أو إيقافه إذا لم يعد مناسبًا سريريًا للاستمرار",
];

const faqItems = [
  {
    question: "هل تعني أعراضي أنني أعاني من نقص التستوستيرون؟",
    answer: "ليس بالضرورة. يمكن أن ترتبط أعراض مثل التعب وضعف الرغبة الجنسية وتراجع الأداء بنقص التستوستيرون، لكن يمكن أن يكون لها أسباب أخرى عديدة أيضًا. يلزم إجراء تقييم شامل قبل عزو الأعراض إلى التستوستيرون.",
  },
  {
    question: "ماذا يتضمن التقييم؟",
    answer: "مراجعة للأعراض والتاريخ المرضي، إلى جانب فحوصات دم تشمل عادةً التستوستيرون الكلي والحر و SHBG و LH/FSH والبرولاكتين ووظيفة الغدة الدرقية — إضافة إلى النظر في الصحة الاستقلابية والنوم.",
  },
  {
    question: "هل سأُعرض عليّ علاج التستوستيرون تلقائيًا؟",
    answer: "لا. لا يُنظر في علاج التستوستيرون إلا بعد تقييم سريري وكيميائي حيوي مناسب، وفقط عند وجود مؤشر واضح له.",
    readMoreHref: "/insights/trt-who-is-it-for",
    readMoreLabel: "اقرأ المزيد: Testosterone Replacement Therapy, Who Is It For? (مقال بالإنجليزية)",
  },
  {
    question: "هل هذا مماثل لعيادة كمال أجسام أو تحسين أداء؟",
    answer: "لا. هذا تقييم سريري للصحة الهرمونية، وليس خدمة لتحسين الأداء، ولا يُقدَّم العلاج لهذا الغرض.",
  },
  {
    question: "ماذا لو كنت أخطط لتكوين أسرة؟",
    answer: "تُناقش خطط الإنجاب كجزء من التقييم، لأن بعض العلاجات الهرمونية يمكن أن تؤثر على الخصوبة — ويُؤخذ هذا بعين الاعتبار في أي توصية.",
  },
  {
    question: "ما الفرق بين التستوستيرون الحر والكلي؟",
    answer: "يقيس التستوستيرون الكلي كل التستوستيرون في الدم، بما في ذلك الجزء المرتبط بـ SHBG وغير المتاح لاستخدام الجسم. أما التستوستيرون الحر فيقيس فقط الجزء غير المرتبط والنشط بيولوجيًا — ولهذا يُفسَّر الاثنان معًا بدلاً من التستوستيرون الكلي وحده.",
    readMoreHref: "/insights/shbg-and-free-testosterone-explained",
    readMoreLabel: "اقرأ المزيد: SHBG and Free Testosterone Explained (مقال بالإنجليزية)",
  },
  {
    question: "حقن التستوستيرون أم الجل — أيهما يُستخدم؟",
    answer: "كلاهما وسيلتا إعطاء معتمدتان، ويعتمد الاختيار على التفضيل الفردي ونمط الحياة ومدى استجابة مستوياتك — وليس قرارًا موحدًا يناسب الجميع. يختلفان في وتيرة الاستخدام ومدى تذبذب المستويات بين الجرعات، وهو جزء مما يُناقش عند الاختيار بينهما.",
  },
  {
    question: "هل يؤثر العلاج على الهيماتوكريت أو تعداد الدم؟",
    answer: "يمكن أن يرفع علاج التستوستيرون تعداد كريات الدم الحمراء (الهيماتوكريت)، وهو أحد المؤشرات المحددة التي تُفحص بفحوصات الدم الدورية أثناء العلاج — لا شيء يُراجع فقط عند ظهور الأعراض. وإذا ارتفعت المستويات خارج النطاق الآمن، يُعدَّل العلاج أو يُوقف بدلاً من الاستمرار دون تغيير.",
  },
  {
    question: "هل يؤثر علاج التستوستيرون على البروستاتا أو مستضد البروستاتا النوعي (PSA)؟",
    answer: "يُفحص مستضد البروستاتا النوعي (PSA) وصحة البروستاتا قبل بدء العلاج ويُراقبان أثناءه، كممارسة معيارية لأي علاج بالتستوستيرون — وهما من مؤشرات السلامة المشار إليها في المتابعة المستمرة، لا فكرة لاحقة منفصلة.",
  },
  {
    question: "هل يرتبط انخفاض التستوستيرون بضعف الانتصاب؟",
    answer: "من الممكن ذلك، رغم أنه نادرًا ما يكون العامل الوحيد — إذ يعتمد الانتصاب بشكل أساسي على آليات وعائية وعصبية، بينما يسهم التستوستيرون في الرغبة الجنسية ويدعم أجزاء من العملية. ولهذا يُقيَّم الاثنان معًا بدلاً من افتراض أن قراءة منخفضة تفسر الأعراض الجنسية بمفردها.",
    readMoreHref: "/insights/testosterone-and-erectile-dysfunction",
    readMoreLabel: "اقرأ المزيد: Testosterone and Erectile Dysfunction (مقال بالإنجليزية)",
  },
];

export default function TestosteronePageAr() {
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
              name: "التستوستيرون والصحة الهرمونية للرجال",
              description: "تقييم وإدارة التستوستيرون والصحة الهرمونية للرجال — الأعراض والتشخيص والفحص الكيميائي الحيوي، ومتى يكون العلاج مناسبًا.",
              path: PATH,
              aboutType: "MedicalCondition",
              aboutName: "Testosterone Deficiency",
            },
            { inLanguage: "ar" },
          ),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative py-section-y">
        <HeroAtmosphere align="right" restrained />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-eyebrow font-medium uppercase text-accent-strong">
                صحة الرجل
              </p>
              <h1 className="mt-4 font-display text-display-xl text-foreground">
                التستوستيرون والصحة الهرمونية للرجال
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
                يمكن أن ترتبط قلة الطاقة وضعف الرغبة الجنسية والأعراض
                الجنسية بنقص التستوستيرون — لكن يمكن أن يكون لها أسباب
                أخرى عديدة أيضًا.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <BookingCta sourcePage={PATH} ctaPosition="hero" service="testosterone" size="lg">
                  احجز استشارة
                </BookingCta>
              </div>
            </Reveal>
          </div>
          <MaskedReveal className="order-last w-full lg:order-none">
            <EditorialFrame slot="testosteroneHero" landscape priority />
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
              <p>تقييم هرموني واستقلابي وجنسي — لا عيادة لتحسين الأداء</p>
              {doctor.medicalTrainer && (
                <p>
                  <strong>مدرّب طبي</strong> · {doctor.medicalTrainer.program}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Symptoms are not diagnosis */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-display text-display-md italic leading-snug text-foreground">
              «الأعراض أولاً. الأرقام تحتاج سياقًا.»
            </p>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              لا يحتاج كل رجل يعاني من التعب أو ضعف الرغبة الجنسية أو
              تراجع الأداء الجنسي إلى التستوستيرون. الخطوة الأولى هي فهم
              السبب — فالأعراض وحدها ليست تشخيصًا، وتُقرأ الكيمياء
              الحيوية إلى جانبها، لا بدلاً منها.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Dr. Molina's Approach */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="الفلسفة السريرية"
            heading="نهج د. مولينا في الصحة الهرمونية للرجال"
            description="ليس رقم تستوستيرون يُعالَج بمعزل عن غيره — بل تقييم لمدى تناسق الأعراض والكيمياء الحيوية والصورة الصحية الأوسع فعليًا."
            locale="ar"
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {approachPillars.map((pillar) => (
              <StaggerItem key={pillar.title} className="card-hover border-t border-border pt-6">
                <h3 className="font-display text-lg text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Diagnostic panel */}
      <section className="py-section-y">
        <Container>
          <SectionHeading
            eyebrow="كيف يتم التشخيص"
            heading="صورة هرمونية واستقلابية كاملة"
            description="ينظر التقييم إلى ما هو أبعد من رقم واحد، ويراعي علاقة هذه المؤشرات ببعضها وبأعراضك."
            locale="ar"
          />
          <Reveal delay={0.05}>
            <HormoneBalanceDiagram className="mt-10 h-24 w-24 text-muted-foreground" />
          </Reveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {panel.map((item) => (
              <StaggerItem key={item.label} className="card-hover border-t border-border pt-5">
                <h3 className="font-display text-base text-foreground">{item.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Container className="max-w-2xl py-14">
        <PullQuote>
          لا يُنظر في العلاج إلا بعد تقييم سريري وكيميائي حيوي مناسب —
          ولا يُقدَّم كاستجابة افتراضية للأعراض وحدها.
        </PullQuote>
      </Container>

      {/* Contributing factors + when treatment considered */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              عوامل مساهمة
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              الوزن والنوم والصحة الاستقلابية
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              يمكن للسمنة ومتلازمة الاستقلاب وضعف النوم — بما في ذلك
              انقطاع النفس النومي غير المعالج — أن تخفض جميعها مستويات
              التستوستيرون أو تزيد الأعراض سوءًا. غالبًا ما تكون معالجة
              هذه العوامل جزءًا من الصورة قبل أي علاج هرموني أو إلى
              جانبه.
            </p>
          </div>
          <div>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              متى يُنظر في العلاج
            </p>
            <h2 className="mt-4 font-display text-display-md text-foreground">
              العلاج فقط عند وجود مؤشر سريري
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              لا يُنظر في علاج التستوستيرون إلا بعد تقييم سريري وكيميائي
              حيوي مناسب، وفقط عند وجود مؤشر واضح — لا كاستجابة افتراضية
              للأعراض وحدها، ولا لأغراض كمال الأجسام أو تحسين الأداء.
            </p>
          </div>
        </Container>
      </section>

      {/* Monitoring and safety */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="الرعاية المستمرة" heading="المتابعة والسلامة" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {monitoring.map((item, index) => (
              <StaggerItem key={item}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              كما هو الحال مع أي علاج هرموني، يحمل علاج التستوستيرون
              موانع استعمال ومخاطر تُراجع بشكل فردي قبل البدء وتُتابع
              طوال فترة العلاج — فهو غير مناسب لكل رجل، ويُوقف أو يُعدَّل
              إذا لم يعد يلائم ظروفك.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Restrained authorship reference */}
      {publications.length > 0 && (
        <section className="border-t border-border py-14">
          <Container className="flex flex-wrap items-center gap-6">
            <Image src="/brand/authority/mens-health.jpg" alt="Men's Health Spain" width={100} height={44} style={{ height: "1.5rem", width: "auto" }} className="opacity-80" />
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">مساهم وكاتب — مجلة Men&rsquo;s Health إسبانيا.</span>{" "}
              مقالات مختارة (بالإنجليزية):{" "}
              {publications.map((item, index) => (
                <span key={item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-border underline-offset-4 hover:decoration-accent-strong">
                    {PUBLICATION_LABELS_AR[item.label] ?? item.label}
                  </a>
                  {index < publications.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </Container>
        </section>
      )}

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "خصوبة الرجل", href: "/ar/male-fertility" },
          { label: "دوالي الخصية", href: "/ar/male-fertility/varicocele" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="افهم السبب قبل النظر في العلاج"
        sourcePage={PATH}
        bookingLabel="احجز استشارة"
        secondary={{ label: "استكشف ضعف الانتصاب", href: "/ar/erectile-dysfunction" }}
      />
    </>
  );
}
