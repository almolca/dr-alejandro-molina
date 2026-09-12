import { InternalLink as Link } from "@/components/ui/InternalLink";
import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { PhotoFrame } from "@/components/editorial/PhotoFrame";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";

const HIGHLIGHTS_AR: Record<string, string> = {
  "Hospital Clínic Barcelona training": "تدريب في مستشفى كلينيك برشلونة",
  "FEBU — Fellow of the European Board of Urology": "FEBU — زميل المجلس الأوروبي لطب المسالك البولية",
  "Advanced laparoscopic surgery": "جراحة متقدمة بالمنظار",
  "Practicing in the United Arab Emirates": "يمارس الطب في دولة الإمارات العربية المتحدة",
};

// Derived from `HIGHLIGHTS_AR` (rather than maintained as a separate
// array) so there's only one list of English credential strings to keep
// in sync with the translations — a label added to one is automatically
// in the other.
const highlightLabels = Object.keys(HIGHLIGHTS_AR);

const highlights = doctor.credentials
  .filter((c) => highlightLabels.includes(c))
  .map((c) => HIGHLIGHTS_AR[c]);

/** Temporary EN destination — no Arabic /about yet, spec §7. */
export function AboutSectionAr() {
  return (
    <section className="py-section-y">
      <Container className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <MaskedReveal className="order-last w-full lg:order-first">
          <PhotoFrame slot="homeClinical" landscape alt="الدكتور أليخاندرو مولينا في إطار العمل السريري" />
        </MaskedReveal>

        <div>
          <Reveal>
            <p className="text-eyebrow font-medium uppercase text-accent-strong">نبذة عن د. مولينا</p>
            <h2 className="mt-4 font-display text-display-lg text-foreground">
              تدريب أوروبي. خلفية جراحية. تركيز متخصص على صحة الرجل.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
              {highlights.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center text-sm font-medium text-foreground underline decoration-accent-strong underline-offset-4"
            >
              تعرّف على د. مولينا
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
