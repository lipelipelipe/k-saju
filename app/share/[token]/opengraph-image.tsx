import { ImageResponse } from "next/og";
import { decodeSharePayload } from "@/lib/share-payload";

export const runtime = "edge";
export const alt = "A personal Korean Saju reading";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payload = decodeSharePayload(token);
  if (!payload) return new ImageResponse(<div style={{ display: "flex", background: "#0b0b0c", width: "100%", height: "100%", color: "#d2b779", alignItems: "center", justifyContent: "center", fontSize: 52 }}>SAJU · 四柱</div>, size);
  const ko = payload.locale === "ko";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0b0c", color: "#efeadd", padding: "54px 68px", fontFamily: "Georgia, serif", position: "relative" }}>
      <div style={{ position: "absolute", width: 620, height: 620, borderRadius: 310, border: "1px solid rgba(196,166,106,.12)", top: -205, right: -95, display: "flex" }} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15, color: "#c4a66c", letterSpacing: 7, fontSize: 20 }}><span style={{ fontSize: 30 }}>太</span>SAJU <span style={{ color: "#777164", fontSize: 14, letterSpacing: 3 }}>· 四柱</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 46, color: "#c4a66c", fontFamily: "Arial, sans-serif", fontSize: 13, letterSpacing: 4 }}><span style={{ display: "flex", width: 28, height: 1, background: "#8f7749" }} />{ko ? "나만을 위한 사주 리딩" : "A PERSONAL SAJU READING"}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22, marginTop: 17 }}><span style={{ color: "#d4ba80", fontSize: 58 }}>{payload.dayMaster.hanja}</span><span style={{ fontSize: 44 }}>{payload.dayMaster.elementLabel}</span></div>
        <div style={{ display: "flex", marginTop: 27, gap: 11 }}>
          {payload.pillars.map((pillar) => <div key={pillar.label} style={{ width: 108, height: 119, padding: "13px 12px", display: "flex", flexDirection: "column", alignItems: "center", background: "#141413", border: "1px solid #353126", borderRadius: 5 }}><span style={{ color: "#c4a66c", fontFamily: "Arial, sans-serif", fontSize: 10, letterSpacing: 2 }}>{pillar.label}</span><strong style={{ marginTop: 10, fontSize: 31, fontWeight: 400 }}>{pillar.hanja}</strong><span style={{ marginTop: 5, fontSize: 14, color: "#a39a87" }}>{pillar.korean}</span></div>)}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 17, fontFamily: "Arial, sans-serif", fontSize: 12, color: "#a39a87" }}>
          {payload.elementBalance.map((item) => <div key={item.key} style={{ width: 110, display: "flex", alignItems: "center", gap: 8 }}><span>{item.label}</span><span style={{ color: "#dfd0ad" }}>{item.count}</span><span style={{ display: "flex", flex: 1, height: 3, background: "#292721" }}><span style={{ display: "flex", width: `${item.count / (payload.pillars.length * 2) * 100}%`, height: "100%", background: "#b79a5e" }} /></span></div>)}
        </div>
        <div style={{ display: "flex", marginTop: 31, maxWidth: 950, fontFamily: "Arial, sans-serif", fontSize: 18, lineHeight: 1.65, color: "#aaa596" }}>{payload.reading.first.slice(0, 130)}{payload.reading.first.length > 130 ? "…" : ""}</div>
        <div style={{ display: "flex", marginTop: "auto", color: "#756f63", fontFamily: "Arial, sans-serif", fontSize: 11, letterSpacing: 2 }}>{ko ? "자기 성찰과 엔터테인먼트를 위한 리딩" : "FOR SELF-REFLECTION & ENTERTAINMENT"}<span style={{ marginLeft: "auto", color: "#ad9460" }}>{payload.dayMaster.stem} · {payload.dayMaster.yinYang === "yang" ? "陽" : "陰"}</span></div>
      </div>
    </div>,
    size,
  );
}
