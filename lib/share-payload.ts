import type { ElementKey, FocusKey, Locale } from "@/lib/dictionary";
import type { BirthChart } from "@/lib/saju-engine";

export type SharePillar = { label: string; korean: string; hanja: string };
export type SharePayload = {
  version: 1;
  locale: Locale;
  focus: FocusKey;
  readingIndex: number;
  dayMaster: { label: string; stem: string; hanja: string; yinYang: "yang" | "yin"; element: ElementKey; elementLabel: string };
  pillars: SharePillar[];
  elementBalance: Array<{ key: ElementKey; label: string; count: number }>;
  advanced: {
    tenGods: Array<{ label: string; stem: string; branch: string }>;
    voidBranches: string[];
    luckPillars: { forward: boolean; startAge: number; startYears: number; startMonths: number; startDays: number; pillars: Array<{ age: number; korean: string }> } | null;
  };
  reading: { first: string; second: string };
};

export function createSharePayload(chart: BirthChart, elementLabel: string, locale: Locale, first: string, second: string, focus: FocusKey, readingIndex: number): SharePayload {
  const labels = locale === "ko"
    ? { year: "년주", month: "월주", day: "일주", hour: "시주" }
    : { year: "YEAR", month: "MONTH", day: "DAY", hour: "HOUR" };
  const pillars = (["year", "month", "day", "hour"] as const)
    .map((key) => chart.pillars[key] ? ({ label: labels[key], korean: chart.pillars[key]!.korean, hanja: chart.pillars[key]!.hanja }) : null)
    .filter((item): item is SharePillar => item !== null);
  const elementLabels: Record<ElementKey, { ko: string; en: string }> = {
    wood: { ko: "목", en: "Wood" }, fire: { ko: "화", en: "Fire" }, earth: { ko: "토", en: "Earth" },
    metal: { ko: "금", en: "Metal" }, water: { ko: "수", en: "Water" },
  };
  return {
    version: 1,
    locale,
    focus,
    readingIndex,
    dayMaster: {
      label: locale === "ko" ? "나의 일간" : "MY DAY MASTER",
      stem: chart.dayMaster.stem,
      hanja: chart.dayMaster.hanja,
      yinYang: chart.dayMaster.yinYang,
      element: chart.dayMaster.element,
      elementLabel,
    },
    pillars,
    elementBalance: (["wood", "fire", "earth", "metal", "water"] as const).map((key) => ({ key, label: elementLabels[key][locale], count: chart.elementBalance[key] })),
    advanced: {
      tenGods: (["year", "month", "day", "hour"] as const)
        .filter((key) => chart.pillars[key] !== null)
        .map((key) => ({ label: labels[key], ...chart.tenGods[key] })),
      voidBranches: chart.voidBranches,
      luckPillars: chart.luckPillars,
    },
    reading: { first, second },
  };
}

export function encodeSharePayload(payload: SharePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function isText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

export function decodeSharePayload(token: string): SharePayload | null {
  if (token.length > 8000 || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(token.length / 4) * 4, "=");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const value: unknown = JSON.parse(json);
    if (!value || typeof value !== "object") return null;
    const payload = value as Partial<SharePayload>;
    if (payload.version !== 1 || (payload.locale !== "ko" && payload.locale !== "en")) return null;
    if (!["love", "wealth", "career"].includes(String(payload.focus)) || !Number.isInteger(payload.readingIndex) || payload.readingIndex! < 0 || payload.readingIndex! >= 400) return null;
    const master = payload.dayMaster;
    if (!master || !isText(master.label, 50) || !isText(master.stem, 2) || !isText(master.hanja, 2) || !isText(master.elementLabel, 50) || !["wood", "fire", "earth", "metal", "water"].includes(String(master.element)) || (master.yinYang !== "yin" && master.yinYang !== "yang")) return null;
    if (!Array.isArray(payload.pillars) || payload.pillars.length < 3 || payload.pillars.length > 4) return null;
    if (!payload.pillars.every((pillar) => pillar && isText(pillar.label, 12) && isText(pillar.korean, 4) && isText(pillar.hanja, 4))) return null;
    const elementKeys: ElementKey[] = ["wood", "fire", "earth", "metal", "water"];
    if (!Array.isArray(payload.elementBalance) || payload.elementBalance.length !== 5 || !payload.elementBalance.every((item) => item && elementKeys.includes(item.key) && isText(item.label, 12) && Number.isInteger(item.count) && item.count >= 0 && item.count <= 8)) return null;
    const reading = payload.reading;
    if (!reading || !isText(reading.first, 1600) || !isText(reading.second, 1600)) return null;
    const advanced = payload.advanced;
    if (!advanced || !Array.isArray(advanced.tenGods) || advanced.tenGods.length !== payload.pillars.length || !advanced.tenGods.every((item) => item && isText(item.label, 12) && isText(item.stem, 12) && isText(item.branch, 12)) || !Array.isArray(advanced.voidBranches) || advanced.voidBranches.length !== 2 || !advanced.voidBranches.every((item) => isText(item, 2))) return null;
    if (advanced.luckPillars !== null && (!advanced.luckPillars || typeof advanced.luckPillars.forward !== "boolean" || !Number.isInteger(advanced.luckPillars.startAge) || !Number.isInteger(advanced.luckPillars.startYears) || !Number.isInteger(advanced.luckPillars.startMonths) || !Number.isInteger(advanced.luckPillars.startDays) || !Array.isArray(advanced.luckPillars.pillars) || advanced.luckPillars.pillars.length > 12 || !advanced.luckPillars.pillars.every((item) => item && Number.isInteger(item.age) && isText(item.korean, 4)))) return null;
    return payload as SharePayload;
  } catch {
    return null;
  }
}
