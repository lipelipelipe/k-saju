import { revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteSettings, validateSiteSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }) : null;

export async function GET() {
  if (!(await isAdminRequest())) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });
  if (!redis) return Response.json({ error: "Upstash Redis não está configurado." }, { status: 503 });
  const settings = await getSiteSettings();
  return Response.json(settings, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Origem inválida." }, { status: 403 });
  if (!(await isAdminRequest())) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });
  if (!redis) return Response.json({ error: "Upstash Redis não está configurado." }, { status: 503 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 10000) return Response.json({ error: "Os dados excedem o limite permitido." }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return Response.json({ error: "Não foi possível ler os dados enviados." }, { status: 400 }); }
  if (!validateSiteSettings(body)) return Response.json({ error: "Revise os campos: o domínio deve ser HTTPS em .vercel.app e os limites de texto devem ser respeitados." }, { status: 400 });
  try {
    await redis.set("saju:site-settings", body);
    revalidateTag("site-settings");
    return Response.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Não foi possível salvar no Redis. Tente novamente." }, { status: 503 }); }
}
