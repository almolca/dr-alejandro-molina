import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

/** Spec §7 Section 9 — "Editorial index": a directory, deliberately unadorned. */
const conditions = [
  { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
  { label: "Low Testosterone", href: "/mens-health/testosterone" },
  { label: "Peyronie's Disease", href: "/peyronies-disease" },
  { label: "Male Infertility", href: "/male-fertility" },
  { label: "Premature Ejaculation", href: "/sexual-medicine" },
  { label: "Low Libido", href: "/mens-health/low-libido" },
  { label: "Varicocele", href: "/male-fertility/varicocele" },
  { label: "Penile Aesthetic Concerns", href: "/male-aesthetics" },
];

export function ConditionsSection() {
  return (
    <section className="py-section-y">
      <Container>
        <SectionHeading eyebrow="Index" heading="Conditions" size="md" />

        <StaggerGroup className="mt-14 grid grid-cols-1 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {conditions.map((condition, index) => (
            <StaggerItem key={condition.href + condition.label}>
              <Link
                href={condition.href}
                className="group flex items-center gap-3 border-b border-r border-border px-5 py-5 lg:px-6 lg:py-6"
              >
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-base text-foreground sm:text-lg">
                  {condition.label}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
