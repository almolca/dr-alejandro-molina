import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { findAll } from "./react-element";

function Leaf({ label }: { label: string }) {
  return createElement("span", { "data-label": label });
}

describe("findAll", () => {
  it("finds a host element by string type at the top level", () => {
    const tree = createElement("form", null, createElement("input", { name: "x" }));
    expect(findAll(tree, (el) => el.type === "form")).toHaveLength(1);
    expect(findAll(tree, (el) => el.type === "input")).toHaveLength(1);
  });

  it("recurses into an array of children", () => {
    const tree = createElement(
      "div",
      null,
      createElement("a", { href: "/one" }),
      createElement("a", { href: "/two" }),
    );
    const anchors = findAll(tree, (el) => el.type === "a");
    expect(anchors.map((a) => a.props.href)).toEqual(["/one", "/two"]);
  });

  it("matches by component function reference, not just host element strings", () => {
    const tree = createElement("div", null, createElement(Leaf, { label: "hi" }));
    const leaves = findAll(tree, (el) => el.type === Leaf);
    expect(leaves).toHaveLength(1);
    expect(leaves[0].props.label).toBe("hi");
  });

  it("does not descend into an unrendered component's own children (it has none until called)", () => {
    const tree = createElement(Leaf, { label: "hi" });
    expect(findAll(tree, (el) => el.type === "span")).toHaveLength(0);
  });

  it("returns an empty array for a tree with no matches, and ignores plain string children", () => {
    const tree = createElement("p", null, "just text");
    expect(findAll(tree, (el) => el.type === "form")).toEqual([]);
  });
});
