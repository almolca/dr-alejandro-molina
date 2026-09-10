import { mediaAppearances } from "@/config/mediaAppearances";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Renders nothing until at least one `mediaAppearances` entry has
 * `publishReady: true` — currently always nothing, since the array
 * ships empty. Do not add a fallback/placeholder state; an empty
 * trust section is worse than no section.
 */
export function MediaAppearancesSection() {
  const publishable = mediaAppearances.filter((item) => item.publishReady);
  if (publishable.length === 0) return null;

  return (
    <section className="border-t border-border py-section-y">
      <Container className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
            Media &amp; Editorial Contributions
          </p>
          <ul className="mt-8 flex flex-col items-center gap-4">
            {publishable.map((item) => (
              <li key={`${item.outletName}-${item.year}`} className="text-sm text-muted-foreground">
                {item.title} — {item.outletName}, {item.year}
                {item.url && (
                  <>
                    {" · "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-border underline-offset-4 hover:decoration-accent-strong"
                    >
                      View
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
