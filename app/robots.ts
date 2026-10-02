import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSiteSettings();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] },
      { userAgent: "Yeti", allow: "/", disallow: ["/dashboard", "/api/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
