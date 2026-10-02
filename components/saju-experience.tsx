"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, Compass, Flame, LockKeyhole,
  Moon, Mountain, Sparkles, Sun, Waves, Wind,
} from "lucide-react";
import { copy, elementContent, focusOptions, type ElementKey, type FocusKey, type Locale } from "@/lib/dictionary";
import { calculateBirthChart, type BirthCalendar, type BirthChart, type BirthGender } from "@/lib/saju-engine";
import { createSharePayload, type SharePayload } from "@/lib/share-payload";
import { getReading } from "@/lib/reading-catalog";
import { ShareActions } from "@/components/share-actions";

type Phase = "form" | "loading" | "result";
const elementIcons = { wood: Wind, fire: Flame, earth: Mountain, metal: Moon, water: Waves };
const pillarKeys = ["year", "month", "day", "hour"] as const;
const pillarLabelKeys = { year: "yearPillar", month: "monthPillar", day: "dayPillar", hour: "hourPillar" } as const;
const elementBarColors: Record<ElementKey, string> = { wood: "#91a47a", fire: "#c98768", earth: "#c4a66c", metal: "#9aa8af", water: "#758eaa" };
const elementHangul: Record<ElementKey, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const birthPlaces = [
  { key: "seoul", ko: "서울특별시", en: "Seoul Special City", longitude: 126.9780 },
  { key: "busan", ko: "부산광역시", en: "Busan Metropolitan City", longitude: 129.0756 },
  { key: "daegu", ko: "대구광역시", en: "Daegu Metropolitan City", longitude: 128.6014 },
  { key: "incheon", ko: "인천광역시", en: "Incheon Metropolitan City", longitude: 126.7052 },
  { key: "gwangju", ko: "광주광역시", en: "Gwangju Metropolitan City", longitude: 126.8526 },
  { key: "daejeon", ko: "대전광역시", en: "Daejeon Metropolitan City", longitude: 127.3845 },
  { key: "ulsan", ko: "울산광역시", en: "Ulsan Metropolitan City", longitude: 129.3114 },
  { key: "sejong", ko: "세종특별자치시", en: "Sejong Special Self-Governing City", longitude: 127.2890 },
  { key: "gyeonggi", ko: "경기도", en: "Gyeonggi Province · Suwon", longitude: 127.0089 },
  { key: "gangwon", ko: "강원특별자치도", en: "Gangwon Special Self-Governing Province · Chuncheon", longitude: 127.7298 },
  { key: "chungbuk", ko: "충청북도", en: "North Chungcheong Province · Cheongju", longitude: 127.4890 },
  { key: "chungnam", ko: "충청남도", en: "South Chungcheong Province · Hongseong", longitude: 126.6600 },
  { key: "jeonbuk", ko: "전북특별자치도", en: "Jeonbuk Special Self-Governing Province · Jeonju", longitude: 127.1480 },
  { key: "jeonnam", ko: "전라남도", en: "South Jeolla Province · Muan", longitude: 126.4810 },
  { key: "gyeongbuk", ko: "경상북도", en: "North Gyeongsang Province · Andong", longitude: 128.7294 },
  { key: "gyeongnam", ko: "경상남도", en: "South Gyeongsang Province · Changwon", longitude: 128.6811 },
  { key: "jeju", ko: "제주특별자치도", en: "Jeju Special Self-Governing Province", longitude: 126.5312 },
];

