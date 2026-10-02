import {
  calculateFourPillars,
  getEarthlyBranchElement,
  getHeavenlyStemElement,
  getHeavenlyStemYinYang,
  lunarToSolar,
  type DayBoundary,
  type Gender as SajuGender,
  type FiveElement,
} from "manseryeok";
import type { ElementKey } from "@/lib/dictionary";

export type BirthCalendar = "solar" | "lunar";
export type BirthGender = "male" | "female" | "other";
export type BirthDetails = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  calendar: BirthCalendar;
  leapMonth?: boolean;
  timeZone: string;
  longitude: number;
  gender: BirthGender;
  dayBoundary: DayBoundary;
};

export type ChartPillar = {
  korean: string;
  hanja: string;
  stem: string;
  branch: string;
  stemElement: ElementKey;
  branchElement: ElementKey;
};

export type BirthChart = {
  pillars: { year: ChartPillar; month: ChartPillar; day: ChartPillar; hour: ChartPillar | null };
  dayMaster: { stem: string; hanja: string; yinYang: "yang" | "yin"; element: ElementKey };
  elementBalance: Record<ElementKey, number>;
  tenGods: Record<"year" | "month" | "day" | "hour", { stem: string; branch: string }>;
  voidBranches: string[];
  luckPillars: { forward: boolean; startAge: number; startYears: number; startMonths: number; startDays: number; pillars: Array<{ age: number; korean: string }> } | null;
  solarBirth: { year: number; month: number; day: number };
  timeZone: string;
  usedTrueSolarTime: true;
  dayBoundary: DayBoundary;
};

const elementKeys: Record<FiveElement, ElementKey> = {
  목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water",
};
const stemHanja: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

function zonedParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB-u-ca-gregory-nu-latn", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(instant);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year), month: Number(values.month), day: Number(values.day),
    hour: Number(values.hour), minute: Number(values.minute),
  };
}

/** Resolve a wall-clock birth time in its IANA zone, including historical DST rules. */
function localTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, timeZone: string) {
  // Validate the time-zone identifier before attempting conversion.
  zonedParts(new Date(), timeZone);
  const targetWallTime = Date.UTC(year, month - 1, day, hour, minute);
  let guess = targetWallTime;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const local = zonedParts(new Date(guess), timeZone);
    const representedWallTime = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute);
    const difference = targetWallTime - representedWallTime;
    if (difference === 0) return new Date(guess);
    guess += difference;
  }
  throw new RangeError("That local time does not exist in the selected time zone because of a clock change.");
}

function toPillar(korean: string, hanja: string, stemElement: FiveElement, branchElement: FiveElement): ChartPillar {
  return {
    korean, hanja, stem: korean[0], branch: korean[1],
    stemElement: elementKeys[stemElement], branchElement: elementKeys[branchElement],
  };
}

export function calculateBirthChart(details: BirthDetails): BirthChart {
  const solarDate = details.calendar === "lunar"
    ? lunarToSolar(details.year, details.month, details.day, Boolean(details.leapMonth))
    : { year: details.year, month: details.month, day: details.day };

  const hour = details.hour ?? 12;
  const minute = details.minute ?? 0;
  const birthInstant = localTimeToUtc(solarDate.year, solarDate.month, solarDate.day, hour, minute, details.timeZone);
  const koreanStandardTime = zonedParts(birthInstant, "Asia/Seoul");

  const gender: SajuGender | undefined = details.gender === "other" ? undefined : details.gender;
  const calculated = calculateFourPillars({
    ...koreanStandardTime,
    trueSolarTime: {
      longitude: details.longitude,
      applyEquationOfTime: true,
      // The input instant has already been normalized to KST from the selected IANA zone.
      applyHistoricalDst: false,
    },
    dayBoundary: details.dayBoundary,
    ...(gender ? { gender } : {}),
  });
  const hangul = calculated.toObject();
  const hanja = calculated.toHanjaObject();
  const toDetail = (name: keyof typeof hangul) => {
    const pillar = calculated[name];
    return toPillar(hangul[name], hanja[name].hanja, getHeavenlyStemElement(pillar.heavenlyStem), getEarthlyBranchElement(pillar.earthlyBranch));
  };

  const dayStem = calculated.day.heavenlyStem;
  const pillars = {
    year: toDetail("year"), month: toDetail("month"), day: toDetail("day"),
    hour: details.hour === undefined ? null : toDetail("hour"),
  };
  const elementBalance: Record<ElementKey, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const pillar of Object.values(pillars)) {
    if (!pillar) continue;
    elementBalance[pillar.stemElement] += 1;
    elementBalance[pillar.branchElement] += 1;
  }

  return {
    pillars,
    dayMaster: {
      stem: dayStem,
      hanja: stemHanja[dayStem],
      yinYang: getHeavenlyStemYinYang(dayStem) === "양" ? "yang" : "yin",
      element: elementKeys[getHeavenlyStemElement(dayStem)],
    },
    elementBalance,
    tenGods: calculated.tenGods,
    voidBranches: calculated.voidBranches,
    luckPillars: calculated.luckPillars ? {
      forward: calculated.luckPillars.forward,
      startAge: calculated.luckPillars.startAge,
      startYears: calculated.luckPillars.startYears,
      startMonths: calculated.luckPillars.startMonths,
      startDays: calculated.luckPillars.startDays,
      pillars: calculated.luckPillars.pillars.map(({ age, korean }) => ({ age, korean })),
    } : null,
    solarBirth: solarDate,
    timeZone: details.timeZone,
    usedTrueSolarTime: true,
    dayBoundary: details.dayBoundary,
  };
}
