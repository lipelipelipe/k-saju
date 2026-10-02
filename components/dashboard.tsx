"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Activity, Check, ExternalLink, Globe2, KeyRound, LogOut, Save, Search, ShieldCheck, Sparkles } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

const emptySettings: SiteSettings = { siteName: "", siteUrl: "", titleKo: "", titleEn: "", descriptionKo: "", descriptionEn: "", keywordsKo: "", keywordsEn: "", ogImageUrl: "", googleVerification: "", bingVerification: "", naverVerification: "" };
const fields: Array<{ name: keyof SiteSettings; label: string; hint: string; max: number; multiline?: boolean }> = [
  { name: "siteName", label: "Nome do site", hint: "Marca exibida em resultados e prévias sociais.", max: 70 },
  { name: "siteUrl", label: "Domínio principal da Vercel", hint: "Use o domínio de produção, por exemplo https://saju-destiny-reading.vercel.app", max: 253 },
  { name: "titleKo", label: "Título SEO · coreano", hint: "Título para resultados de busca em coreano.", max: 120 },
  { name: "descriptionKo", label: "Meta descrição · coreano", hint: "Resumo da página para mecanismos de busca em coreano.", max: 320, multiline: true },
  { name: "keywordsKo", label: "Palavras-chave · coreano", hint: "Separe por vírgulas e use termos relacionados ao conteúdo real.", max: 500, multiline: true },
  { name: "titleEn", label: "Título SEO · inglês", hint: "Título para resultados de busca em inglês.", max: 120 },
  { name: "descriptionEn", label: "Meta descrição · inglês", hint: "Resumo da página para mecanismos de busca em inglês.", max: 320, multiline: true },
  { name: "keywordsEn", label: "Palavras-chave · inglês", hint: "Separe por vírgulas e use termos relacionados ao conteúdo real.", max: 500, multiline: true },
  { name: "ogImageUrl", label: "Imagem para compartilhamento", hint: "URL HTTPS de uma imagem pública, de preferência 1200 × 630 px. Deixe vazio para usar a imagem padrão.", max: 600 },
  { name: "googleVerification", label: "Google Search Console · código", hint: "Cole somente o valor do atributo content da meta-tag do Google.", max: 250 },
  { name: "bingVerification", label: "Bing Webmaster Tools · código", hint: "Cole o código msvalidate.01 fornecido pelo Bing.", max: 250 },
  { name: "naverVerification", label: "Naver Search Advisor · código", hint: "Cole o código de verificação fornecido pelo Naver.", max: 250 },
];

