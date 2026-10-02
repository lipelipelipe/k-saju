import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "saju_admin_session";
const sessionDurationSeconds = 60 * 60 * 12;

function signatureFor(payload: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(payload).digest("hex");
}

export function hasAdminConfiguration() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyAdminPassword(candidate: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  const digest = (value: string) => createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(value).digest();
  return timingSafeEqual(digest(candidate), digest(configured));
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDurationSeconds;
  const payload = String(expiresAt);
  return { value: `${payload}.${signatureFor(payload)}`, maxAge: sessionDurationSeconds };
}

export function isValidAdminSession(value: string | undefined) {
  if (!value || !hasAdminConfiguration()) return false;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra || !/^\d{10}$/.test(payload) || Number(payload) < Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(signatureFor(payload), "hex");
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function isAdminRequest() {
  const cookieJar = await cookies();
  return isValidAdminSession(cookieJar.get(cookieName)?.value);
}

export const adminCookieName = cookieName;
