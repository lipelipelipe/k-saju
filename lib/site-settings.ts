import { unstable_cache } from "next/cache";
import { Redis } from "@upstash/redis";

export type SiteSettings = {
  siteName: string;
  siteUrl: string;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  keywordsKo: string;
  keywordsEn: string;
  ogImageUrl: string;
  googleVerification: string;
  bingVerification: string;
  naverVerification: string;
};

const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL || "https://saju-destiny-reading.vercel.app");

export const defaultSiteSettings: SiteSettings = {
  siteName: "SAJU",
  siteUrl: defaultUrl,
  titleKo: "한국 사주 풀이 | 나만의 사주와 오행 리딩",
  titleEn: "Korean Saju Reading | Your Four Pillars & Five Elements",
  descriptionKo: "태어난 날짜와 시간으로 사주 네 기둥과 오행의 흐름을 살펴보세요. 한국 전통 명리학에 영감을 받은 사주 리딩으로 자기 성찰의 시간을 만나보세요.",
  descriptionEn: "Explore your Korean Saju Four Pillars, Day Master, and five-element balance with a thoughtful, bilingual reading inspired by traditional Korean astrology.",
  keywordsKo: "한국 사주, 사주 풀이, 사주팔자, 사주 리딩, 오행, 만세력, 일주, 운세, 한국 점성술",
  keywordsEn: "Korean Saju, Saju reading, Four Pillars, BaZi, five elements, Day Master, Korean astrology, birth chart",
  ogImageUrl: "",
  googleVerification: "",
  bingVerification: "",
  naverVerification: "",
};

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

export const getSiteSettings = unstable_cache(async (): Promise<SiteSettings> => {
  try {
    const redis = getRedis();
    if (!redis) return defaultSiteSettings;
    const stored = await redis.get<Partial<SiteSettings>>("saju:site-settings");
    if (!stored || typeof stored !== "object") return defaultSiteSettings;
    return { ...defaultSiteSettings, ...stored };
  } catch {
    return defaultSiteSettings;
  }
}, ["saju-site-settings-v1"], { tags: ["site-settings"], revalidate: 300 });

export function validateSiteSettings(value: unknown): value is SiteSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as Record<string, unknown>;
  const limits: Record<keyof SiteSettings, number> = {
    siteName: 70, siteUrl: 253, titleKo: 120, titleEn: 120,
    descriptionKo: 320, descriptionEn: 320, keywordsKo: 500, keywordsEn: 500,
    ogImageUrl: 600, googleVerification: 250, bingVerification: 250, naverVerification: 250,
  };
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof settings[key] !== "string" || (settings[key] as string).length > limit) return false;
  }
  for (const key of ["siteName", "siteUrl", "titleKo", "titleEn", "descriptionKo", "descriptionEn"] as const) {
    if (!(settings[key] as string).trim()) return false;
  }
  try {
    const url = new URL(settings.siteUrl as string);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".vercel.app") || url.pathname !== "/" || url.search || url.hash) return false;
    if (settings.ogImageUrl) {
      const image = new URL(settings.ogImageUrl as string);
      if (image.protocol !== "https:") return false;
    }
  } catch { return false; }
  return true;
}
