import type { ReactElement, ReactNode } from "react";

/**
 * Structural test helper for this repo's node-only, non-jsdom vitest
 * setup (see vitest.config.ts — `*.test.ts` only, `environment: "node"`).
 * Calling a hooks-free component function directly (a Server Component,
 * or a plain client component) returns the same `{ type, props }` tree
 * JSX always compiles to, with zero rendering pipeline involved. This
 * walks that tree looking for elements matching `predicate` — it never
 * calls into a nested component (that would require re-invoking it,
 * which is unsafe for anything using hooks), so a match must already
 * exist as a literal element in the tree being walked.
 */
function isReactElement(node: ReactNode): node is ReactElement<any> {
  return typeof node === "object" && node !== null && "type" in node && "props" in node;
}

export function findAll(
  node: ReactNode,
  predicate: (el: ReactElement<any>) => boolean,
  found: ReactElement<any>[] = [],
): ReactElement<any>[] {
  if (Array.isArray(node)) {
    for (const child of node) findAll(child, predicate, found);
    return found;
  }
  if (!isReactElement(node)) return found;
  if (predicate(node)) found.push(node);
  const children = (node.props as { children?: ReactNode }).children;
  if (children !== undefined) findAll(children, predicate, found);
  return found;
}
