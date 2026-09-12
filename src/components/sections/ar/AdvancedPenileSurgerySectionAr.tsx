import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const facts = [
  {
    title: "الدعامات القابلة للنفخ",
    description: "أجهزة من قطعتين أو ثلاث قطع، مصممة لمحاكاة الصلابة والارتخاء الطبيعيين بدقة.",
  },
  {
    title: "الدعامات القابلة للثني",
    description: "قضبان شبه صلبة يمكن توجيهها يدويًا، دون أجزاء ميكانيكية.",
  },
];

const steps = [
  "الاستشارة",
  "التقييم الهرموني والأيضي",
  "تقييم الأوعية الدموية القضيبية عند الحاجة",
  "استراتيجية علاج فردية",
];

/** Temporary EN destinations for both links — no Arabic pages yet, spec §7. */
export function AdvancedPenileSurgerySectionAr() {
  return (
    <section className="border-t border-border bg-surface py-section-y">
      <Container>
        <SectionHeading
          eyebrow="جراحة القضيب المتقدمة"
          heading="خيار نهائي، يُتوصَّل إليه عبر التقييم"
          description="تُعد جراحة زراعة القضيب خيارًا مدروسًا في مرحلة لاحقة — يُتوصَّل إليه بعد تقييم منظم، ولا يُطرح كخطوة أولى."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2">
          {facts.map((fact) => (
            <StaggerItem key={fact.title}>
              <h3 className="font-display text-xl text-foreground">{fact.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{fact.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-14 border-t border-border pt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">كيف يتم تأكيد السبب أولًا</p>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, index) => (
              <StaggerItem key={step}>
                <span className="font-display text-2xl text-accent-strong">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 max-w-[20ch] text-sm text-foreground">{step}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
            <Link href="/penile-implant" className="text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4">
              استكشف زراعة القضيب
            </Link>
            <Link
              href="/erectile-dysfunction/penile-doppler"
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent-strong"
            >
              الموجات فوق الصوتية الدوبلر للقضيب
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
