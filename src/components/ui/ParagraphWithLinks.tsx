import { Fragment } from "react";
import { InternalLink as Link } from "@/components/ui/InternalLink";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Renders an Insights article paragraph, recognizing a minimal
 * `[label](/path)` link syntax so a small number of paragraphs can carry
 * a genuine in-prose contextual link (penile implant authority/E-E-A-T
 * phase — internal links were previously only structural, via the fixed
 * Related-Treatments module and closing CTA). Every existing article
 * paragraph is plain text with no brackets, so this is a no-op for all
 * of them — only the handful of paragraphs deliberately written with
 * this syntax render a link.
 */
export function ParagraphWithLinks({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  // `matchAll` clones the regex internally rather than mutating
  // `LINK_PATTERN.lastIndex` directly — required since this component
  // mutating a module-level object on every render isn't allowed.
  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index;
    if (index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, index)}</Fragment>);
    }
    parts.push(
      <Link
        key={key++}
        href={match[2]}
        className="underline decoration-accent-strong underline-offset-4"
      >
        {match[1]}
      </Link>,
    );
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }
  return <>{parts}</>;
}
