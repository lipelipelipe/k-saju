import { createHmac, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { decodeSharePayload } from "@/lib/share-payload";
import { renderReport } from "@/lib/email-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function signatureIsValid(raw: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(raw).digest();
  const supplied = Buffer.from(signature, "hex");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function POST(request: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SAJU_FROM_EMAIL;
  const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!secret || !apiKey || !from || !variantId || !storeId || !redisUrl || !redisToken) {
    return Response.json({ error: "Payment fulfillment is not configured." }, { status: 503 });
  }

  const raw = await request.text();
  if (raw.length > 40000) return Response.json({ error: "Webhook is too large." }, { status: 413 });
  const signature = request.headers.get("x-signature") ?? "";
  if (!signatureIsValid(raw, signature, secret)) return Response.json({ error: "Invalid webhook signature." }, { status: 401 });

  let body: {
    meta?: { event_name?: unknown; custom_data?: { saju_report_id?: unknown } };
    data?: { id?: unknown; attributes?: { store_id?: unknown; status?: unknown; refunded?: unknown; user_email?: unknown; first_order_item?: { variant_id?: unknown } } };
  };
  try { body = JSON.parse(raw); }
  catch { return Response.json({ error: "Invalid webhook body." }, { status: 400 }); }

  const eventName = request.headers.get("x-event-name") ?? body.meta?.event_name;
  if (eventName !== "order_created") return Response.json({ received: true });
  const attributes = body.data?.attributes;
  if (!attributes || attributes.status !== "paid" || attributes.refunded === true) return Response.json({ received: true });
  if (String(attributes.store_id) !== storeId || String(attributes.first_order_item?.variant_id) !== variantId) {
    return Response.json({ received: true });
  }

  const orderId = String(body.data?.id ?? "");
  const reportId = body.meta?.custom_data?.saju_report_id;
  const email = attributes.user_email;
  if (!orderId || orderId.length > 120 || typeof reportId !== "string" || !/^[0-9a-f-]{36}$/i.test(reportId) || typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Required order details are missing." }, { status: 400 });
  }

  const redis = new Redis({ url: redisUrl, token: redisToken });
  const processedKey = `saju:fulfilled-order:${orderId}`;
  try {
    if (await redis.get(processedKey) === "sent") return Response.json({ received: true });
    const lock = await redis.set(processedKey, "sending", { nx: true, ex: 5 * 60 });
    if (lock !== "OK") return Response.json({ received: true });

    const storedReport = await redis.get<string>(`saju:pending-purchase:${reportId}`);
    if (typeof storedReport !== "string") {
      await redis.del(processedKey);
      return Response.json({ error: "The report is no longer available." }, { status: 503 });
    }
    const payloadToken = Buffer.from(storedReport).toString("base64url");
    const payload = decodeSharePayload(payloadToken);
    if (!payload) {
      await redis.del(processedKey);
      return Response.json({ error: "The report could not be restored." }, { status: 500 });
    }

    const report = renderReport(payload, payload.locale, true);
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: report.subject,
      html: report.html,
      text: report.text,
      tags: [{ name: "category", value: "saju-premium-report" }],
    });
    if (error) {
      await redis.del(processedKey);
      return Response.json({ error: "Premium report delivery failed." }, { status: 502 });
    }

    await Promise.all([
      redis.set(processedKey, "sent", { ex: 60 * 60 * 24 * 60 }),
      redis.del(`saju:pending-purchase:${reportId}`),
    ]);
    return Response.json({ received: true });
  } catch {
    await redis.del(processedKey).catch(() => undefined);
    return Response.json({ error: "Payment fulfillment is temporarily unavailable." }, { status: 503 });
  }
}
