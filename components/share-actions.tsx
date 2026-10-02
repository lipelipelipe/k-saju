"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy, LockKeyhole, Mail, MessageCircle, Send, Share2, X } from "lucide-react";
import { copy, type Locale } from "@/lib/dictionary";
import { encodeSharePayload, type SharePayload } from "@/lib/share-payload";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: { sendDefault: (message: Record<string, unknown>) => void };
    };
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const emailEnabled = process.env.NEXT_PUBLIC_EMAIL_REPORTS_ENABLED === "true";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ShareActions({ payload, locale }: { payload: SharePayload; locale: Locale }) {
  const t = copy[locale];
  const [url, setUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    const token = encodeSharePayload(payload);
    setUrl(`${window.location.origin}/share/${token}`);
  }, [payload]);

  useEffect(() => {
    if (!kakaoKey) return;
    let alive = true;
    const scriptId = "kakao-js-sdk";
    const initialize = () => {
      if (!alive || !window.Kakao) return;
      if (!window.Kakao.isInitialized()) window.Kakao.init(kakaoKey);
      setKakaoReady(true);
    };
    if (window.Kakao) { initialize(); return () => { alive = false; }; }
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.2/kakao.min.js";
      script.integrity = "sha384-zt/G7/KfaRQ9dT/QIkS0ujMtzouJqzuSJcXVQu50x0rl/+mD1dc70AeOejVbMD9E";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = initialize;
      document.head.appendChild(script);
    } else script.addEventListener("load", initialize, { once: true });
    return () => { alive = false; };
  }, []);

  function openShare(target: "naver" | "whatsapp" | "facebook") {
    if (!url) return;
    const title = locale === "ko" ? "나만의 사주 리딩" : "My Korean Saju reading";
    const destination = target === "naver"
      ? `https://share.naver.com/web/shareView?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      : target === "whatsapp"
        ? `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(destination, "_blank", "noopener,noreferrer,width=720,height=640");
  }

  async function shareNative() {
    if (!url) return;
    const title = locale === "ko" ? "나만의 사주 리딩" : "My Korean Saju reading";
    if (navigator.share) {
      try { await navigator.share({ title, text: payload.reading.first.slice(0, 180), url }); }
      catch (error) { if (error instanceof Error && error.name !== "AbortError") setFeedback(t.emailError); }
      return;
    }
    await copyUrl();
  }

  async function copyUrl() {
    if (!url) return;
    try { await navigator.clipboard.writeText(url); setFeedback(t.shareCopied); }
    catch { setFeedback(url); }
  }

  function shareKakao() {
    if (!kakaoKey) { setFeedback(locale === "ko" ? "배포 환경에 NEXT_PUBLIC_KAKAO_JS_KEY를 설정해 주세요." : "Set NEXT_PUBLIC_KAKAO_JS_KEY in your deployment settings."); return; }
    if (!kakaoReady || !window.Kakao || !url) { setFeedback(locale === "ko" ? "카카오톡 공유를 준비 중입니다. 잠시 후 다시 눌러주세요." : "KakaoTalk sharing is loading. Please try again in a moment."); return; }
    const title = locale === "ko" ? "나만의 사주 리딩" : "My Korean Saju reading";
    const description = payload.reading.first.slice(0, 180);
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: { title, description, imageUrl: `${url}/opengraph-image`, link: { mobileWebUrl: url, webUrl: url } },
      buttons: [{ title: locale === "ko" ? "리딩 보기" : "View reading", link: { mobileWebUrl: url, webUrl: url } }],
    });
  }

  return <>
    <section className="share-panel">
      <div className="share-panel-heading"><div className="share-panel-icon"><Share2 size={16} /></div><div><h3>{t.share}</h3><p>{locale === "ko" ? "생년월일과 이름은 공유하지 않아요." : "Your name and birth details stay private."}</p></div></div>
      <div className="share-grid">
        <button type="button" onClick={shareNative}><Share2 size={15} />{t.shareSystem}</button>
        <button type="button" onClick={shareKakao}><MessageCircle size={15} />{t.shareKakao}</button>
        <button type="button" onClick={() => openShare("naver")}><Send size={14} />{t.shareNaver}</button>
        <button type="button" onClick={() => openShare("whatsapp")}><MessageCircle size={15} />{t.shareWhatsApp}</button>
        <button type="button" onClick={() => openShare("facebook")}><span className="facebook-mark">f</span>{t.shareFacebook}</button>
        <button type="button" onClick={copyUrl}><Copy size={14} />{locale === "ko" ? "링크 복사" : "Copy link"}</button>
      </div>
      {feedback && <p className="share-feedback" role="status">{feedback}</p>}
      <button className="email-open-button" type="button" onClick={() => setEmailOpen(true)}><Mail size={15} />{t.sendEmail}<ArrowRightIcon /></button>
    </section>
    {emailOpen && <EmailDialog payload={payload} locale={locale} onClose={() => setEmailOpen(false)} />}
  </>;
}

function ArrowRightIcon() { return <span aria-hidden="true">→</span>; }

function EmailDialog({ payload, locale, onClose }: { payload: SharePayload; locale: Locale; onClose: () => void }) {
  const t = copy[locale];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "setup">("idle");
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !widgetRef.current) return;
    let active = true;
    let widgetId: string | undefined;
    const renderWidget = () => {
      if (active && window.turnstile && widgetRef.current) {
        widgetId = window.turnstile.render(widgetRef.current, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          size: "flexible",
          action: "report-email",
          callback: (challengeToken: string) => setToken(challengeToken),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      }
    };
    if (window.turnstile) renderWidget();
    else {
      let script = document.getElementById("turnstile-api") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script"); script.id = "turnstile-api";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true; script.defer = true; script.onload = renderWidget; document.head.appendChild(script);
      } else script.addEventListener("load", renderWidget, { once: true });
    }
    return () => { active = false; if (widgetId && window.turnstile) window.turnstile.remove(widgetId); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/report-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, payload, turnstileToken: token, website: honeypot }),
      });
      if (!response.ok) { setStatus(response.status === 503 ? "setup" : "error"); return; }
      setStatus("sent");
    } catch { setStatus("error"); }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="email-dialog" role="dialog" aria-modal="true" aria-labelledby="email-dialog-title">
      <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={17} /></button>
      <div className="email-dialog-icon"><Mail size={19} /></div>
      <span className="unlock-kicker">SAJU · YOUR PRIVATE REPORT</span>
      <h2 id="email-dialog-title">{t.sendEmail}</h2>
      <p>{t.emailPrivacy}</p>
      {!emailEnabled ? <div className="integration-notice"><LockKeyhole size={15} />{t.emailNotConfigured}</div> : <form onSubmit={submit}>
        <label className="field-label" htmlFor="report-email">{t.emailLabel}</label>
        <input className="text-input" id="report-email" type="email" required maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} />
        <label className="honeypot" aria-hidden="true">Company<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
        {turnstileSiteKey && <div className="turnstile-container" ref={widgetRef} />}
        {status === "sent" ? <p className="success-message"><Check size={15} />{t.emailSent}</p> : <button className="submit-button" type="submit" disabled={status === "sending" || (Boolean(turnstileSiteKey) && !token)}>{status === "sending" ? t.emailSending : t.sendReport}<ArrowRight size={16} /></button>}
        {status === "setup" && <p className="form-notice" role="alert">{t.emailNotConfigured}</p>}
        {status === "error" && <p className="form-notice" role="alert">{t.emailError}</p>}
      </form>}
    </section>
  </div>;
}
