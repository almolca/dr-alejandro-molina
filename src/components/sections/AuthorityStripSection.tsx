import { doctor } from "@/config/doctor";
import { Container } from "@/components/ui/Container";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

/**
 * Authority/credibility strip — SEO_RESTRUCTURE_IMPLEMENTATION_PLAN.md
 * Phase A2. Reads directly from `doctor.ts`'s owner-confirmed authority
 * fields; renders only the metrics that actually have a value, and
 * renders nothing at all if none do — the same fail-safe,
 * config-driven pattern already used for `isBookingConfigured`
 * elsewhere in this codebase. No number or claim is hard-coded here.
 */
const metrics = [
  doctor.yearsOfExperience !== undefined && {
    value: `${doctor.yearsOfExperience}+ Years`,
    label: "Urology Experience",
  },
  doctor.girthProcedureCount !== undefined && {
    value: doctor.girthProcedureCount,
    label: "Penile Girth Enhancement Procedures",
  },
  doctor.girthEnhancementSince !== undefined && {
    value: `Since ${doctor.girthEnhancementSince}`,
    label: "Penile Enhancement Experience",
  },
  doctor.medicalTrainer?.role !== undefined && {
    value: "Medical Trainer",
    label: "Urologists & Aesthetic Physicians",
  },
].filter((metric): metric is { value: string; label: string } => Boolean(metric));

export function AuthorityStripSection() {
  if (metrics.length === 0) return null;

  return (
    <section className="border-y border-border bg-background py-14">
      <Container>
        <StaggerGroup className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {metrics.map((metric) => (
            <StaggerItem key={metric.label} className="text-center lg:text-left">
              <p className="font-display text-display-md text-foreground">
                {metric.value}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {metric.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
