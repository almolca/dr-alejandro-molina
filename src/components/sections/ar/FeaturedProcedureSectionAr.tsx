import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BrandCurve } from "@/components/ui/BrandCurve";
import { Reveal } from "@/components/motion/Reveal";

/** Temporary EN destination for the CTA — no Arabic page yet, spec §7. */
export function FeaturedProcedureSectionAr() {
  return (
    <section className="section-dark relative overflow-hidden bg-background py-section-y text-foreground">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">الإجراء الرائد</p>
          <h2 className="mt-4 max-w-xl font-display text-display-xl">زيادة سماكة القضيب</h2>
          <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
            يقدّم د. مولينا إجراءً متخصصًا لزيادة سماكة القضيب باستخدام حمض
            الهيالورونيك، بإشراف استشاري مباشر — يُخطَّط وفق التشريح الفردي
            لكل حالة، مع توقعات واقعية ومتابعة متخصصة.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/male-aesthetics/penile-girth-enhancement">استكشف زيادة سماكة القضيب</Link>
          </Button>
        </Reveal>
        <div className="border-r border-accent-strong/50 pr-8">
          <BrandCurve className="mb-10 h-8 w-full text-accent-strong" />
          <p className="font-display text-3xl leading-snug">
            التشريح.<br />الدقة.<br /><em>استمرارية الرعاية.</em>
          </p>
          <p className="mt-6 text-sm text-muted-foreground">التقييم ← التخطيط الفردي ← المتابعة</p>
        </div>
      </Container>
    </section>
  );
}
