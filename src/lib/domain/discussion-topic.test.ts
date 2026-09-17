import { describe, expect, it } from "vitest";
import { discussionTopicLabel } from "./discussion-topic";

describe("discussionTopicLabel", () => {
  it("labels a known topic", () => {
    expect(discussionTopicLabel("male_hormonal_health")).toBe("Male Hormonal Health");
  });
  it("labels null as Not specified", () => {
    expect(discussionTopicLabel(null)).toBe("Not specified");
  });
  it("labels undefined as Not specified", () => {
    expect(discussionTopicLabel(undefined)).toBe("Not specified");
  });
  it("labels an unknown value as Not specified", () => {
    expect(discussionTopicLabel("something_unmapped")).toBe("Not specified");
  });
});