export function Dashboard() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [saved, setSaved] = useState(false);

  async function loadSettings() {
    const response = await fetch("/api/admin/settings", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar as configurações.");
    setSettings(data);
  }

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      setConfigured(data.configured);
      if (data.authenticated) { setAuthenticated(true); await loadSettings(); }
    }).catch(() => setNotice("Não foi possível conectar ao painel. Atualize a página."));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível entrar.");
      setPassword(""); setAuthenticated(true); await loadSettings();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível entrar."); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(""); setSaved(false);
    try {
      const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar.");
      setSaved(true); setNotice("Configurações salvas. SEO e arquivos de indexação atualizados.");
      window.setTimeout(() => setSaved(false), 3200);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível salvar."); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false); setSettings(emptySettings);
  }

  function update(name: keyof SiteSettings, value: string) { setSettings((current) => ({ ...current, [name]: value })); }

  if (configured === null) return <main className="dashboard-shell"><div className="dashboard-loading">Carregando painel seguro…</div></main>;

  if (!configured) return <main className="dashboard-shell"><section className="dashboard-gate"><a className="dashboard-brand" href="/"><span>太</span> SAJU <i>.</i></a><div className="dashboard-lock"><KeyRound size={21} /></div><span className="dashboard-eyebrow">PAINEL ADMINISTRATIVO</span><h1>Configure o acesso seguro</h1><p>Cadastre estas variáveis privadas na Vercel e faça um novo deploy para ativar o painel.</p><pre>ADMIN_PASSWORD=sua-senha-forte{"\n"}ADMIN_SESSION_SECRET=uma-chave-aleatoria-longa</pre><p>O painel também exige as variáveis de conexão do Upstash Redis listadas em <code>.env.example</code>.</p><a className="dashboard-home-link" href="/">Voltar ao site <ExternalLink size={14} /></a></section></main>;

  if (!authenticated) return <main className="dashboard-shell"><section className="dashboard-gate"><a className="dashboard-brand" href="/"><span>太</span> SAJU <i>.</i></a><div className="dashboard-lock"><ShieldCheck size={21} /></div><span className="dashboard-eyebrow">ÁREA RESTRITA</span><h1>Entre no painel</h1><p>Gerencie os dados públicos e a indexação do site.</p><form className="dashboard-login" onSubmit={login}><label htmlFor="admin-password">Senha administrativa</label><input autoComplete="current-password" id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="dashboard-save" disabled={busy}>{busy ? "Verificando…" : "Acessar painel"}</button></form>{notice && <p className="dashboard-notice error" role="alert">{notice}</p>}<a className="dashboard-home-link" href="/">← Voltar ao site</a></section></main>;

  const url = settings.siteUrl || "https://saju-destiny-reading.vercel.app";
  return <main className="dashboard-shell"><div className="dashboard-container">
    <header className="dashboard-header"><a className="dashboard-brand" href="/"><span>太</span> SAJU <i>.</i></a><div><span className="dashboard-live"><Activity size={13} /> PAINEL DO SITE</span><button className="dashboard-logout" onClick={logout}><LogOut size={14} /> Sair</button></div></header>
    <section className="dashboard-hero"><div className="dashboard-hero-icon"><Sparkles size={19} /></div><span className="dashboard-eyebrow">ADMINISTRAÇÃO · SEO</span><h1>Presença digital do seu site</h1><p>Edite as informações públicas que buscadores e redes usam para entender e apresentar o SAJU.</p><div className="dashboard-url"><Globe2 size={15} /><span>{url}</span><a href={url} target="_blank" rel="noreferrer" aria-label="Abrir site público"><ExternalLink size={14} /></a></div></section>
    <section className="dashboard-status-grid"><article><span><Search size={15} /> INDEXAÇÃO</span><strong>Sitemap.xml e robots.txt ativos</strong><small>Atualizados com o domínio configurado</small></article><article><span><ShieldCheck size={15} /> VERIFICAÇÃO</span><strong>{[settings.googleVerification, settings.bingVerification, settings.naverVerification].filter(Boolean).length} de 3 mecanismos conectados</strong><small>Google · Bing · Naver Search Advisor</small></article><article><span><Activity size={15} /> DADOS ESTRUTURADOS</span><strong>Schema.org · WebSite</strong><small>Metadados estruturados na página inicial</small></article></section>
    <div className="dashboard-grid"><form className="dashboard-form" onSubmit={save}><div className="dashboard-form-header"><div><span className="dashboard-eyebrow">CONFIGURAÇÕES PÚBLICAS</span><h2>Informações do site</h2></div><button className="dashboard-save" disabled={busy}>{saved ? <><Check size={15} /> Salvo</> : <><Save size={15} />{busy ? "Salvando…" : "Salvar alterações"}</>}</button></div>
      {fields.map((field) => <label className="dashboard-field" key={field.name}><span>{field.label}</span>{field.multiline ? <textarea value={settings[field.name]} maxLength={field.max} rows={field.name.includes("description") ? 4 : 3} onChange={(event) => update(field.name, event.target.value)} /> : <input value={settings[field.name]} maxLength={field.max} type={field.name === "siteUrl" || field.name === "ogImageUrl" ? "url" : "text"} onChange={(event) => update(field.name, event.target.value)} placeholder={field.name === "siteUrl" ? "https://saju-destiny-reading.vercel.app" : ""} />}<small>{field.hint}<span>{settings[field.name].length}/{field.max}</span></small></label>)}
      {notice && <p className={`dashboard-notice ${saved ? "success" : "error"}`} role="status">{notice}</p>}<button className="dashboard-save dashboard-save-bottom" disabled={busy}>{saved ? <><Check size={15} /> Salvo</> : <><Save size={15} />{busy ? "Salvando…" : "Salvar alterações"}</>}</button>
    </form><aside className="dashboard-aside"><article className="dashboard-preview"><span className="dashboard-eyebrow">PRÉVIA NO GOOGLE · ENGLISH</span><div className="preview-domain">{url.replace(/^https:\/\//, "")}</div><h3>{settings.titleEn || settings.siteName}</h3><p>{settings.descriptionEn}</p></article><article className="dashboard-preview"><span className="dashboard-eyebrow">PRÉVIA NO GOOGLE · 한국어</span><div className="preview-domain">{url.replace(/^https:\/\//, "")}/ko</div><h3>{settings.titleKo || settings.siteName}</h3><p>{settings.descriptionKo}</p></article><article className="dashboard-links"><span className="dashboard-eyebrow">CADASTRAR PROPRIEDADE</span><a href="https://search.google.com/search-console/welcome" target="_blank" rel="noreferrer">Google Search Console <ExternalLink size={13} /></a><a href="https://www.bing.com/webmasters/" target="_blank" rel="noreferrer">Bing Webmaster Tools <ExternalLink size={13} /></a><a href="https://searchadvisor.naver.com/" target="_blank" rel="noreferrer">Naver Search Advisor <ExternalLink size={13} /></a><div><small>Envie o sitemap:</small><code>{url}/sitemap.xml</code></div></article><article className="dashboard-tip"><Sparkles size={15} /><p>A verificação confirma a propriedade do domínio. Depois, cadastre-o nos painéis acima e envie o sitemap para solicitar a indexação.</p></article></aside></div>
    <footer className="dashboard-footer"><a href="/">← Ver site</a><span>SAJU · PAINEL PRIVADO</span></footer>
  </div></main>;
}
