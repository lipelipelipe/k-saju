import type { Metadata } from "next";
import { SajuExperience } from "@/components/saju-experience";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.titleKo,
    description: settings.descriptionKo,
    keywords: settings.keywordsKo.split(",").map((word) => word.trim()).filter(Boolean),
    alternates: { canonical: "/ko", languages: { "en-US": "/", "ko-KR": "/ko" } },
    openGraph: { title: settings.titleKo, description: settings.descriptionKo, url: "/ko", locale: "ko_KR", alternateLocale: ["en_US"], type: "website", images: [{ url: settings.ogImageUrl || "/opengraph-image", width: 1200, height: 630, alt: settings.siteName }] },
    twitter: { card: "summary_large_image", title: settings.titleKo, description: settings.descriptionKo, images: [settings.ogImageUrl || "/opengraph-image"] },
  };
}

export default function KoreanHomePage() {
  return <SajuExperience initialLocale="ko" />;
}
