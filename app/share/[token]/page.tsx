import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeSharePayload } from "@/lib/share-payload";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const payload = decodeSharePayload(token);
  if (!payload) return { title: "Saju Reading" };
  const korean = payload.locale === "ko";
  const title = korean ? "나만의 사주 리딩 · SAJU" : "My Korean Saju Reading · SAJU";
  const description = payload.reading.first.slice(0, 180);
  return {
    title,
    description,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: `/share/${token}/opengraph-image`, width: 1200, height: 630, alt: payload.dayMaster.label }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`/share/${token}/opengraph-image`] },
  };
}

export default async function SharedReadingPage({ params }: Props) {
  const { token } = await params;
  const payload = decodeSharePayload(token);
  if (!payload) notFound();
  const ko = payload.locale === "ko";
  return <main className="shared-page">
    <header className="shared-header"><a className="brand" href="/"><span className="brand-mark">太</span><span>SAJU<span className="brand-period">.</span></span></a><a className="shared-home" href="/">{ko ? "나도 사주 읽기 →" : "Get your own reading →"}</a></header>
    <section className="shared-main">
      <div className="shared-eyebrow"><span />{ko ? "나만을 위한 사주 리딩" : "A PERSONAL SAJU READING"}<span /></div>
      <div className="shared-daymaster"><span className="shared-orbit">{payload.dayMaster.hanja}</span><div className="shared-caption">{payload.dayMaster.label}</div><h1>{payload.dayMaster.elementLabel}</h1><p>{payload.dayMaster.stem} · {payload.dayMaster.hanja} · {payload.dayMaster.yinYang === "yang" ? "陽" : "陰"}</p></div>
      <section className="shared-pillars"><div className="shared-section-label">{ko ? "사주 네 기둥" : "THE FOUR PILLARS"}</div><div className="shared-pillar-grid">{payload.pillars.map((pillar) => <article className="shared-pillar" key={pillar.label}><span>{pillar.label}</span><strong>{pillar.hanja}</strong><small>{pillar.korean}</small></article>)}</div><div className="shared-balance-heading">{ko ? "여덟 글자의 오행 분포" : "VISIBLE FIVE-ELEMENT COUNT"}</div><div className="shared-balance">{payload.elementBalance.map((item) => <div className="shared-balance-item" key={item.key}><span>{item.label}</span><div><i style={{ width: `${item.count / (payload.pillars.length * 2) * 100}%` }} /></div><b>{item.count}</b></div>)}</div></section>
      <section className="shared-pillars"><div className="shared-section-label">{ko ? "십신 · 일간과의 관계" : "TEN GODS · DAY MASTER RELATIONSHIPS"}</div><div className="shared-pillar-grid">{payload.advanced.tenGods.map((item) => <article className="shared-pillar" key={item.label}><span>{item.label}</span><strong>{item.stem} · {item.branch}</strong></article>)}</div><div className="shared-balance-heading">{ko ? "공망" : "VOID BRANCHES"} · {payload.advanced.voidBranches.join(" · ")}</div>{payload.advanced.luckPillars && <><div className="shared-section-label shared-luck-heading">{ko ? "대운 흐름" : "DECADE LUCK CYCLES"} · {payload.advanced.luckPillars.forward ? (ko ? "순행" : "Forward") : (ko ? "역행" : "Backward")} · {payload.advanced.luckPillars.startAge}{ko ? "세 시작" : " years to first cycle"}</div><div className="shared-balance-heading">{payload.advanced.luckPillars.startYears}{ko ? "년 " : "y "}{payload.advanced.luckPillars.startMonths}{ko ? "개월 " : "m "}{payload.advanced.luckPillars.startDays}{ko ? "일" : "d"}</div><div className="shared-luck-list">{payload.advanced.luckPillars.pillars.map((cycle) => <span key={cycle.age}>{cycle.age}: {cycle.korean}</span>)}</div></>}</section>
      <section className="shared-reading"><div className="shared-section-label">{ko ? "당신 안에 흐르는 기운" : "THE ENERGY WITHIN YOU"}</div><p>{payload.reading.first}</p><p>{payload.reading.second}</p></section>
      <a className="hero-cta shared-cta" href="/">{ko ? "나의 사주 리딩 받기" : "Discover your own Saju reading"}<span aria-hidden="true">→</span></a>
      <p className="shared-disclaimer">{ko ? "자기 성찰 및 엔터테인먼트 목적으로 제공됩니다." : "For self-reflection and entertainment purposes only."}</p>
    </section>
    <footer className="shared-footer">© {new Date().getFullYear()} SAJU · {ko ? "동양의 지혜, 오늘의 나를 위해" : "ANCIENT WISDOM, FOR WHO YOU ARE TODAY"}</footer>
  </main>;
}
