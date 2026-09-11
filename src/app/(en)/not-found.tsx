import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Global 404 — spec §34 requires this in the smoke-test list. Wrapped in
 * `PageShell` directly since the root-level `not-found.tsx` renders
 * inside the root layout only, not the `(marketing)` nested layout.
 */
export default function NotFound() {
  return (
    <PageShell>
      <Container className="flex min-h-[60vh] flex-col items-start justify-center py-section-y">
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
          404
        </p>
        <h1 className="mt-4 font-display text-display-lg text-foreground">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-body-lg text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist or hasn&rsquo;t
          been published yet.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </Container>
    </PageShell>
  );
}
