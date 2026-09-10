import { describe, expect, it } from "vitest";
import {
  discussionTopicLabel,
  isDiscussionTopic,
  mapServiceToDiscussionTopic,
  resolveSubmittedDiscussionTopic,
} from "./discussion-topic";

describe("isDiscussionTopic", () => {
  it("accepts a known topic", () => {
    expect(isDiscussionTopic("fertility")).toBe(true);
  });
  it("rejects an unknown value", () => {
    expect(isDiscussionTopic("erectile_dysfunction")).toBe(false);
  });
  it("rejects the prefer-not-to-say sentinel (never a stored topic)", () => {
    expect(isDiscussionTopic("prefer_not_to_say")).toBe(false);
  });
});

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

describe("resolveSubmittedDiscussionTopic", () => {
  // R7.2.2 — what the booking form actually sends to the server for
  // each of the three required scenarios. Must never throw and must
  // never resolve "prefer_not_to_say" as a real topic.

  it("scenario A: topic omitted (null) resolves to undefined", () => {
    expect(resolveSubmittedDiscussionTopic(null)).toBeUndefined();
  });

  it("scenario A: topic omitted (empty string) resolves to undefined", () => {
    expect(resolveSubmittedDiscussionTopic("")).toBeUndefined();
  });

  it("scenario B: Prefer not to say resolves to undefined, not a stored value", () => {
    expect(resolveSubmittedDiscussionTopic("prefer_not_to_say")).toBeUndefined();
  });

  it("scenario C: a valid broad topic resolves to itself", () => {
    expect(resolveSubmittedDiscussionTopic("fertility")).toBe("fertility");
  });

  it("rejects a fine-grained page-context value as not a valid broad topic", () => {
    expect(resolveSubmittedDiscussionTopic("erectile_dysfunction")).toBeUndefined();
  });

  it("rejects garbage input safely", () => {
    expect(resolveSubmittedDiscussionTopic("<script>alert(1)</script>")).toBeUndefined();
  });
});

describe("mapServiceToDiscussionTopic", () => {
  it("maps erectile_dysfunction to mens_sexual_health", () => {
    expect(mapServiceToDiscussionTopic("erectile_dysfunction")).toBe("mens_sexual_health");
  });
  it("maps penile_doppler to penile_doppler_vascular", () => {
    expect(mapServiceToDiscussionTopic("penile_doppler")).toBe("penile_doppler_vascular");
  });
  it("returns undefined for a service with no confident broad mapping", () => {
    expect(mapServiceToDiscussionTopic("other")).toBeUndefined();
  });
  it("returns undefined when no service is given", () => {
    expect(mapServiceToDiscussionTopic(undefined)).toBeUndefined();
  });
});