export function SajuExperience({ initialLocale = "en" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<BirthGender>("female");
  const [calendar, setCalendar] = useState<BirthCalendar>("solar");
  const [leapMonth, setLeapMonth] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthplace, setBirthplace] = useState("seoul");
  const [longitude, setLongitude] = useState("126.978");
  const [dayBoundary, setDayBoundary] = useState<"midnight" | "jasi" | "splitJasi">("midnight");
  const [focus, setFocus] = useState<FocusKey>("love");
  const [phase, setPhase] = useState<Phase>("form");
  const [progress, setProgress] = useState(0);
  const [readingName, setReadingName] = useState("");
  const [readingIdentity, setReadingIdentity] = useState("");
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [typed, setTyped] = useState(0);
  const [notice, setNotice] = useState("");

  const t = copy[locale];
  const element: ElementKey = chart?.dayMaster.element ?? "wood";
  const elementInfo = elementContent[element];
  const Icon = elementIcons[element];
  const dayMasterName = chart
    ? locale === "ko"
      ? `${chart.dayMaster.yinYang === "yang" ? "양" : "음"}${elementHangul[element]} (${chart.dayMaster.stem}${chart.dayMaster.hanja})`
      : `${chart.dayMaster.yinYang === "yang" ? "Yang" : "Yin"} ${elementInfo.en.replace(/^Yang /, "")} · ${chart.dayMaster.stem} ${chart.dayMaster.hanja}`
    : "";
  const reading = getReading(element, readingIdentity, locale);
  const combined = `${reading.first}\n\n${reading.second}`;

  function chooseLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    const nextPath = nextLocale === "ko" ? "/ko" : "/";
    window.history.replaceState(null, "", `${nextPath}${window.location.hash}`);
  }

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  useEffect(() => {
    if (phase !== "loading") return;
    setProgress(0);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setProgress(Math.min(elapsed / 3000, 1));
      if (elapsed >= 3000) { window.clearInterval(timer); setPhase("result"); }
    }, 50);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "result") return;
    setTyped(0);
    const timer = window.setInterval(() => setTyped((count) => {
      if (count >= combined.length) { window.clearInterval(timer); return combined.length; }
      return Math.min(count + 3, combined.length);
    }), 18);
    return () => window.clearInterval(timer);
  }, [phase, combined]);

  const sharePayload = useMemo<SharePayload | null>(() => {
    if (!chart) return null;
    return createSharePayload(chart, dayMasterName, locale, reading.first, reading.second, focus, reading.index);
  }, [chart, dayMasterName, locale, reading.first, reading.index, reading.second, focus]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const [year, month, day] = date.split("-").map(Number);
    const maxDay = new Date(year, month, 0).getDate();
    const long = Number(longitude);
    const maxYear = calendar === "lunar" ? 2100 : 2300;
    const supportedYear = year >= 1800 && year <= maxYear;
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && supportedYear && month >= 1 && month <= 12 && day >= 1 && day <= maxDay;
    if (!name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) { setNotice(t.validation); return; }
    if (!supportedYear) { setNotice(t.dateRangeError); return; }
    if (!validDate) { setNotice(t.validation); return; }
    if (!birthPlaces.some((place) => place.key === birthplace) || !Number.isFinite(long) || long < 123 || long > 132) {
      setNotice(locale === "ko" ? "출생 지역과 경도를 확인해 주세요." : "Check your Korean birth region and longitude.");
      return;
    }
    setNotice("");
    const [dateYear, dateMonth, dateDay] = date.split("-").map(Number);
    const [hour, minute] = unknownTime ? [undefined, undefined] : (time || "12:00").split(":").map(Number);
    try {
      const nextChart = calculateBirthChart({
        year: dateYear, month: dateMonth, day: dateDay,
        ...(hour === undefined ? {} : { hour, minute }),
        calendar, leapMonth, timeZone: "Asia/Seoul", longitude: long, gender, dayBoundary,
      });
      setChart(nextChart);
      setReadingName(name.trim());
      setReadingIdentity(`${nextChart.dayMaster.stem}|${nextChart.pillars.year.hanja}|${nextChart.pillars.month.hanja}|${nextChart.pillars.day.hanja}|${nextChart.pillars.hour?.hanja ?? "unknown"}|${focus}`);
      setPhase("loading");
    } catch (error) {
      setNotice(t.calculationError);
    }
  }

  function reset() { setPhase("form"); setTyped(0); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Saju home"><span className="brand-mark">太</span><span>SAJU<span className="brand-period">.</span></span></a>
        <a className="header-link" href="#reading">{t.nav}<ArrowRight size={14} /></a>
        <div className="language-switch" role="group" aria-label="Choose language">
          <button type="button" onClick={() => chooseLocale("ko")} className={locale === "ko" ? "active" : ""} aria-pressed={locale === "ko"}>한국어</button>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => chooseLocale("en")} className={locale === "en" ? "active" : ""} aria-pressed={locale === "en"}>English</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <span className="hero-star star-a">✳</span><span className="hero-star star-b">✧</span>
        <div className="hero-inner">
          <div className="eyebrow"><span className="eyebrow-line" />{t.heroEyebrow}<span className="eyebrow-line" /></div>
          <div className="hero-sigil" aria-hidden="true"><span>陰</span><span className="sigil-dot">☯</span><span>陽</span></div>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroBody}</p>
          <a className="hero-cta" href="#reading">{t.submit}<ArrowDown size={15} /></a>
          <div className="hero-trust"><Sparkles size={14} /> {t.trust}</div>
        </div>
        <div className="hero-footnote"><span>木</span> <i>·</i> <span>火</span> <i>·</i> <span>土</span> <i>·</i> <span>金</span> <i>·</i> <span>水</span></div>
      </section>

      {phase === "form" && <section className="form-section" id="reading">
        <div className="section-heading"><div className="section-kicker">{locale === "ko" ? "01 — 나의 사주 명식" : "01 — YOUR BIRTH CHART"}</div><h2>{t.formTitle}</h2><p>{t.formSub}</p></div>
        <form className="reading-form" onSubmit={submit}>
          <label className="field-label" htmlFor="name">{t.name}</label>
          <input className="text-input" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} maxLength={40} autoComplete="given-name" required />
          <fieldset className="gender-field"><legend className="field-label">{t.gender}</legend><div className="gender-options">{(["male", "female", "other"] as const).map((value) => <button type="button" key={value} aria-pressed={gender === value} className={`choice-pill ${gender === value ? "selected" : ""}`} onClick={() => setGender(value)}>{t.genders[value]}</button>)}</div></fieldset>

          <fieldset className="calendar-field"><legend className="field-label">{t.birthCalendar}</legend><div className="gender-options">{(["solar", "lunar"] as const).map((value) => <button type="button" key={value} aria-pressed={calendar === value} className={`choice-pill ${calendar === value ? "selected" : ""}`} onClick={() => setCalendar(value)}>{value === "solar" ? t.solarCalendar : t.lunarCalendar}</button>)}</div></fieldset>
          <div className="field-label birth-label">{t.birthDate}</div>
          <div className="date-grid">
            <input className="text-input" type="number" inputMode="numeric" placeholder={t.dateLabels.year} aria-label={t.dateLabels.year} min="1800" max={calendar === "lunar" ? "2100" : "2300"} value={date ? date.split("-")[0] : ""} onChange={(e) => { const [, m = "01", d = "01"] = date.split("-"); setDate(`${e.target.value}-${m}-${d}`); }} required />
            <input className="text-input" type="number" inputMode="numeric" placeholder={t.dateLabels.month} aria-label={t.dateLabels.month} min="1" max="12" value={date ? Number(date.split("-")[1]) : ""} onChange={(e) => { const [y = "2000", , d = "01"] = date.split("-"); setDate(`${y}-${e.target.value.padStart(2, "0")}-${d}`); }} required />
            <input className="text-input" type="number" inputMode="numeric" placeholder={t.dateLabels.day} aria-label={t.dateLabels.day} min="1" max="31" value={date ? Number(date.split("-")[2]) : ""} onChange={(e) => { const [y = "2000", m = "01"] = date.split("-"); setDate(`${y}-${m}-${e.target.value.padStart(2, "0")}`); }} required />
          </div>
          {calendar === "lunar" && <label className="checkbox-label"><input type="checkbox" checked={leapMonth} onChange={(e) => setLeapMonth(e.target.checked)} /><span className="custom-check"><Check size={13} /></span>{t.leapMonth}</label>}

          <label className="field-label location-label" htmlFor="birthplace">{t.birthplace}</label>
          <div className="time-select-wrap"><select className="text-input time-select" id="birthplace" value={birthplace} onChange={(e) => { const match = birthPlaces.find((place) => place.key === e.target.value); if (match) { setBirthplace(match.key); setLongitude(String(match.longitude)); } }} required>{birthPlaces.map((place) => <option key={place.key} value={place.key}>{locale === "ko" ? place.ko : place.en}</option>)}</select><ChevronDown size={16} /></div>
          <p className="field-hint">{t.birthplaceHelp}</p>
          <label className="field-label time-label" htmlFor="timezone">{t.timeZone}</label>
          <input className="text-input" id="timezone" value="Asia/Seoul (KST, UTC+09:00)" readOnly aria-readonly="true" />
          <label className="field-label time-label" htmlFor="longitude">{t.longitude}</label>
          <input className="text-input" id="longitude" type="number" min="123" max="132" step="0.0001" inputMode="decimal" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
          <p className="field-hint">{t.longitudeHint}</p>

          <label className="field-label time-label" htmlFor="birth-time">{t.birthTime}</label>
          <div className={`time-select-wrap ${unknownTime ? "disabled" : ""}`}><input id="birth-time" className="text-input time-select" type="time" value={unknownTime ? "" : time} onChange={(e) => setTime(e.target.value)} disabled={unknownTime} required={!unknownTime} aria-label={t.birthTime} /></div>
          <label className="checkbox-label"><input type="checkbox" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTime(""); }} /><span className="custom-check"><Check size={13} /></span>{t.unknownTime}</label>
          <label className="field-label time-label" htmlFor="day-boundary">{t.dayBoundary}</label>
          <div className="time-select-wrap"><select className="text-input time-select" id="day-boundary" value={dayBoundary} onChange={(e) => setDayBoundary(e.target.value as typeof dayBoundary)}><option value="midnight">{t.midnightBoundary}</option><option value="jasi">{t.earlyZiBoundary}</option><option value="splitJasi">{t.splitZiBoundary}</option></select><ChevronDown size={16} /></div>

          <fieldset className="focus-field"><legend className="field-label">{t.focus}</legend><div className="focus-options">{focusOptions.map((value) => <button type="button" key={value} aria-pressed={focus === value} className={`focus-card ${focus === value ? "selected" : ""}`} onClick={() => setFocus(value)}><span>{value === "love" ? "♡" : value === "wealth" ? "₩" : "↗"}</span>{t.focuses[value]}{focus === value && <Check className="focus-check" size={14} />}</button>)}</div></fieldset>
          {notice && <p className="form-notice" role="alert">{notice}</p>}
          <button className="submit-button" type="submit">{t.submit}<ArrowRight size={17} /></button>
          <p className="form-privacy"><LockKeyhole size={12} /> {locale === "ko" ? "입력하신 정보는 기기에서 계산되며 저장되지 않습니다." : "Your chart is calculated on this device; birth details are not stored."}</p>
        </form>
      </section>}

      {phase === "loading" && <section className="loading-section" aria-live="polite"><div className="loading-mandala"><div className="loading-ring" /><span>四</span></div><p className="loading-kicker">{locale === "ko" ? "사주 명식 분석" : "READING YOUR BIRTH CHART"}</p><div className="loading-steps">{t.loading.map((message, index) => <p className={progress * 3 >= index ? "step-active" : ""} key={message}><span>{progress * 3 >= index + 1 ? "✦" : "·"}</span>{message}</p>)}</div><div className="progress-track"><span style={{ transform: `scaleX(${progress})` }} /></div></section>}

      {phase === "result" && chart && <section className="result-section" id="reading">
        <button type="button" className="back-button" onClick={reset}><ArrowLeft size={15} />{t.newReading}</button>
        <div className="result-heading"><span className="section-kicker">{locale === "ko" ? "02 — 당신만을 위한 리딩" : "02 — YOUR PERSONAL READING"}</span><h2>{readingName}{t.readingFor}</h2></div>
        <article className="element-card"><div className="element-card-top"><span>{t.dayMaster}</span><Sparkles size={15} /></div><div className="element-display"><div className="element-glyph"><Icon size={34} strokeWidth={1.2} /></div><div><div className="element-name">{dayMasterName}</div><div className="element-subtitle">{chart.dayMaster.stem} · {chart.dayMaster.hanja} · {chart.dayMaster.yinYang === "yang" ? "陽" : "陰"}{locale === "ko" ? " 일간" : " Day Master"}</div></div></div><div className="element-bottom"><span>{locale === "ko" ? "日主 · 일간 오행" : "DAY MASTER · FIVE ELEMENTS"}</span><span>{elementInfo.icon}　{chart.dayMaster.hanja}</span></div></article>

        <section className="pillars-panel"><div className="panel-heading"><span>{t.chartLabel}</span><span>四柱 · 四</span></div><div className="pillars-grid">{pillarKeys.map((key) => { const pillar = chart.pillars[key]; return <article className={`pillar-tile ${key === "day" ? "pillar-day" : ""} ${!pillar ? "pillar-unknown" : ""}`} key={key}><span className="pillar-label">{t[pillarLabelKeys[key]]}</span>{pillar ? <><span className="pillar-hanja">{pillar.hanja}</span><span className="pillar-korean">{pillar.korean}</span><span className="pillar-element-dots"><i style={{ background: elementBarColors[pillar.stemElement] }} /><i style={{ background: elementBarColors[pillar.branchElement] }} /></span></> : <span className="pillar-unknown-label">{t.unknownPillar}</span>}</article>; })}</div><div className="balance-heading">{t.elementBalance}</div><div className="element-balance">{(["wood", "fire", "earth", "metal", "water"] as const).map((key) => <div className="balance-item" key={key}><div className="balance-track"><span style={{ width: `${chart.elementBalance[key] / (chart.pillars.hour ? 8 : 6) * 100}%`, background: elementBarColors[key] }} /></div><span>{locale === "ko" ? elementContent[key].ko.replace("의 ", "") : key[0].toUpperCase() + key.slice(1)}</span><strong>{chart.elementBalance[key]}</strong></div>)}</div></section>

        <section className="advanced-chart-panel"><div className="panel-heading"><span>{t.tenGodsTitle}</span><span>十神</span></div><p className="advanced-hint">{t.tenGodsHint}</p><div className="ten-gods-grid">{pillarKeys.map((key) => { const pillar = chart.pillars[key]; const gods = chart.tenGods[key]; return <div className={`ten-god-tile ${!pillar ? "pillar-unknown" : ""}`} key={key}><span className="pillar-label">{t[pillarLabelKeys[key]]}</span>{pillar ? <><strong>{gods.stem}</strong><span>{gods.branch}</span></> : <span className="pillar-unknown-label">{t.unknownPillar}</span>}</div>; })}</div><div className="advanced-footer"><div><span className="advanced-label">{t.voidTitle}</span><strong>{chart.voidBranches.join(" · ")}</strong></div>{chart.luckPillars && <div><span className="advanced-label">{t.luckTitle}</span><strong>{chart.luckPillars.forward ? t.luckForward : t.luckBackward} · {t.luckStart} {chart.luckPillars.startAge} ({chart.luckPillars.startYears}{locale === "ko" ? "년 " : "y "}{chart.luckPillars.startMonths}{locale === "ko" ? "개월 " : "m "}{chart.luckPillars.startDays}{locale === "ko" ? "일" : "d"})</strong></div>}</div>{chart.luckPillars ? <div className="luck-cycle-list">{chart.luckPillars.pillars.map((cycle) => <span key={`${cycle.age}-${cycle.korean}`}><b>{cycle.age} {t.luckAge}</b>{cycle.korean}</span>)}</div> : <p className="advanced-hint">{t.unknownLuck}</p>}</section>

        <article className="reading-card"><div className="reading-card-heading"><div className="reading-icon"><Sun size={17} /></div><div><span className="reading-overline">{t.freeLabel} <span className="reading-count">· {String(reading.index + 1).padStart(3, "0")} / 400</span></span><h3>{t.freeReading}</h3></div></div><p className="typewriter-text">{reading.first.slice(0, typed)}{typed < reading.first.length && <span className="type-cursor" />}</p><p className={`typewriter-text second-paragraph ${typed > reading.first.length ? "revealed" : ""}`}>{typed > reading.first.length ? reading.second.slice(0, Math.max(0, typed - reading.first.length - 2)) : ""}{typed >= combined.length && <span className="type-cursor" />}</p></article>
        <article className="locked-preview"><div className="locked-label"><span />{t.lockedLabel}</div><p className="blurred-copy" aria-hidden="true">{reading.locked}</p><div className="lock-overlay"><span className="lock-icon"><LockKeyhole size={17} /></span><span>{locale === "ko" ? "나만의 미래 리딩" : "YOUR PERSONAL FUTURE READING"}</span></div></article>
        <article className="unlock-card"><div className="unlock-orbit" /><div className="unlock-icon"><Compass size={20} /></div><span className="unlock-kicker">SAJU · PREMIUM REPORT</span><h3>{locale === "ko" ? t.unlockKo : t.unlockEn}</h3><p>{t.lockedCopy}</p><div className="price-row"><span>{t.price}</span><span>{t.priceUsd}</span></div><PurchaseButton payload={sharePayload} label={t.purchase} missingLabel={t.checkoutMissing} locale={locale} /><div className="secure-note"><LockKeyhole size={11} />{t.safe}</div></article>
        {sharePayload && <ShareActions payload={sharePayload} locale={locale} />}
        <p className="result-disclaimer">{t.footerEn}</p>
      </section>}

      <footer className="site-footer"><span className="footer-symbol">太</span><p>{locale === "ko" ? t.footer : t.footerEn}</p><span>© 2026 SAJU</span></footer>
    </main>
  );
}

function PurchaseButton({ payload, label, missingLabel, locale }: { payload: SharePayload | null; label: string; missingLabel: string; locale: Locale }) {
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function beginCheckout() {
    if (!checkoutUrl) { window.alert(missingLabel); return; }
    if (!payload) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload }) });
      const data = await response.json();
      if (!response.ok || typeof data.checkoutUrl !== "string") throw new Error("Checkout is unavailable");
      window.location.assign(data.checkoutUrl);
    } catch { setLoading(false); setError(locale === "ko" ? "결제를 준비할 수 없어요. 잠시 후 다시 시도해 주세요." : "Checkout could not be prepared. Please try again shortly."); }
  }
  return <><button className="purchase-button" type="button" onClick={beginCheckout} disabled={loading}>{loading ? (locale === "ko" ? "결제 준비 중..." : "Preparing checkout...") : label}<ArrowRight size={16} /></button>{error && <p className="form-notice" role="alert">{error}</p>}</>;
}
