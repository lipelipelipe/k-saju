import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";
import type { Locale } from "@/lib/dictionary";
import { decodeSharePayload } from "@/lib/share-payload";
import { renderReport } from "@/lib/email-report";
import { getPremiumFocus, getReadingAtIndex } from "@/lib/reading-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const ipLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "saju:report:ip", analytics: false }) : null;
const recipientLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "saju:report:recipient", analytics: false }) : null;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function verifyHuman(token: string, secret: string, remoteIp: string | null) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, ...(remoteIp ? { remoteip: remoteIp } : {}) }),
    signal: AbortSignal.timeout(7000),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true && result.action === "report-email";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });

  const requestText = await request.text();
  if (requestText.length > 12000) return Response.json({ error: "Request too large." }, { status: 413 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SAJU_FROM_EMAIL;
  if (!apiKey || !from) return Response.json({ error: "Email delivery is not configured." }, { status: 503 });
  if (process.env.NODE_ENV === "production" && (!ipLimiter || !recipientLimiter)) {
    return Response.json({ error: "Email protection is not configured." }, { status: 503 });
  }

  let body: { email?: unknown; locale?: unknown; payload?: unknown; turnstileToken?: unknown; website?: unknown };
  try { body = JSON.parse(requestText); }
  catch { return Response.json({ error: "Invalid request body." }, { status: 400 }); }

  // Quietly accept honeypot submissions without sending mail.
  if (typeof body.website === "string" && body.website.length > 0) return Response.json({ ok: true });
  if (!isEmail(body.email) || (body.locale !== "ko" && body.locale !== "en")) return Response.json({ error: "Invalid email or language." }, { status: 400 });

  if (typeof body.payload !== "object" || !body.payload) return Response.json({ error: "Invalid report." }, { status: 400 });
  const payloadText = JSON.stringify(body.payload);
  if (payloadText.length > 9000) return Response.json({ error: "Invalid report." }, { status: 400 });
  const payloadToken = Buffer.from(payloadText).toString("base64url");
  const payload = decodeSharePayload(payloadToken);
  if (!payload || payload.locale !== body.locale) return Response.json({ error: "Invalid report." }, { status: 400 });

  if (process.env.NODE_ENV === "production") {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret || typeof body.turnstileToken !== "string") return Response.json({ error: "Email verification is not configured." }, { status: 503 });
    try {
      const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
      if (!(await verifyHuman(body.turnstileToken, secret, ip))) return Response.json({ error: "Please complete the verification and try again." }, { status: 403 });
    } catch { return Response.json({ error: "Email verification is temporarily unavailable." }, { status: 503 }); }
  } else if (process.env.TURNSTILE_SECRET_KEY) {
    if (typeof body.turnstileToken !== "string" || !(await verifyHuman(body.turnstileToken, process.env.TURNSTILE_SECRET_KEY, null))) {
      return Response.json({ error: "Please complete the verification and try again." }, { status: 403 });
    }
  }

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (ipLimiter && recipientLimiter) {
    try {
      const [ipResult, recipientResult] = await Promise.all([
        ipLimiter.limit(ip),
        recipientLimiter.limit(createHash("sha256").update(body.email.toLowerCase()).digest("hex")),
      ]);
      if (!ipResult.success || !recipientResult.success) return Response.json({ error: "Please wait before requesting another email." }, { status: 429 });
    } catch { return Response.json({ error: "Email protection is temporarily unavailable." }, { status: 503 }); }
  }

  const report = renderReport(payload, body.locale);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: body.email,
    subject: report.subject,
    html: report.html,
    text: report.text,
    tags: [{ name: "category", value: "saju-report" }],
  });
  if (error) return Response.json({ error: "The report could not be sent." }, { status: 502 });
  return Response.json({ ok: true });
}
