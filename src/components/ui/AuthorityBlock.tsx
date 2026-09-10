"use client";

import { motion } from "motion/react";
import { doctor } from "@/config/doctor";
import { defaultViewport, durations, easeSoft } from "@/components/motion/motion-config";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils/cn";

/**
 * Shared authority-metrics block — extracted from the Penile Girth
 * Enhancement page (Phase R1-R2, was previously a one-off there so it
 * could be reused on the homepage and the Male Aesthetics hub). Same
 * fail-safe, config-driven pattern as AuthorityStripSection: never
 * renders a metric whose backing config field is unset.
 */
const metrics = [
  doctor.girthProcedureCount !== undefined && {
    value: doctor.girthProcedureCount,
    label: "Procedures Performed",
  },
  doctor.girthEnhancementSince !== undefined && {
    value: `Since ${doctor.girthEnhancementSince}`,
    label: "Penile Girth Enhancement Experience",
  },
  { value: "Consultant", label: "Urologist & Andrologist" },
  doctor.medicalTrainer?.role !== undefined && {
    value: "Medical Trainer",
    label: "Penile Enhancement Techniques",
  },
].filter((metric): metric is { value: string; label: string } => Boolean(metric));

export function AuthorityBlock({ align = "left" }: { align?: "left" | "center" }) {
  if (metrics.length === 0) return null;

  return (
    <StaggerGroup
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4 lg:gap-6",
        align === "center" && "mx-auto max-w-2xl",
      )}
    >
      {metrics.map((metric) => (
        <StaggerItem
          key={metric.label}
          className={align === "center" ? "text-center" : "text-center lg:text-left"}
        >
          <motion.p
            className="font-display text-display-md text-foreground"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={defaultViewport}
            transition={{ duration: durations.base, ease: easeSoft }}
          >
            {metric.value}
          </motion.p>
          <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {metric.label}
          </p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
