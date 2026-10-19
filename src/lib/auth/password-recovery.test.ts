import { afterEach, describe, expect, it, vi } from "vitest";
import { createRecoveryProof, validRecoveryProof, passwordSchema, recoveryOrigin } from "./password-recovery";
afterEach(() => vi.unstubAllEnvs());
describe("password recovery security", () => {
  it("binds signed proof to user, session and expiry", () => {
    vi.stubEnv("ADMIN_RECOVERY_SECRET", "test-only-secret");
    const proof = createRecoveryProof("admin", "token", 1000);
    expect(validRecoveryProof(proof, "admin", "token", 1001)).toBe(true);
    expect(validRecoveryProof(proof, "other", "token", 1001)).toBe(false);
    expect(validRecoveryProof(proof, "admin", "different-token", 1001)).toBe(false);
    expect(validRecoveryProof(proof, "admin", "token", 901000)).toBe(false);
    expect(validRecoveryProof(proof + "x", "admin", "token", 1001)).toBe(false);
    expect(validRecoveryProof(undefined, "admin", "token")).toBe(false);
    expect(validRecoveryProof("malformed.mac", "admin", "token")).toBe(false);
  });
  it("rejects proofs after secret rotation", () => {
    vi.stubEnv("ADMIN_RECOVERY_SECRET", "first");
    const proof = createRecoveryProof("admin", "token");
    vi.stubEnv("ADMIN_RECOVERY_SECRET", "second");
    expect(validRecoveryProof(proof, "admin", "token")).toBe(false);
  });
  it("validates matching passwords and length limits", () => {
    for (const password of ["short", "a".repeat(129)]) expect(passwordSchema.safeParse({ password, confirmPassword: password }).success).toBe(false);
    expect(passwordSchema.safeParse({ password: "long-test-password", confirmPassword: "different" }).success).toBe(false);
    expect(passwordSchema.safeParse({ password: "long-test-password", confirmPassword: "long-test-password" }).success).toBe(true);
  });
  it("uses the fixed production origin and rejects insecure or path-bearing configuration", () => {
    vi.stubEnv("ADMIN_AUTH_ORIGIN", "");
    expect(recoveryOrigin()).toBe("https://dralejandromolinaurologist.com");
    for (const origin of ["http://evil.test", "https://example.com/redirect", "https://example.com?next=evil"]) {
      vi.stubEnv("ADMIN_AUTH_ORIGIN", origin);
      expect(() => recoveryOrigin()).toThrow();
    }
    vi.stubEnv("ADMIN_AUTH_ORIGIN", "https://preview.example.com");
    expect(recoveryOrigin()).toBe("https://preview.example.com");
  });
});
