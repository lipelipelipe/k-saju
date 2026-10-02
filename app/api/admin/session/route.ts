import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createAdminSession, adminCookieName, hasAdminConfiguration, isAdminRequest, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }) : null;
const loginLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(8, "1 h"), prefix: "saju:admin-login", analytics: false }) : null;

function originIsValid(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function GET() {
  return Response.json({ authenticated: await isAdminRequest(), configured: hasAdminConfiguration() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!originIsValid(request)) return Response.json({ error: "Origem inválida." }, { status: 403 });
  if (!hasAdminConfiguration() || !redis || !loginLimiter) return Response.json({ error: "Configure ADMIN_PASSWORD, ADMIN_SESSION_SECRET e Upstash Redis na Vercel." }, { status: 503 });
  let body: { password?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 2048) return Response.json({ error: "Requisição inválida." }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return Response.json({ error: "Requisição inválida." }, { status: 400 }); }
  if (typeof body.password !== "string" || body.password.length > 512) return Response.json({ error: "Senha inválida." }, { status: 400 });
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  try {
    const limit = await loginLimiter.limit(ip);
    if (!limit.success) return Response.json({ error: "Muitas tentativas. Aguarde e tente novamente." }, { status: 429 });
  } catch { return Response.json({ error: "Proteção de acesso indisponível." }, { status: 503 }); }
  if (!verifyAdminPassword(body.password)) return Response.json({ error: "Senha incorreta." }, { status: 401 });
  const session = createAdminSession();
  const response = Response.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
  response.headers.append("Set-Cookie", `${adminCookieName}=${session.value}; Path=/; Max-Age=${session.maxAge}; HttpOnly; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return response;
}

export async function DELETE(request: Request) {
  if (!originIsValid(request)) return Response.json({ error: "Origem inválida." }, { status: 403 });
  const response = Response.json({ authenticated: false }, { headers: { "Cache-Control": "no-store" } });
  response.headers.append("Set-Cookie", `${adminCookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return response;
}
