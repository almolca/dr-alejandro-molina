import { isPhysicianProfileConfigured, practice } from "@/config/practice";
import { BookingCta } from "@/components/ui/BookingCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function BookingSectionAr() {
  return (
    <section className="section-olive bg-background py-section-y text-foreground">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase text-accent-strong">الاستشارة</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-display-xl text-foreground">
            استشر د. أليخاندرو مولينا في أبوظبي
          </h2>
          {/* Arabic translation of `practiceLocationLine` (src/config/practice.ts) — keep in sync with it and with HeroSectionAr.tsx's copy of this same line. */}
          <p className="mt-6 text-body-lg text-muted-foreground">
            مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BookingCta sourcePage="/ar" ctaPosition="closing-section" size="lg">
              احجز استشارة
            </BookingCta>
            {isPhysicianProfileConfigured && (
              <a
                href={practice.physicianProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center px-6 text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
              >
                عرض الملف الشخصي في NMC
              </a>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
