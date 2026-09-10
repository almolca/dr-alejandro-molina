"use client";

/**
 * Anonymous session identifier — R7.2 brief §39. Random UUID, no PII
 * encoding, first-party cookie with a 180-day expiry. Never derived
 * from email/phone/name, never used for fingerprinting.
 */
const COOKIE_NAME = "analytics_session_id";
const MAX_AGE_DAYS = 180;

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAnonymousSessionId(): string {
  if (typeof document === "undefined") return "";
  const existing = readCookie(COOKIE_NAME);
  if (existing) return existing;

  const id = crypto.randomUUID();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id)}; path=/; max-age=${MAX_AGE_DAYS * 86400}; SameSite=Lax`;
  return id;
}
