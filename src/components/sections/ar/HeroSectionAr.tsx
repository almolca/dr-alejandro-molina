import visual from "@/components/editorial/VisualSystem.module.css";
import { BookingCta } from "@/components/ui/BookingCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialField } from "@/components/editorial/LayeredEditorialPanel";
import { HeroAtmosphere } from "@/components/editorial/HeroAtmosphere";
import { HeroPortrait } from "@/components/editorial/HeroPortrait";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

/**
 * R9 Phase B0 — Arabic mirror of `HeroSection`. `align="left"` on
 * `HeroAtmosphere` (English uses "right") because the grid's visual
 * column order flips under `dir="rtl"`: the portrait ends up on the
 * left, so the atmosphere plane leans the same way, matching the Phase
 * A pilot's existing choice. See spec §6/§7.
 */
export function HeroSectionAr() {
  return (
    <EditorialField>
      <HeroAtmosphere align="left" />
      <Container className={`${visual.heroGrid} relative z-10`}>
        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">
              استشاري أمراض المسالك البولية والذكورة · أبوظبي
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-display-2xl text-foreground">
              د. أليخاندرو مولينا
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              طب الذكورة · الصحة الجنسية للرجال · التجميل الذكوري
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-body-lg text-muted-foreground">
              رعاية متخصصة في الطب الجنسي، والصحة الهرمونية للرجال، وجراحة
              القضيب، والتجميل الذكوري، مع خبرة خاصة في زيادة سماكة القضيب.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                FEBU · زميل المجلس الأوروبي لطب المسالك البولية
              </p>
              {/* Arabic translation of `practiceLocationLine` (src/config/practice.ts) — keep in sync with it and with BookingSectionAr.tsx's copy of this same line. */}
              <p className="mt-1 text-sm text-muted-foreground">
                مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              <BookingCta sourcePage="/ar" ctaPosition="hero" size="lg">
                احجز استشارتك السرية
              </BookingCta>
              {/* Temporary EN destination — no Arabic page yet, spec §7 */}
              <Button asChild variant="secondary" size="lg">
                <a href="/male-aesthetics/penile-girth-enhancement">
                  استكشف زيادة سماكة القضيب
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className={visual.heroMedia}>
          <MaskedReveal>
            <HeroPortrait
              slot="homeHero"
              priority
              objectPosition="center 4%"
              alt="صورة الدكتور أليخاندرو مولينا، استشاري أمراض المسالك البولية والذكورة"
            />
          </MaskedReveal>
        </div>
      </Container>
    </EditorialField>
  );
}
