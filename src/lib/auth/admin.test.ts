import { afterEach, describe, expect, it, vi } from "vitest";
import { isAllowedAdminEmail } from "./admin";

const ORIGINAL_ENV = process.env.ADMIN_ALLOWED_EMAILS;

afterEach(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.ADMIN_ALLOWED_EMAILS;
  else process.env.ADMIN_ALLOWED_EMAILS = ORIGINAL_ENV;
  vi.unstubAllEnvs();
});

describe("isAllowedAdminEmail", () => {
  it("rejects any email when the allowlist is empty", () => {
    process.env.ADMIN_ALLOWED_EMAILS = "";
    expect(isAllowedAdminEmail("owner@example.com")).toBe(false);
  });

  it("rejects any email when the allowlist is unset", () => {
    delete process.env.ADMIN_ALLOWED_EMAILS;
    expect(isAllowedAdminEmail("owner@example.com")).toBe(false);
  });

  it("allows a matching email, case-insensitively and with whitespace", () => {
    process.env.ADMIN_ALLOWED_EMAILS = " Owner@Example.com , other@example.com";
    expect(isAllowedAdminEmail("owner@example.com")).toBe(true);
  });

  it("rejects a non-matching email", () => {
    process.env.ADMIN_ALLOWED_EMAILS = "owner@example.com";
    expect(isAllowedAdminEmail("intruder@example.com")).toBe(false);
  });

  it("rejects null/undefined", () => {
    process.env.ADMIN_ALLOWED_EMAILS = "owner@example.com";
    expect(isAllowedAdminEmail(null)).toBe(false);
    expect(isAllowedAdminEmail(undefined)).toBe(false);
  });
});
