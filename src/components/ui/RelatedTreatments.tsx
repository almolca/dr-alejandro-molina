import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export type RelatedLink = { label: string; href: string };

/**
 * Internal-linking band — spec explicitly requires "strong internal
 * linking between related treatments" on every inner page. Deliberately
 * plain (a labelled list, not cards) so it reads as reference material,
 * not another promotional block.
 */
export function RelatedTreatments({ items }: { items: RelatedLink[] }) {
  return (
    <section className="border-t border-border py-16">
      <Container>
        <Reveal className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Related
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
