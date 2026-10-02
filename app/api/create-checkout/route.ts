import { randomUUID } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { decodeSharePayload } from "@/lib/share-payload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const checkoutLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 h"), prefix: "saju:checkout", analytics: false }) : null;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!redis || !checkoutLimiter) return Response.json({ error: "Checkout protection is not configured." }, { status: 503 });

  const checkoutBase = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL;
  if (!checkoutBase) return Response.json({ error: "Checkout is not configured." }, { status: 503 });
  let checkout: URL;
  try { checkout = new URL(checkoutBase); }
  catch { return Response.json({ error: "Checkout is not configured." }, { status: 503 }); }
  if (checkout.protocol !== "https:" || !(checkout.hostname === "lemonsqueezy.com" || checkout.hostname.endsWith(".lemonsqueezy.com"))) {
    return Response.json({ error: "Checkout URL must be an HTTPS Lemon Squeezy checkout." }, { status: 503 });
  }

  const raw = await request.text();
  if (raw.length > 12000) return Response.json({ error: "Request too large." }, { status: 413 });
  let body: { payload?: unknown };
  try { body = JSON.parse(raw); }
  catch { return Response.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!body.payload || typeof body.payload !== "object") return Response.json({ error: "Invalid report." }, { status: 400 });
  const payloadToken = Buffer.from(JSON.stringify(body.payload)).toString("base64url");
  const payload = decodeSharePayload(payloadToken);
  if (!payload) return Response.json({ error: "Invalid report." }, { status: 400 });

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  try {
    const limit = await checkoutLimiter.limit(ip);
    if (!limit.success) return Response.json({ error: "Please wait before starting another checkout." }, { status: 429 });
    const reportId = randomUUID();
    await redis.set(`saju:pending-purchase:${reportId}`, JSON.stringify(payload), { ex: 60 * 60 * 24 * 7, nx: true });
    checkout.searchParams.set("checkout[custom][saju_report_id]", reportId);
    return Response.json({ checkoutUrl: checkout.toString() }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Checkout is temporarily unavailable." }, { status: 503 }); }
}
