import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

export type RelatedLink = { label: string; href: string };

/**
 * Internal-linking band — spec explicitly requires "strong internal
 * linking between related treatments" on every inner page. Deliberately
 * plain (a labelled list, not cards) so it reads as reference material,
 * not another promotional block.
 */
export function RelatedTreatments({ items, locale }: { items: RelatedLink[]; locale?: "ar" }) {
  return (
    <section className="border-t border-border py-16">
      <Container>
        <Reveal className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
          <span className={cn("text-xs font-medium uppercase text-muted-foreground", locale !== "ar" && "tracking-widest")}>
            {locale === "ar" ? "مواضيع ذات صلة" : "Related"}
          </span>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent-strong"
            >
              {item.label}
            </Link>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
