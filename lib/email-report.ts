import type { Locale } from '@/lib/dictionary';
import { decodeSharePayload, type SharePayload } from '@/lib/share-payload';
import { getPremiumFocus, getReadingAtIndex } from '@/lib/reading-catalog';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}
export function renderReport(payload: SharePayload, locale: Locale, premium = false) {
  const reading = getReadingAtIndex(payload.dayMaster.element, payload.readingIndex, locale);
  const focusReading = getPremiumFocus(payload.dayMaster.element, payload.focus, locale);
  const labels = locale === "ko"
    ? { subject: premium ? "나만의 프리미엄 사주 리포트" : "당신의 사주 리딩 리포트", pillars: "나의 사주 네 기둥", dayMaster: "나의 일간", element: "오행 분포", tenGods: "십신 · 일간과의 관계", voidBranches: "공망", luck: "대운 흐름", focus: payload.focus === "love" ? "연애와 관계" : payload.focus === "wealth" ? "재물과 재정" : "커리어와 사업", outlook: "다가오는 흐름", closing: "이 리딩은 자기 성찰과 엔터테인먼트를 위한 콘텐츠입니다." }
    : { subject: premium ? "Your Premium Korean Saju Report" : "Your Korean Saju Reading", pillars: "YOUR FOUR PILLARS", dayMaster: "YOUR DAY MASTER", element: "FIVE-ELEMENT BALANCE", tenGods: "TEN GODS · DAY MASTER RELATIONSHIPS", voidBranches: "VOID BRANCHES", luck: "DECADE LUCK CYCLES", focus: payload.focus === "love" ? "LOVE & RELATIONSHIPS" : payload.focus === "wealth" ? "WEALTH & FINANCES" : "CAREER & BUSINESS", outlook: "THE MONTHS AHEAD", closing: "For self-reflection and entertainment purposes only." };
  const pillMarkup = payload.pillars.map((pillar) => `
    <td align="center" style="width:${100 / payload.pillars.length}%;padding:15px 7px;background:#171716;border:1px solid #39352d;">
      <div style="font:10px Arial,sans-serif;letter-spacing:2px;color:#c6aa70;">${escapeHtml(pillar.label)}</div>
      <div style="margin-top:8px;font:30px Georgia,serif;color:#eee8da;">${escapeHtml(pillar.hanja)}</div>
      <div style="margin-top:5px;font:12px Arial,sans-serif;color:#a59e8e;">${escapeHtml(pillar.korean)}</div>
    </td>`).join("");
  const balanceMarkup = payload.elementBalance.map((item) => `
    <td style="width:20%;padding:8px 5px;color:#a79f8e;font:10px Arial,sans-serif;text-align:center;">
      <div>${escapeHtml(item.label)} <span style="color:#e0d4b8;">${item.count}</span></div>
      <div style="height:3px;margin-top:7px;background:#2e2b24;"><div style="height:3px;width:${item.count / (payload.pillars.length * 2) * 100}%;background:#b79a5e;"></div></div>
    </td>`).join("");
  const advancedMarkup = `<div style="margin:0 0 23px;padding:15px 14px;background:#121212;border:1px solid #2a2822;">
    <div style="font:9px Arial,sans-serif;letter-spacing:2px;color:#aa9360;">${escapeHtml(labels.tenGods)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:10px;"><tr>${payload.advanced.tenGods.map((item) => `<td align="center" style="padding:8px 3px;color:#c0baad;font:10px Arial,sans-serif;border:1px solid #302d26;">${escapeHtml(item.label)}<br><b style="display:inline-block;margin-top:5px;color:#e0d4b8;">${escapeHtml(item.stem)} · ${escapeHtml(item.branch)}</b></td>`).join("")}</tr></table>
    <div style="margin-top:13px;font:10px Arial,sans-serif;color:#c0baad;">${escapeHtml(labels.voidBranches)}: <b style="color:#e0d4b8;">${payload.advanced.voidBranches.map(escapeHtml).join(" · ")}</b></div>
    ${payload.advanced.luckPillars ? `<div style="margin-top:8px;font:10px Arial,sans-serif;color:#c0baad;">${escapeHtml(labels.luck)} · ${payload.advanced.luckPillars.forward ? (locale === "ko" ? "순행" : "Forward") : (locale === "ko" ? "역행" : "Backward")} · ${payload.advanced.luckPillars.startAge}${locale === "ko" ? "세 시작" : " years to first cycle"} (${payload.advanced.luckPillars.startYears}${locale === "ko" ? "년 " : "y "}${payload.advanced.luckPillars.startMonths}${locale === "ko" ? "개월 " : "m "}${payload.advanced.luckPillars.startDays}${locale === "ko" ? "일" : "d"})</div><div style="margin-top:8px;font:10px/1.8 Arial,sans-serif;color:#b79a5e;">${payload.advanced.luckPillars.pillars.map((item) => `${item.age}: ${escapeHtml(item.korean)}`).join("　·　")}</div>` : ""}
  </div>`;
  const first = escapeHtml(payload.reading.first).replace(/\n/g, "<br>");
  const second = escapeHtml(payload.reading.second).replace(/\n/g, "<br>");
  const premiumMarkup = premium ? `
    <div style="margin-top:15px;padding:20px 19px;background:#151410;border:1px solid #655438;">
      <div style="font:9px Arial,sans-serif;letter-spacing:2px;color:#c4a66c;">${escapeHtml(labels.focus)}</div>
      <p style="margin:11px 0 0;font:14px/1.9 Arial,sans-serif;color:#c0baad;">${escapeHtml(focusReading)}</p>
      <div style="margin-top:22px;font:9px Arial,sans-serif;letter-spacing:2px;color:#c4a66c;">${escapeHtml(labels.outlook)}</div>
      <p style="margin:11px 0 0;font:14px/1.9 Arial,sans-serif;color:#c0baad;">${escapeHtml(reading.locked)}</p>
    </div>` : "";
  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;background:#0b0b0c;color:#eeeae0;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:32px 18px 42px;">
      <div style="text-align:center;padding:20px 12px 27px;border-bottom:1px solid #29271f;">
        <div style="font:26px Georgia,serif;color:#c4a66c;">太 SAJU</div>
        <div style="margin-top:9px;font:9px Arial,sans-serif;letter-spacing:3px;color:#c4a66c;">A PERSONAL READING, ROOTED IN ANCIENT WISDOM</div>
      </div>
      <div style="padding:27px 8px 16px;text-align:center;">
        <div style="font:10px Arial,sans-serif;letter-spacing:2px;color:#aa9360;">${escapeHtml(labels.dayMaster)}</div>
        <div style="margin-top:8px;font:31px Georgia,serif;color:#efe9dc;">${escapeHtml(payload.dayMaster.elementLabel)}</div>
        <div style="margin-top:5px;font:15px Georgia,serif;color:#b7a477;">${escapeHtml(payload.dayMaster.stem)} · ${escapeHtml(payload.dayMaster.hanja)}</div>
      </div>
      <div style="padding:13px 0 10px;">
        <div style="margin-bottom:10px;font:9px Arial,sans-serif;letter-spacing:2px;color:#aa9360;">${escapeHtml(labels.pillars)}</div>
        <table role="presentation" cellpadding="0" cellspacing="5" border="0" style="width:100%;"><tr>${pillMarkup}</tr></table>
      </div>
      <div style="padding:6px 0 23px;">
        <div style="margin-bottom:5px;font:9px Arial,sans-serif;letter-spacing:2px;color:#aa9360;">${escapeHtml(labels.element)}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr>${balanceMarkup}</tr></table>
      </div>
      ${advancedMarkup}
      <div style="padding:20px 19px;background:#121212;border:1px solid #2a2822;">
        <div style="font:10px Arial,sans-serif;letter-spacing:2px;color:#c4a66c;">${escapeHtml(labels.element)}</div>
        <h2 style="margin:8px 0 15px;font:22px Georgia,serif;font-weight:normal;color:#eeeae0;">${locale === "ko" ? "당신 안에 흐르는 기운" : "The energy within you"}</h2>
        <p style="margin:0 0 14px;font:14px/1.9 Arial,sans-serif;color:#c0baad;">${first}</p>
        <p style="margin:0;font:14px/1.9 Arial,sans-serif;color:#c0baad;">${second}</p>
      </div>
      ${premiumMarkup}
      <div style="padding:24px 8px;text-align:center;font:10px/1.7 Arial,sans-serif;color:#827d72;">${escapeHtml(labels.closing)}<br>SAJU · ${new Date().getFullYear()}</div>
    </div>
  </body></html>`;
  const text = `${labels.subject}\n\n${labels.dayMaster}: ${payload.dayMaster.elementLabel} (${payload.dayMaster.hanja})\n\n${labels.pillars}\n${payload.pillars.map((pillar) => `${pillar.label}: ${pillar.hanja} (${pillar.korean})`).join("\n")}\n\n${labels.tenGods}\n${payload.advanced.tenGods.map((item) => `${item.label}: ${item.stem} · ${item.branch}`).join("\n")}\n${labels.voidBranches}: ${payload.advanced.voidBranches.join(" · ")}${payload.advanced.luckPillars ? `\n${labels.luck}: ${payload.advanced.luckPillars.pillars.map((item) => `${item.age}: ${item.korean}`).join(" · ")}` : ""}\n\n${payload.reading.first}\n\n${payload.reading.second}${premium ? `\n\n${labels.focus}\n${focusReading}\n\n${labels.outlook}\n${reading.locked}` : ""}\n\n${labels.closing}`;
  return { subject: labels.subject, html, text };
}
