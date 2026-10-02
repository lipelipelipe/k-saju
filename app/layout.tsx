import type { Metadata, Viewport } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.titleEn || settings.siteName;
  const description = settings.descriptionEn;
  return {
    metadataBase: new URL(settings.siteUrl),
    title: { default: title, template: `%s | ${settings.siteName}` },
    description,
    keywords: [...settings.keywordsEn.split(","), ...settings.keywordsKo.split(",")].map((word) => word.trim()).filter(Boolean),
    applicationName: settings.siteName,
    alternates: { canonical: "/", languages: { "en-US": "/", "ko-KR": "/ko" } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    verification: {
      ...(settings.googleVerification ? { google: settings.googleVerification } : {}),
      other: {
        ...(settings.bingVerification ? { "msvalidate.01": settings.bingVerification } : {}),
        ...(settings.naverVerification ? { "naver-site-verification": settings.naverVerification } : {}),
      },
    },
    openGraph: {
      title, description, siteName: settings.siteName, url: "/", type: "website", locale: "en_US", alternateLocale: ["ko_KR"],
      images: [{ url: settings.ogImageUrl || "/opengraph-image", width: 1200, height: 630, alt: settings.siteName }],
    },
    twitter: { card: "summary_large_image", title, description, images: [settings.ogImageUrl || "/opengraph-image"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: settings.siteUrl,
    description: settings.descriptionEn,
    inLanguage: ["en", "ko"],
  };
  return (
    <html lang="en">
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />{children}</body>
    </html>
  );
}
