import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const alt = "SAJU · Korean Four Pillars Reading";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const settings = await getSiteSettings();
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#eee9de", background: "radial-gradient(ellipse at 50% 43%, #242117 0%, #101011 48%, #09090a 100%)", fontFamily: "serif" }}>
      <div style={{ width: 110, height: 110, border: "1px solid #76613d", borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#c9aa6c", fontSize: 52 }}>太</div>
      <div style={{ marginTop: 27, color: "#c9aa6c", fontSize: 20, letterSpacing: 9 }}>SAJU · 四柱</div>
      <div style={{ marginTop: 20, fontSize: 45, letterSpacing: 1 }}>{settings.siteName}</div>
      <div style={{ marginTop: 19, maxWidth: 850, textAlign: "center", color: "#aaa396", fontSize: 23, lineHeight: 1.5 }}>{settings.descriptionEn}</div>
      <div style={{ position: "absolute", bottom: 33, color: "#827d72", fontSize: 15, letterSpacing: 5 }}>ANCIENT WISDOM · YOUR LIFE TODAY</div>
    </div>,
    size,
  );
}
