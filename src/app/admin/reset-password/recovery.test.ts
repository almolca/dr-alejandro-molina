import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  store: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
  auth: { exchangeCodeForSession: vi.fn(), signOut: vi.fn(), getUser: vi.fn(), getSession: vi.fn(), updateUser: vi.fn(), resetPasswordForEmail: vi.fn() },
}));
vi.mock("next/headers", () => ({ cookies: async () => mocks.store }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
vi.mock("@/lib/supabase/admin-auth-client", () => ({ createAdminAuthClient: async () => ({ auth: mocks.auth }) }));
import { GET } from "./callback/route";
import { resetPassword } from "./actions";
import { requestPasswordReset } from "../forgot-password/actions";
import { createRecoveryProof } from "@/lib/auth/password-recovery";
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("ADMIN_ALLOWED_EMAILS", "admin@example.com");
  vi.stubEnv("ADMIN_RECOVERY_SECRET", "test-secret");
  vi.stubEnv("ADMIN_AUTH_ORIGIN", "https://dralejandromolinaurologist.com");
  mocks.auth.signOut.mockResolvedValue({ error: null });
});
describe("recovery callback", () => {
  it("rejects missing codes and ignores arbitrary redirect destinations", async () => {
    const response = await GET(new NextRequest("https://host.test/admin/reset-password/callback?next=https://evil.test"));
    expect(response.headers.get("location")).toBe("https://dralejandromolinaurologist.com/admin/reset-password?error=invalid");
    expect(mocks.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });
  it.each(["signin", "expired", "unauthorized"])("rejects %s links", async (kind) => {
    mocks.auth.exchangeCodeForSession.mockResolvedValue({ error: kind === "expired" ? {} : null, data: { redirectType: kind === "signin" ? "signin" : "recovery", user: { id: "uid", email: kind === "unauthorized" ? "other@example.com" : "admin@example.com" }, session: { access_token: "token" } } });
    const response = await GET(new NextRequest("https://host.test/admin/reset-password/callback?code=invalid"));
    expect(response.headers.get("location")).toContain("error=invalid");
    expect(mocks.store.set).not.toHaveBeenCalled();
  });
  it("exchanges recovery PKCE code and sets a short HttpOnly proof", async () => {
    mocks.auth.exchangeCodeForSession.mockResolvedValue({ error: null, data: { redirectType: "recovery", user: { id: "uid", email: "admin@example.com" }, session: { access_token: "token" } } });
    const response = await GET(new NextRequest("https://host.test/admin/reset-password/callback?code=valid&sb_flow_id=flow"));
    expect(mocks.auth.exchangeCodeForSession).toHaveBeenCalledWith("valid", { flowId: "flow" });
    expect(response.headers.get("location")).toBe("https://dralejandromolinaurologist.com/admin/reset-password");
    expect(mocks.store.set).toHaveBeenCalledWith("admin-password-recovery", expect.any(String), expect.objectContaining({ httpOnly: true, sameSite: "lax", maxAge: 900, path: "/admin" }));
  });
});
function form(password = "a-long-test-password", confirmation = password) {
  const data = new FormData(); data.set("password", password); data.set("confirmPassword", confirmation); return data;
}
describe("password update action", () => {
  it("rejects invalid confirmation before calling Auth", async () => {
    expect(await resetPassword(null, form("a-long-test-password", "different"))).toHaveProperty("error");
    expect(mocks.auth.updateUser).not.toHaveBeenCalled();
  });
  it("rejects ordinary signed-in sessions without recovery proof", async () => {
    mocks.auth.getUser.mockResolvedValue({ data: { user: { id: "uid", email: "admin@example.com" } }, error: null });
    mocks.auth.getSession.mockResolvedValue({ data: { session: { access_token: "token" } } });
    expect(await resetPassword(null, form())).toHaveProperty("error");
    expect(mocks.auth.updateUser).not.toHaveBeenCalled();
  });
  it("updates only the verified user then clears proof and signs out", async () => {
    mocks.auth.getUser.mockResolvedValue({ data: { user: { id: "uid", email: "admin@example.com" } }, error: null });
    mocks.auth.getSession.mockResolvedValue({ data: { session: { access_token: "token" } } });
    mocks.store.get.mockReturnValue({ value: createRecoveryProof("uid", "token") });
    mocks.auth.updateUser.mockResolvedValue({ error: null });
    await expect(resetPassword(null, form())).rejects.toThrow("REDIRECT:/admin/login?reset=success");
    expect(mocks.auth.updateUser).toHaveBeenCalledWith({ password: "a-long-test-password" });
    expect(mocks.store.delete).toHaveBeenCalledWith("admin-password-recovery");
    expect(mocks.auth.signOut).toHaveBeenCalledWith({ scope: "global" });
  });
});
describe("request email", () => {
  it("returns the same generic message regardless of provider outcome", async () => {
    const data = new FormData(); data.set("email", "admin@example.com");
    mocks.auth.resetPasswordForEmail.mockResolvedValueOnce({ error: null }).mockRejectedValueOnce(new Error("private details"));
    const first = await requestPasswordReset(null, data);
    expect(await requestPasswordReset(null, data)).toEqual(first);
    expect(mocks.auth.resetPasswordForEmail).toHaveBeenCalledWith("admin@example.com", { redirectTo: "https://dralejandromolinaurologist.com/admin/reset-password/callback" });
  });
});
