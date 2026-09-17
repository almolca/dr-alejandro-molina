// src/app/(ar)/ar/(marketing)/erectile-dysfunction/penile-doppler/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/ui/BookingCta";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { RelatedTreatments } from "@/components/ui/RelatedTreatments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DopplerWaveformPanel, UltrasoundEchoFan } from "@/components/illustrations";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { JsonLd } from "@/components/seo/JsonLd";
import { TreatmentCtaSection } from "@/components/sections/TreatmentCtaSection";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/ar/erectile-dysfunction/penile-doppler";

export const metadata: Metadata = buildMetadata({
  title: "دوبلر القضيب — تقييم متقدم لضعف الانتصاب",
  description:
    "تقييم دوبلر القضيب (الموجات فوق الصوتية الثنائية للقضيب) في أبوظبي — التدفق الشرياني الداخل، وظيفة الانسداد الوريدي، وكيفية توجيه النتائج لخطة علاج ضعف الانتصاب.",
  path: PATH,
});

const breadcrumbItems = [
  { name: "الرئيسية", href: "/ar" },
  { name: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
  { name: "دوبلر القضيب", href: PATH },
];

const evaluates = [
  {
    title: "التدفق الشرياني الداخل",
    description: "تدفق الدم إلى القضيب، يُقيَّم لتحديد ما إذا كان انخفاض الإمداد الشرياني يسهم في ضعف الانتصاب.",
  },
  {
    title: "وظيفة الانسداد الوريدي",
    description: "مدى احتفاظ القضيب بالدم أثناء الانتصاب. يمكن أن يسمح ضعف وظيفة الانسداد الوريدي بتصريف الدم بسرعة زائدة، مما يؤثر على الصلابة.",
  },
  {
    title: "الاستجابة للتحفيز",
    description: "يتضمن الفحص عادة حقنة داخل الكهفي لتحفيز الانتصاب دوائيًا، مما يتيح تقييم تدفق الدم في ظروف موحدة.",
  },
];

const arterialContributors = [
  "السكري", "التدخين", "ارتفاع ضغط الدم", "متلازمة الاستقلاب",
  "أمراض الأوعية الدموية", "الخلل البطاني", "التقدم في العمر",
];

const dopplerContextFactors = [
  "جودة الانتصاب المتحقق فعليًا أثناء الفحص",
  "توقيت القياس بعد الحقنة المحفزة",
  "الاستجابة الفردية للعامل الدوائي المستخدم",
  "مدى كفاية التحفيز أثناء الفحص",
  "الأعراض والتاريخ المرضي المذكور أثناء الاستشارة",
  "ما إذا كانت الانتصابات التلقائية ما زالت تحدث",
  "ما إذا كانت الانتصابات أثناء الاستمناء تختلف عنها مع الشريك",
  "عوامل الخطر الوعائية",
  "السياق الاستقلابي",
  "السياق الهرموني",
];

const approachPrinciples = [
  "تُقرأ الأعراض والتاريخ المرضي أولاً، لا الأرقام بمعزل عنها",
  "تُؤخذ جودة الانتصاب المتحقق فعليًا أثناء الفحص بعين الاعتبار، لا السرعات المقاسة فقط",
  "تُفسَّر النتائج الشريانية والانسدادية الوريدية معًا، لا كحكمين مستقلين",
  "تُراعى العوامل الهرمونية والاستقلابية إلى جانب الفحص",
  "توفر الانتصابات التلقائية والانتصابات أثناء الاستمناء سياقًا واقعيًا لا يقدمه فحص واحد",
  "لا يُفترض وجود تسرب وريدي ظاهر تلقائيًا من قيمة مرتفعة واحدة",
  "يتبع العلاج الآلية المحددة فعليًا — لا تصنيف دوبلر يُطبَّق بمفرده",
];

const faqItems = [
  {
    question: "هل أحتاج إلى فحص دوبلر القضيب؟",
    answer: "ليس بالضرورة. يُنظر فيه عند الاشتباه بسبب وعائي، أو عندما لا يستجيب العلاج الأولي كما هو متوقع، أو قبل إجراءات معينة — يُقيَّم بشكل فردي، وليس روتينيًا لكل مريض.",
  },
  {
    question: "ماذا يتضمن الفحص؟",
    answer: "يتضمن الفحص حقنة لتحفيز الانتصاب لأغراض التقييم، تليها تصوير بالموجات فوق الصوتية لتدفق الدم. يُشرح ما يمكن توقعه بالتفصيل مسبقًا.",
  },
  {
    question: "ما هو ضعف الانتصاب الشرياني؟",
    answer: "هو ضعف انتصاب يكون فيه العامل الرئيسي انخفاض تدفق الدم الواصل إلى القضيب عبر الشرايين المغذية له — وغالبًا ما يرتبط بالسكري أو التدخين أو ارتفاع ضغط الدم أو متلازمة الاستقلاب أو أمراض الأوعية الدموية أو التقدم في العمر. يساعد دوبلر القضيب في تقييم التدفق الشرياني الداخل تحديدًا، رغم أن قياسًا واحدًا لا يُشخَّص كمرض شرياني دون النظر إلى الصورة السريرية الأوسع.",
  },
  {
    question: "ما هو التسرب الوريدي؟",
    answer: "هو نمط يبدو فيه التدفق الوريدي الخارج أعلى من المتوقع أثناء الانتصاب، ويوصف أحيانًا بأن الدم «يتسرب بسرعة زائدة». لكن الأمر أكثر تعقيدًا من مجرد أنبوب مسرّب — فالانسداد الوريدي الطبيعي يعتمد على كفاية التدفق الداخل والتمدد الكهفي الكامل الذي يضغط على التدفق الخارج، لذا فإن انتصابًا غير مكتمل قد يُظهر نمطًا مشابهًا دون وجود مشكلة وريدية بنيوية ثابتة.",
    readMoreHref: "#venous-leak",
    readMoreLabel: "اقرأ المزيد أدناه: التسرب الوريدي أكثر تعقيدًا مما يبدو",
  },
  {
    question: "هل تعني السرعة الانبساطية النهائية (EDV) المرتفعة دائمًا وجود تسرب وريدي؟",
    answer: "لا. تساعد السرعة الانبساطية النهائية (EDV) في تقييم مقدار التدفق الخارج المستمر أثناء الانتصاب، لكن يجب قراءتها إلى جانب مدى صلابة الانتصاب فعليًا أثناء الفحص. فإذا لم يتحقق التمدد الكهفي الكامل — بسبب ضعف التحفيز أو القلق أو استجابة غير مثالية لحقنة الفحص — فقد يبدو التدفق الخارج مرتفعًا دون وجود تسرب بنيوي ثابت.",
  },
  {
    question: "هل يمكن أن يؤثر القلق على فحص دوبلر القضيب؟",
    answer: "نعم. يعتمد الفحص على تحقيق استجابة انتصابية حقيقية لحقنة محفزة، ويمكن للقلق في هذا السياق أن يؤثر على مدى استرخاء وتمدد الأنسجة الكهفية — مما قد يؤثر بدوره على السرعات المقاسة، بمعزل عن أي مشكلة وعائية كامنة.",
  },
  {
    question: "هل يمكن أن يجعل النشاط الودي الحفاظ على الانتصاب صعبًا؟",
    answer: "قد يعكس النمط الانسدادي الوريدي الظاهر لدى بعض الرجال استرخاءً كهفيًا غير مكتمل أو صلابة غير مكتملة بدلاً من عيب بنيوي ثابت — ويُعد ارتفاع النشاط الودي (استجابة الجسم للتوتر) أحد العوامل التي يمكن أن تسهم في استرخاء غير مكتمل في بيئة سريرية مثل فحص الدوبلر.",
  },
  {
    question: "لماذا قد تكون الانتصابات أفضل أثناء الاستمناء منها أثناء الجماع؟",
    answer: "هذه معلومة مفيدة فعليًا في التاريخ المرضي، وليست مجرد ملاحظة عابرة — فهي تشير إلى دور عوامل الأداء أو السياق، بدلاً من مشكلة بنيوية ثابتة، إذ إن التشريح الوعائي الكامن واحد في كلتا الحالتين. وهي من الأمور المحددة التي تُسأل عنها أثناء التقييم، وجزء من سبب كون الانتصابات التلقائية وانتصابات الاستمناء توفر سياقًا لا يقدمه فحص واحد.",
  },
  {
    question: "هل يمكن أن يؤثر التستوستيرون على وظيفة الانتصاب؟",
    answer: "يمكن أن يسهم، إلى جانب آليات وعائية وعصبية — رغم أنه نادرًا ما يكون العامل الوحيد. يُراعى التقييم الهرموني كجزء من التقييم الشامل لضعف الانتصاب عند الحاجة، ولا يُعامل كسؤال منفصل غير ذي صلة.",
    readMoreHref: "/ar/mens-health/testosterone",
    readMoreLabel: "استكشف التستوستيرون والصحة الهرمونية",
  },
  {
    question: "متى يكون دوبلر القضيب مفيدًا؟",
    answer: "يكون مفيدًا عندما تحتاج الحالة الوعائية إلى توضيح فعلي — على سبيل المثال عندما لا يستجيب العلاج كما هو متوقع، أو عند التخطيط لجراحة مثل زراعة دعامة القضيب، أو عند الحاجة للتمييز بين عامل شرياني وآخر انسدادي وريدي بما يغيّر مسار النقاش العلاجي. وهو ليس خطوة أولى روتينية لكل مريض يعاني من ضعف الانتصاب.",
  },
  {
    question: "هل يمكن لدوبلر القضيب التمييز بين المشكلات الشريانية والانسدادية الوريدية؟",
    answer: "يمكن أن يساعد — إذ تعكس ذروة السرعة الانقباضية (PSV) بشكل أساسي التدفق الشرياني الداخل، بينما تساعد السرعة الانبساطية النهائية (EDV) في تقييم التدفق الخارج المستمر. لكن كلاهما يُقرأ في سياق جودة الانتصاب المتحقق، وتوقيت الاستجابة لحقنة الفحص، وصورتك السريرية الأوسع — لا كرقمين ينتجان تشخيصًا بمفردهما.",
  },
  {
    question: "هل يتطلب التسرب الوريدي جراحة دائمًا؟",
    answer: "لا. بما أن النمط الانسدادي الوريدي الظاهر قد يعكس استرخاءً غير مكتمل أو ضعف تحفيز أو عوامل استقلابية وهرمونية بدلاً من عيب بنيوي ثابت، فإن العلاج يتبع الآلية المحددة فعليًا — وهو ما قد يعني معالجة عامل مساهم بدلاً من الجراحة. لا تُطرح الخيارات الجراحية إلا لنمط بنيوي مؤكد فعليًا، وتُناقش بشكل فردي.",
  },
];

export default function PenileDopplerPageAr() {
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
              name: "دوبلر القضيب — تقييم متقدم لضعف الانتصاب",
              description: "تقييم دوبلر القضيب الثنائي للتدفق الشرياني الداخل ووظيفة الانسداد الوريدي، يُستخدم كجزء من التقييم المتقدم لضعف الانتصاب.",
              path: PATH,
              aboutType: "MedicalProcedure",
              aboutName: "Penile Duplex Ultrasound",
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
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              تقييم متقدم لضعف الانتصاب
            </p>
            <h1 className="mt-4 font-display text-display-xl text-foreground">
              دوبلر القضيب
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted-foreground">
              تقييم بالموجات فوق الصوتية لتدفق الدم في القضيب، يُستخدم
              كجزء من التقييم المتقدم لضعف الانتصاب عند الحاجة لتقييم
              سبب وعائي بالتفصيل.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage={PATH} ctaPosition="hero" service="penile_doppler" size="lg">
                احجز استشارتك السرية
              </BookingCta>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Illustrative Doppler visual */}
      <section className="border-t border-border py-section-y">
        <Container className="max-w-3xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start">
            <div>
              <UltrasoundEchoFan className="w-full max-w-[11rem]" />
              <p className="mt-3 text-xs text-muted-foreground">صورة توضيحية محاكاة للموجات فوق الصوتية</p>
            </div>
            <DopplerWaveformPanel
              pattern="normal"
              label="مثال توضيحي لموجة دوبلر"
              description="تصور توضيحي محاكى لمخطط دوبلر طيفي طبيعي — وليس فحصًا لمريض حقيقي. تختلف الفحوصات الفعلية بين الأفراد."
              locale="ar"
            />
          </div>
        </Container>
      </section>

      {/* When indicated */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="متى قد يُشار إليه"
            heading="ليس فحصًا روتينيًا لكل مريض"
            size="md"
            description="قد يُنظر في دوبلر القضيب عند الاشتباه بسبب وعائي، أو عندما لا يقدم العلاج الأولي الاستجابة المتوقعة، أو عند التخطيط قبل إجراء مثل جراحة زراعة دعامة القضيب — يُقيَّم بشكل فردي، لا كخطوة افتراضية."
            locale="ar"
          />
        </Container>
      </section>

      {/* What the test evaluates */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="ما الذي يقيّمه الفحص" heading="ثلاثة أمور ينظر إليها الفحص" locale="ar" />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 border-t border-border pt-12 md:grid-cols-3">
            {evaluates.map((item, index) => (
              <StaggerItem key={item.title} className="card-hover">
                <span className="font-display text-2xl text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Arterial ED */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="إحدى آليتين"
            heading="ضعف الانتصاب الشرياني"
            size="md"
            description="يعني ضعف الانتصاب الشرياني أن العامل الرئيسي هو انخفاض تدفق الدم الواصل إلى القضيب عبر الشرايين المغذية له — وهو الجانب «الداخل» من الآلية الفسيولوجية الموضحة أعلاه."
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="text-sm font-medium uppercase text-muted-foreground">
              ما يسهم فيه عادة
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {arterialContributors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              يمكن لدوبلر القضيب أن يساعد في تقييم التدفق الشرياني الداخل
              تحديدًا، ويُقاس بذروة السرعة الانقباضية (PSV). لكن رقمًا
              واحدًا لا يُشخَّص بمفرده كمرض شرياني — إذ يُقرأ إلى جانب
              عوامل الخطر الوعائية والأعراض وبقية الصورة السريرية.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Venous leak */}
      <section id="venous-leak" className="py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="الآلية الأخرى"
            heading="التسرب الوريدي أكثر تعقيدًا مما يبدو"
            size="md"
            locale="ar"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              لا يعني ما يُسمى بالتسرب الوريدي بالضرورة أن أحد الأوردة
              معطل بشكل دائم أو مفتوح ببساطة. يعتمد الانسداد الوريدي
              الطبيعي — وهو انخفاض التدفق الخارج الذي يحافظ على
              الانتصاب — على كفاية التدفق الشرياني الداخل، واسترخاء
              العضلات الملساء، والتمدد الكهفي الكامل، وما ينتج عنه من
              ضغط على التدفق الوريدي الخارج مقابل الغلاف الكهفي. إنه
              نتيجة نهائية لسلسلة من الأحداث، لا مفتاحًا مستقلاً.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              إذا كانت الصلابة أثناء التقييم غير مكتملة لأي سبب، فقد
              يبقى التدفق الوريدي الخارج قابلاً للقياس ببساطة لأن الضغط
              الكامل لم يتحقق قط. ولهذا السبب لا ينبغي تفسير ارتفاع
              السرعة الانبساطية النهائية (EDV) تلقائيًا وبمعزل عن غيره
              كتسرب وريدي بنيوي ثابت.
            </p>
            <p className="mt-6 text-sm">
              <Link href="/insights/venous-leak-erectile-dysfunction" className="text-foreground underline decoration-accent-strong underline-offset-4">
                اقرأ المقال كاملاً: Venous Leak and Erectile Dysfunction
                (مقال بالإنجليزية)
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three-pattern Doppler comparison */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container>
          <SectionHeading
            eyebrow="مقارنة الأنماط"
            heading="ثلاثة أنماط استجابة في دوبلر"
            size="md"
            description="مخططات موجية توضيحية وتعليمية — وليست فحوصات تشخيصية حقيقية — توضح كيف يمكن أن تبدو الآليات الثلاث المذكورة أعلاه على مخطط دوبلر طيفي."
            locale="ar"
          />
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <DopplerWaveformPanel
              pattern="normal"
              label="أ. استجابة طبيعية"
              description="تدفق شرياني داخل كافٍ. ترتفع ذروة السرعة الانقباضية (PSV) بشكل مناسب وتنخفض السرعة الانبساطية النهائية (EDV) نحو الصفر مع اكتمال الصلابة."
              locale="ar"
            />
            <DopplerWaveformPanel
              pattern="arterial-insufficiency"
              label="ب. القصور الشرياني"
              description="انخفاض التدفق الشرياني الداخل، وينعكس ذلك في استجابة أقل لذروة السرعة الانقباضية (PSV)."
              locale="ar"
            />
            <DopplerWaveformPanel
              pattern="veno-occlusive"
              label="ج. الخلل الوظيفي الانسدادي الوريدي (التسرب الوريدي)"
              description="قد يكون التدفق الشرياني الداخل كافيًا، لكن التدفق الخارج لا يُثبَّط بشكل كافٍ — وتبقى السرعة الانبساطية النهائية (EDV) مرتفعة باستمرار رغم الانتصاب."
              locale="ar"
            />
          </div>
        </Container>
      </section>

      {/* Functional veno-occlusive patterns */}
      <section className="border-t border-border bg-surface py-section-y">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="لماذا يهم السياق" heading="الأنماط الانسدادية الوريدية الوظيفية" size="md" locale="ar" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              قد يعكس النمط الانسدادي الوريدي الظاهر لدى بعض الرجال
              استرخاءً كهفيًا غير مكتمل أو صلابة غير مكتملة أثناء الفحص —
              لا عيبًا بنيويًا ثابتًا. وقد تشمل العوامل المساهمة ضعف
              التحفيز، أو قلق الأداء، أو ارتفاع النشاط الودي، أو استجابة
              غير مثالية للعامل الدوائي المستخدم، أو عوامل استقلابية
              وهرمونية. ولهذا السبب تُعد جودة الانتصاب المتحقق فعليًا
              أثناء الفحص جزءًا من كيفية قراءة النتيجة، لا هامشًا عليها.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Reading PSV and EDV in context */}
      <section className="py-section-y">
        <Container>
          <SectionHeading eyebrow="قراءة الأرقام" heading="ذروة السرعة الانقباضية والسرعة الانبساطية النهائية نقطة بداية، لا تشخيص" locale="ar" />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <Reveal className="card-hover border-t border-border pt-6">
              <h3 className="font-display text-lg text-foreground">PSV</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">ذروة السرعة الانقباضية — تعكس بشكل أساسي التدفق الشرياني الداخل.</p>
            </Reveal>
            <Reveal delay={0.05} className="card-hover border-t border-border pt-6">
              <h3 className="font-display text-lg text-foreground">EDV</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">السرعة الانبساطية النهائية — تساعد في تقييم التدفق الخارج المستمر أثناء الانتصاب.</p>
            </Reveal>
          </div>
          <p className="mt-10 max-w-2xl text-sm font-medium uppercase text-muted-foreground">
            لكن كلاهما يُفسَّر إلى جانب
          </p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {dopplerContextFactors.map((factor) => (
              <StaggerItem key={factor} className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-strong" />
                {factor}
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
              ليس الدوبلر مجرد جهاز ينتج تشخيصًا من رقم واحد — بل هو جزء
              واحد من تقييم لا يكون مفيدًا إلا بقدر السياق الذي يُقرأ
              ضمنه.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Dr. Molina's approach */}
      <section className="section-dark bg-background py-section-y text-foreground">
        <Container>
          <SectionHeading eyebrow="نهجنا" heading="تفسير الدوبلر ضمن سياقه" locale="ar" />
          <StaggerGroup className="mt-14 divide-y divide-border border-t border-border">
            {approachPrinciples.map((principle, index) => (
              <StaggerItem key={principle}>
                <div className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6">
                  <span className="font-display text-xl text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground sm:text-base">{principle}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* Interpretation — olive */}
      <section className="section-olive bg-background py-section-y text-foreground">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              تفسير النتائج
            </p>
            <p className="mt-6 font-display text-display-md text-foreground">
              سياق، لا حكم نهائي.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              تُفسَّر النتائج إلى جانب تاريخك المرضي والفحص السريري
              ونتائج التقييم الأخرى — لا بمعزل عنها. يمكن أن تساعد
              النتائج في توضيح وجود عامل وعائي، وتوجيه اختيار الخيارات
              الأنسب على سلّم علاج ضعف الانتصاب، لكن الفحص نفسه لا يحل
              محل الحكم السريري ولا يحدد العلاج بمفرده.
            </p>
          </Reveal>
        </Container>
      </section>

      <RelatedTreatments
        locale="ar"
        items={[
          { label: "ضعف الانتصاب", href: "/ar/erectile-dysfunction" },
          { label: "التستوستيرون والصحة الهرمونية", href: "/ar/mens-health/testosterone" },
          { label: "العلاج بالموجات الصادمة", href: "/erectile-dysfunction/shockwave-therapy" },
          { label: "جراحة زراعة دعامة القضيب", href: "/ar/penile-implant" },
          { label: "مرض بيروني", href: "/ar/peyronies-disease" },
        ]}
      />

      <Faq items={faqItems} locale="ar" />

      <TreatmentCtaSection
        heading="ناقش ما إذا كان التقييم مناسبًا لك"
        sourcePage={PATH}
        bookingLabel="احجز استشارتك السرية"
      />
    </>
  );
}
