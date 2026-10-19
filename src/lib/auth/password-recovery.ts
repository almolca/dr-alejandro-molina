import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const RECOVERY_COOKIE = "admin-password-recovery";
export const passwordSchema = z.object({
  password: z.string().min(12).max(128),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword);

export function recoveryOrigin() {
  // Never derive an email redirect from untrusted Host/forwarded headers.
  const previewHost = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL : undefined;
  if (previewHost && !/^[a-z0-9-]+\.vercel\.app$/.test(previewHost)) throw new Error("Invalid preview host");
  const configured = process.env.ADMIN_AUTH_ORIGIN || (previewHost ? `https://${previewHost}` : undefined);
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.origin === "http://localhost:3000")) {
      throw new Error("Invalid admin auth origin");
    }
    if (url.origin !== configured) throw new Error("Admin auth origin must be an origin only");
    return url.origin;
  }
  return "https://dralejandromolinaurologist.com";
}

function signature(value: string) {
  const secret = process.env.ADMIN_RECOVERY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Recovery signing secret is not configured");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createRecoveryProof(userId: string, accessToken: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ userId, expires: now + 15 * 60_000 })).toString("base64url");
  return `${payload}.${signature(`${payload}.${accessToken}`)}`;
}

export function validRecoveryProof(proof: string | undefined, userId: string, accessToken: string, now = Date.now()) {
  if (!proof) return false;
  try {
    const [payload, mac, extra] = proof.split(".");
    if (!payload || !mac || extra) return false;
    const expected = signature(`${payload}.${accessToken}`);
    if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.userId === userId && data.expires > now && data.expires <= now + 15 * 60_000;
  } catch { return false; }
}
