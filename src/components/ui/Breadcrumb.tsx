import { ChevronRight } from "lucide-react";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { Container } from "@/components/ui/Container";

export type BreadcrumbItem = { name: string; href?: string };

/**
 * Visual breadcrumb trail — spec §24. Only links to routes that
 * actually exist (a page's real spec §5 parent may not be built yet;
 * in that case the trail is shorter rather than linking to a route
 * that would 404). JSON-LD is rendered separately by the page via
 * `breadcrumbSchema()` (`lib/seo/json-ld.ts`), using the same items.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-4 text-xs text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight aria-hidden size={12} />}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "text-foreground" : undefined}
                  >
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
